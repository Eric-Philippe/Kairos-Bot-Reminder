import { RemindusQueries } from "./remindus.queries";
import { execute } from "../../utils/mysql.connector";
import { Remindus } from "./remindus";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "src/utils/mysql_tables.enum";

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
    return usId;
  },
  removeRemindus: async (usId: string): Promise<number> => {
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
