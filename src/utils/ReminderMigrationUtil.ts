import { getReminderScheduler } from "../Listener/Listener";
import { execute } from "../database/mysql.connector";

/**
 * Utility to migrate existing reminders to the new scheduler system
 * This should be called once when upgrading from the old cron-based system
 */
export class ReminderMigrationUtil {
  /**
   * Load all existing active reminders into the scheduler
   */
  public static async migrateExistingReminders(): Promise<void> {
    console.log("Starting migration of existing reminders to scheduler...");

    const scheduler = getReminderScheduler();
    if (!scheduler) {
      console.error("Scheduler not initialized. Cannot migrate reminders.");
      return;
    }

    try {
      // Migrate remindme entries
      const remindmeCount = await this.migrateRemindmeEntries(scheduler);

      // Migrate remindus entries
      const remindusCount = await this.migrateRemindusEntries(scheduler);

      console.log(
        `Migration completed. Migrated ${remindmeCount} remindme and ${remindusCount} remindus entries.`
      );
    } catch (error) {
      console.error("Error during migration:", error);
    }
  }

  /**
   * Migrate existing remindme entries
   */
  private static async migrateRemindmeEntries(scheduler: any): Promise<number> {
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
        AND R.targetDate > NOW()
      ORDER BY R.targetDate ASC
    `;

    try {
      const results = (await execute(query, [])) as any[];

      for (const row of results) {
        await scheduler.addReminder(
          row.meId,
          row.targetDate,
          "remindme",
          row.gmtOffset
        );
      }

      return results.length;
    } catch (error) {
      console.error("Error migrating remindme entries:", error);
      return 0;
    }
  }

  /**
   * Migrate existing remindus entries
   */
  private static async migrateRemindusEntries(scheduler: any): Promise<number> {
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
        AND R.targetDate > NOW()
      ORDER BY R.targetDate ASC
    `;

    try {
      const results = (await execute(query, [])) as any[];

      for (const row of results) {
        await scheduler.addReminder(
          row.usId,
          row.targetDate,
          "remindus",
          row.gmtOffset
        );
      }

      return results.length;
    } catch (error) {
      console.error("Error migrating remindus entries:", error);
      return 0;
    }
  }
}
