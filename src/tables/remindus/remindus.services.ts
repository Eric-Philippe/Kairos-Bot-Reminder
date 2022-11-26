import { RemindusQueries } from "./remindus.queries";
import { execute } from "../../utils/mysql.connector";
import { Remindus } from "./remindus";

export const RemindusServices = {
  getRemindusById: async (usId: string): Promise<Remindus[]> => {
    const result: Remindus[] = await execute(RemindusQueries.GetRemindusById, [
      usId,
    ]);
    return result;
  },
  addRemindus: async (
    usId: string,
    guildId: string,
    channelId: string,
    content: string,
    description: string,
    entryDate: Date,
    targetDate: Date,
    repetition: string,
    mentionId: string,
    isPaused: number,
    RId: string
  ): Promise<number> => {
    await execute(RemindusQueries.AddRemindus, [
      usId,
      guildId,
      channelId,
      content,
      description,
      entryDate,
      targetDate,
      repetition,
      mentionId,
      isPaused,
      RId,
    ]);
    return 0;
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
};
