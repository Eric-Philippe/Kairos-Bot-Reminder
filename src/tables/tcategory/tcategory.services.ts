import { TCategoryQueries } from "./tcategory.queries";
import { execute } from "../../database/mysql.connector";
import { TCategory } from "./tcategory";
import { MYSQL_TABLES } from "../../database/mysql_tables.enum";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";

export const TCategoryServices = {
  getTCategoryById: async (TCId: string): Promise<TCategory> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoryById,
      [TCId]
    );
    return result[0];
  },
  getTCategoriesByUserId: async (userId: string): Promise<TCategory[]> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoriesByUserId,
      [userId]
    );
    return result;
  },
  getTCategoryByTitleUserId: async (
    title: string,
    userId: string
  ): Promise<TCategory> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoryByTitleUserId,
      [userId, title]
    );
    return result[0];
  },
  getCategoryByKeywordUserId: async (
    keyword: string,
    userId: string
  ): Promise<TCategory[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";

    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoryByKeywordUserId,
      [userId, keywordSQL]
    );
    return result;
  },
  getCategoriesByDate: async (
    userId: string,
    datein: string,
    dateout: string
  ) => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoriesByDate,
      [userId, datein, dateout]
    );
    return result;
  },
  getMiscellaneousTCategory: async (userId: string): Promise<TCategory> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetMiscellaneousCategory,
      [userId]
    );
    return result[0];
  },
  insertTCategory: async (title: string, userId: string) => {
    const TCId = await getAvailableIdentifiant(MYSQL_TABLES.TCategory);
    await execute(TCategoryQueries.InsertCategory, [TCId, title, userId]);
    return TCId;
  },
  deleteTCategory: async (TCId: string) => {
    await execute(TCategoryQueries.DeleteCategory, [TCId]);
  },
  isDuplicatedTCategory: async (title: string, userId: string) => {
    const result: TCategory[] = await execute(
      TCategoryQueries.IsDuplicatedCategory,
      [title, userId]
    );
    return result.length > 0;
  },
};
