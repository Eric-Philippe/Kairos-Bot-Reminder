const Discord = require("discord.js"); // Discord.js API

const { client } = require("../utils/client"); // Discord Bot
const { con } = require("../utils/mysql"); // SQL Connexion

const { dateToString } = require("../dateTools");

const { IMG } = require("../ressources.json"); // Ressources required for the system

/**
 *
 * @param {Discord.Message} msg
 */
const myRemindUs = async (msg) => {
  // Check if the user has the admin permission
  if (!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))
    return msg.channel.send(
      "You don't have the permission to use this command !"
    );
  let server_id = msg.guild.id;
  let sql = `SELECT * FROM Reminder_Us WHERE server_id = ?`; // SQL Reminder
  let values = [server_id]; // Values to send to the SQL
  // Send the SQL to the database
  await con.query(sql, values, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      let txt = "";
      for (let i = 0; i < results.length; i++) {
        txt +=
          `\n\n**# ${results[i].remind}** \n => ${dateToString(
            new Date(results[i].t_date)
          )}\n` +
          "``Recurrence :`` " +
          results[i].recurrence +
          " | ``Notification :`` " +
          results[i].notif;
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`Reminder List of the server ${msg.guild.name}`)
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
      msg.channel.send({ embeds: [embed] });
    } else {
      msg.channel.send("The server has no reminders !");
    }
  });
};

exports.myRemindUs = myRemindUs;
