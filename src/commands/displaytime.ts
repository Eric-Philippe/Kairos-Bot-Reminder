import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "src/CommandTemplate";

import MessageManager from "../messages/MessageManager";
import DateWorker from "../utils/date.worker";
import { ConvertissorFactory } from "../Book/components/GraphManager/Convertissor/convertissor.factory";
import * as ComponentsEnum from "../Book/components/book.cmpt.enum";
const CP = ComponentsEnum.default;

const CommandUtilsEnum = {
  TITLE: "TITLE",
  NAME: "NAME",
  CONTENT: "CONTENT",
  KEYWORD: "KEYWORD",
};

import { UsersServices } from "../tables/users/users.services";
import { TCategoryServices } from "../tables/tcategory/tcategory.services";
import { ActivityServices } from "../tables/activity/activity.services";
import { TaskServices } from "../tables/task/task.services";

import TimeLoggerLoad from "../Book/components/plugins/timelogger.load";
import Book from "../Book/Book";
import Page from "../Book/components/Page/Page";
import GraphPage from "../Book/components/Page/GraphPage";
import TextPage from "../Book/components/Page/TextPage";
import TextPageAgg from "../Book/components/Page/TextPageAgg";
import CategoryData from "src/Book/components/plugins/timelogger.data";
/**
 * @description
 * This command allow the user to see his time logger data at different format
 * The user can pick one element at a time (title, name, content) or a keyword to search inside the database
 * For each research (Category, Activity, Task) different format are available
 * @example
 * /displaytime | category |-> title => [TextPage, GraphPage{PolarArea}, GraphPage{Doughnut}]
 *                         |-> keyword => nCategory * [TextPage, GraphPage{PolarArea}, GraphPage{Doughnut}]
 * @example
 * /displaytime | activity |-> name => [TextPage, GraphPage{Doughnut}]
 *                         |-> keyword => nActivity * [TextPage, GraphPage{Doughnut}]
 * @example
 * /displaytime | task |-> content => Discord.EmbedBuilder
 *                        |-> keyword => [TextPage, GraphPage{BarData}]
 */
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
    const answerInteraction = await interaction.deferReply();
    await UsersServices.isADBUser(interaction.user.id);
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "category":
        await displayTimeCategory(interaction, answerInteraction);
        break;
      case "activity":
        await displayTimeActivity(interaction, answerInteraction);
        break;
      case "task":
        await displayTimeTask(interaction, answerInteraction);
        break;
      case "bydate":
        break;
    }
  },
};
/**
 * @CATEGORY
 * Handler for the "/displaytime category"
 * @param interaction
 * @param answer
 * @returns
 */
const displayTimeCategory = async function (
  interaction: ChatInputCommandInteraction,
  answer: InteractionResponse
) {
  // We get the options from the command
  const title = interaction.options.getString("title", false);
  const keyword = interaction.options.getString("keyword", false);
  /** If no option has been sent */
  if (!title && !keyword)
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "You must specify a title or a keyword",
      interaction
    );
  /**
   * Here we create the convertissor for the polar area and the doughnut
   * The convertissor is a function that convert the data from the database to the data needed for the graph
   * This is a three depth factory, the first depth is to know if we search for a convertissor for one category or multiple
   * The second is the type of graph
   * And the third is the precise type of the data we want to focus
   */
  let convertissorPAActivity = await ConvertissorFactory(
    CP.UNIT,
    CP.POLAR_AREA,
    CP.ACTIVITY
  );

  let convertissorDTasks = await ConvertissorFactory(
    CP.UNIT,
    CP.DOUGHNUT,
    CP.TASK
  );
  // Pick the option that has been sent, title is chosen by default if both are sent
  let workingTask = title ? title : (keyword as string);
  let workingTaskType = title
    ? CommandUtilsEnum.TITLE // If the title is sent, we use the title for a single category request
    : CommandUtilsEnum.KEYWORD; // If the keyword is chosent, we use the keyword for a multiple category request
  /** Determine wich search type the user chose */
  switch (workingTaskType) {
    case CommandUtilsEnum.TITLE:
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
      try {
        let categoryData = await TimeLoggerLoad.loadCategory(
          interaction.user.id,
          category.title
        );
        if (!categoryData || !convertissorPAActivity || !convertissorDTasks) {
          throw new Error("Error while loading the data");
        }
        /**
         * Loading of the book
         * - Title, Pages
         */
        const title = `📊 | Analysis of the category "${category.title}"`;
        const pages = [
          new TextPage(
            title,
            categoryData?.toString(),
            interaction.user,
            categoryData
          ),
          new GraphPage(
            title,
            interaction.user,
            convertissorPAActivity(categoryData),
            CP.POLAR_AREA
          ),
          new GraphPage(
            title,
            interaction.user,
            convertissorDTasks(categoryData),
            CP.DOUGHNUT
          ),
        ];
        new Book(pages, interaction, answer, interaction.user);
      } catch (err) {
        console.log(err);
      }
      break;
    case CommandUtilsEnum.KEYWORD:
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

      try {
        let categoriesData = (await TimeLoggerLoad.loadCategories(
          interaction.user.id,
          keyword as string
        )) as CategoryData[];
        if (!categoriesData) {
          throw new Error("Error while loading the data");
        }

        let contentArray: string[] = [];
        categoriesData.forEach((category) => {
          contentArray.push(category.toString());
        });

        let txtPageContent: string[] = [];
        if (TextPage.isContentTooLong(contentArray.join("\n\n"))) {
          txtPageContent = TextPageAgg.createEnoughTextPageAgg(contentArray);
        } else {
          txtPageContent = [contentArray.join("\n\n")];
        }
        const title = `📊 | Analysis of the categories found with "${keyword}"`;

        let pages: Page[] = [];
        txtPageContent.forEach((content) => {
          pages.push(
            new TextPageAgg(
              title,
              content,
              interaction.user,
              categoriesData[0],
              categoriesData
            )
          );
        });
        for (let i = 0; i < categoriesData.length; i++) {
          pages.push(
            new GraphPage(
              title,
              interaction.user,
              convertissorPAActivity(categoriesData[i]),
              CP.POLAR_AREA,
              `Chart for the category **"${categoriesData[i].getTitle()}"**`
            )
          );
          pages.push(
            new GraphPage(
              title,
              interaction.user,
              convertissorDTasks(categoriesData[i]),
              CP.DOUGHNUT,
              `Chart for the category **"${categoriesData[i].getTitle()}"**`
            )
          );
        }
        new Book(pages, interaction, answer, interaction.user);
      } catch (err) {
        console.log(err);
      }
      break;
  }
};
/**
 * @ACTIVITY
 * Handler for the "/displaytime activity" command
 * @param interaction
 * @param answer
 * @returns
 */
