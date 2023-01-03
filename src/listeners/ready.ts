import { Client } from "discord.js";
import fireController from "../Controller/Controller";
import Commands from "../Commands";
import * as MySQLConnector from "../utils/mysql.connector";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) return;
    MySQLConnector.init();

    let CommandsData = Commands.map((cmd) => cmd.data.toJSON());
    await client.application.commands.set(CommandsData);

    fireController(client);

    console.log("Kairos is starting up...");
  });
};
