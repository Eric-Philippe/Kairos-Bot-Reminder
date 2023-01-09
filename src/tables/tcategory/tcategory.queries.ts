export const TCategoryQueries = {
  GetCategoryByUserId: `
        SELECT * FROM TCategory WHERE userId = ?;`,

  GetCategoryById: `
        SELECT * FROM TCategory WHERE TCId = ?;`,

  GetCategoryByTitleUserId: `
        SELECT * FROM TCategory WHERE UPPER(title) = UPPER(?) AND userId = ?;`,

  GetCategoryByKeywordUserId: `
      SELECT * FROM TCategory WHERE UPPER(title) LIKE UPPER(?) AND userId = ?;
  `,

  GetMiscellaneousCategory: `
        SELECT * FROM TCategory WHERE title = 'Miscellaneous' AND userId = ?;`,

  InsertCategory: `
        INSERT INTO TCategory (TCId, title, userId) VALUES (?, ?, ?);`,

  DeleteCategory: `
        DELETE FROM TCategory WHERE TCId = ?;`,

  IsDuplicatedCategory: `
        SELECT * FROM TCategory WHERE UPPER(title) = UPPER(?) AND userId = ?;`,
};
