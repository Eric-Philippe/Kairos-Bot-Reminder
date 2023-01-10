import { TCategoryQueries } from "./tcategory.queries";
import { execute } from "../../utils/mysql.connector";
import { TCategory } from "./tcategory";
import { MYSQL_TABLES } from "../../utils/mysql_tables.enum";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";

export const TCategoryServices = {
  getTCategoryById: async (TCId: string): Promise<TCategory> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoryById,
      [TCId]
    );
    return result[0];
  },
  getTCategoryByUserId: async (userId: string): Promise<TCategory[]> => {
    const result: TCategory[] = await execute(
      TCategoryQueries.GetCategoryByUserId,
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
      [title, userId]
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
      [keywordSQL, userId]
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
