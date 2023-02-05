import {
  ApplicationCommandOptionChoiceData,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../commands_/categories";

import MessageManager from "../messages/MessageManager";

import { UsersServices } from "../tables/users/users.services";
import { TCategoryServices } from "../tables/tcategory/tcategory.services";
import { TCategory } from "src/tables/tcategory/tcategory";
import { ActivityServices } from "../tables/activity/activity.services";
import { Activity } from "../tables/activity/activity";
import { TaskServices } from "../tables/task/task.services";
import {
  autocompleteActivities,
  autocompleteTCategories,
} from "../utils/autocomplete.routine";

const StartWork: Command = {
  description: {
    name: "Start Work",
    shortDescription: "Start a work session and track your time",
    fullDescription: "Start a work session and track your time",
    emoji: "👨‍💻",
    categoryName: CommandCategories.TIMETRACKER.name,
    usage: "/startwork [task] [activity] [category]",
    example: '/startwork "Create a new command" "Coding" "Kairos"',
  },
  data: new SlashCommandBuilder()
    .setName("startwork")
    .setDescription("Start a work session")
    .addStringOption((option) =>
      option
        .setName("task")
        .setDescription("The name of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("The activity of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(false)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(false)
        .setAutocomplete(true)
    ),
  autocomplete: async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    let choices: ApplicationCommandOptionChoiceData[] = [];
    if (focusedOption.name === "activity") {
      choices = await autocompleteActivities(
        interaction,
        focusedOption.value,
        true
      );
    } else if (focusedOption.name === "category") {
      choices = await autocompleteTCategories(
        interaction,
        focusedOption.value,
        true
      );
    }
    interaction.respond(choices);
  },
  run: async (client, interaction) => {
    let categoryCreated = false;
    let activityCreated = false;
    let userId = interaction.user.id;
    await UsersServices.isADBUser(interaction.user.id);
    const task = interaction.options.getString("task") as string;
    const activity = interaction.options.getString("activity");
    const category = interaction.options.getString("category");

    let myCategory: TCategory;
    // If the category is not specified, we use the default Miscellaneous category
    if (!category) {
      myCategory = await TCategoryServices.getMiscellaneousTCategory(userId);
      if (!myCategory) return;
    } else {
      // We try to find the give category
      myCategory = await TCategoryServices.getTCategoryByTitleUserId(
        category,
        userId
      );
      // If the category does not exist, we create it
      if (!myCategory) {
        myCategory = { TCId: "", title: "", userId: "" };
        myCategory.TCId = await TCategoryServices.insertTCategory(
          category,
          userId
        );
        categoryCreated = true;
      }
    }

    let myActivity: Activity;

    if (!activity) {
      if (
        await TaskServices.isDuplicateTaskFromCategory(task, myCategory.TCId)
      ) {
        if (categoryCreated)
          await TCategoryServices.deleteTCategory(myCategory.TCId);
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Task already exists in this category",
          interaction
        );
      } else {
        TaskServices.insertTask(task, new Date(), null, myCategory.TCId, null);
      }
    } else {
      // We try to find the given activity
      myActivity = await ActivityServices.getActivityByNameCategoryId(
        activity,
        myCategory.TCId
      );
      // If the activity does not exist, we create it
      if (!myActivity) {
        myActivity = {
          AId: "",
          name: "",
          TCId: "",
        };

        myActivity.AId = await ActivityServices.insertActivity(
          activity,
          myCategory.TCId
        );
        activityCreated = true;
      }

      if (
        await TaskServices.isDuplicateTaskFromActivity(
          task,
          myActivity.AId,
          myCategory.TCId
        )
      ) {
        if (activityCreated)
          await ActivityServices.deleteActivity(myActivity.AId);
        if (categoryCreated)
          await TCategoryServices.deleteTCategory(myCategory.TCId);
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Task already exists in this activity",
          interaction
        );
      }
      TaskServices.insertTask(task, new Date(), null, null, myActivity.AId);
    }

    await MessageManager.send(
      MessageManager.getSuccessCnst(),
      "Task added",
      interaction
    );
  },
};

export default StartWork;
