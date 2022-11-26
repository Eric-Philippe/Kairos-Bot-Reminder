import { ApplicationCommandType } from "discord.js";
import { Command } from "src/types";

export const Ping: Command = {
  name: "ping",
  description: "Replies with pong!",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    await interaction.reply("Pong!");
  },
};
