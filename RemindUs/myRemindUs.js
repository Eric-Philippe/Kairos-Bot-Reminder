// ================== MODULE IMPORT ==========================
const Discord = require("discord.js"); // Discord.js API
const util = require("util"); // Util module
// ================== CONNEXION IMPORT =======================
const { client } = require("../utils/client"); // Discord Bot
const { con } = require("../utils/mysql"); // SQL Connexion
// ================== FUNCTION IMPORT =========================
const { isAdmin } = require("../utils/isAdmin"); // Check if the user is admin or not
const { dateToString } = require("../dateTools"); // Convert Date to String Module
const CategoryManager = require("./categoryManager"); // Category Manager
// ================= RESSOURCES IMPORT ========================
const { IMG } = require("../ressources.json"); // Ressources required for the system
// ===================== DEFINITIONS ==========================
const MOVE_AMOUNT = 3; // Step between two load
const query = util.promisify(con.query).bind(con); // Promisify the query Function
/**
 * Interface wich contains all the required parameters
 * @typedef {Object} RemindUsObject
 * @property {Date} target_date
 * @property {Date} entry_date
 * @property {String} remind
 * @property {String} channel_id
 * @property {String} server_id
 * @property {String} notif
 * @property {String} recurrence
 * @property {String} category
 */
/**
 * Display in an "infinite scroll" style the reminder from the server
 */
module.exports = class ListRemindUs {
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
    this.server_id = msg.guild.id;
    /** @type {Number} */
    this.current_index = 0;
    /** @type {String} */
    this.description = "";
    /** @type {String} */
    this.filter = null;
    /** @type {Array<RemindUsObject>} */
    this.results = null;
    this.__init__();
  }
  /**
   * Init the class
   */
  async __init__() {
    // Check if the user is admin
    if (!isAdmin(this.msg)) return;
    // Check if the filter is needed
    await this.__initFilter__();
    // Get the results of the query
    this.results = await this.generateResults();
    // Check if the server has reminders
    if (this.results.length === 0)
      // If not, send a message and if a filter was used, add the filter to the message
      return this.msg.channel.send(
        "``🙆‍♂️`` - No reminders for this server" +
          (this.filter ? ` in the category ${this.filter}` : "")
      );
    await this.generateDescription(); // Generate the description with the query results
    // Generate the Embed
    this.msgEmbed = await this.msg.channel.send({
      embeds: [this.generateEmbed()],
      components: [this.generateButtons()],
    });
    this.launchCollector(); // Launch the Buttons collector
  }
  /**
   * Generate the filter input if it is needed
   */
  async __initFilter__() {
    let args = this.msg.content.split(" "); // Split the message
    if (!args[1]) return; // If no filter is needed, return
    let filter = args[1]; // Get the filter
    let myCategories = await CategoryManager.getCategories(this.msg); // Get the categories of the server
    // Check if the filter is an existing category
    let category_id = myCategories.find(
      (e) =>
        // If the filter is in the server category or the native ones
        e.label === filter || ["None", "Birthday", "Meeting"].includes(filter)
    );
    if (!category_id) return; // If not, return
    this.filter = filter; // Set the filter
  }
  /**
   * Edit the Embed with the new description
   */
  async editEmbed() {
    await this.generateDescription(); // Generate the description with the query results
    // Edit the Embed
    this.msgEmbed.edit({
      embeds: [this.generateEmbed()],
      components: [this.generateButtons()],
    });
    // End the system at the end of the description
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
      .setTitle(`Reminders for the server ${this.msg.guild.name}`)
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
        `- *Recurrence* : ${this.results[i].recurrence}` +
        "\n``" +
        "📥" +
        "``" +
        `- *Category* : ${this.results[i].category} \n\n`;
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
    let sql;
    // Check if the filter is needed
    if (!this.filter) {
      sql = `SELECT * FROM Reminder_Us WHERE server_id = "${this.server_id}" ORDER BY t_date ASC`;
    } else {
      sql = `SELECT * FROM Reminder_Us WHERE server_id = "${this.server_id}" AND category = "${this.filter}" ORDER BY t_date ASC`;
    }
    let results = await query(sql); // Get the results
    return results;
  }
  /**
   * Launch the Buttons collector
   */
  async launchCollector() {
    // Create the Buttons collector
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
          await this.generateDescription(); // Generate the description with the query results
          // Edit the Embed
          this.editEmbed();
          i.deferUpdate("Done"); // Update the Button
        }
      }
    });
    // At the end of the Collector
    this.collector.on("end", (collected) => {});
  }
};
