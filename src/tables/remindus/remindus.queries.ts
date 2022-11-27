export const RemindusQueries = {
  GetRemindusById: `
        SELECT
       *
        FROM
        Remindus
        WHERE
        usId = ?;
        `,

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
        Remindus
        WHERE
        guildId = ?;
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
};
