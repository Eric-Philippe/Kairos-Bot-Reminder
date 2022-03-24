const Discord = require("discord.js"); // Main library
require("require-sql"); // .sql file reader

const { IMG } = require("./ressources.json"); // Ressources required for the system

/** All the function needed */
const { insertSQL } = require("./SQL/INSERT/insertSQL"); // Get the SQL insert function for the Reminder obj
const { dateToString, buildTimeLeft, timeLeft } = require("./dateTools"); // ToolBox to work with date format
const { con } = require("./utils/mysql"); // Get the mysql connexion object

/** All the READ/SELECT SQL request needed */
const query_Reminder = require("./SQL/READ/SELECT_REMINDER.sql");
const query_Users = require("./SQL/READ/SELECT_USERS.sql");
const query_userHAS = require("./SQL/READ/USER_HAS_REMINDER");
const query_Find = require("./SQL/READ/SELECT_ALL_USERS_REMINDER.sql");

/** All the DELETE SQL request needed */
const query_clear_user = require("./SQL/DELETE/CLEAR_USERS.sql");
const query_clear_concerner = require("./SQL/DELETE/CLEAR_CONCERNER.sql");
const query_clear_reminder = require("./SQL/DELETE/CLEAR_REMINDER.sql");

const { client } = require("./utils/client"); // Get Discord Client

/**
 * remindMe Class
 *
 * @public
 * @author Zaorhion
 */
