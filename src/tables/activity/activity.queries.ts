export const ActivityQueries = {
  GetActivitiesByUserId: `
    SELECT * FROM Activities WHERE userId = ?;
    `,

  GetActivityById: `
    SELECT * FROM Activities WHERE AId = ?;
    `,

  AddActivity: `
    INSERT INTO Activities VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,

  DeleteActivity: `
    DELETE FROM Activities WHERE AId = ?;
    `,
};
