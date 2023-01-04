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
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(false)
    ),

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
    if (!category)
      myCategory = await TCategoryServices.getMiscellaneousTCategory(userId);
    else {
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
        await !TaskServices.isDuplicateTaskFromCategory(task, myCategory.TCId)
      ) {
        TaskServices.insertTask(task, new Date(), null, myCategory.TCId, null);
      } else {
        if (categoryCreated)
          await TCategoryServices.deleteTCategory(myCategory.TCId);
        return interaction.reply("Task already exists");
      }
    } else {
      // We try to find the given activity
      myActivity = await ActivityServices.getActivityByNameUserIdNotEnded(
        activity,
        userId
      );
      // If the activity does not exist, we create it
      if (!myActivity) {
        myActivity = {
          AId: "",
          name: "",
          entryDate: new Date(),
          endDate: null,
          TCId: "",
        };

        myActivity.AId = await ActivityServices.insertActivity(
          activity,
          new Date(),
          null,
          myCategory.TCId
        );
        activityCreated = true;
      }

      if (
        await TaskServices.isDuplicateTaskFromActivity(task, myActivity.AId)
      ) {
        if (categoryCreated)
          await TCategoryServices.deleteTCategory(myCategory.TCId);
        if (activityCreated)
          await ActivityServices.deleteActivity(myActivity.AId);
        return interaction.reply("Task already exists");
      }
      TaskServices.insertTask(task, new Date(), null, null, myActivity.AId);
    }

    await interaction.reply("Task added");
  },
};

export default StartWork;
