require("require-sql"); // SQL Interpreter

const { con } = require("../../utils/mysql"); // Connexion DB

// ALL SQL Request
const query_Users = require("./INSERT_USERS.sql");
const query_Reminder = require("./INSERT_REMINDER.sql");
const query_Concerner = require("./INSERT_CONCERNER.sql");
const query_Users_READ = require("../READ/USER_ID_FILTER.sql");

/**
 * Add a new reminder Object at the DB
 *
 * @param {Object} reminder
 */
exports.insertSQL = async function (reminder) {
  con.query(
    query_Users_READ, // We don't add user if the user already got a Reminder
    // One user can have 1 at n Reminder
    // One Reminder can concern 1 at n User
    [reminder.users_id[0]],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length === 0) {
        con.query(
          query_Users, // ADD ONE
          [reminder.users_id[0]],
          function (err, result, fields) {
            if (err) throw err;
          }
        );
      }
    }
  );

  await con.query(
    query_Reminder, // ADD REMINDER
    [reminder.current_date, reminder.target_date, reminder.remind],
    async function (err, result, fields) {
      if (err) throw err;
      insertID = await result.insertId;
      await con.query(
        query_Concerner,
        [insertID, reminder.users_id[0]],
        async function (err, result, fields) {
          if (err) throw err;
        }
      );
    }
  );
};
