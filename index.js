const { client } = require("./utils/client");
const { con } = require("./utils/mysql");

const { TOKEN } = require("./config.json");

const Reminder = require("./remindMe");

client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);
  client.user.setActivity("Time is Meaningless");

  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected to database as ID : " + con.threadId);
    Reminder.remindCheck();
  });
});

client.on("messageCreate", (msg) => {
  if (msg.content.startsWith("!remindme")) {
    Reminder.remindMe(msg);
  }
  if (msg.content.startsWith("!myReminders")) {
    Reminder.myReminder(msg);
  }
});

client.login(TOKEN);
