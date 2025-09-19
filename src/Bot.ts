import { Client, GatewayIntentBits } from "discord.js";

import slashCommandCreate from "./events/slashCommandCreate";
import autoCompleteCreate from "./events/autoCompleteCreate";
import ready from "./events/ready";
import client from "./Client";

/**
 * @description
 * This is a temporary fix for the shard guild undefined error
 * @see
 * https://github.com/discordjs/discord.js/issues/3956
 * Discord.js v13 fixed by waiting 15 seconds
 * More info: https://discordjs.guide/additional-info/changes-in-v13.html#sharding
 * I'm waiting 4 seconds knowing that the bot is spending the 15 seconds waiting for a soft deleted guild
 */
setTimeout(() => {
  //@ts-ignore
  client.emit("ready");
}, 4000);

ready(client);
slashCommandCreate(client);
autoCompleteCreate(client);

client.login(process.env.TOKEN_KAIROS);
