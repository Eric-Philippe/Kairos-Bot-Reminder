import { SlashCommandBuilder } from "discord.js";
import TextPage from "../Book/components/Page/TextPage";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";
import GraphManager from "../Book/components/GraphManager/GraphManager";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    GraphManager.sendMyGraph(interaction);
  },
};

export default Test;
