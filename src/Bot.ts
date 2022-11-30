import { Client } from "discord.js";

import slashCommandCreate from "./listeners/slashCommandCreate";
import autoCompleteCreate from "./listeners/autoCompleteCreate";
import ready from "./listeners/ready";

require("dotenv").config();

const client = new Client({
  intents: [],
});

ready(client);
slashCommandCreate(client);
autoCompleteCreate(client);

client.login(process.env.TOKEN_KAIROS);
