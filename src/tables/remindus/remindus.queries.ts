export const RemindusQueries = {
  GetRemindusById: `
      SELECT
      *
      FROM
      Remindus
      WHERE
      usId = ?;`,

  AddRemindus: `
        INSERT INTO Remindus VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
  DeleteRemindus: `
        DELETE FROM Remindus WHERE usId = ?;`,
  GetRemindusAtDate: `
        SELECT
        *
        FROM
        Remindus
        WHERE
        targetDate = ?;
        `,
  GetRemindusByGuildId: `
        SELECT
       *
        FROM
        Remindus as R, Guild as G
        `,
  BreakRemindus: `
            UPDATE Remindus SET isPaused = ? WHERE usId = ?;
            `,
  GetRemindusByCategoryAndGuildId: `
            SELECT
            *
            FROM
            Remindus
            WHERE
            RCId = ? AND
            guildId = ?;
            `,

  FetchPastRemindus: `
            SELECT
            *
            FROM
            Remindus as R, Guild as G, Country as C
            WHERE
            R.guildId = G.guildId AND
            G.CId = C.CId AND
            R.isPaused = 0 AND
            R.targetDate <= DATE_ADD(NOW(), INTERVAL C.gmtOffset HOUR);
            `,

  UpdateRemindusDate: `
            UPDATE Remindus
            SET targetDate = ?
            WHERE usId = ?;
            `,
};
