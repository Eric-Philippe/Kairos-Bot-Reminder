const Discord = require("discord.js");

/**
 * remindUs Class
 *
 * @public
 * @author EricP
 */
module.exports = class createRemindUsObject {
  /**
   * Interface wich contains all the required parameters
   * @typedef {Object} RemindUsObject
   * @property {Date} target_date
   * @property {Date} entry_date
   * @property {String} remind
   * @property {String} channel_id
   * @property {Boolean} notif
   * @property {Boolean} recurrence
   */
  /**
   * Input of the reminder
   * @param {Discord.Message} msg
   * @return {RemindUsObject}
   */
  static getRemindUsObject(msg) {
    // Check if the user has Admin permission
    if (!msg.member.hasPermission("ADMINISTRATOR"))
      return msg.channel.send(
        "You don't have the permission to use this command"
      );
    // Ask for the date
    const date = this.inputDate(msg);
    // Ask for the time
    const time = this.inputTime(msg);
    // Build the full date
    const full_date = new Date(`${date} ${time}`);
    console.log(full_date);
  }

  /**
   * Input of the full date and time
   * @param {Discord.Message} msg
   * @return {Date}
   */
  static inputDate(msg) {
    msg.channel.send("Please enter the date.");
    const filter = (m) =>
      m.author.id === msg.author.id && isValidDate(m.content);
    msg.channel
      .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const date = collected.first().content;
        return date;
      });
  }

  /**
   * Check if the given string is a valid date
   * @param {String} date
   * @return {Boolean}
   */
  static isValidDate(date) {
    const date_array = date.split("/");
    const day = date_array[0];
    const month = date_array[1];
    const year = date_array[2];
    const date_object = new Date(year, month, day);
    return date_object.getDate() === day && date_object.getMonth() === month;
  }

  /**
   * Input of the time
   * @param {Discord.Message} msg
   * @return {String}
   */
  static inputTime(msg) {
    msg.channel.send("Please enter the time.");
    const filter = (m) =>
      m.author.id === msg.author.id && isValidTime(m.content);
    msg.channel
      .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const time = collected.first().content;
        return time;
      });
  }

  /**
   * Check if the given string is a valid time
   * @param {String} time
   * @return {Boolean}
   * @example
   * isValidTime("12h00"); // true
   * isValidTime("12H00"); // true
   * isValidTime("salut"); // false
   */
  static isValidTime(time) {
    const time_array = time.split("h");
    const hour = time_array[0];
    const minutes = time_array[1];
    const time_object = new Date(0, 0, 0, hour, minutes);
    return (
      time_object.getHours() === hour && time_object.getMinutes() === minutes
    );
  }
};
