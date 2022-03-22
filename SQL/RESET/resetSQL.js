require("require-sql"); // SQL Interpreter

const { con } = require("../../utils/mysql"); // Connexion

// All SQL request
const query_Users = require("./Users.sql");
const query_Reminder = require("./Reminder.sql");
const query_Concerner = require("./Concerner.sql");

/**
 * Hard reset all the SQL tables for the Reminder MYSQL
 */
exports.resetSQL = function () {
  // Clear everthing in a specific order (Concerner -> Users -> Reminder)
  // Foregein Keys contraints
  con.query(query_Concerner, function (err, result, fields) {
    if (err) throw err;
    con.query(query_Users, function (err, result, fields) {
      if (err) throw err;
      con.query(query_Reminder, function (err, result, fields) {
        if (err) throw err;
      });
    });
  });
};
