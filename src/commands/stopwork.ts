import {
  ApplicationCommandOptionChoiceData,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../commands_/categories";

import { autocompleteTasksToEnd } from "../utils/autocomplete.routine";

import MessageManager from "../messages/MessageManager";

import { TaskServices } from "../tables/task/task.services";

const StartWork: Command = {
  description: {
    name: "Stop Work",
    shortDescription: "Stop a work session",
    fullDescription: "Stop a work session",
    emoji: "🛑",
    categoryName: CommandCategories.TIMETRACKER.name,
  },
  data: new SlashCommandBuilder()
    .setName("stopwork")
    .setDescription("Start a work session")
    .addStringOption((option) =>
      option
        .setName("task")
        .setDescription("The name of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(true)
        .setAutocomplete(true)
    ),
  autocomplete: async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    let choices: ApplicationCommandOptionChoiceData[] = [];
    if (focusedOption.name === "task") {
      choices = await autocompleteTasksToEnd(interaction, focusedOption.value);
    }
    interaction.respond(choices);
  },
  run: async (client, interaction) => {
    let name = interaction.options.getString("task") || "";

    if (name.includes(">#>")) name = name.split(">#>")[1];
    let task = await TaskServices.getTaskByNameNotEndend(
      interaction.user.id,
      name
    );
    if (!task) {
      await MessageManager.send(
        MessageManager.getErrorCnst(),
        "Task not found",
        interaction
      );
      return;
    }
    await TaskServices.endTask(task.TId, new Date());

    await MessageManager.send(
      MessageManager.getSuccessCnst(),
      "Task stopped",
      interaction
    );
  },
};

export default StartWork;
