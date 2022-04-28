const Discord = require("discord.js"); // Discord.js API
// =============== CONNECTION IMPORTS ===============
const { client } = require("../utils/client");
const { con } = require("../utils/mysql");
// =============== FUNCTION IMPORTS =================
const { dateToString } = require("../dateTools");

const { IMG } = require("../ressources.json"); // Ressources required for the system
/**
 * Delete a reminder chosen by the user
 * @param {Discord.Message} msg
 */
const deleteRemindMe = async (msg) => {
  let user_id = msg.author.id; // User ID
  let sql = `SELECT * FROM Reminder_Me WHERE id_user = ?`; // SQL Reminder
  let values = [user_id]; // Values to send to the SQL
  // Send the SQL to the database
  await con.query(sql, values, async (err, results) => {
    if (err) throw err; // If there is an error
    // If there is a reminder
    if (results.length > 0) {
      let txt = ""; // Text to send
      // For each reminder
      for (let i = 0; i < results.length; i++) {
        // Texte Template
        txt +=
          `\n\n** __[${i + 1}]__ ${results[i].remind}** \n => ${dateToString(
            new Date(results[i].t_date)
          )}\n` +
          "``" +
          `Recurrence : ${results[i].recurrence}` +
          "``";
      }
      // Main Embed Constructor
      let embed = new Discord.MessageEmbed()
        .setTitle(`Reminder List of the user ${msg.author.username}`)
        .setColor("#03fcd3")
        .setFooter({
          text: "Provided by Kairos | Reminder Bot",
          iconURL: client.user.avatarURL(),
        })
        .setAuthor({
          name: msg.author.username,
          iconURL: msg.author.avatarURL(),
        })
        .setThumbnail(IMG.REMINDER_LOGO)
        .setDescription(txt);
      // Send the Embed
      const msg_embed = await msg.channel.send({ embeds: [embed] });
      // Ask the user to choose a reminder to delete
      const msg_instruction = await msg.channel.send(
        "Please choose a reminder to delete by typing the number of the reminder you want to delete"
      );
      // Collector Builder
      let collector = msg.channel.createMessageCollector({
        time: 30 * 1000, // 30 seconds
        maxMatches: 1,
        maxMatchesPerUser: 1,
      });
      // Launch the Collector
      collector.on("collect", async (m) => {
        // If the user is the same as the author
        if (m.author.id === msg.author.id) {
          // If the user has typed something else than a number
          if (isNaN(m.content))
            return msg.channel.send("Please enter a number !");
          // If the number is not in the range of the reminder list
          if (parseInt(m.content) > results.length || parseInt(m.content) < 1)
            return msg.channel.send(
              "Please enter a number between 1 and " + results.length
            );
          let sql = `DELETE FROM Reminder_Me WHERE id_reminder = ?`; // SQL Reminder
          let values = [results[parseInt(m.content) - 1].id_reminder]; // Values to send to the SQL
          // Send the SQL to the database
          await con.query(sql, values, (err, rslts) => {
            if (err) throw err;
            collector.stop("time");
            msg.channel.send("Reminder deleted !"); // Success Message
            msg_embed.delete(); // Delete the Embed
            msg_instruction.delete(); // Delete the Instruction
          });
        }
      });
    } else {
      msg.channel.send("You have no reminders !"); // If there is no reminder
    }
  });
};
// Export the function
exports.deleteRemindMe = deleteRemindMe;
