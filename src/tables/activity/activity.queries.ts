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
    AND tc.userId = ?;
    `,

  InsertActivity: `
    INSERT INTO Activity (AId, name, TCId) VALUES (?, ?, ?);
    `,

  DeleteActivity: `
    DELETE FROM Activity
    WHERE AId = ?;
    `,
};
