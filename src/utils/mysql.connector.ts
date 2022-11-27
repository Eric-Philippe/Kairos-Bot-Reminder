import { createConnection, Connection } from "mysql2";
import data from "../config/mysql.json";
const dataSource = data.SQL_Option;

let connection: Connection;

/**
 * generates the connection to be used throughout the app
 */
export const init = () => {
  try {
    connection = createConnection({
      host: dataSource.host,
      user: dataSource.user,
      password: dataSource.password,
      database: dataSource.database,
      port: Number(dataSource.port),
    });

    console.debug("Connected to MySQL database");
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
  console.log("Executing query: ", query);
  console.log("With params: ", params);

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
    console.error("[mysql.connector][execute][Error]: ", error);
    throw new Error("failed to execute MySQL query");
  }
};
