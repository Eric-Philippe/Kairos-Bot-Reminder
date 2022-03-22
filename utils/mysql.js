const mysql = require("mysql");

const { SQL_Option } = require("../mysql.json");

module.exports.con = mysql.createConnection(SQL_Option);
