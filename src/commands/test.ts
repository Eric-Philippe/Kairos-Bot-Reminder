import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    let answer = UsersServices.isAdmin(interaction.user.id);
    console.log(answer);

    await interaction.reply({ content: Boolean(answer).toString() });
  },
};

export default Test;
