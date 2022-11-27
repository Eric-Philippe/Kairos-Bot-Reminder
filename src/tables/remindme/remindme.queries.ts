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
  // Query that will check every remindme that has a date past the current date considering the Utilisateur timezone
  FetchNewQueuedRemindme: `
      SELECT
      *
      FROM
      Remindme as R, Utilisateur as U, Country as C
      WHERE
      R.userId = U.userId AND
      U.CId = C.CId AND
      R.isPaused = 0 AND
      R.targetDate <= DATE_ADD(NOW(), INTERVAL C.gmtOffset HOUR);
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
};
