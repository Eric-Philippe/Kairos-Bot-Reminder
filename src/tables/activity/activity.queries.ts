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
    WHERE name = ? AND TCId = ?;
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
