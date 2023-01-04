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

  IsDuplicatedActivity: `
    SELECT *
    FROM Activity
    WHERE UPPER(name) = UPPER(?) AND TCId = ? AND endDate IS NULL;
    `,

  GetActivityByNameUserId: `
    SELECT *
    FROM Activity as a, TCategory as tc
    WHERE UPPER(a.name) = UPPER(?)
    AND a.TCId = tc.TCId
    AND tc.userId = ?;
    `,

  GetActivityByNameUserIdNotEnded: `
    SELECT *
    FROM Activity as a, TCategory as tc
    WHERE UPPER(a.name) = UPPER(?)
    AND a.endDate IS NULL
    AND a.TCId = tc.TCId
    AND tc.userId = ?
    ORDER BY a.entryDate DESC;
    `,

  InsertActivity: `
    INSERT INTO Activity (AId, name, entryDate, endDate, TCId) VALUES (?, ?, ?, ?, ?);
    `,

  DeleteActivity: `
    DELETE FROM Activity
    WHERE AId = ?;
    `,

  EndActivity: `
    UPDATE Activity SET endDate = ?
    WHERE AId = ?;
    `,
};
