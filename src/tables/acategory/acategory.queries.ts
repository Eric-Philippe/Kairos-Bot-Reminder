export const ACategoryQueries = {
  GetACategoryById: `
        SELECT
        ACId,
        name,
        parentId
        FROM
        ACategory
        WHERE
        ACId = ?;
        `,
  AddACategory: `
        INSERT INTO ACategory VALUES (?, ?, ?);`,
  DeleteACategory: `
        DELETE FROM ACategory WHERE ACId = ?;`,
  GetACategoriesByParentId: `
        SELECT
        ACId,
        name,
        parentId
        FROM
        ACategory
        WHERE
        parentId = ?;
        `,
};
