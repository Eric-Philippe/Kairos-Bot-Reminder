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
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("The title of the category")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity")
        .setDescription(
          "Display the user's activities, you must specify a keyword or a name"
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the activity")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("The keyword to search for")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("task")
        .setDescription(
          "Display the user's tasks, you must specify a keyword or a content"
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The content of the task")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("The keyword to search for")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bydate")
        .setDescription("Display the user's logged tasks between two dates")
        .addStringOption((option) =>
          option
            .setName("firstdate")
            .setDescription("The first date")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("seconddate")
            .setDescription("The second date | default: today")
            .setRequired(false)
        )
    ),
  run: async (client, interaction) => {
    let answer = UsersServices.isAdmin(interaction.user.id);
    console.log(answer);

    await interaction.reply({ content: Boolean(answer).toString() });
  },
};

export default Test;
