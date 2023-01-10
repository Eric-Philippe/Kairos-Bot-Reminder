import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import MessageManager from "../messages/MessageManager";

import { UsersServices } from "../tables/users/users.services";
import { TCategoryServices } from "../tables/tcategory/tcategory.services";
import { ActivityServices } from "../tables/activity/activity.services";
import { TaskServices } from "../tables/task/task.services";

const DisplayTime: Command = {
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
    await interaction.deferReply();
    await UsersServices.isADBUser(interaction.user.id);
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "category":
        await displayTimeCategory(interaction);
        break;
      case "activity":
        await displayTimeActivity(interaction);
        break;
      case "task":
        await displayTimeTask(interaction);
        break;
      case "bydate":
        break;
    }
  },
};

const displayTimeCategory = async function (
  interaction: ChatInputCommandInteraction
) {
  const title = interaction.options.getString("title", false);
  const keyword = interaction.options.getString("keyword", false);
  if (!title && !keyword)
    MessageManager.send(
      MessageManager.getErrorCnst(),
      "You must specify a title or a keyword",
      interaction
    );

  let workingTask = title ? title : (keyword as string);
  let workingTaskType = title ? "title" : "keyword";

  switch (workingTaskType) {
    case "title":
      const category = await TCategoryServices.getTCategoryByTitleUserId(
        workingTask,
        interaction.user.id
      );
      if (!category)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Category not found",
          interaction
        );
      break;
    case "keyword":
      const categories = await TCategoryServices.getCategoryByKeywordUserId(
        workingTask,
        interaction.user.id
      );
      if (categories.length == 0)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "No category found",
          interaction
        );
      break;
  }
};

const displayTimeActivity = async function (
  interaction: ChatInputCommandInteraction
) {
  const name = interaction.options.getString("name", false);
  const keyword = interaction.options.getString("keyword", false);
  if (!name && !keyword)
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "You must specify a name or a keyword",
      interaction
    );
  let workingTask = name ? name : (keyword as string);
  let workingTaskType = name ? "name" : "keyword";

  switch (workingTaskType) {
    case "name":
      const activity = await ActivityServices.getActivityByNameUserId(
        workingTask,
        interaction.user.id
      );
      if (!activity)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Activity not found",
          interaction
        );
      break;
    case "keyword":
      const activities = await ActivityServices.getActivitiesByKeywordUserId(
        workingTask,
        interaction.user.id
      );
      if (activities.length == 0)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "No activity found",
          interaction
        );
      break;
      break;
  }
};

const displayTimeTask = async function (
  interaction: ChatInputCommandInteraction
) {
  const content = interaction.options.getString("content", false);
  const keyword = interaction.options.getString("keyword", false);
  if (!content && !keyword)
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "You must specify a content or a keyword",
      interaction
    );

  let workingTask = content ? content : (keyword as string);
  let workingTaskType = content ? "content" : "keyword";

  switch (workingTaskType) {
    case "content":
      const task = await TaskServices.getTaskByNameNotEndend(
        interaction.user.id,
        workingTask
      );
      if (!task)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Task not found",
          interaction
        );
      break;
    case "keyword":
      const tasks = await TaskServices.getTasksByKeywordUserIdEnded(
        interaction.user.id,
        workingTask
      );
      if (tasks.length == 0)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "No task found",
          interaction
        );
      break;
  }
};

export default DisplayTime;
