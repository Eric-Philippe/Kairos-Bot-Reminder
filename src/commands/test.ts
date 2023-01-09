import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    interaction.deferReply();
  },
};

export default Test;
