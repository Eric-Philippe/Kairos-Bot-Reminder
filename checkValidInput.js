const Discord = require("discord.js");
const { client } = require("./utils/client"); // Discord Bot

module.exports = class CheckInput {
  /**
   * Check if the given string is a valid date
   * @param {String} str
   * @example isValidDate("01/01/2020") // true
   * @example isValidDate("01-01-2020") // false
   * @returns {Boolean}
   */
  static isValidDate(str) {
    let args = str.split("/");
    const date = new Date(args[2], args[1] - 1, args[0]);
    return (
      date.getDate() === parseInt(args[0]) &&
      date.getMonth() === parseInt(args[1]) - 1 &&
      date.getFullYear() === parseInt(args[2])
    );
  }

  /**
   * Check if the given string is a valid time
   * @param {String} str
   * @example isValidTime("01:01") // true
   * @example isValidTime("01-01") // false
   * @returns {Boolean}
   */
  static isValidTime(str) {
    let args = str.split(":");
    const date = new Date(0, 0, 0, args[0], args[1]);
    return (
      date.getHours() === parseInt(args[0]) &&
      date.getMinutes() === parseInt(args[1])
    );
  }

  static buildDate(str) {
    let args = str.split("/");
    const date = new Date(args[2].split(" ")[0], args[1] - 1, args[0]);
    const time = str.split(" ")[1].split(":");
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    return date;
  }

  /**
   * Check if the given string (DD/MM/YYYY HH:MM) is not in the past
   * @param {String} str
   * @returns {Boolean}
   */
  static isNotPast(str) {
    return CheckInput.buildDate(str) > new Date();
  }

  /**
   * Check if the given string is a valid ID channel and if the bot has the permission to send a message
   * @param {String} str
   * @returns {Boolean}
   */
  static isValidChannel(str) {
    const channel = client.channels.cache.get(str);
    return (
      channel &&
      channel.type === "GUILD_TEXT" &&
      channel.permissionsFor(client.user).has("SEND_MESSAGES")
    );
  }
};
