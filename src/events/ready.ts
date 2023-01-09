import { Client } from "discord.js";
import fireListener from "../Listener/Listener";
import Commands from "../Commands";
import * as MySQLConnector from "../utils/mysql.connector";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) return;
    MySQLConnector.init();

    let CommandsData = Commands.map((cmd) => cmd.data.toJSON());
    await client.application.commands.set(CommandsData);

    fireListener(client);

    console.log(
      "%c⏳ Kairos is starting up...",
      "color: #00ff00; font-size: 20px"
    );
    // Red
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
  });
};
