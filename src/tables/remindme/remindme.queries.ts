export const RemindmeQueries = {
  GetRemindmesById: `
        SELECT
        meId,
        content,
        description,
        entryDate,
        targetDate,
        repetition,
        isPaused,
        RId,
        userId
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
        meId,
        content,
        description,
        entryDate,
        targetDate,
        repetition,
        isPaused,
        RId,
        userId
        FROM
        Remindme
        WHERE
        targetDate = ?;
        `,
  GetRemindmeByUserId: `
            SELECT
            meId,
            content,
            description,
            entryDate,
            targetDate,
            repetition,
            isPaused,
            RId,
            userId
            FROM
            Remindme
            WHERE
            userId = ?;
            `,
};
