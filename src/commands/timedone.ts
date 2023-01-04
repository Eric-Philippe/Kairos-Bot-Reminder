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
    .setName("timedone")
    .setDescription("Insert a completed task")
    .addStringOption((option) =>
      option
        .setName("task")
        .setDescription("The name of the task")
        .setMaxLength(50)
        .setMinLength(2)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("hours")
        .setDescription("The number of hours")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("The number of minutes")
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
    let userId = interaction.user.id;
    await UsersServices.isADBUser(interaction.user.id);
    const task = interaction.options.getString("task") || "";
    const activity = interaction.options.getString("activity");
    const category = interaction.options.getString("category");

    // Create a variable to store the number of hours
    const hours = interaction.options.getInteger("hours") || 0;
    // Create a variable to store the number of minutes
    const minutes = interaction.options.getInteger("minutes") || 0;

    // Create a date of today 00:00:00
    const entryDate = new Date();
    entryDate.setHours(0, 0, 0, 0);

    // Create a date of today 00:00:00 + the number of hours and minutes
    const endDate = new Date();
    endDate.setHours(hours, minutes, 0, 0);

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
      }
    }

    let myActivity: Activity;

    if (!activity) {
      TaskServices.insertTask(task, entryDate, endDate, myCategory.TCId, null);
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
      }
      TaskServices.insertTask(task, entryDate, endDate, null, myActivity.AId);
    }

    await interaction.reply("Task done added");
  },
};

export default StartWork;