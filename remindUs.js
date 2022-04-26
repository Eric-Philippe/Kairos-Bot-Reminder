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
    if (!msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR"))
      return msg.channel.send(
        "You don't have the permission to use this command"
      );

    // Ask the user to input a date
    msg.channel.send("Please input a date");
    const filter = (m) => m.author.id === msg.author.id;
    msg.channel
      .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        // Get the date
        let date = collected.first().content;
        // Check if the date is valid
        if (!createRemindUsObject.isValidDate(date))
          return msg.channel.send("The date is not valid");
        // Get the remind
        msg.channel.send("Please input the remind");
        msg.channel
          .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
          .then((collected) => {
            // Get the remind
            let remind = collected.first().content;
            // Get the channel
            msg.channel.send("Please input the channel");
            msg.channel
              .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
              .then((collected) => {
                // Get the channel
                let channel = collected.first().content;
                // Get the notification
                msg.channel.send("Do you want to receive a notification?");
                msg.channel
                  .awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    // Get the notification
                    let notif = collected.first().content;
                    // Get the recurrence
                    msg.channel.send("Do you want to set a recurrence?");
                    msg.channel
                      .awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                      })
                      .then((collected) => {
                        // Get the recurrence
                        let recurrence = collected.first().content;
                        // Create the remind
                        let remindUsObject = {
                          target_date: new Date(date),
                          entry_date: new Date(),
                          remind: remind,
                          channel_id: channel,
                          notif: notif,
                          recurrence: recurrence,
                        };
                        console.log(remindUsObject);
                      });
                  });
              });
          });
      });
  }
};
