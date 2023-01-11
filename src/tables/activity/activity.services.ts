import { ActivityQueries } from "./activity.queries";
import { execute } from "../../utils/mysql.connector";
import { Activity } from "./activity";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "../../utils/mysql_tables.enum";

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

  getActivityByNameCategoryId: async (
    name: string,
    TCId: string
  ): Promise<Activity> => {
    const result: Activity[] = await execute(
      ActivityQueries.GetActivityByNameCategoryId,
      [name, TCId]
    );
    return result[0];
  },

  getActivitiesByCategoryId: async (TCId: string): Promise<Activity[]> => {
    const result: Activity[] = await execute(
      ActivityQueries.GetActivitiesByCategoryId,
      [TCId]
    );
    return result;
  },

  getActivityByNameUserId: async (
    name: string,
    userId: string
  ): Promise<Activity> => {
    const result: Activity[] = await execute(
      ActivityQueries.GetActivityByNameUserId,
      [name, userId]
    );
    return result[0];
  },

  getActivitiesByKeywordUserId: async (
    keyword: string,
    userId: string
  ): Promise<Activity[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";
    const result: Activity[] = await execute(
      ActivityQueries.GetActivityByKeywordUserId,
      [keywordSQL, userId, userId]
    );
    return result;
  },

  insertActivity: async (name: string, TCId: string): Promise<string> => {
    let AId = await getAvailableIdentifiant(MYSQL_TABLES.Activity);
    await execute(ActivityQueries.InsertActivity, [AId, name, TCId]);
    return AId;
  },

  isDuplicateActivity: async (name: string, TCId: string): Promise<boolean> => {
    const result: Activity[] = await execute(
      ActivityQueries.IsDuplicatedActivity,
      [name, TCId]
    );
    return result.length > 0;
  },

  deleteActivity: async (AId: string): Promise<number> => {
    await execute(ActivityQueries.DeleteActivity, [AId]);
    return 0;
  },
};
