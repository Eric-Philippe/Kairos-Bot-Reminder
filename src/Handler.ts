/**
 * This file will be launched by cron job every 1 minute to check if
 * there are any new remind in the queue
 */
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import Logger from "./logs/Logger";
import { LogType } from "./logs/type.enum";
import { Repetition } from "./utils/repetition.enum";
import { Remindme } from "./tables/remindme/remindme";
import { RemindmeServices } from "./tables/remindme/remindme.services";

import * as MySQLConnector from "./utils/mysql.connector";

const logger = Logger.getInstance();

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

dotenv.config();
MySQLConnector.init();

client.on("ready", async () => {
  const remindmes: Remindme[] = await RemindmeServices.fetchPastRemindme();

  if (remindmes.length == 0) return;

  await logger.log(`Found ${remindmes.length} remindme to send`, LogType.INFO);

  for (let remindme of remindmes) {
    let user = await client.users.cache.get(remindme.userId);
    if (!user) {
      await RemindmeServices.removeRemindMe(remindme.meId);
      return;
    }

    try {
      await user.send({ content: remindme.content });
    } catch (error) {
      logger.log(
        `Error sending remindme to user ${remindme.userId}`,
        LogType.ERROR,
        __filename
      );
    }
    if (remindme.repetition) {
      let currentRep = Object.values(Repetition).find(
        (rep) => rep.value == remindme.repetition
      );
      if (!currentRep) return;
      let nextDate = await currentRep.nextDate(remindme.targetDate);
      await RemindmeServices.updateRemindme(remindme, nextDate);
    } else {
      await RemindmeServices.removeRemindMe(remindme.meId);
    }
  }

  await process.exit(0);
});

client.login(process.env.TOKEN);
