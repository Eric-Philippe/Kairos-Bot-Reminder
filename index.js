const { client } = require("./utils/client");
const { con } = require("./utils/mysql"); // Database Connexion

const { TOKEN } = require("./config.json");

const Reminder = require("./remindMe"); // RemindMe SelfIncrement

client.on("ready", () => {
  console.log(`Well connected to ${client.user.username}`);

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
});

client.login(TOKEN);
