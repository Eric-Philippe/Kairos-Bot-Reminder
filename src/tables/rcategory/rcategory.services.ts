import { RCategoryQueries } from "./rcategory.queries";
import { execute } from "../../utils/mysql.connector";
import { RCategory } from "./rcategory";

export const ACategoryServices = {
  getACategoryById: async (ACId: string): Promise<RCategory> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoryById,
      [ACId]
    );
    return result[0];
  },
  getACategoriesByParentId: async (parentId: string): Promise<RCategory[]> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoriesByParentId,
      [parentId]
    );
    return result;
  },
  addACategory: async (
    ACId: string,
    name: string,
    parentId: string
  ): Promise<number> => {
    await execute(RCategoryQueries.AddRCategory, [ACId, name, parentId]);
    return 0;
  },
  removeACategory: async (ACId: string): Promise<number> => {
    await execute(RCategoryQueries.DeleteRCategory, [ACId]);
    return 0;
  },
  isGuild: async (ACId: string): Promise<boolean> => {
    const result: RCategory[] = await execute(
      RCategoryQueries.GetRCategoryById,
      [ACId]
    );
    return Boolean(result[0].isGuild);
  },
};
