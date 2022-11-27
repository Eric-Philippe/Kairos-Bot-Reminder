import { RCategoryQueries } from "./rcategory.queries";
import { execute } from "../../utils/mysql.connector";
import { RCategory } from "./rcategory";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "src/utils/mysql_tables.enum";

export const RCategoryServices = {
  getRCategoryById: async (RCId: string): Promise<RCategory> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoryById,
      [RCId]
    );
    return result[0];
  },
  getRCategoriesByParentId: async (parentId: string): Promise<RCategory[]> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoriesByParentId,
      [parentId]
    );
    return result;
  },
  addRCategory: async (
    name: string,
    parentId: string,
    isGuild: number
  ): Promise<string> => {
    let id = await getAvailableIdentifiant(MYSQL_TABLES.RCategories);
    await execute(RCategoryQueries.AddRCategory, [id, name, parentId, isGuild]);
    return id;
  },
  removeRCategory: async (RCId: string): Promise<number> => {
    await execute(RCategoryQueries.DeleteRCategory, [RCId]);
    return 0;
  },
  isGuild: async (RCId: string): Promise<boolean> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoryById,
      [RCId]
    );
    return Boolean(result[0].isGuild);
  },
  getRCategoryByNameAndParentId: async (
    name: string,
    parentId: string
  ): Promise<RCategory> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoryByNameAndParentId,
      [name, parentId]
    );
    return result[0];
  },
};
