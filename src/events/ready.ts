import { Client } from "discord.js";
import fireListener from "../Listener/Listener";
import Commands from "../Commands";
import * as MySQLConnector from "../database/mysql.connector";

export default (client: Client): void => {
  let date = new Date();
  let dateStr = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  console.log(
    "%c🕒 Launch date : " + dateStr,
    "color: #5D6D7E ; font-size: 20px"
  );

  console.time("⏳ Time elapsed ");

  console.log(
    "%c⏳ Kairos is starting up...",
    "color: #00ff00; font-size: 20px"
  );
  client.once("ready", async () => {
    if (!client.user || !client.application) return;

    let CommandsData = Commands.map((cmd) => cmd.data.toJSON());
    await client.application.commands.set(CommandsData);

    MySQLConnector.init();

    fireListener();

    console.info(
      `%c💾 CPU: ${process.cpuUsage().user / 1000}ms`,
      "color: #FF5733; font-size: 20px"
    );
    console.info(
      `%c🏓 Ping: ${client.ws.ping}ms`,
      "color: #FF5733; font-size: 20px"
    );
    console.log(
      `%c📝 Loaded ${Commands.length} commands`,
      "color: #FF5733; font-size: 20px"
    );

    console.log(`🏷️ Logged in as ${client.user.tag}`);

    console.timeEnd("⏳ Time elapsed ");
  });
};
