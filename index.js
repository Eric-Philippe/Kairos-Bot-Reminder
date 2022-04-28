const { client } = require("./utils/client"); // Discord Bot
const { con } = require("./utils/mysql"); // SQL Connexion

const { TOKEN } = require("./config.json"); // Token

const RemindMe = require("./RemindMe/inputRemindMe");
const { remindMeCheck } = require("./RemindMe/checkRemindMe");
const ListRemindMe = require("./RemindMe/myRemindMe");
const { deleteRemindMe } = require("./RemindMe/deleteRemindMe");

const RemindUs = require("./RemindUs/inputRemindUs"); // RemindUs Class
const { remindUsCheck } = require("./RemindUs/checkRemindUs"); // RemindUs Checker
const ListRemindUs = require("./RemindUs/myRemindUs"); // RemindUs Class
const { deleteRemindUs } = require("./RemindUs/deleteRemindUs"); // RemindUs Class

// When Client's ready
client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);
  client.user.setActivity("Time is Meaningless");

  // Database connexion
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected to database as ID : " + con.threadId);
    remindMeCheck();
    remindUsCheck();
  });
});

// When new Message
client.on("messageCreate", (msg) => {
  // Commands Input
  if (msg.content.startsWith("!remindMe")) {
    new RemindMe(msg);
  }
  if (msg.content.startsWith("!myRemindMe")) {
    new ListRemindMe(msg);
  }
  if (msg.content.startsWith("!delRemindMe")) {
    deleteRemindMe(msg);
  }
  if (msg.content.startsWith("!help reminder")) {
    Reminder.helpReminder(msg);
  }
  // Check if the user is on dm
  if (msg.channel.type != "DM") {
    if (msg.content.startsWith("!remindUs")) {
      new RemindUs(msg);
    }
    if (msg.content.startsWith("!myRemindUs")) {
      new ListRemindUs(msg);
    }
    if (msg.content.startsWith("!delRemindUs")) {
      deleteRemindUs(msg);
    }
  }
});

// Client Connexion
client.login(TOKEN);
