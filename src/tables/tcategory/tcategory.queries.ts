export const TCategoryQueries = {
  GetCategoryByUserId: `
        SELECT * FROM TCategory WHERE userId = ?;`,

  GetCategoryById: `
        SELECT * FROM TCategory WHERE TCId = ?;`,

  InsertCategory: `
        INSERT INTO TCategory (TCId, title, userId) VALUES (?, ?, ?);`,

  DeleteCategory: `
        DELETE FROM TCategory WHERE TCId = ?;`,

  IsDuplicatedCategory: `
        SELECT * FROM TCategory WHERE title = ? AND userId = ?;`,
};
