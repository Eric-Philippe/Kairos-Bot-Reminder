import { ACategoryQueries } from "./acategory.queries";
import { execute } from "../../utils/mysql.connector";
import { ACategory } from "./acategory";

export const ACategoryServices = {
  getACategoryById: async (ACId: string): Promise<ACategory> => {
    const result: ACategory[] = await execute(
      ACategoryQueries.GetACategoryById,
      [ACId]
    );
    return result[0];
  },
  getACategoriesByParentId: async (parentId: string): Promise<ACategory[]> => {
    const result: ACategory[] = await execute(
      ACategoryQueries.GetACategoriesByParentId,
      [parentId]
    );
    return result;
  },
  addACategory: async (
    ACId: string,
    name: string,
    parentId: string
  ): Promise<number> => {
    await execute(ACategoryQueries.AddACategory, [ACId, name, parentId]);
    return 0;
  },
  removeACategory: async (ACId: string): Promise<number> => {
    await execute(ACategoryQueries.DeleteACategory, [ACId]);
    return 0;
  },
};
