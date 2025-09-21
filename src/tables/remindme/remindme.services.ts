import { RemindmeQueries } from "./remindme.queries";
import { execute } from "../../database/mysql.connector";
import { Remindme } from "./remindme";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "src/database/mysql_tables.enum";

export const RemindmeServices = {
  getRemindmesById: async (meId: string): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(RemindmeQueries.GetRemindmesById, [
      meId,
    ]);
    return result;
  },
  addRemindMe: async (
    content: string,
    description: string | null,
    entryDate: Date,
    targetDate: Date,
    repetition: string | null,
    isPaused: number,
    RCId: string | null,
    userId: string
  ): Promise<string> => {
    let meId = await getAvailableIdentifiant(MYSQL_TABLES.Remindme);
    await execute(RemindmeQueries.AddRemindme, [
      meId,
      content,
      description,
      entryDate,
      targetDate,
      repetition,
      isPaused,
      RCId,
      userId,
    ]);

    // Add to scheduler if not paused
    if (isPaused === 0) {
      try {
        const { getReminderScheduler } = await import(
          "../../Listener/Listener"
        );
        const scheduler = getReminderScheduler();
        if (scheduler) {
          // Get user's timezone offset
          const userQuery = `
            SELECT C.gmtOffset
            FROM Utilisateur U
            JOIN Country C ON U.CId = C.CId
            WHERE U.userId = ?
          `;
          const userResult = (await execute(userQuery, [userId])) as any[];
          const gmtOffset = userResult.length > 0 ? userResult[0].gmtOffset : 0;

          await scheduler.addReminder(meId, targetDate, "remindme", gmtOffset);
        }
      } catch (error) {
        console.error("Error adding reminder to scheduler:", error);
      }
    }

    return meId;
  },
  removeRemindMe: async (meId: string): Promise<number> => {
    // Remove from scheduler first
    try {
      const { getReminderScheduler } = await import("../../Listener/Listener");
      const scheduler = getReminderScheduler();
      if (scheduler) {
        scheduler.removeReminder(meId);
      }
    } catch (error) {
      console.error("Error removing reminder from scheduler:", error);
    }

    await execute(RemindmeQueries.DeleteRemindme, [meId]);
    return 0;
  },
  getRemindmeAtDate: async (targetDate: Date): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(
      RemindmeQueries.GetRemindmeAtDate,
      [targetDate]
    );
    return result;
  },
  getRemindmeByUserId: async (userId: string): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(
      RemindmeQueries.GetRemindmeByUserId,
      [userId]
    );
    return result;
  },
  pauseRemindme: async (meId: string, value: number): Promise<number> => {
    await execute(RemindmeQueries.PauseRemindme, [value, meId]);

    // Handle scheduler integration
    try {
      const { getReminderScheduler } = await import("../../Listener/Listener");
      const scheduler = getReminderScheduler();
      if (scheduler) {
        if (value === 1) {
          // Pausing - remove from scheduler
          scheduler.removeReminder(meId);
        } else {
          // Unpausing - add back to scheduler
          const reminders = await RemindmeServices.getRemindmesById(meId);
          if (reminders.length > 0) {
            const reminder = reminders[0];
            // Get user's timezone offset
            const userQuery = `
              SELECT C.gmtOffset
              FROM Utilisateur U
              JOIN Country C ON U.CId = C.CId
              WHERE U.userId = ?
            `;
            const userResult = (await execute(userQuery, [
              reminder.userId,
            ])) as any[];
            const gmtOffset =
              userResult.length > 0 ? userResult[0].gmtOffset : 0;

            await scheduler.addReminder(
              meId,
              reminder.targetDate,
              "remindme",
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

  fetchPastRemindme: async (): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(
      RemindmeQueries.FetchNewQueuedRemindme,
      []
    );
    return result;
  },

  updateRemindme: async (
    remindme: Remindme,
    targetDate: Date
  ): Promise<number> => {
    await execute(RemindmeQueries.UpdateRemindmeDate, [
      targetDate,
      remindme.meId,
    ]);
    return 0;
  },

  getRemindmesByCategoryAndUserId: async (
    RCId: string,
    userId: string
  ): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(
      RemindmeQueries.GetRemindmesByCategoryAndUserId,
      [RCId, userId]
    );
    return result;
  },
};
