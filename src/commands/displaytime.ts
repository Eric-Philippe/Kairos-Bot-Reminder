import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("displaytime")
    .setDescription("Display the user's information from the time logger")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("category")
        .setDescription("Display the user's categories from the time logger")
    ),
  run: async (client, interaction) => {
    let answer = UsersServices.isAdmin(interaction.user.id);
    console.log(answer);

    await interaction.reply({ content: Boolean(answer).toString() });
  },
};

export default Test;
