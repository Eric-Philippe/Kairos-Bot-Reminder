import { ApplicationCommandType } from "discord.js";
import { Command } from "src/types";
import { getAvailableIdentifiant } from "../identifiant/identifiant.manager";

export const Test: Command = {
  name: "test",
  description: "Give the current time for many locations",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    const id = await getAvailableIdentifiant("ACategories");
    await interaction.reply({ content: id });
  },
};
