const Discord = require("discord.js");
/**
 *  Check if the user is admin or not
 * @param {Discord.Message} msg
 * @returns {Boolean}
 */
const isAdmin = function (msg) {
  if (msg.member.permissions.has([Discord.Permissions.FLAGS.ADMINISTRATOR])) {
    return true;
  } else {
    return false;
  }
};
// export { isAdmin };
exports.isAdmin = isAdmin;
