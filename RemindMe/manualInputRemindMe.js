const Discord = require("discord.js");

const { con } = require("../utils/mysql");
/**
 * Interface wich contains all the required parameters
 * @typedef {Object} RemindMeObject
 * @property {String} id_user
 * @property {Date} entry_date
 * @property {Date} target_date
 * @property {String} remind
 * @property {String} recurrence
 */
/**
 * Class to Input a ReminderMe manually
 * @class
 * @example {new InputRemindMe(msg)}
 */
module.exports = class ManualInputRemindMe {
  /**
   * @param {Discord.Message} msg
   * @example {!remindme 01/01/1999 12:00 "Hello World"}
   * @example {!remindme 12:00 "Hello World"}
   */
  constructor(msg) {
    this.msg = msg;
    this.date = new Date();
    this.sortArgs();
  }

  sortArgs() {
    let args = this.msg.content.split(" ");
    if (args.length < 3) return;
    let date, time, remind;

    if (args[1].includes("/")) {
      date = args[1];
      time = args[2];
      remind = args.slice(3).join(" ");
    } else {
      let temp_date = new Date();
      date = `${temp_date.getDate()}/${
        temp_date.getMonth() + 1
      }/${temp_date.getFullYear()}`;
      time = args[1];
      remind = args.slice(2).join(" ");
    }

    if (!this.checkDate(date)) return;
    if (!this.checkTime(time)) return;
    if (!this.isInTheFuture(this.date)) return;
    if (!this.checkRemind(remind)) return;
    this.createReminder();
  }
  /**
   * Check if the date is valid
   * @param {String} date
   */
  async checkDate(date) {
    let dateArray = date.split("/");
    if (dateArray.length < 2 || dateArray.length > 3) {
      this.msg.channel.send(
        "``❌`` - Wrong date format ! (dd/mm/yyyy) or (dd/mm)"
      );
      return false;
    }
    let day = dateArray[0];
    let month = dateArray[1];
    let year;
    if (!dateArray[2]) {
      year = new Date().getFullYear();
    } else {
      year = dateArray[2];
    }
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      this.msg.channel.send(
        "``❌`` - Wrong date format ! \n Please enter valid numbers !"
      );
      return false;
    }
    if (!isValidDate(day, month, year)) {
      this.msg.channel.send("``❌`` - Wrong date format !");
      return false;
    }
    this.date = new Date(year, month - 1, day);
    return true;
  }
  /**
   * check if the time is valid
   * @param {String} time
   */
  async checkTime(time) {
    let timeArray = time.split(":");
    if (timeArray.length != 2) {
      this.msg.channel.send("``❌`` - Wrong time format ! (hh:mm)");
      return false;
    }
    let hour = timeArray[0];
    let minute = timeArray[1];
    if (isNaN(hour) || isNaN(minute)) {
      this.msg.channel.send(
        "``❌`` - Wrong time format ! \n Please enter valid numbers !"
      );
      return false;
    }
    if (!isValidTime(hour, minute)) {
      this.msg.channel.send("``❌`` - Wrong time format !");
      return false;
    }
    this.date.setHours(time.split(":")[0]);
    this.date.setMinutes(time.split(":")[1]);
    return true;
  }
  /**
   *
   * @param {*} remind
   * @returns
   */
  isInTheFuture(date) {
    if (date < new Date()) {
      this.msg.channel.send("``❌`` - You can't set a reminder in the past !");
      return false;
    }
    return true;
  }
  /**
   * Check of the remind
   * @param {String} remind
   * @returns {Boolean}
   */
  async checkRemind(remind) {
    if (remind.length > 191) {
      this.msg.channel.send("``❌`` - Remind too long !");
      return false;
    }
    this.remind = remind;
    return true;
  }

  /**
   * Create the reminder
   * @returns {Promise<void>}
   */
  async createReminder() {
    let sql = `INSERT INTO Reminder_Me (id_user, c_date, t_date, remind, recurrence) VALUES (?, ?, ?, ?, ?)`;
    let values = [
      this.msg.author.id,
      new Date(),
      this.date,
      this.remind,
      "None",
    ];
    con.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.msg.channel.send("``✅`` - Reminder created !");
    });
  }
};

function daysInMonth(m, y) {
  // m is 0 indexed: 0-11
  switch (m) {
    case 1:
      return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
    case 8:
    case 3:
    case 5:
    case 10:
      return 30;
    default:
      return 31;
  }
}

function isValidDate(d, m, y) {
  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y);
}

function isValidTime(h, m) {
  return h >= 0 && h < 24 && m >= 0 && m < 60;
}
