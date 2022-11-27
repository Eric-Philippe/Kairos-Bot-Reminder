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
        RCId,
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
        RCId,
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
            RCId,
            userId
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
};
