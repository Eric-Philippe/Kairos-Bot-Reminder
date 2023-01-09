export const TaskQueries = {
  GetTaskByName: `
            SELECT * 
            FROM Task as t, Activity as a, TCategory as tc
            WHERE UPPER(t.content) = UPPER(?)
            AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?
      `,
  GetTaskByNameNotEnded: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE UPPER(t.content) = UPPER(?)
            AND t.endDate IS NULL
            AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?
            ORDER BY t.entryDate DESC;
      `,
  GetTaskByContentUserIdEnded: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE UPPER(t.content) = UPPER(?)
            AND t.endDate IS NOT NULL
            AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?
            ORDER BY t.entryDate DESC;
  `,

  GetTasksByKeywordUserIdEnded: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE UPPER(t.content) LIKE UPPER(?)
            AND t.endDate IS NOT NULL
            AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?
            ORDER BY t.entryDate DESC;
  `,

  GetTaskById: `
            SELECT * FROM Task WHERE TId = ?;
      `,

  GetTasksNotEndedByActivityId: `
            SELECT * FROM Task WHERE AId = ? AND endDate IS NULL;
      `,
  GetTasksByUserId: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
            AND tc.userid = ?;
      `,

  GetTasksAlteredEndedByActivityId: `
      SELECT TId, content, timestampdiff(MINUTE, entryDate, endDate) as timeElapsed, TCId, AId
      FROM Reminder.Task
      WHERE endDate IS NOT NULL AND AId = ?;
      `,

  GetTasksAlteredByCategoryIdNotEnded: `
      SELECT TId, content, timestampdiff(MINUTE, entryDate, endDate) as timeElapsed, TCId, AId
      FROM Reminder.Task
      WHERE endDate IS NOT NULL AND TCId = ?;
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
  IsDuplicateTaskFromActivity: `
            SELECT *
            FROM Task as t, Activity as a, TCategory as tc
            WHERE UPPER(t.content) = UPPER(?)
            AND t.AId = ?
            AND t.AId = a.AId
            AND a.TCId = tc.TCId
            AND tc.TCId = ?
            AND t.endDate IS NULL;
      `,
  IsDuplicateTaskFromTCategory: `
            SELECT * FROM Task WHERE UPPER(content) = UPPER(?) AND TCId = ? AND AId IS NULL AND endDate IS NULL;
      `,
};
