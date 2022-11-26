import { ActivityQueries } from "./activity.queries";
import { execute } from "../../utils/mysql.connector";
import { Activity } from "./activity";

export const ActivityServices = {
  getActivitiesByUserId: async (userId: string): Promise<Activity[]> => {
    const result: Activity[] = await execute(
      ActivityQueries.GetActivitiesByUserId,
      [userId]
    );
    return result;
  },

  getActivityById: async (AId: string): Promise<Activity> => {
    const result: Activity[] = await execute(ActivityQueries.GetActivityById, [
      AId,
    ]);
    return result[0];
  },

  addActivity: async (
    AId: string,
    userId: string,
    name: string,
    description: string,
    dueDate: string,
    isComplete: boolean,
    isRecurring: boolean,
    isGuild: boolean
  ): Promise<number> => {
    await execute(ActivityQueries.AddActivity, [
      AId,
      userId,
      name,
      description,
      dueDate,
      isComplete,
      isRecurring,
      isGuild,
    ]);
    return 0;
  },

  removeActivity: async (AId: string): Promise<number> => {
    await execute(ActivityQueries.DeleteActivity, [AId]);
    return 0;
  },
};
