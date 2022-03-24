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
const insertSQL = async function (reminder) {
  // Find if the user already has a reminder
  // One user can have 1 at n Reminder
  // One Reminder can concern 1 at n User
  con.query(
    query_Users_READ,
    [reminder.users_id[0]],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length === 0) {
        // Add the User at the DB
        con.query(
          query_Users,
          [reminder.users_id[0]],
          function (err, result, fields) {
            if (err) throw err;
          }
        );
      }
    }
  );

  // Add Reminder
  await con.query(
    query_Reminder,
    [reminder.current_date, reminder.target_date, reminder.remind],
    async function (err, result, fields) {
      if (err) throw err;
      insertID = await result.insertId;
      // Add the Concerner obj
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

exports.insertSQL = insertSQL;