module.exports = class createReminderObject {
  /**
   * Object that contains all the requiered parameters
   * @typedef {Object} ReminderObject
   * @property {Date} target_date
   * @property {Date} entry_date
   * @property {String} remind
   * @property {Array.<Discord.User>} users_id   *
   */

  /**
   * Input Reminder
   * @param {Discord.Message} msg
   * @return {ReminderObject} The object with all the reminder's information
   */
  static async remindMe(msg) {
    let args = msg.content.split(" ");
    /**  Checking & Validation of the input arguments | BEGINING]*/
    // Check if all argument exist
    if (!args[1]) return msg.reply("Please enter a date !");
    if (!args[2]) return msg.reply("Please enter a time !");
    if (!args[3]) return msg.reply("Please enter a label !");

    // === Date verification ===
    let date = args[1];
    let date_array = date.split("/");

    if (!date_array[1]) return msg.reply("Please enter a month !");
    // Check if all the date input are valid numbers
    let result_test = true;
    // Loop around all the date args and check if they're all valid
    for (let i = 0; i < date_array.length; i++) {
      // Need to be a number
      if (isNaN(date_array[i])) {
        result_test = false;
      }
    }
    // Missing date argument handler
    if (!result_test)
      return msg.reply("Please enter numeric values ​​for the date !");

    let day = date_array[0]; //Get day
    let splited_day = day.split(""); //Get divided day numbers
    let month = date_array[1]; //Get month
    let splited_month = month.split(""); //Get divided month numbers
    let current_date = new Date(); //Get full current date
    let current_year = current_date.getFullYear(); //Get current year
    let year = date_array[2] || current_year; //Get targeted year, if not, current year

    // Add zero to the day number if necessary
    if (!splited_day[1]) {
      day = "0" + splited_day[0];
    }

    // Add zero to the day month if necessary
    if (!splited_month[1]) {
      month = "0" + splited_month[0];
    }

    let day_byMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Day by month
    // Month Field overrun
    if (month > 12 || month < 1)
      return msg.reply("Please enter a valid month !");
    // Day Field overrun depending on the month
    if (day > day_byMonth[month - 1])
      return msg.reply("Please enter a valid day !");
    // Year Field overrun
    if (year < current_year || year > current_year + 2)
      return msg.reply("Please enter a valid year !");

    // === Time verification ===
    let time = args[2];
    let time_array = time.split("h") || time.split("H");

    // Check if minutes input exit
    if (!time_array[1]) time_array[1] = "00";
    // Check if all time input are number
    result_test = true;
    // Loop around all the time args
    for (let i = 0; i < time_array.length; i++) {
      // Time args need to be number
      if (isNaN(time_array[i])) {
        result_test = false;
      }
    }
    // Missing time arguments handler
    if (!result_test)
      return msg.reply("Please enter numeric values ​​for time !");

    let hour = time_array[0]; // Get hour
    let splited_hour = hour.split(""); // Get spilted hour numbers
    let minute = time_array[1]; // Get minutes
    let splited_minute = minute.split(""); // Get splited minutes numbers

    // Add zero to the hour number if necessary
    if (!splited_hour[1]) {
      hour = "0" + splited_hour[0];
    }

    // Add zero to the minutes number if necessary
    if (!splited_minute[1]) {
      minute = "0" + splited_minute[0];
    }

    // Hour Field overrun
    if (hour > 23 || hour < 0) return msg.reply("Please enter valid hours !");
    // Minutes Field overrun
    if (minute > 59 || minute < 0)
      return msg.reply("Please enter valid minutes!");

    // Formated date
    let target_date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

    // Check if date is before the current date
    if (target_date < current_date)
      return msg.reply("Please enter a future date !");
    //*  Checking & validation of the arguments |END]*/

    let remind = args.slice(3).join(" "); // Reminder title

    let users_id = [msg.author.id]; // Array of user who'll receive the reminder

    await insertSQL({ target_date, current_date, remind, users_id }); // Add the Reminder object to the SQL Databse

    // Validation Embed
    let embed = new Discord.MessageEmbed()
      .setTitle("⚙️ | Your reminder has been added !")
      .setColor("#03fcd3")
      .setFooter({
        text: `Asked by : ${msg.author.tag}`,
        iconURL: msg.author.avatarURL(),
      })
      .setTimestamp()
      .setThumbnail(IMG.REMINDER_LOGO);

    msg.channel.send({ embeds: [embed] }); // Send the confirmation embed
  }

  /**
   * Récursvive loop checking reminders to launch
   */
  static remindCheck() {
    setTimeout(function () {
      let REMINDER; // Past Reminder Array
      // ============ NEW REMINDER TO SEND ============
      con.query(
        query_Reminder,
        [new Date()],
        async function (err, results, fields) {
          /** Query Result PARSE */
          if (!err) REMINDER = JSON.parse(JSON.stringify(results)); // Parse all the SQL result into JSON
          if (!REMINDER) return console.log("ERROR"); // Error after the parse
          if (REMINDER.length === 0) return; // If not reminder need to be launch
          console.log(`${REMINDER.length} rappel(s) demandé(s)`);

          // Loop all around the "Past" Reminder
          for (let i = 0; i < REMINDER.length; i++) {
            // ============ EMBED CONSTRUCTOR ============
            let embedReminder = new Discord.MessageEmbed() // Embed Reminder Constructor
              .setTitle("You have a reminder !")
              .setColor("#03fcd3")
              .addField("🗨️ | Reminder Label : ", REMINDER[i].remind)
              .addField(
                "🕔 | Reminder Date : ",
                "``" + REMINDER[i].c_date + "``",
                true
              )
              .addField(
                "🕣 | Reminder Target Date  : ",
                "``" + REMINDER[i].t_date + "``",
                true
              )
              .addField("#️⃣ | Reminder ID : ", `#${REMINDER[i].id_reminder}`)
              .setFooter({ text: "Provided by Kairos | Reminder Bot" })
              .setThumbnail(IMG.REMINDER_LOGO);

            let USER; // All users matching the target reminder
            // Find all the user who have the targeted Reminder
            con.query(
              query_Users,
              [REMINDER[i].id_reminder],
              async function (err, results, fields) {
                if (!err) USER = JSON.parse(JSON.stringify(results));
                if (USER.length === 0) return;

                // Loop on all the targeted users to send the reminder
                for (let u = 0; u < USER.length; u++) {
                  // Try to send the Reminder at the targeted user
                  // Need that the user has agreed to receive DMs
                  try {
                    // Find user on the Bot Cache
                    let user = await client.users.cache.find(
                      (user) => user.id === USER[u].id_user
                    );
                    // Send the embed Reminder
                    await user.send({ embeds: [embedReminder] });
                  } catch (err) {
                    console.log(err);
                  }
                  // ============ CLEAR ============
                  // Clear the row of the Join table, in a specific order (Foreign Keys)
                  con.query(
                    query_clear_concerner,
                    [REMINDER[i].id_reminder],
                    function (err, result, fileds) {
                      // Check if the user has another reminder to keep it in the DB
                      con.query(
                        query_userHAS,
                        [USER[u].id_user],
                        function (err, result, fields) {
                          // If no more reminder, clear the user from the DB
                          if (result.length === 0) {
                            con.query(query_clear_user, [USER[u].id_user]);
                          }
                        }
                      );
                    }
                  );
                }

                // Clear the Reminder Object from the DB
                con.query(
                  query_clear_reminder,
                  [REMINDER[i].id_reminder],
                  function (err, result, fields) {
                    if (err) throw err;
                  }
                );
              }
            );
          }
        }
      );
      createReminderObject.remindCheck(); // The function call itself every minute
    }, 60 * 1000); // Check every minutes
  }

  /**
   * Display all the reminders from the message author
   * @param {Discord.Message} msg
   */
  static myReminder(msg) {
    let id_user = msg.author.id; // User ID

    // Find all the User's reminder ongoing
    con.query(query_Find, [id_user], async function (err, results, fields) {
      if (err) return msg.reply("An error has occurred !"); // Error handler

      let reminders = JSON.parse(JSON.stringify(results)); // Parse the Result

      if (reminders.length == 0) return msg.reply("You have no reminder !"); // No reminder Handler

      // Embed List Constructor
      let embed = new Discord.MessageEmbed()
        .setTitle("My ongoing reminders : ")
        .setColor("#ff00ea")
        .setFooter({ text: "Provided by Kairos | Reminder Bot" })
        .setTimestamp();
      // Build the whole Description List
      let new_text = "";
      // Loop all around the list of ongoing reminders
      for (let i = 0; i < reminders.length; i++) {
        new_text +=
          `**- ${reminders[i].remind}** \n ${dateToString(
            new Date(reminders[i].t_date)
          )} \n` +
          "``" +
          buildTimeLeft(
            new Date(reminders[i].t_date),
            new Date(reminders[i].c_date)
          ) +
          "``" +
          timeLeft(new Date(reminders[i].t_date).getTime()) +
          "\n";
      }
      embed.setDescription(new_text);
      // Send the final embed
      msg.channel.send({ embeds: [embed] });
    });
  }

  /**
   * Delete a specific Reminder
   * @param {Discord.Message} msg
   */
  static deleteReminder(msg) {
    let id_user = msg.author.id; // User ID

    // Find all the User's ongoing Reminder
    con.query(query_Find, [id_user], async function (err, results, fields) {
      if (err) return msg.reply("An error has occurred !"); // Error handler

      let reminders = JSON.parse(JSON.stringify(results)); // Parse the result

      if (reminders.length == 0)
        return msg.reply("You have no reminder to delete !"); // Empty list handler

      // Embed List Constructor
      let embed = new Discord.MessageEmbed()
        .setTitle("My ongoing Reminders : ")
        .setColor("#03fcd3")
        .setFooter({ text: "Provided by Kairos | Reminder Bot" })
        .setTimestamp();
      let final_text = ""; // Final Description
      let reminders_objects = []; // Get the index and id of each remember inside a list

      // Loop all around the user's ongoing reminders
      for (let i = 0; i < reminders.length; i++) {
        // Description Set
        final_text =
          final_text +
          `**- [${i + 1}] ${reminders[i].remind}** \n` +
          "``" +
          `${dateToString(new Date(reminders[i].t_date))}` +
          "``\n\n";

        // Array Object Set
        reminders_objects[i] = {
          remind: reminders[i].remind,
          id_reminder: reminders[i].id_reminder,
        };
      }

      // add the instruction to pick the desired reminder to delete
      final_text =
        final_text +
        "\n **Please send the __index__ corresponding to the reminder you wish to delete !**";
      embed.setDescription(final_text);

      // Send the embed
      let msg_embed = await msg.channel.send({ embeds: [embed] });

      // Filter for the Message Collector
      const filter = (m) => {
        // A number is required, between 1 and the length of the list
        if (!isNaN(Number(m.content))) {
          if (Number(m.content) <= reminders.length && Number(m.content >= 1)) {
            return true;
          }
        }
      };

      // Message Collector Func
      const collector = msg.channel.createMessageCollector({
        filter: filter,
        max: 1,
        time: 1000 * 60 * 10, // 10 minutes
        errors: ["time"],
      });

      // Switch on the collector
      collector.on("collect", async (m) => {
        let target_reminder = reminders_objects[Number(m.content) - 1]; // Reminder Selected
        let id_reminder = target_reminder.id_reminder; // id_reminder Selected

        /** =========== Delete the selected reminder from the DB =========== */
        try {
          // Clear Concerner Table, User then Reminder
          await con.query(
            query_clear_concerner,
            [id_reminder],
            function (err, result, fileds) {
              // Find if the user has another ongoing reminder
              con.query(
                query_userHAS,
                [id_user],
                function (err, result, fields) {
                  // If the user doesn't have another ongoing Reminder, clear it from the DB
                  if (result.length === 0) {
                    con.query(query_clear_user, [id_user]);
                  }
                }
              );
            }
          );

          // Clear the Reminder Object from de Database
          await con.query(
            query_clear_reminder,
            [id_reminder],
            function (err, result, fields) {
              if (err) throw err;
            }
          );

          // Success Message
          await msg.reply(
            `Reminder number ${m.content} has been successfully deleted !`
          );

          // Clear all the func messages
          await m.delete();
          await msg_embed.delete();
        } catch (err) {
          // Error Message
          console.log(err);
          msg.reply("An error has occurred !");
        }
      });
    });
  }

  /**
   * Help Embed Command
   * @param {Discord.Message} msg
   */
  static helpReminder(msg) {
    // Embed Constructor
    let embed = new Discord.MessageEmbed()
      .setTitle("!remindme")
      .setColor("#ff00ea")
      .addField(
        "***Examples : ***",
        "``!remindme 01/01/2022 14h35 Sleep`` \n" +
          "Will setup a reminder at this given date with the label ``Sleep`` \n" +
          "``!myReminders`` \n" +
          "Display all your ongoing reminders \n" +
          "``!delReminder`` Pick and delete one of your ongoing reminders",
        true
      )
      .addField(
        "***Usages : ***",
        "``!remindme < [01 day] / [01 month] / [2022 year] > < [00 hour] h [00 minutes] > | !myReminders | !delReminder => [1 index]``",
        true
      )
      .setThumbnail(IMG.REMINDER_LOGO)
      .setFooter({
        text: `Asked by : ${msg.author.username}`,
        iconURL: msg.author.avatarURL(),
      });

    // Send the embed
    msg.channel.send({ embeds: [embed] });
  }
};
