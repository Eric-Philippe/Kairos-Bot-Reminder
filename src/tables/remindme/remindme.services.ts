import { RemindmeQueries } from "./remindme.queries";
import { execute } from "../../utils/mysql.connector";
import { Remindme } from "./remindme";

export const RemindmeServices = {
  getRemindmesById: async (meId: string): Promise<Remindme[]> => {
    const result: Remindme[] = await execute(RemindmeQueries.GetRemindmesById, [
      meId,
    ]);
    return result;
  },
  addRemindMe: async (
    meId: string,
    content: string,
    description: string,
    entryDate: Date,
    targetDate: Date,
    repetition: string,
    isPaused: number,
    RId: string,
    userId: string
  ): Promise<number> => {
    await execute(RemindmeQueries.AddRemindme, [
      meId,
      content,
      description,
      entryDate,
      targetDate,
      repetition,
      isPaused,
      RId,
      userId,
    ]);
    return 0;
  },
  removeRemindMe: async (meId: string): Promise<number> => {
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
};
