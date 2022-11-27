/**
 * This file will be launched by cron job every 1 minute to check if
 * there are any new remind in the queue
 */
import * as dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Remindme } from "./tables/remindme/remindme";
import { RemindmeServices } from "./tables/remindme/remindme.services";
import * as MySQLConnector from "./utils/mysql.connector";

import { Repetition } from "./utils/repetition.enum";

console.log("Starting RemindMe Queue Checker . . .");

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

// TODO: Add a Logger instead of console.log

dotenv.config();
MySQLConnector.init();

client.on("ready", async () => {
  const remindmes: Remindme[] = await RemindmeServices.fetchPastRemindme();
  console.log("Found " + remindmes.length + " remindmes");

  if (remindmes.length == 0) return console.log("No remindme to send");

  for (let remindme of remindmes) {
    let user = client.users.cache.get(remindme.userId);
    if (!user) {
      await RemindmeServices.removeRemindMe(remindme.meId);
      return;
    }

    try {
      user.send({ content: remindme.content });
    } catch (error) {
      console.log(error);
    }
    if (remindme.repetition) {
      let currentRep = Object.values(Repetition).find(
        (rep) => rep.value == remindme.repetition
      );
      if (!currentRep) return;
      let nextDate = currentRep.nextDate(remindme.targetDate);
      RemindmeServices.updateRemindme(remindme, nextDate);
    } else {
      RemindmeServices.removeRemindMe(remindme.meId);
    }
  }
});

client.login(process.env.TOKEN);
