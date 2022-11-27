export const UserQueries = {
  GetUsers: `
        SELECT
        userId,
        superAdmin,
        cId
        FROM
        Utilisateur;
        `,
  GetUserById: `
        SELECT
        userId,
        superAdmin,
        cId
        FROM
        Utilisateur
        WHERE
        userId = ?;
        `,
  AddUser: `
        INSERT INTO Utilisateur VALUES (?, ?, ?);`,

  DeleteUser: `
        DELETE FROM Utilisateur WHERE userId = ?;`,

  UpdateUserCountry: `
            UPDATE Utilisateur SET cId = ? WHERE userId = ?;`,
};
