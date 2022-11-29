/**
 * This file will be launched by cron job every 1 minute to check if
 * there are any new remind in the queue
 */
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import * as MySQLConnector from "../utils/mysql.connector";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";

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
  const remindmeQueue = new FireRemindmeQueue();
  const remindusQueue = new FireRemindusQueue();

  try {
    const backValues = await Promise.all([
      remindmeQueue.fire(client),
      remindusQueue.fire(client),
    ]);
  } catch (error) {
    console.log(error);
  }

  process.exit(0);
});

client.login(process.env.TOKEN_KAIROS);
