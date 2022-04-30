/**
 * @author EricP
 * @version 1.2.0
 * @description This is the main launcher of the bot.
 */
// ======================= Imports =======================
const { client } = require("./utils/client"); // Discord Bot
const { con } = require("./utils/mysql"); // SQL Connexion
// ===================== Token Imports====================
const { TOKEN } = require("./config.json"); // Token
// ==================== ReminderMe Imports ===============
const RemindMe = require("./RemindMe/inputRemindMe");
const ManualInputRemindMe = require("./RemindMe/manualInputRemindMe");
const { remindMeCheck } = require("./RemindMe/checkRemindMe");
const ListRemindMe = require("./RemindMe/myRemindMe");
const { deleteRemindMe } = require("./RemindMe/deleteRemindMe");
// ==================== ReminderUs Imports ===============
const RemindUs = require("./RemindUs/inputRemindUs");
const { remindUsCheck } = require("./RemindUs/checkRemindUs");
const ListRemindUs = require("./RemindUs/myRemindUs");
const { deleteRemindUs } = require("./RemindUs/deleteRemindUs");
// =========== CategoryManager Class Imports =============
const CategoryManager = require("./RemindUs/categoryManager");
const ReminderHelp = require("./remindHelp");
// When Client is ready
client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);
  client.user.setActivity("Time is Meaningless");
  // Database connexion
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected to database as ID : " + con.threadId);
    remindMeCheck(); // Check if there is a reminderMe to send
    remindUsCheck(); // Check if there is a reminderUs to send
  });
});

// When new Message
client.on("messageCreate", (msg) => {
  // Commands Input
  let cmd = msg.content.split(" ")[0].toLowerCase();
  switch (cmd) {
    // ========== REMIND ME ==========
    case "!remindme":
      if (msg.content === "!remindme") {
        new RemindMe(msg);
      } else {
        new ManualInputRemindMe(msg);
      }
      break;
    case "!myremindme":
      new ListRemindMe(msg);
      break;
    case "!delremindme":
      deleteRemindMe(msg);
      break;
    case "!help":
      new ReminderHelp(msg);
      break;
  }
  // Check if the user is not on dm
  if (msg.channel.type != "DM") {
    switch (cmd) {
      // ========== REMIND US ==========
      case "!remindus":
        new RemindUs(msg);
        break;
      case "!myremindus":
        new ListRemindUs(msg);
        break;
      case "!delremindus":
        deleteRemindUs(msg);
        break;
      // ========== CATEGORY ==========
      case "!creategroup":
        CategoryManager.inputCategory(msg);
        break;
      case "!mygroups":
        CategoryManager.displayCategories(msg);
        break;
      case "!delgroup":
        CategoryManager.deleteCategory(msg);
        break;
    }
  }
});
// Client Connexion
client.login(TOKEN);
