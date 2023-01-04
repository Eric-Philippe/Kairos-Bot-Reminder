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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("task")
        .setDescription("Stop the task")
        .addStringOption((option) =>
          option
            .setName("task")
            .setDescription("The name of the task")
            .setMaxLength(50)
            .setMinLength(2)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity")
        .setDescription("Stop the activity")
        .addStringOption((option) =>
          option
            .setName("activity")
            .setDescription("The name of the activity")
            .setMaxLength(50)
            .setMinLength(2)
            .setRequired(true)
        )
    ),
  run: async (client, interaction) => {
    let subcommand = interaction.options.getSubcommand();
    let name =
      interaction.options.getString("task") ||
      interaction.options.getString("activity") ||
      "";

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
    } else if (subcommand === "activity") {
      let activity = await ActivityServices.getActivityByNameUserIdNotEnded(
        name,
        interaction.user.id
      );
      if (!activity) {
        await interaction.reply("Activity not found");
        return;
      }
      await ActivityServices.endActivity(activity.AId, new Date());
      let tasks = await TaskServices.getTasksByActivityId(activity.AId);
      for (let task of tasks) {
        await TaskServices.endTask(task.TId, new Date());
      }

      if (tasks.length == 0) {
        await interaction.reply("Activity stopped");
      } else {
        await interaction.reply(
          `Activity stopped. ${tasks.length} tasks stopped`
        );
      }
    }
  },
};

export default StartWork;