const displayTimeActivity = async function (
  interaction: ChatInputCommandInteraction,
  answer: InteractionResponse
) {
  const name = interaction.options.getString("name", false);
  const keyword = interaction.options.getString("keyword", false);
  if (!name && !keyword)
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "You must specify a name or a keyword",
      interaction
    );

  let convertissorDTask = await ConvertissorFactory(
    CP.UNIT,
    CP.DOUGHNUT,
    CP.TASK
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

      try {
        let activityData = await TimeLoggerLoad.loadActivityToCategory(
          activity
        );

        let activityDataDount = convertissorDTask(activityData);
        let title = `📊 | Analysis of the activity "${activity.name}"`;

        let pages: Page[] = [
          new TextPage(
            title,
            activityData.toString(),
            interaction.user,
            activityData
          ),
          new GraphPage(
            title,
            interaction.user,
            activityDataDount,
            CP.DOUGHNUT
          ),
        ];

        new Book(pages, interaction, answer, interaction.user);
      } catch (err) {
        console.error(err);
      }
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

      try {
        let activitiesData: CategoryData[] = [];
        for (let i = 0; i < activities.length; i++) {
          let activityData = await TimeLoggerLoad.loadActivityToCategory(
            activities[i],
            true
          );
          activitiesData.push(activityData);
        }

        let contentArray: string[] = [];
        activitiesData.forEach((activity) => {
          contentArray.push(activity.toString());
        });

        let txtPageContent: string[] = [];
        if (TextPage.isContentTooLong(contentArray.join("\n\n"))) {
          txtPageContent = TextPageAgg.createEnoughTextPageAgg(contentArray);
        } else {
          txtPageContent = [contentArray.join("\n\n")];
        }
        const title = `📊 | Analysis of the activities found with "${keyword}"`;

        let pages: Page[] = [];
        txtPageContent.forEach((content) => {
          pages.push(
            new TextPageAgg(
              title,
              content,
              interaction.user,
              activitiesData[0],
              activitiesData
            )
          );
        });
        for (let i = 0; i < activitiesData.length; i++) {
          pages.push(
            new GraphPage(
              title,
              interaction.user,
              convertissorDTask(activitiesData[i]),
              CP.DOUGHNUT,
              `Chart for the activity **"${activitiesData[i].getTitle()}"**`
            )
          );
        }
        new Book(pages, interaction, answer, interaction.user);
      } catch (err) {
        console.error(err);
      }
      break;
  }
};
/**
 * Handler of the command "/displaytime task"
 * @TASK
 * @param interaction
 * @param answer
 * @returns
 */
const displayTimeTask = async function (
  interaction: ChatInputCommandInteraction,
  answer: InteractionResponse
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
  let workingTaskType = content
    ? CommandUtilsEnum.CONTENT
    : CommandUtilsEnum.KEYWORD;

  switch (workingTaskType) {
    case CommandUtilsEnum.CONTENT:
      const task = await TaskServices.getTaskByContentUserIdEnded(
        interaction.user.id,
        workingTask
      );
      if (!task)
        return MessageManager.send(
          MessageManager.getErrorCnst(),
          "Task not found",
          interaction
        );

      console.log(task);

      let embed = new EmbedBuilder()
        .setTitle(`Task : ${task.content}`)
        .setColor("#5865F2")
        .addFields(
          {
            name: "🕒 | EntryDate : ",
            value: DateWorker.dateToReadable(task.entryDate),
          },
          {
            name: "🕛 | EndDate : ",
            value: DateWorker.dateToReadable(task.endDate as Date),
          },
          {
            name: "🕰️ | Category : ",
            value: task.TCId ? "✅" : "❌",
          },
          {
            name: "⏰ | Activity : ",
            value: task.AId ? "✅" : "❌",
          }
        )
        .setFooter({ text: "⏳ | Provided by Kairos | Bot Reminder" });

      interaction.editReply({ embeds: [embed] });
      break;
    case CommandUtilsEnum.KEYWORD:
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

      let convertissorBTasks = await ConvertissorFactory(
        CP.UNIT,
        CP.BAR,
        CP.TASK
      );

      const categoryDataTasks = await TimeLoggerLoad.loadAlteredTasksToCategory(
        tasks
      );

      let tasksDataBar = convertissorBTasks(categoryDataTasks);
      let title = `📊 | Analysis of the tasks found with "${keyword}"`;

      let pages: Page[] = [
        new TextPage(
          title,
          categoryDataTasks.toString(),
          interaction.user,
          categoryDataTasks
        ),
        new GraphPage(title, interaction.user, tasksDataBar, CP.BAR),
      ];

      new Book(pages, interaction, answer, interaction.user);
      break;
  }
};

export default DisplayTime;
