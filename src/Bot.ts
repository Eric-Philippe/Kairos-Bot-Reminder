import { Client } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
require("dotenv").config();

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);

client.login(process.env.TOKEN);
