export const RemindmeQueries = {
  GetRemindmesById: `
        SELECT
        *
        FROM
        Remindme
        WHERE
        meId = ?;
        `,
  AddRemindme: `
        INSERT INTO Remindme VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
  DeleteRemindme: `
        DELETE FROM Remindme WHERE meId = ?;`,
  GetRemindmeAtDate: `
        SELECT
        *
        FROM
        Remindme
        WHERE
        targetDate = ?;
        `,
  GetRemindmeByUserId: `
            SELECT
            *
            FROM
            Remindme
            WHERE
            userId = ?;
            `,
  PauseRemindme: `
            UPDATE Remindme
            SET isPaused = ?
            WHERE meId = ?;
            `,
  // MYSql query to get all remindmes that are now in the past and considering also the timezone linked to the user
  FetchNewQueuedRemindme: `
            SELECT
            R.*
            FROM
            Remindme as R,
            Utilisateur as U,
            Country as C
            WHERE
            R.userId = U.userId
            AND U.CId = C.CId
            AND R.targetDate <= DATE_ADD(NOW(), INTERVAL C.gmtOffset - 1 HOUR);
      `,

  UpdateRemindmeDate: `
            UPDATE Remindme
            SET targetDate = ?
            WHERE meId = ?;
            `,

  GetRemindmesByCategoryAndUserId: `
            SELECT
            *
            FROM
            Remindme
            WHERE
            RCId = ? AND
            userId = ?;
            `,

  GetNextRemindMe: `
            SELECT
            *
            FROM
            Remindme
            WHERE
            isPaused = 0
            ORDER BY targetDate ASC
            LIMIT 1;
            `,
};
