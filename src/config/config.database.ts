require("dotenv").config();

const {
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_HOST,
} = process.env;

if (
  !MYSQL_ROOT_PASSWORD ||
  !MYSQL_DATABASE ||
  !MYSQL_USER ||
  !MYSQL_PASSWORD ||
  !MYSQL_PORT ||
  !MYSQL_HOST
) {
  throw new Error("Missing environment variables");
}

export {
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_HOST,
};
