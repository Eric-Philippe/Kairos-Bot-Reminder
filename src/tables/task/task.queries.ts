export const TaskQueries = {
  GetTasksByActivityId: `
        SELECT * FROM task WHERE AId = ?
        `,
  GetTaskById: `
        SELECT * FROM task WHERE TId = ?
        `,
  AddTask: `
      INSERT INTO Task VALUEQ (?, ?, ?, ?, ?, ?, ?);`,
  DeleteTask: `
        DELETE FROM Task WHERE TId = ?;`,
};
