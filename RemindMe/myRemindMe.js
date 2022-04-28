const Discord = require("discord.js"); // Discord.js API
const util = require("util");

const { client } = require("../utils/client"); // Discord Bot
const { con } = require("../utils/mysql"); // SQL Connexion

const { dateToString } = require("../dateTools");

const { IMG } = require("../ressources.json"); // Ressources required for the system

const MOVE_AMOUNT = 8;
const query = util.promisify(con.query).bind(con);

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

  async __init__() {
    this.results = await this.generateResults();
    if (this.results.length === 0) return this.msg.channel.send("No reminders");
    await this.generateDescription();
    this.msgEmbed = await this.msg.channel.send({
      embeds: [this.generateEmbed()],
      components: [this.generateButtons()],
    });
    this.launchCollector();
  }

  generateEmbed() {
    let left_text = `${
      this.current_index < this.results.length
        ? this.current_index
        : this.results.length
    } / ${this.results.length} reminders displayed`;
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

  generateButtons() {
    // Generate the Buttons
    const plus_button = new Discord.MessageButton()
      .setCustomId("plus")
      .setLabel("+")
      .setStyle("PRIMARY");
    // Next Button
    // Build the basics Buttons Array
    const buttons = [plus_button];
    // Build the Message Action Row
    const row = new Discord.MessageActionRow().addComponents(buttons);
    // Return the Message Action Row
    return row;
  }

  generateDescription() {
    let i = this.current_index;
    this.current_index += MOVE_AMOUNT;
    while (i < this.current_index && i < this.results.length) {
      this.description +=
        `**# [${i + 1}] - ${this.results[i].remind}**` +
        "\n``" +
        "📅" +
        "``" +
        `- *Date* : ${dateToString(new Date(this.results[i].t_date))}` +
        "\n``" +
        "🕐" +
        "``" +
        `- *Recurrence* : ${this.results[i].recurrence} \n\n`;
      i++;
    }
  }

  async generateResults() {
    let sql = `SELECT * FROM Reminder_Me WHERE id_user = "${this.user_id}" ORDER BY t_date ASC`;
    let results = await query(sql);
    return results;
  }

  async launchCollector() {
    let buttonsCollector = this.msgEmbed.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 5 * 60 * 1000, // 5 minutes
    });
    // On Button Click
    buttonsCollector.on("collect", async (i) => {
      // Only if the user is the same as the author
      if (i.user.id === this.msg.author.id) {
        // Process of the Button
        if (i.customId === "plus") {
          await this.generateDescription();
          this.msgEmbed.edit({
            embeds: [this.generateEmbed()],
            components: [this.generateButtons()],
          });
          i.deferUpdate("Done");
        }
      }
    });
    // At the end of the Collector
    buttonsCollector.on("end", (collected) => {});
  }
};
