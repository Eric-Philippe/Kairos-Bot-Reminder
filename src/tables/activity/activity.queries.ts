export const ActivityQueries = {
  GetActivitiesByUserId: `
    SELECT * 
    FROM Activity as a, TCategory as tc
    WHERE a.TCId = tc.TCId
    AND tc.userid = ?;
    `,

  GetActivityById: `
    SELECT *
    FROM Activity
    WHERE AId = ?;
    `,

  GetActivitiesByCategoryId: `
    SELECT *
    FROM Activity
    WHERE TCId = ?;
    `,

  GetActivityByNameCategoryId: `
    SELECT *
    FROM Activity
    WHERE UPPER(name) = UPPER(?)
    AND TCId = ?;
    `,

  IsDuplicatedActivity: `
    SELECT *
    FROM Activity
    WHERE UPPER(name) = UPPER(?) AND TCId = ?;
    `,

  GetActivityByNameUserId: `
    SELECT *
    FROM Activity as a, TCategory as tc
    WHERE UPPER(a.name) = UPPER(?)
    AND a.TCId = tc.TCId
    AND tc.userId = ?
    `,
  // And the sum of all his tasks is not 0
  GetActivityByKeywordUserId: `
    SELECT *
    FROM Activity as a, TCategory as tc
    WHERE UPPER(a.name) LIKE UPPER(?)
    AND a.TCId = tc.TCId
    AND tc.userId = ?
    AND a.AId IN (
      SELECT AId
      FROM Task
      WHERE userId = ?
      GROUP BY AId
      HAVING SUM(timestampdiff(MINUTE, entryDate, endDate)) > 0
    );  
    `,

  InsertActivity: `
    INSERT INTO Activity (AId, name, TCId) VALUES (?, ?, ?);
    `,

  DeleteActivity: `
    DELETE FROM Activity
    WHERE AId = ?;
    `,
};
