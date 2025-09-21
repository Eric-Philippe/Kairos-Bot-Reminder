import { Client } from "discord.js";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";
import { RemindmeServices } from "../tables/remindme/remindme.services";
import { RemindusServices } from "../tables/remindus/remindus.services";

interface ScheduledReminder {
  id: string;
  executeAt: Date;
  type: "remindme" | "remindus";
}

export default class ReminderScheduler {
  private client: Client;
  private scheduledTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Start the reminder scheduler
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log("ReminderScheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting ReminderScheduler...");

    // Initial schedule
    await this.scheduleNextReminders();

    // Check for new reminders every 5 minutes (much less frequent than before)
    // This catches any reminders that might have been added after the initial schedule
    this.checkInterval = setInterval(async () => {
      await this.scheduleNextReminders();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop the reminder scheduler
   */
  public stop(): void {
    console.log("Stopping ReminderScheduler...");
    this.isRunning = false;

    // Clear all scheduled timeouts
    this.scheduledTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.scheduledTimeouts.clear();

    // Clear check interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Schedule the next batch of reminders
   */
  private async scheduleNextReminders(): Promise<void> {
    try {
      // Get upcoming reminders for the next 24 hours
      const upcomingReminders = await this.getUpcomingReminders();

      // Schedule each reminder
      for (const reminder of upcomingReminders) {
        await this.scheduleReminder(reminder);
      }

      console.log(`Scheduled ${upcomingReminders.length} upcoming reminders`);
    } catch (error) {
      console.error("Error scheduling reminders:", error);
    }
  }

  /**
   * Get upcoming reminders for the next 24 hours, considering timezones
   */
  private async getUpcomingReminders(): Promise<ScheduledReminder[]> {
    const scheduledReminders: ScheduledReminder[] = [];
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      // Get upcoming remindme entries
      const remindmeEntries = await this.getUpcomingRemindmeEntries(
        now,
        next24Hours
      );
      scheduledReminders.push(...remindmeEntries);

      // Get upcoming remindus entries
      const remindusEntries = await this.getUpcomingRemindusEntries(
        now,
        next24Hours
      );
      scheduledReminders.push(...remindusEntries);

      // Sort by execution time
      scheduledReminders.sort(
        (a, b) => a.executeAt.getTime() - b.executeAt.getTime()
      );
    } catch (error) {
      console.error("Error fetching upcoming reminders:", error);
    }

    return scheduledReminders;
  }

  /**
   * Get upcoming remindme entries with timezone consideration
   */
  private async getUpcomingRemindmeEntries(
    startTime: Date,
    endTime: Date
  ): Promise<ScheduledReminder[]> {
    const query = `
      SELECT 
        R.meId,
        R.targetDate,
        C.gmtOffset
      FROM 
        Remindme as R
      INNER JOIN 
        Utilisateur as U ON R.userId = U.userId
      INNER JOIN 
        Country as C ON U.CId = C.CId
      WHERE 
        R.isPaused = 0
        AND R.targetDate BETWEEN ? AND ?
      ORDER BY R.targetDate ASC
    `;

    try {
      const { execute } = await import("../database/mysql.connector");
      const results = (await execute(query, [startTime, endTime])) as any[];

      return results.map((row: any) => ({
        id: row.meId,
        executeAt: new Date(
          row.targetDate.getTime() - row.gmtOffset * 60 * 60 * 1000
        ),
        type: "remindme" as const,
      }));
    } catch (error) {
      console.error("Error fetching remindme entries:", error);
      return [];
    }
  }

  /**
   * Get upcoming remindus entries with timezone consideration
   */
  private async getUpcomingRemindusEntries(
    startTime: Date,
    endTime: Date
  ): Promise<ScheduledReminder[]> {
    const query = `
      SELECT 
        R.usId,
        R.targetDate,
        C.gmtOffset
      FROM 
        Remindus as R
      INNER JOIN 
        Guild as G ON R.guildId = G.guildId
      INNER JOIN 
        Country as C ON G.CId = C.CId
      WHERE 
        R.isPaused = 0
        AND R.targetDate BETWEEN ? AND ?
      ORDER BY R.targetDate ASC
    `;

    try {
      const { execute } = await import("../database/mysql.connector");
      const results = (await execute(query, [startTime, endTime])) as any[];

      return results.map((row: any) => ({
        id: row.usId,
        executeAt: new Date(
          row.targetDate.getTime() - row.gmtOffset * 60 * 60 * 1000
        ),
        type: "remindus" as const,
      }));
    } catch (error) {
      console.error("Error fetching remindus entries:", error);
      return [];
    }
  }

  /**
   * Schedule a specific reminder
   */
  private async scheduleReminder(reminder: ScheduledReminder): Promise<void> {
    // Don't schedule if already scheduled
    if (this.scheduledTimeouts.has(reminder.id)) {
      return;
    }

    const now = new Date();
    const delay = reminder.executeAt.getTime() - now.getTime();

    // Don't schedule reminders in the past or too far in the future (>24 hours)
    if (delay <= 0) {
      // Execute immediately if it's overdue
      await this.executeReminder(reminder);
      return;
    }

    if (delay > 24 * 60 * 60 * 1000) {
      // Don't schedule more than 24 hours in advance
      return;
    }

    // Schedule the reminder
    const timeout = setTimeout(async () => {
      await this.executeReminder(reminder);
      this.scheduledTimeouts.delete(reminder.id);
    }, delay);

    this.scheduledTimeouts.set(reminder.id, timeout);

    if (process.env.DEBUG_MODE === "true") {
      console.log(
        `Scheduled ${reminder.type} ${reminder.id} to execute in ${Math.round(
          delay / 1000
        )} seconds`
      );
    }
  }

  /**
   * Execute a specific reminder
   */
  private async executeReminder(reminder: ScheduledReminder): Promise<void> {
    try {
      if (reminder.type === "remindme") {
        const remindmeQueue = new FireRemindmeQueue();
        // We need to modify the fire method to accept specific IDs
        await this.executeSpecificRemindme(reminder.id);
      } else if (reminder.type === "remindus") {
        const remindusQueue = new FireRemindusQueue();
        await this.executeSpecificRemindus(reminder.id);
      }

      if (process.env.DEBUG_MODE === "true") {
        console.log(`Executed ${reminder.type} ${reminder.id}`);
      }
    } catch (error) {
      console.error(`Error executing ${reminder.type} ${reminder.id}:`, error);
    }
  }

  /**
   * Execute a specific remindme by ID
   */
  private async executeSpecificRemindme(meId: string): Promise<void> {
    try {
      const reminders = await RemindmeServices.getRemindmesById(meId);
      if (reminders.length === 0) {
        return; // Reminder might have been deleted
      }

      const reminder = reminders[0];
      const now = new Date();

      // Check if the reminder is due (considering timezone)
      if (reminder.targetDate <= now) {
        const remindmeQueue = new FireRemindmeQueue();

        // Get the user
        const target = await this.client.users.cache.get(reminder.userId);
        if (!target) {
          await RemindmeServices.removeRemindMe(reminder.meId);
          return;
        }

        // Send the reminder
        await remindmeQueue.sendMsg(target, reminder);

        // Handle repetition or removal
        if (!reminder.repetition) {
          await RemindmeServices.removeRemindMe(reminder.meId);
        } else {
          const { Repetition } = await import("../utils/repetition.enum");
          const currentRepetition = Object.values(Repetition).find(
            (rep) => rep.value === reminder.repetition
          );

          if (currentRepetition) {
            const nextDate = await currentRepetition.nextDate(
              reminder.targetDate
            );
            await RemindmeServices.updateRemindme(reminder, nextDate);

            // Schedule the next occurrence
            const nextReminder: ScheduledReminder = {
              id: reminder.meId,
              executeAt: nextDate,
              type: "remindme",
            };
            await this.scheduleReminder(nextReminder);
          }
        }
      }
    } catch (error) {
      console.error(`Error executing remindme ${meId}:`, error);
    }
  }

  /**
   * Execute a specific remindus by ID
   */
  private async executeSpecificRemindus(usId: string): Promise<void> {
    try {
      const reminders = await RemindusServices.getRemindusById(usId);
      if (reminders.length === 0) {
        return; // Reminder might have been deleted
      }

      const reminder = reminders[0];
      const now = new Date();

      // Check if the reminder is due (considering timezone)
      if (reminder.targetDate <= now) {
        const remindusQueue = new FireRemindusQueue();

        // Get the channel
        const target = await this.client.channels.cache.get(reminder.channelId);
        if (!target) {
          await RemindusServices.removeRemindus(reminder.usId);
          return;
        }

        // Send the reminder
        await remindusQueue.sendMsg(target as any, reminder);

        // Handle repetition or removal
        if (!reminder.repetition) {
          await RemindusServices.removeRemindus(reminder.usId);
        } else {
          const { Repetition } = await import("../utils/repetition.enum");
          const currentRepetition = Object.values(Repetition).find(
            (rep) => rep.value === reminder.repetition
          );

          if (currentRepetition) {
            const nextDate = await currentRepetition.nextDate(
              reminder.targetDate
            );
            await RemindusServices.updateRemindus(reminder, nextDate);

            // Schedule the next occurrence
            const nextReminder: ScheduledReminder = {
              id: reminder.usId,
              executeAt: nextDate,
              type: "remindus",
            };
            await this.scheduleReminder(nextReminder);
          }
        }
      }
    } catch (error) {
      console.error(`Error executing remindus ${usId}:`, error);
    }
  }

  /**
   * Add a new reminder to the scheduler
   * This should be called when a new reminder is created
   */
  public async addReminder(
    id: string,
    targetDate: Date,
    type: "remindme" | "remindus",
    gmtOffset: number
  ): Promise<void> {
    const executeAt = new Date(
      targetDate.getTime() - gmtOffset * 60 * 60 * 1000
    );
    const reminder: ScheduledReminder = {
      id,
      executeAt,
      type,
    };

    await this.scheduleReminder(reminder);
  }

  /**
   * Remove a reminder from the scheduler
   * This should be called when a reminder is deleted
   */
  public removeReminder(id: string): void {
    const timeout = this.scheduledTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledTimeouts.delete(id);

      if (process.env.DEBUG_MODE === "true") {
        console.log(`Removed scheduled reminder ${id}`);
      }
    }
  }
}
