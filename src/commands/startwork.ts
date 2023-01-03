import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";

const StartWork: Command = {
  data: new SlashCommandBuilder()
    .setName("startwork")
    .setDescription("Start a work session")
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("The parent activity of the work session")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(true)
    ),

  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
  },
};

export default StartWork;
