import RandExp from "@fusionstrings/randexp";

import { execute } from "../../database/mysql.connector";
import { IdentifiantRegex } from "./identifiant_regex.enum";
import { IdentifiantQueries } from "./identifiant.queries";

export const getAvailableIdentifiant = async (
  table: string
): Promise<string> => {
  let query, regex;
  switch (table) {
    case "TCategory":
      query = IdentifiantQueries.GetTCategories;
      regex = IdentifiantRegex.TCATEGORIES;
      break;
    case "Activity":
      query = IdentifiantQueries.GetActivities;
      regex = IdentifiantRegex.ACTIVITIES;
      break;
    case "Country":
      query = IdentifiantQueries.GetCountry;
      regex = IdentifiantRegex.COUNTRY;
      break;
    case "RCategories":
      query = IdentifiantQueries.GetRCategories;
      regex = IdentifiantRegex.CATEGORIES;
      break;
    case "Remindme":
      query = IdentifiantQueries.GetRemindme;
      regex = IdentifiantRegex.REMINDER;
      break;
    case "Remindus":
      query = IdentifiantQueries.GetRemindus;
      regex = IdentifiantRegex.REMINDER;
      break;
    case "Task":
      query = IdentifiantQueries.GetTask;
      regex = IdentifiantRegex.TASKS;
      break;
    default:
      throw new Error("Invalid table name");
  }

  let identifiants: any[] = await execute(query, []);
  let availableIdentifiant = "";
  let i = 0;
  while (availableIdentifiant === "" && i < (identifiants.length + 1) * 4) {
    let identifiant = createNextIdentifiant(regex);
    if (!identifiants.includes(identifiant)) {
      availableIdentifiant = identifiant;
    }
  }
  if (availableIdentifiant === "") {
    throw new Error("No available identifiant");
  }
  return availableIdentifiant;
};
/**
 * Generates a random identifiant respecting the given regex
 * @param regex {string} - regex to be used to create the identifiant
 * @param current {string} - current identifiant
 */
const createNextIdentifiant = (regex: string): string => {
  let randexp = new RandExp(regex);
  let randomExp = randexp.gen();
  return randomExp.substring(1, randomExp.length - 1);
};
