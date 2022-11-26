import { Client } from "discord.js";
import { Commands } from "../Commands";
import * as MySQLConnector from "../utils/mysql.connector";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) return;
    MySQLConnector.init();

    await client.application.commands.set(Commands);

    console.log("Kairos is starting up...");
  });
};
