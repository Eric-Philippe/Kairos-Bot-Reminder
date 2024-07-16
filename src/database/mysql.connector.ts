import { createConnection, Connection } from "mysql2";
import Logger from "../logs/Logger";
import { LogType } from "../logs/type.enum";
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "../config/config.database";

const logger = Logger.getInstance();
let connection: Connection;

/**
 * generates the connection to be used throughout the app
 */
export const init = () => {
  try {
    connection = createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: Number(MYSQL_PORT),
    });

    console.debug("%c💿 Connected to MySQL database", "color: #00ff00");
  } catch (error) {
    console.error("[mysql.connector][init][Error]: ", error);
    throw new Error("failed to initialized pool");
  }
};
/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const execute = <T>(
  query: string,
  params: string[] | Object
): Promise<T> => {
  try {
    if (!connection)
      throw new Error(
        "Pool was not created. Ensure pool is created when running the app."
      );

    return new Promise<any>(async (resolve, reject) => {
      connection.execute(query, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  } catch (error) {
    logger.log(
      `Error executing query: ${query} with params: ${params}. Error: ${error}`,
      LogType.ERROR,
      __filename
    );
    throw new Error("failed to execute MySQL query");
  }
};
