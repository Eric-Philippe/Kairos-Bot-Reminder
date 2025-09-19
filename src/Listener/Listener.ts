import { Client } from "discord.js";

import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";
import { RemindmeServices } from "../tables/remindme/remindme.services";
import { RemindusServices } from "../tables/remindus/remindus.services";
import { Remindme } from "../tables/remindme/remindme";
import { Remindus } from "../tables/remindus/remindus";
import client from "../Client";

require("dotenv").config();

type NextReminder = {
  reminder: Remindme | Remindus;
  date: Date;
};

class ReminderListener {
  private static instance: ReminderListener;
  private reminderQueue: NextReminder[] = [];
  private currentTimeout: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  private constructor() {}

  public static getInstance(): ReminderListener {
    if (!ReminderListener.instance) {
      ReminderListener.instance = new ReminderListener();
    }
    return ReminderListener.instance;
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    await this.loadReminders();
    this.scheduleNext();
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.reminderQueue = [];
  }

  public async addReminder(reminder: Remindme | Remindus): Promise<void> {
    const newReminder: NextReminder = {
      reminder,
      date: reminder.targetDate,
    };

    // Insert in sorted order
    const insertIndex = this.reminderQueue.findIndex(
      (r) => r.date > newReminder.date
    );
    if (insertIndex === -1) {
      this.reminderQueue.push(newReminder);
    } else {
      this.reminderQueue.splice(insertIndex, 0, newReminder);
    }

    // If this is now the next reminder, reschedule
    if (insertIndex === 0 || this.reminderQueue.length === 1) {
      this.reschedule();
    }
  }

  public async removeReminder(
    reminderId: string,
    type: "remindme" | "remindus"
  ): Promise<void> {
    const initialLength = this.reminderQueue.length;
    this.reminderQueue = this.reminderQueue.filter((r) => {
      if (type === "remindme" && "meId" in r.reminder) {
        return r.reminder.meId !== reminderId;
      }
      if (type === "remindus" && "usId" in r.reminder) {
        return r.reminder.usId !== reminderId;
      }
      return true;
    });

    // If we removed the first item, reschedule
    if (initialLength > 0 && this.reminderQueue.length !== initialLength) {
      this.reschedule();
    }
  }

  private async loadReminders(): Promise<void> {
    const [remindmeList, remindusList] = await Promise.all([
      RemindmeServices.getNextRemindMe(),
      RemindusServices.getNextRemindus(),
    ]);

    this.reminderQueue = [];

    if (remindmeList) {
      this.reminderQueue.push({
        reminder: remindmeList,
        date: remindmeList.targetDate,
      });
    }
    if (remindusList) {
      this.reminderQueue.push({
        reminder: remindusList,
        date: remindusList.targetDate,
      });
    }

    // Sort by date
    this.reminderQueue.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private reschedule(): void {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.scheduleNext();
  }

  private scheduleNext(): void {
    if (!this.isRunning || this.reminderQueue.length === 0) return;

    const nextReminder = this.reminderQueue[0];
    const now = new Date();
    const delay = Math.max(0, nextReminder.date.getTime() - now.getTime());

    console.log(delay);

    this.currentTimeout = setTimeout(async () => {
      await this.fireReminder(nextReminder);
      this.reminderQueue.shift(); // Remove the fired reminder
      this.scheduleNext(); // Schedule the next one
    }, delay);
  }

  private async fireReminder(nextReminder: NextReminder): Promise<void> {
    try {
      if ("meId" in nextReminder.reminder) {
        const remindmeQueue = new FireRemindmeQueue();
        await remindmeQueue.fire(client);
      } else if ("usId" in nextReminder.reminder) {
        const remindusQueue = new FireRemindusQueue();
        await remindusQueue.fire(client);
      }
    } catch (error) {
      console.error("Error firing reminder:", error);
    }
  }

  public getQueueSize(): number {
    return this.reminderQueue.length;
  }

  public getNextReminderDate(): Date | null {
    return this.reminderQueue.length > 0 ? this.reminderQueue[0].date : null;
  }
}

const fireListener = async (): Promise<void> => {
  const listener = ReminderListener.getInstance();
  await listener.start();
};

export default fireListener;
export { ReminderListener };
