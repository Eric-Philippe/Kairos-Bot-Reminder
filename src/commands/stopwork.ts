import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";
import { TCategoryServices } from "../tables/tcategory/tcategory.services";
import { TCategory } from "src/tables/tcategory/tcategory";
import { ActivityServices } from "../tables/activity/activity.services";
import { Activity } from "../tables/activity/activity";
import { TaskServices } from "../tables/task/task.services";
import { Task } from "../tables/task/task";

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
        await interaction.reply("Task not found");
        return;
      }
      await TaskServices.endTask(task.TId, new Date());

      await interaction.reply("Task stopped");
    }
  },
};

export default StartWork;
