import { RemindusQueries } from "./remindus.queries";
import { execute } from "../../database/mysql.connector";
import { Remindus } from "./remindus";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "src/database/mysql_tables.enum";

export const RemindusServices = {
  getRemindusById: async (usId: string): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(RemindusQueries.GetRemindusById, [
      usId,
    ]);
    return result;
  },
  addRemindus: async (
    guildId: string,
    channelId: string,
    content: string,
    description: string | null,
    entryDate: Date,
    targetDate: Date,
    repetition: string | null,
    mentionId: string | null,
    isPaused: number,
    RCId: string | null
  ): Promise<string> => {
    let usId = await getAvailableIdentifiant(MYSQL_TABLES.Remindus);
    await execute(RemindusQueries.AddRemindus, [
      usId,
      channelId,
      content,
      entryDate,
      targetDate,
      description,
      repetition,
      mentionId,
      isPaused,
      guildId,
      RCId,
    ]);

    // Add to scheduler if not paused
    if (isPaused === 0) {
      try {
        const { getReminderScheduler } = await import(
          "../../Listener/Listener"
        );
        const scheduler = getReminderScheduler();
        if (scheduler) {
          // Get guild's timezone offset
          const guildQuery = `
            SELECT C.gmtOffset
            FROM Guild G
            JOIN Country C ON G.CId = C.CId
            WHERE G.guildId = ?
          `;
          const guildResult = (await execute(guildQuery, [guildId])) as any[];
          const gmtOffset =
            guildResult.length > 0 ? guildResult[0].gmtOffset : 0;

          await scheduler.addReminder(usId, targetDate, "remindus", gmtOffset);
        }
      } catch (error) {
        console.error("Error adding reminder to scheduler:", error);
      }
    }

    return usId;
  },
  removeRemindus: async (usId: string): Promise<number> => {
    // Remove from scheduler first
    try {
      const { getReminderScheduler } = await import("../../Listener/Listener");
      const scheduler = getReminderScheduler();
      if (scheduler) {
        scheduler.removeReminder(usId);
      }
    } catch (error) {
      console.error("Error removing reminder from scheduler:", error);
    }

    await execute(RemindusQueries.DeleteRemindus, [usId]);
    return 0;
  },
  getRemindusAtDate: async (targetDate: Date): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(
      RemindusQueries.GetRemindusAtDate,
      [targetDate]
    );
    return result;
  },
  getRemindusByGuildId: async (guildId: string): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(
      RemindusQueries.GetRemindusByGuildId,
      [guildId]
    );
    return result;
  },
  breakRemindus: async (usId: string, isPaused: number): Promise<number> => {
    await execute(RemindusQueries.BreakRemindus, [isPaused, usId]);

    // Handle scheduler integration
    try {
      const { getReminderScheduler } = await import("../../Listener/Listener");
      const scheduler = getReminderScheduler();
      if (scheduler) {
        if (isPaused === 1) {
          // Pausing - remove from scheduler
          scheduler.removeReminder(usId);
        } else {
          // Unpausing - add back to scheduler
          const reminders = await RemindusServices.getRemindusById(usId);
          if (reminders.length > 0) {
            const reminder = reminders[0];
            // Get guild's timezone offset
            const guildQuery = `
              SELECT C.gmtOffset
              FROM Guild G
              JOIN Country C ON G.CId = C.CId
              WHERE G.guildId = ?
            `;
            const guildResult = (await execute(guildQuery, [
              reminder.guildId,
            ])) as any[];
            const gmtOffset =
              guildResult.length > 0 ? guildResult[0].gmtOffset : 0;

            await scheduler.addReminder(
              usId,
              reminder.targetDate,
              "remindus",
              gmtOffset
            );
          }
        }
      }
    } catch (error) {
      console.error("Error updating scheduler for pause/resume:", error);
    }

    return 0;
  },
  getRemindusByCategoryAndGuildId: async (
    RCId: string,
    guildId: string
  ): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(
      RemindusQueries.GetRemindusByCategoryAndGuildId,
      [RCId, guildId]
    );
    return result;
  },
  fetchPastRemindus: async (): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(
      RemindusQueries.FetchPastRemindus,
      []
    );
    return result;
  },
  updateRemindus: async (
    remindus: Remindus,
    targetDate: Date
  ): Promise<number> => {
    await execute(RemindusQueries.UpdateRemindusDate, [
      targetDate,
      remindus.usId,
    ]);
    return 0;
  },
};
