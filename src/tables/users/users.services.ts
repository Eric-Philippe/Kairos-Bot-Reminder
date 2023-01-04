import { UserQueries } from "./users.queries";
import { TCategoryServices } from "../tcategory/tcategory.services";
import { execute } from "../../utils/mysql.connector";
import { Utilisateur } from "./utilisateur";
import { DEFAULT } from "src/utils/default.enum";

export const UsersServices = {
  isADBUser: async (userId: string): Promise<boolean> => {
    let result: Utilisateur[] = await execute(UserQueries.GetUserById, [
      userId,
    ]);
    if (result.length > 0) return true;
    else {
      UsersServices.addUser(userId);
      return false;
    }
  },
  addUser: async (userId: string): Promise<number> => {
    await execute(UserQueries.AddUser, [userId, 0, DEFAULT.TimeZoneId]);
    await TCategoryServices.insertTCategory("Miscellaneous", userId);
    return 0;
  },

  removeUser: async (userId: string): Promise<number> => {
    await execute(UserQueries.DeleteUser, [userId]);
    return 0;
  },

  isAdmin: async (userId: string): Promise<boolean> => {
    const result: Utilisateur[] = await execute(UserQueries.GetUserById, [
      userId,
    ]);

    return result[0].superAdmin === 1;
  },

  getUsers: async (): Promise<Utilisateur[]> => {
    const result: Utilisateur[] = await execute(UserQueries.GetUsers, []);
    return result;
  },

  getUserById: async (userId: string): Promise<Utilisateur> => {
    const result: Utilisateur[] = await execute(UserQueries.GetUserById, [
      userId,
    ]);
    return result[0];
  },

  updateUserCountry: async (
    userId: string,
    countryId: string
  ): Promise<number> => {
    await execute(UserQueries.UpdateUserCountry, [countryId, userId]);
    return 0;
  },
};
