import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../commands_/categories";

import { Help } from "../commands_/Help";

const Test: Command = {
  description: {
    name: "Help",
    shortDescription: "Help command",
    fullDescription: "Help command",
    emoji: "🧪",
    categoryName: CommandCategories.GENERAL.name,
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command"),
  run: async (client, interaction) => {
    new Help(interaction, client);
  },
};

export default Test;
