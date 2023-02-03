export const TaskQueries = {
  GetTaskByName: `
        SELECT t.* 
        FROM Task as t, Activity as a, TCategory as tc
        WHERE UPPER(t.content) = UPPER(?)
        AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
        AND tc.userid = ?
    `,
  GetTaskById: `
        SELECT t.*
        FROM Task as t
        WHERE t.TId = ?
    `,

  GetTaskByIdUserId: `
        SELECT DISTINCT t.*
        FROM Task as t, Activity as a, TCategory as tc
        WHERE t.TId = ?
        AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
        AND tc.userid = ?
    `,
  GetTasksByCategory: `
        SELECT DISTINCT t.*
        FROM Task as t, Activity as a, TCategory as tc
        WHERE t.TCId = tc.TCId
        AND tc.TCId = ?
    `,
  GetTasksByActivityId: `
        SELECT DISTINCT t.*
        FROM Task as t, Activity as a
        WHERE t.AId = a.AId
        AND a.AId = ?
    `,
  GetTaskByNameNotEnded: `
        SELECT t.*
        FROM Task as t, Activity as a, TCategory as tc
        WHERE UPPER(t.content) = UPPER(?)
        AND t.endDate IS NULL
        AND (t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId)
        AND tc.userid = ?
        ORDER BY t.entryDate DESC;
    `,
  GetTaskByContentUserIdEnded: `
        SELECT t.TId,t.content,t.entryDate,t.endDate,t.TCId,t.AId
        FROM Task as t, Activity as a, TCategory as tc
        WHERE UPPER(t.content) = UPPER(?)
        AND t.endDate IS NOT NULL
        AND ((t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId))
        AND tc.userid = ?
        ORDER BY t.entryDate DESC;
    `,
  GetTasksByKeywordUserId: `
        SELECT Task.TId, Task.content, 
        TCategory.TCId, TCategory.title, Activity.AId, Activity.name 
        FROM Task 
        LEFT JOIN TCategory ON Task.TCId = TCategory.TCId
        LEFT JOIN Activity ON Task.AId = Activity.AId
        WHERE Task.content LIKE UPPER(?)
        AND (TCategory.userId = ? OR 
        Activity.TCId IN (SELECT TCId FROM TCategory WHERE userId = ?))
    `,
  GetTasksNotEndedByKeywordUserId: `
        SELECT Task.TId, Task.content, 
        TCategory.TCId, TCategory.title, Activity.AId, Activity.name 
        FROM Task 
        LEFT JOIN TCategory ON Task.TCId = TCategory.TCId
        LEFT JOIN Activity ON Task.AId = Activity.AId
        WHERE Task.content LIKE UPPER(?)
        AND Task.endDate IS NULL
        AND (TCategory.userId = ? OR 
        Activity.TCId IN (SELECT TCId FROM TCategory WHERE userId = ?))
    `,
  GetTasksByKeywordUserIdEnded: `
        SELECT DISTINCT t.TId,t.content,timestampdiff(MINUTE, entryDate, endDate) as timeElapsed,t.TCId,t.AId
        FROM Task as t, Activity as a, TCategory as tc
        WHERE UPPER(t.content) LIKE UPPER(?)
        AND t.endDate IS NOT NULL
        AND ((t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId))
        AND tc.userid = ?
        ORDER BY timeElapsed DESC;
    `,
  GetTasksByKeywordUserIdNotEnded: `
    SELECT DISTINCT t.TId,t.content,timestampdiff(MINUTE, entryDate, endDate) as timeElapsed,t.TCId,t.AId
    FROM Task as t, Activity as a, TCategory as tc
    WHERE UPPER(t.content) LIKE UPPER(?)
    AND t.endDate IS NULL
    AND ((t.AId = a.AId AND a.TCId = tc.TCId) OR (t.TCId = tc.TCId))
    AND tc.userid = ?
    ORDER BY timeElapsed DESC;
`,
  GetTasksNotEndedByActivityId: `
        SELECT * FROM Task WHERE AId = ? AND endDate IS NULL;
    `,
  GetTasksByUserId: `
        SELECT t.*
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
