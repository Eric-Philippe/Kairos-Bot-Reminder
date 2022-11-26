export const RCategoryQueries = {
  GetRCategoryById: `
        SELECT
        ACId,
        name,
        parentId,
        isGuild
        FROM
        ACategory
        WHERE
        ACId = ?;
        `,
  AddRCategory: `
        INSERT INTO RCategory VALUES (?, ?, ?, ?);`,
  DeleteRCategory: `
        DELETE FROM RCategory WHERE RCId = ?;`,
  GetRCategoriesByParentId: `
        SELECT
        ACId,
        name,
        parentId,
        isGuild
        FROM
        ACategory
        WHERE
        parentId = ?;
        `,
};
