const Discord = require("discord.js"); // Discord.js API
// ================== CONNEXION IMPORT =========================
const { client } = require("../utils/client"); // Discord Bot
const { con } = require("../utils/mysql"); // SQL Connexion
// ================== RESSOURCES IMPORT =========================
const { IMG } = require("../ressources.json"); // Ressources required for the system
/**
 * Check if there is a reminder to send
 */
const checkRemindUs = async () => {
  const now = new Date(); // Create a new current date
  const sql = `SELECT * FROM Reminder_Us WHERE t_date <= ?`; // SQL Past Reminder
  const values = [now]; // Values to send to the SQL
  // Send the SQL to the database
  await con.query(sql, values, (err, results) => {
    if (err) throw err;
    // If there is a reminder to send
    if (results.length > 0) {
      // For each reminder
      for (let i = 0; i < results.length; i++) {
        // Find the channel of the reminder
        let channel = client.channels.cache.get(results[i].channel_id);
        if (!channel) return; // If the channel doesn't exist anymore
        let embedReminder = new Discord.MessageEmbed() // Embed Reminder Constructor
          .setTitle("You have a reminder !")
          .setColor("#03fcd3")
          .addField("🗨️ | Reminder Label : ", results[i].remind)
          .addField(
            "🕔 | Reminder Date : ",
            "``" + results[i].c_date + "``",
            true
          )
          .addField(
            "🕣 | Reminder Target Date  : ",
            "``" + results[i].t_date + "``",
            true
          )
          .addField("#️⃣ | Reminder ID : ", `#${results[i].id_reminder}`)
          .setFooter({ text: "Provided by Kairos | Reminder Bot" })
          .setThumbnail(IMG.REMINDER_LOGO);
        // ============= Notification paramaters ==========
        // @everyone
        if (results[i].notif === "@everyone") {
          channel.send("||@everyone||");
          // @here
        } else if (results[i].notif === "@here") {
          channel.send("||@here||");
        } else if (results[i].notif != "None") {
          channel.send(`||${results[i].notif}||`);
        }
        // Send the Main Embed
        channel.send({ embeds: [embedReminder] });
        // ============ Recurrence parameters =============
        // If the reminder is recurrent
        if (results[i].recurrence != "None") {
          const sql = `UPDATE Reminder_Us SET t_date = ? WHERE id_reminder = ?`; // SQL Update
          let values; // Values to send to the SQL
          let current_date = new Date(results[i].t_date); // Create a new date with the past current date
          let new_date; // New date to send to the SQL
          // Switch between all the recurrents
          switch (results[i].recurrence) {
            /**
             * case "Recurrence":
             * Update the past date + the recurrence
             * Add to the value array
             * break;
             */
            case "Daily":
              new_date = new Date(
                current_date.setDate(current_date.getDate() + 1)
              );
              values = [new_date, results[i].id_reminder];
              break;
            case "Weekly":
              new_date = new Date(
                current_date.setDate(current_date.getDate() + 7)
              );
              values = [new_date, results[i].id_reminder];
              break;
            case "Monthly":
              new_date = new Date(
                current_date.setMonth(current_date.getMonth() + 1)
              );
              values = [new_date, results[i].id_reminder];
              break;
            case "Yearly":
              new_date = new Date(
                current_date.setFullYear(current_date.getFullYear() + 1)
              );
              values = [new_date, results[i].id_reminder];
              break;
            // Default
            default:
              break;
          }
          // Send the SQL to the database
          con.query(sql, values, (err, result) => {
            if (err) throw err;
          });
          // If the reminder is not recurrent
        } else {
          // Delete the Reminder from the database
          const sql = `DELETE FROM Reminder_Us WHERE id_reminder = ?`; // SQL Delete
          const values = [results[i].id_reminder]; // Values to send to the SQL
          // Send the SQL to the database
          con.query(sql, values, (err, result) => {
            if (err) throw err;
          });
        }
      }
    }
  });
};
/**
 * Function to call the checkRemindUs function recursively
 * every minute
 */
const remindUsCheck = async () => {
  setInterval(() => {
    checkRemindUs();
  }, 10 * 1000);
};
// Export the function
exports.remindUsCheck = remindUsCheck;
