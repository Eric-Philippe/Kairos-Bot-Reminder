export const RCategoryQueries = {
  GetRCategoryById: `
        SELECT
        RCId,
        name,
        parentId,
        isGuild
        FROM
        RCategories
        WHERE
        RCId = ?;
        `,
  AddRCategory: `
        INSERT INTO RCategories VALUES (?, ?, ?, ?);`,
  DeleteRCategory: `
        DELETE FROM RCategories WHERE RCId = ?;`,
  GetRCategoriesByParentId: `
        SELECT
        RCId,
        name,
        parentId,
        isGuild
        FROM
        RCategories
        WHERE
        parentId = ?;
        `,
  GetRCategoryByNameAndParentId: `
            SELECT
            RCId,
            name,
            parentId,
            isGuild
            FROM
            RCategories
            WHERE
            name = ? AND parentId = ?;
            `,
};
