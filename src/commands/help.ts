import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../commands_/categories";

import { Help } from "../commands_/Help";

const Test: Command = {
  description: {
    name: "Help",
    shortDescription: "Help command",
    fullDescription:
      "Display all the commands with their description, usage and example",
    emoji: "🧪",
    categoryName: CommandCategories.GENERAL.name,
    usage: "/help",
    example: "/help",
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command"),
  run: async (client, interaction) => {
    new Help(interaction, client);
  },
};

export default Test;
