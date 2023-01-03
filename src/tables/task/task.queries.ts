export const TaskQueries = {
  GetTaskByName: `
            SELECT * 
            FROM Task as t, Activity as a, TCategory as tc
            WHERE t.content = ?
            AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?
      `,
  GetTaskById: `
            SELECT * FROM Task WHERE TId = ?;
      `,
  GetTasksByUserId: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?;
      `,
  InsertTask: `
            INSERT INTO Task (TId, content, entryDate, endDate, TCId, AId) VALUES (?, ?, ?, ?, ?, ?);
      `,
  EndTask: `
            UPDATE Task SET endDate = ?
            WHERE TId = ?;
      `,
  DeleteTask: `
            DELETE FROM Task WHERE TId = ?;
      `,
};
