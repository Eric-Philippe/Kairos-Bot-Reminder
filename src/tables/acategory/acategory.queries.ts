export const ACategoryQueries = {
  GetACategoryById: `
        SELECT
        ACId,
        name,
        parentId
        FROM
        ACategories
        WHERE
        ACId = ?;
        `,
  AddACategory: `
        INSERT INTO ACategories VALUES (?, ?, ?);`,
  DeleteACategory: `
        DELETE FROM ACategories WHERE ACId = ?;`,
  GetACategoriesByParentId: `
        SELECT
        ACId,
        name,
        parentId
        FROM
        ACategories
        WHERE
        parentId = ?;
        `,
};
