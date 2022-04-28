const Discord = require("discord.js"); // Discord API

const { con } = require("../utils/mysql"); // SQL Connexion

const {
  isValidDate,
  isValidTime,
  buildDate,
  isNotPast,
  isValidChannel,
} = require("../checkValidInput"); // Check Valid Input
// Labels given for the differents inputs steps
const steps_labels = [
  "Date",
  "Time",
  "Content",
  "Channel",
  "Notification",
  "Recurrence",
];
// Labels given for the differents recurrence possibilities
const recurrence_types = ["None", "Daily", "Weekly", "Monthly", "Yearly"];
// Labels given for the differents notification possibilities
const notification_types = ["None", "@everyone", "@here"];
/**
 * Interface wich contains all the required parameters
 * @typedef {Object} RemindUsObject
 * @property {Date} target_date
 * @property {Date} entry_date
 * @property {String} remind
 * @property {String} channel_id
 * @property {String} server_id
 * @property {Boolean} notif
 * @property {Boolean} recurrence
 */
/**
 * Class to manage the input of the remindUs command
 * @class
 */
module.exports = class RemindUsInput {
  /**
   * @param {Discord.Message} msg
   */
  constructor(msg) {
    /** @type {Discord.Message} */
    this.msg = msg;
    /** @type {String} */
    this.remind = "Empty";
    /** @type {String} */
    this.channel_id = "ID of the announce channel";
    /** @type {String} */
    this.date = "Format DD/MM/YYYY";
    /** @type {String} */
    this.time = "00:00";
    /** @type {Number} */
    this.step = 0;
    /** @type {Number} */
    this.step_recurrence = 0;
    /** @type {Number} */
    this.step_notif = 0;
    /** @type {String} */
    this.notif = notification_types[0];
    /** @type {String} */
    this.recurrence = recurrence_types[0];
    /** @type {Discord.MessageCollector} */
    this.currentMessageCollector = null;
    /** @type {Discord.InteractionCollector} */
    this.currentButtonsCollector = null;
    /** @type {Discord.MessageEmbed} */
    this.embedMessage = null;
    /** @type {Boolean} */
    this.end = false;
    this.isAdmin();
  }
  /**
   * Check if the user is an admin
   * @returns {Boolean}
   */
  isAdmin() {
    if (
      this.msg.member.permissions.has([Discord.Permissions.FLAGS.ADMINISTRATOR])
    ) {
      this.sendEmbed();
    } else {
      this.msg.reply("You need to be an admin to use this command");
    }
  }

  /**
   * Generate the Embed General Information Message
   * @returns {Discord.MessageEmbed}
   **/
  generateEmbed() {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("RemindUs")
      .setDescription(`Please enter the __**${steps_labels[this.step]}**__`)
      .addField("Date", this.date, true)
      .addField("Time", this.time, true)
      .addField("Content", this.remind, true)
      .addField("Channel", this.channel_id, true)
      .addField("Notification", this.notif, true)
      .addField("Recurrence", this.recurrence, true);
    return embed;
  }
  /**
   * Send the Embed Message
   **/
  sendEmbed() {
    this.msg.channel
      .send({
        embeds: [this.generateEmbed()], // Generate the Embed Message
        components: [this.generateButtons()], // Generate the Buttons
      })
      .then((m) => {
        this.embedMessage = m; // Save the Message
        this.launchButtonsCollector(); // Launch the Buttons Collector
        this.processInput(); // Process the Message Input
      });
  }
  /**
   * Edit the Embed Message with the new properties
   */
  editEmbed() {
    this.embedMessage.edit({
      embeds: [this.generateEmbed()], // Generate the new Embed Message
      components: [this.generateButtons()], // Generate the new Buttons
    });
    this.currentButtonsCollector.stop("time"); // Kill the past Buttons Collector
    this.currentMessageCollector.stop("time"); // Kill the past Message Collector
    this.processInput(); // Process the Message Input
    this.launchButtonsCollector(); // Launch the Buttons Collector
  }
  /**
   * Generate the Buttons to the Embed Message
   * @returns {Discord.MessageActionRow}
   **/
  generateButtons() {
    // Generate the Buttons
    // Previous Button
    const button_previous = new Discord.MessageButton()
      .setCustomId("previous")
      .setLabel("Previous")
      .setStyle("PRIMARY");
    // Next Button
    const button_next = new Discord.MessageButton()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle("PRIMARY");
    // Cancel Button
    const button_cancel = new Discord.MessageButton()
      .setCustomId("cancel")
      .setEmoji("🗑️")
      .setStyle("DANGER");
    // Validate Button
    const button_validate = new Discord.MessageButton()
      .setCustomId("validate")
      .setEmoji("✅")
      .setStyle("SUCCESS");
    // Recurrence Button
    const button_change_recurrence = new Discord.MessageButton()
      .setCustomId("recurrence")
      .setLabel("Change Recurrence Type")
      .setStyle("PRIMARY");
    // Notification Button
    const button_change_notif = new Discord.MessageButton()
      .setCustomId("notif")
      .setLabel("Change Notification Type")
      .setStyle("PRIMARY");
    // Build the basics Buttons Array
    const buttons = [
      button_previous,
      button_next,
      button_cancel,
      button_validate,
    ];
    // Add the Recurrence Button if the step is the Recurrence one
    if (this.step === 5) {
      buttons.push(button_change_recurrence);
    }
    // Add the Notification Button if the step is the Notification one
    if (this.step === 4) {
      buttons.push(button_change_notif);
    }
    // Build the Message Action Row
    const row = new Discord.MessageActionRow().addComponents(buttons);
    // Return the Message Action Row
    return row;
  }
  /**
   * Launch the current Buttons Collector
   **/
  launchButtonsCollector() {
    this.currentButtonsCollector =
      this.embedMessage.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 5 * 60 * 1000, // 5 minutes
      });
    // On Button Click
    this.currentButtonsCollector.on("collect", async (i) => {
      // Only if the user is the same as the author
      if (i.user.id === this.msg.author.id) {
        // Process of the Buttons
        switch (i.customId) {
          /**
           * case "customId":
           * Check if the interaction has already been processed
           * If not defer it
           * Do something
           */
          case "next":
            if (!i.deferred) i.deferUpdate();
            this.nextStep(); // Step +1
            break;
          case "previous":
            if (!i.deferred) i.deferUpdate();
            this.previousStep(); // Step -1
            break;
          case "cancel":
            i.reply("Canceled");
            this.cancel(); // Leave the system
            break;
          case "validate":
            this.end = true; // End the system
            await i.deferReply();
            await this.validate(i); // Validate the reminder
            break;
          case "recurrence":
            if (!this.end) i.deferUpdate();
            this.changeRecurrenceState(); // Change the Recurrence State
            break;
          case "notif":
            if (!this.end) i.deferUpdate();
            this.changeNotifState(); // Change the Notification State
            break;
        }
      } else {
        // If the user is not the same as the author
        i.reply({
          content: `These buttons aren't for you!`,
          ephemeral: true, // Only the user can see it
        });
      }
    });
    // At the end of the Collector
    this.currentButtonsCollector.on("end", (collected) => {});
  }
  /**
   * Step +1 & launch the new embed
   */
  nextStep() {
    // Simple check if the step is not the last one
    this.step++;
    if (this.step === steps_labels.length) {
      this.step = 0;
    }
    this.editEmbed();
  }
  /**
   * Step -1 & launch the new embed
   */
  previousStep() {
    // Simple check if the step is not the first one
    this.step--;
    if (this.step < 0) {
      this.step = steps_labels.length - 1;
    }
    this.editEmbed();
  }
  /**
   * Cancel the system
   */
  cancel() {
    this.embedMessage.delete(); // Clear the message
    this.currentButtonsCollector.stop("time"); // Stop the Buttons Collector
    this.currentMessageCollector.stop("time"); // Stop the Message Collector
  }
  /**
   *
   * @param {Discord.ButtonInteraction} i
   */
  async validate(i) {
    // Check if all the fields are filled
    if (this.date && this.remind && this.channel_id) {
      // Check if the reminder is in the future
      if (isNotPast(this.date + " " + this.time)) {
        await this.currentButtonsCollector.stop("time"); // Kill the Buttons Collector
        await this.currentMessageCollector.stop("time"); // Kill the Message Collector
        try {
          // Create the reminder
          await this.insertRemindUs(this.buildFinalObject()); // SQL Insert
          i.editReply("Reminder created!"); // Reply
        } catch (err) {
          i.editReply("Error while inserting the remind, call the admin"); // Error Reply
        }
      } else {
        i.editReply("Please enter a date in the future!"); // Past Reply
      }
    } else {
      i.editReply("Please fill all the required fields!"); // Empty Reply
    }
  }
  /**
   * Switch with the current step
   */
  processInput() {
    switch (this.step) {
      /**
       * case step:
       * Launch the Message Collector if necessary
       */
      case 0:
        this.setDate();
        break;
      case 1:
        this.setTime();
        break;
      case 2:
        this.setRemind();
        break;
      case 3:
        this.setChannel();
        break;
      // Default
      default:
        break;
    }
  }
  /**
   * Input of the Date
   */
  setDate() {
    // Setup the Message Collector
    this.currentMessageCollector =
      this.embedMessage.channel.createMessageCollector({
        time: 5 * 60 * 1000, // 5 minutes
        maxMatches: 1,
        maxMatchesPerUser: 1,
      });
    // Launch the Message Collector
    this.currentMessageCollector.on("collect", async (m) => {
      // Only if the user is the same as the author
      if (m.author.id === this.msg.author.id) {
        // Check if the message is a valid date
        if (isValidDate(m.content)) {
          this.date = m.content; // Set the date
          this.nextStep(); // Go to the next step
        }
        m.delete(); // Clean the message
      }
    });
  }
  /**
   * Input of the Time
   */
  setTime() {
    // Setup the Message Collector
    this.currentMessageCollector =
      this.embedMessage.channel.createMessageCollector({
        time: 5 * 60 * 1000, // 5 minutes
        maxMatches: 1,
        maxMatchesPerUser: 1,
      });
    // Launch the Message Collector
    this.currentMessageCollector.on("collect", async (m) => {
      // Only if the user is the same as the author
      if (m.author.id === this.msg.author.id) {
        // Check if the message is a valid time
        if (isValidTime(m.content)) {
          this.time = m.content; // Set the time
          this.nextStep(); // Go to the next step
        }
        m.delete(); // Clean the message
      }
    });
  }
  /**
   * Input of the Remind
   */
  setRemind() {
    // Setup the Message Collector
    this.currentMessageCollector =
      this.embedMessage.channel.createMessageCollector({
        time: 5 * 60 * 1000, // 5 minutes
        maxMatches: 1,
        maxMatchesPerUser: 1,
      });
    // Launch the Message Collector
    this.currentMessageCollector.on("collect", async (m) => {
      // Only if the user is the same as the author
      if (m.author.id === this.msg.author.id) {
        this.remind = m.content; // Set the remind
        this.nextStep(); // Go to the next step
      }
      m.delete(); // Clean the message
    });
  }
  /**
   * Input of the Channel ID
   */
  setChannel() {
    // Setup the Message Collector
    this.currentMessageCollector =
      this.embedMessage.channel.createMessageCollector({
        time: 5 * 60 * 1000, // 5 minutes
        maxMatches: 1,
        maxMatchesPerUser: 1,
      });
    // Launch the Message Collector
    this.currentMessageCollector.on("collect", async (m) => {
      // Only if the user is the same as the author
      if (m.author.id === this.msg.author.id) {
        // Check if the message is a valid channel and if the bot has the right to send messages in it
        if (isValidChannel(m.content)) {
          this.channel_id = m.content; // Set the channel
          this.nextStep(); // Go to the next step
        }
      }
      m.delete(); // Clean the message
    });
  }
  /**
   * Change the recurrence state between "daily", "weekly", "monthly", "yearly" and "None"
   */
  changeRecurrenceState() {
    // Check if the recurrence step isnt the last one
    if (this.step_recurrence >= recurrence_types.length - 1) {
      this.step_recurrence = 0; // Reset
    } else {
      this.step_recurrence++; // +1
    }
    this.recurrence = recurrence_types[this.step_recurrence]; // Set the recurrence
    this.editEmbed(); // Edit the embed
  }
  /**
   * Change the recurrence state between "@everyone", "@here" and "None"
   */
  changeNotifState() {
    // Check if the notification step isnt the last one
    if (this.step_notif >= notification_types.length - 1) {
      this.step_notif = 0; // Reset
    } else {
      this.step_notif++; // +1
    }
    this.notif = notification_types[this.step_notif]; // Set the notification
    this.editEmbed(); // Edit the embed
  }
  /**
   * Build the final reminder Object to insert in the database
   * @returns {RemindUsObject}
   */
  buildFinalObject() {
    const myObj = {
      target_date: buildDate(this.date + " " + this.time),
      entry_date: new Date(),
      remind: this.remind,
      channel_id: this.channel_id,
      server_id: this.msg.guild.id,
      recurrence: this.recurrence,
      notif: this.notif,
    };
    // Return the object
    return myObj;
  }
  /**
   * Insert the given RemindUsObject into the database
   * @param {RemindUsObject} remindUsObject
   * @returns {Promise<void>}
   */
  async insertRemindUs(remindUsObject) {
    const {
      target_date,
      entry_date,
      remind,
      channel_id,
      server_id,
      notif,
      recurrence,
    } = remindUsObject; // Destructuring
    // SQL Query
    const sql = `INSERT INTO Reminder_Us (t_date, c_date, remind, channel_id, server_id, notif, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    // SQL Values
    const values = [
      target_date,
      entry_date,
      remind,
      channel_id,
      server_id,
      notif,
      recurrence,
    ];
    // SQL Query Command (Insert)
    con.query(sql, values, (err, result) => {
      if (err) throw err;
    });
  }
};
