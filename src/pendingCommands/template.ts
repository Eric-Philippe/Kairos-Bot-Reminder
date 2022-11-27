import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

// import { Services } from "";

const Template: Command = {
  data: new SlashCommandBuilder()
    .setName("template")
    .setDescription("template"),
  run: async (client, interaction) => {
    await interaction.reply({ content: "" });
  },
};

export default Template;
