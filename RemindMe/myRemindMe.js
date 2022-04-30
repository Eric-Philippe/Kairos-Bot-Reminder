// ================== MODULE IMPORT ==========================
const Discord = require("discord.js"); // Discord.js API
const util = require("util"); // Util module
// ================== CONNEXION IMPORT =======================
const { client } = require("../utils/client"); // Discord Bot
const { con } = require("../utils/mysql"); // SQL Connexion
// ================== FUNCTION IMPORT =========================
const { dateToString } = require("../dateTools"); // Convert Date to String Module
// ================= RESSOURCES IMPORT ========================
const { IMG } = require("../ressources.json"); // Ressources required
// ===================== DEFINITIONS ==========================
const MOVE_AMOUNT = 5; // Step between two load
const query = util.promisify(con.query).bind(con); // Promisify the query Function
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
 * Display in an "infinite scroll" style the reminder from the user
 */
module.exports = class ListRemindMe {
  /**
   * @param {Discord.Message} msg
   */
  constructor(msg) {
    this.msg = msg;
    /** @type {Discord.MessageEmbed} */
    this.msgEmbed = null;
    /** @type {Discord.InteractionCollector} */
    this.collector = null;
    /** @type {String} */
    this.user_id = msg.author.id;
    /** @type {Number} */
    this.current_index = 0;
    /** @type {String} */
    this.description = "";
    /** @type {Array<RemindMeObject>} */
    this.results = null;
    this.__init__();
  }
  /**
   * Initialize the class
   */
  async __init__() {
    this.results = await this.generateResults(); // Generate the results
    // If the user has no reminder
    if (this.results.length === 0)
      return this.msg.channel.send("``🙆‍♂️`` - No reminders !");
    await this.generateDescription();
    this.msgEmbed = await this.msg.channel.send({
      embeds: [this.generateEmbed()],
      components: [this.generateButtons()],
    });
    this.launchCollector();
  }
  /**
   * Edit the Embed with the new description
   */
  async editEmbed() {
    await this.generateDescription(); // Generate the new description
    // Edit the Embed
    this.msgEmbed.edit({
      embeds: [this.generateEmbed()],
      components: [this.generateButtons()],
    });
    // End the system if the user has no more reminder
    if (this.current_index >= this.results.length) {
      this.collector.stop("time");
    }
  }
  /**
   * Generate the Main Embed
   * @returns {Discord.MessageEmbed}
   */
  generateEmbed() {
    // Build the text of the remaining reminders to display
    let left_text = `${
      this.current_index < this.results.length
        ? this.current_index
        : this.results.length
    } / ${this.results.length} reminders displayed`;
    // Build the Embed
    let embed = new Discord.MessageEmbed()
      .setTitle(`Reminders for the user ${this.msg.author.username}`)
      .setColor("#03fcd3")
      .setThumbnail(IMG.REMINDER_LOGO)
      .setFooter({
        text: `Provided by ${client.user.username} | ${left_text}`,
        iconURL: client.user.avatarURL(),
      })
      .setAuthor({
        name: `${left_text}`,
      })
      .setDescription(this.description);
    return embed;
  }
  /**
   * Generate the Buttons Embed
   * @returns {Discord.MessageActionRow}
   */
  generateButtons() {
    // Generate the Buttons
    const plus_button = new Discord.MessageButton()
      .setCustomId("plus")
      .setLabel("+")
      .setStyle("PRIMARY");
    // End Button
    const end_button = new Discord.MessageButton()
      .setCustomId("end")
      .setLabel("End")
      .setStyle("SECONDARY")
      .setDisabled(true);
    // Build the basics Buttons Array
    let buttons;
    if (this.current_index < this.results.length) {
      buttons = [plus_button];
    } else {
      buttons = [end_button];
    }
    // Build the Message Action Row
    const row = new Discord.MessageActionRow().addComponents(buttons);
    // Return the Message Action Row
    return row;
  }
  /**
   * Generate the description with the query results
   */
  generateDescription() {
    let i = this.current_index; // Get the current index of the reminders displayed
    this.current_index += MOVE_AMOUNT; // Increment the index
    while (i < this.current_index && i < this.results.length) {
      // While the index is less than the current index and the index is less than the results length
      let addition_txt =
        `**# [${i + 1}] - ${this.results[i].remind}**` +
        "\n``" +
        "📅" +
        "``" +
        `- *Date* : ${dateToString(new Date(this.results[i].t_date))}` +
        "\n``" +
        "🕐" +
        "``" +
        `- *Recurrence* : ${this.results[i].recurrence} \n\n`;
      // Check if the new description override the limit of the Embed
      if (this.description.length + addition_txt.length > 4096) {
        this.description += `No more place ! \n **...**\n`;
        break;
      } else {
        this.description += addition_txt;
      }
      i++;
    }
  }
  /**
   * Generate the results of the query
   * @returns {Promise<Array<RemindUsObject>>}
   */
  async generateResults() {
    let sql = `SELECT * FROM Reminder_Me WHERE id_user = "${this.user_id}" ORDER BY t_date ASC`;
    let results = await query(sql);
    return results;
  }
  /**
   * Launch the Buttons collector
   */
  async launchCollector() {
    this.collector = this.msgEmbed.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60 * 1000, // 5 minutes
    });
    // On Button Click
    this.collector.on("collect", async (i) => {
      // Only if the user is the same as the author
      if (i.user.id === this.msg.author.id) {
        // Process of the Button
        if (i.customId === "plus") {
          this.editEmbed(); // Edit Embed
          i.deferUpdate("Done");
        }
      }
    });
    // At the end of the Collector
    this.collector.on("end", (collected) => {});
  }
};
