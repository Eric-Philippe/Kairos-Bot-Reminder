import { Client, GatewayIntentBits } from "discord.js";

import slashCommandCreate from "./events/slashCommandCreate";
import autoCompleteCreate from "./events/autoCompleteCreate";
import ready from "./events/ready";

import GraphManager from "./Book/components/GraphManager/GraphManager";

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

ready(client);
slashCommandCreate(client);
autoCompleteCreate(client);

client.login(process.env.TOKEN_KAIROS);
