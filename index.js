const { client } = require("./utils/client"); // Discord Bot
const { con } = require("./utils/mysql"); // SQL Connexion

const { TOKEN } = require("./config.json"); // Token

const Reminder = require("./RemindMe/remindMe"); // Reminder Class
const { remindUsCheck } = require("./RemindUs/checkRemindUs"); // RemindUs Checker
const RemindUs = require("./RemindUs/inputRemindUs"); // RemindUs Class
const { myRemindUs } = require("./RemindUs/myRemindUs"); // RemindUs Class
const { deleteRemindUs } = require("./RemindUs/deleteRemindUs"); // RemindUs Class

// When Client's ready
client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);
  client.user.setActivity("Time is Meaningless");

  // Database connexion
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected to database as ID : " + con.threadId);
    remindUsCheck();
    Reminder.remindCheck(); // New Reminder to send auto Check (Recursive)
  });
});

// When new Message
client.on("messageCreate", (msg) => {
  // Commands Input
  if (msg.content.startsWith("!remindme")) {
    Reminder.remindMe(msg);
  }
  if (msg.content.startsWith("!myReminders")) {
    Reminder.myReminder(msg);
  }
  if (msg.content.startsWith("!delReminder")) {
    Reminder.deleteReminder(msg);
  }
  if (msg.content.startsWith("!help reminder")) {
    Reminder.helpReminder(msg);
  }
  if (msg.content.startsWith("!remindUs")) {
    new RemindUs(msg);
  }
  if (msg.content.startsWith("!myRemindUs")) {
    myRemindUs(msg);
  }
  if (msg.content.startsWith("!delRemindUs")) {
    deleteRemindUs(msg);
  }
});

// Client Connexion
client.login(TOKEN);
