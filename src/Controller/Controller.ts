/**
 * This file will be launched by cron job every 1 minute to check if
 * there are any new remind in the queue
 */
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import * as MySQLConnector from "../utils/mysql.connector";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";

const cronitor = require("cronitor")(process.env.CRONTAB_KEY);
const monitor = new cronitor.Monitor("important-heartbeat-monitor");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

if (process.env.DEBUG_MODE == "true") console.log("Starting bot");

dotenv.config();
MySQLConnector.init();

client.on("ready", async () => {
  fire();
});

const fire = async () => {
  setInterval(async () => {
    console.log("Checking remind queue");

    const remindmeQueue = new FireRemindmeQueue();
    const remindusQueue = new FireRemindusQueue();

    try {
      const backValues = await Promise.all([
        remindmeQueue.fire(client),
        remindusQueue.fire(client),
      ]);
      monitor.ping({ message: "Alive" });
    } catch (error) {
      monitor.ping({ count: 2, error_count: 2 });
    }
  }, 1000 * 60);
};

client.login(process.env.TOKEN_KAIROS);
