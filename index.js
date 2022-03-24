const { client } = require("./utils/client"); // Discord Bot
const { con } = require("./utils/mysql"); // SQL Connexion

const { TOKEN } = require("./config.json"); // Token

const Reminder = require("./remindMe"); // Reminder Class

// When Client's ready
client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);
  client.user.setActivity("Time is Meaningless");

  // Database connexion
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected to database as ID : " + con.threadId);
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
});

// Client Connexion
client.login(TOKEN);
