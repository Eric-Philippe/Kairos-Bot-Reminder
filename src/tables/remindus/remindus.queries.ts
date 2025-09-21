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
        Remindus as R
        WHERE R.guildId = ?;
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
            R.*
            FROM
            Remindus as R, Guild as G, Country as C
            WHERE
            R.guildId = G.guildId AND
            G.CId = C.CId AND
            R.isPaused = 0 AND
            R.targetDate <= DATE_ADD(NOW(), INTERVAL C.gmtOffset - 1 HOUR);
            `,

  UpdateRemindusDate: `
            UPDATE Remindus
            SET targetDate = ?
            WHERE usId = ?;
            `,

  GetNextRemindus: `
      SELECT r.*,
            r.targetDate + INTERVAL c.gmtOffset HOUR AS targetDateUser
      FROM Remindus r
      JOIN Guild g ON g.guildId = r.guildId
      JOIN Country c ON c.CId = g.CId
      WHERE r.targetDate + INTERVAL c.gmtOffset HOUR > NOW()
      ORDER BY r.targetDate + INTERVAL c.gmtOffset HOUR
      LIMIT 1;
            `,
};
