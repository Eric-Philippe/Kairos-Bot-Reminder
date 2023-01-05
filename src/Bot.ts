import { Client } from "discord.js";

import slashCommandCreate from "./listeners/slashCommandCreate";
import autoCompleteCreate from "./listeners/autoCompleteCreate";
import ready from "./listeners/ready";

import GraphManager from "./Book/components/GraphManager/GraphManager";

require("dotenv").config();

const client = new Client({
  intents: [],
});

GraphManager.generateRandomPolarChart();

ready(client);
slashCommandCreate(client);
autoCompleteCreate(client);

client.login(process.env.TOKEN_KAIROS);
