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
            *
            FROM
            Remindme
            Utilisateur
            Country
            WHERE
            Remindme.userId = Utilisateur.userId
            AND Utilisateur.CId = Country.CId
            AND Remindme.targetDate <= DATE_ADD(NOW(), INTERVAL Country.gmtOffset - 1 HOUR);
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
