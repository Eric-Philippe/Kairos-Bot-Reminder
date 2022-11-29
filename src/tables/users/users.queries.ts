export const UserQueries = {
  GetUsers: `
      SELECT
      *
      FROM
      Utilisateur;`,

  GetUserById: `
      SELECT
      *
      FROM
      Utilisateur
      WHERE
      userId = ?;`,

  AddUser: `
      INSERT INTO Utilisateur VALUES (?, ?, ?);`,

  DeleteUser: `
      DELETE FROM Utilisateur WHERE userId = ?;`,

  UpdateUserCountry: `
      UPDATE Utilisateur SET cId = ? WHERE userId = ?;`,
};
