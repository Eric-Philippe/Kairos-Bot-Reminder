// ================== MODULE IMPORT ==========================
const Discord = require("discord.js"); // Discord.js API
const util = require("util"); // Util module
// ================== CONNEXION IMPORT =======================
const { con } = require("../utils/mysql"); // SQL Connexion
// ================== FUNCTION IMPORT =========================
const { isAdmin } = require("../utils/isAdmin"); // Check if the user is admin or not
// ===================== DEFINITIONS ==========================
const LIMIT = 4; // Limit of groups for a server
const query = util.promisify(con.query).bind(con); // Promisify the query function
/**
 * Interface wich contains all the required parameters
 * @typedef {Object} CategoryObject
 * @property {String} label
 * @property {String} server_id
 */
module.exports = class CategoryManager {
  /**
   * @param {Discord.Message} msg
   * @returns {Promise<Array<CategoryObject>>}
   */
  static async getCategories(msg) {
    let server_id = msg.guild.id; // Get the server id
    // Get the categories
    let results = await query(
        `SELECT * FROM Category WHERE server_id = '${server_id}'`
      ),
      categories = [];
    // Create the categories object
    for (let i = 0; i < results.length; i++) {
      categories.push({
        label: results[i].label,
        server_id: results[i].server_id,
      });
    }
    // Return the categories
    return categories;
  }
  /**
   * isLimitReached
   * @param {Discord.Message} msg
   */
  static async isLimitReached(msg) {
    let results = await CategoryManager.getCategories(msg);
    return results.length >= LIMIT;
  }
  /**
   * Input a category
   * @param {Discord.Message} msg
   */
  static async inputCategory(msg) {
    // Check if the user is admin
    if (!isAdmin(msg)) return msg.channel.send("``🙆‍♂️`` - You are not admin !");
    // Check if the limit is reached
    if (await CategoryManager.isLimitReached(msg)) {
      return msg.channel.send("``❌`` - You can't add more categories !");
    }
    // Get all the categories of the server
    let results = await CategoryManager.getCategories(msg);
    let label = msg.content.split(" ")[1]; // Split the message
    // If there is not filter
    if (!label) return msg.channel.send("``❌`` - You must specify a label !");
    // Check if the label already exists
    if (results.find((e) => e.label === label)) {
      return msg.channel.send("``❌`` - This label already exists !");
    }
    // Insert the category
    await query(
      `INSERT INTO Category (label, server_id) VALUES ('${label}', '${msg.guild.id}')`
    );
    // Send a message
    return msg.channel.send("``✅`` - Category added successfully ! ");
  }
  /**
   * Display all the categories of the server in an embed
   * @param {Discord.Message} msg
   */
  static async displayCategories(msg) {
    // Check if the user is admin
    if (!isAdmin(msg)) return msg.channel.send("``🙆‍♂️`` - You are not admin !");
    // Get all the categories of the server
    let categories = await CategoryManager.getCategories(msg);
    // Check if the server has categories
    if (categories.length === 0)
      return msg.channel.send("``❌`` - No categories for this server !");
    // Build the embed
    let embed = new Discord.MessageEmbed()
      .setTitle(`Categories of the server ${msg.guild.name}`)
      .setColor("#0099ff")
      .setDescription(categories.map((e) => `- **${e.label}**`).join("\n"))
      .setFooter({ text: `${categories.length} / ${LIMIT} categories` });
    // Send the embed
    return msg.channel.send({ embeds: [embed] });
  }

  /**
   * Delete a category
   * @param {Discord.Message} msg
   */
  static async deleteCategory(msg) {
    // Check if the user is admin
    if (!isAdmin(msg)) return msg.channel.send("``🙆‍♂️`` - You are not admin !");
    let args = msg.content.split(" "); // Split the message
    // If there is not input
    if (!args[1])
      return msg.channel.send("``❌`` - You must specify a label !");
    let label = args[1]; // Get the label
    // Get all the categories of the server
    let results = await CategoryManager.getCategories(msg);
    // Check if the label exists
    if (!results.find((e) => e.label === label)) {
      return msg.channel.send("``❌`` - This label doesn't exist !");
    }
    // Delete the category
    await query(`DELETE FROM Category WHERE label = '${label}'`);
    // Send a message
    return msg.channel.send("``✅`` - Category deleted successfully ! ");
  }
};
