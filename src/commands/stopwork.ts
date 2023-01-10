import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import MessageManager from "../messages/MessageManager";

import { TaskServices } from "../tables/task/task.services";

const StartWork: Command = {
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
    ),
  run: async (client, interaction) => {
    let subcommand = interaction.options.getSubcommand();
    let name = interaction.options.getString("task") || "";

    if (subcommand === "task") {
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
    }
  },
};

export default StartWork;
