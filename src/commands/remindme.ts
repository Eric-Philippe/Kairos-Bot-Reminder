import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../plugins/categories";

import MessageManager from "../messages/MessageManager";

import { Repetition } from "../utils/repetition.enum";
import RCategoriesDefault from "../utils/rcategories.enum";
import { UsersServices } from "../tables/users/users.services";
import { RCategoryServices } from "../tables/rcategory/rcategory.services";
import { RemindmeServices } from "../tables/remindme/remindme.services";
import {
  autoCompleteTime,
  autoCompleteDate,
  autocompleteCategories,
} from "../utils/autocomplete.routine";

import { IMG } from "../assets/LOGOS.json";
import { Remindme } from "src/tables/remindme/remindme";
import { ReminderListener } from "../Listener/Listener";

const Remindme: Command = {
  description: {
    name: "Remindme",
    shortDescription: "Self Reminders",
    fullDescription:
      "Send a reminder to yourself. You'll get a DM when the time comes.",
    emoji: "📝",
    categoryName: CommandCategories.REMINDME.name,
    usage:
      "/remindme <list|delete|break> <id|category> | /remindme set <time> <date> <message> <category> <repetition>",
    example: '/remindme set 10:00 2021-10-10 "My message" "My category" WEEKLY',
  },
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Self Reminders")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("delete")
        .setDescription("Delete a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the reminder")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("list")
        .setDescription("List all your reminders")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("The category of the reminder")
            .setRequired(false)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("break")
        .setDescription("Break a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the reminder")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("restart")
        .setDescription("Restart a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the reminder")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("set")
        .setDescription("Set a reminder")
        .addStringOption(
          (
            option // Time
          ) =>
            option
              .setName("time")
              .setDescription("The time of the reminder")
              .setRequired(true)
              .setAutocomplete(true)
        )
        .addStringOption(
          (
            option // Date
          ) =>
            option
              .setName("date")
              .setDescription("The date of the reminder")
              .setRequired(true)
              .setAutocomplete(true)
        )
        .addStringOption(
          (
            option // Content
          ) =>
            option
              .setName("content")
              .setDescription("The content of the reminder")
              .setRequired(true)
        )
        .addStringOption(
          (
            option // Description
          ) =>
            option
              .setName("description")
              .setDescription("The description of the reminder")
              .setRequired(false)
        )
        .addStringOption(
          (
            option // Repetition
          ) =>
            option
              .setName("repetition")
              .setDescription("The repetition of the reminder")
              .setRequired(false)
              .addChoices(
                Repetition.DAILY,
                Repetition.DAILY_EXCEPT_WEEKENDS,
                Repetition.WEEKLY,
                Repetition.MONTHLY,
                Repetition.YEARLY
              )
        )
        .addStringOption(
          (
            option // Category
          ) =>
            option
              .setName("category")
              .setDescription("The category of the reminder")
              .setRequired(false)
              .setAutocomplete(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("show")
        .setDescription("Show a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the reminder")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused(true);
    let choices: ApplicationCommandOptionChoiceData[] = [];

    switch (focusedValue.name) {
      case "id":
        choices = await autoCompleteRemindMe(interaction);
        break;
      case "time":
        choices = await autoCompleteTime(interaction);
        break;
      case "date":
        choices = await autoCompleteDate(interaction);
        break;
      case "category":
        choices = await autocompleteCategories(interaction);
        break;
    }

    await interaction.respond(choices);
  },
  run: async (client, interaction) => {
    let subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "delete":
        await deleteReminder(interaction);
        break;
      case "list":
        await listReminders(interaction);
        break;
      case "break":
        await breakReminder(interaction);
        break;
      case "restart":
        await restartReminder(interaction);
        break;
      case "set":
        await createReminder(interaction);
        break;
      case "show":
        await showReminder(interaction);
        break;
    }
  },
};

const createReminder = async (interaction: ChatInputCommandInteraction) => {
  let time = interaction.options.getString("time", true);
  let date = interaction.options.getString("date", true);
  let content = interaction.options.getString("content", true);
  let description = interaction.options.getString("description", false);
  let repetition = interaction.options.getString("repetition", false);
  let category = interaction.options.getString("category", false);

  const user = interaction.user;
  if (await !UsersServices.isADBUser(user.id)) {
    UsersServices.addUser(user.id);
  }

  // Check if the time is valid (HH:MM)
  if (!/^\d{1,2}:\d{1,2}$/.test(time))
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "Invalid time format",
      interaction
    );

  let hours = parseInt(time.split(":")[0]);
  let minutes = parseInt(time.split(":")[1]);

  if (hours > 23 || hours < 0 || minutes > 59 || minutes < 0) {
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "Invalid time format",
      interaction
    );
  }

  // Check if the date is valid If there is not year, add the current year, if there is not month, add the current month
  let splittedDate = date.split("/");
  // If there is only one number, it's the day
  if (splittedDate.length === 1) {
    splittedDate = [
      splittedDate[0],
      (new Date().getMonth() + 1).toString(),
      new Date().getFullYear().toString(),
    ];
  } else if (splittedDate.length === 2) {
    // If there is two numbers, it's the day and the month
    splittedDate = [
      splittedDate[0],
      splittedDate[1],
      new Date().getFullYear().toString(),
    ];
  }

  // Check if the date is valid
  if (
    !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(
      splittedDate.join("/") // If the date is valid, join the splitted date
    )
  )
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "Invalid date format",
      interaction
    );
  let year = parseInt(splittedDate[2]);
  let month = parseInt(splittedDate[1]) - 1;
  let day = parseInt(splittedDate[0]);

  if (month > 11 || month < 0 || day > 31 || day < 0) {
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "Invalid date format",
      interaction
    );
  }

  let targetDate = new Date(year, month, day, hours, minutes);

  if (targetDate < new Date())
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "The date is in the past",
      interaction
    );

  // Check if the repetition is inside the enum
  if (
    repetition &&
    !Object.values(Repetition).find((r) => r.value === repetition)
  )
    return MessageManager.send(
      MessageManager.getErrorCnst(),
      "Invalid repetition",
      interaction
    );

  // Check if the category exists
  let idCategory = null;
  if (category) {
    const categoryExists =
      await RCategoryServices.getRCategoryByNameAndParentId(category, user.id);
    if (!categoryExists && !RCategoriesDefault.includes(category)) {
      //Create the category
      idCategory = await RCategoryServices.addRCategory(category, user.id, 0);
    } else {
      idCategory = categoryExists.RCId;
    }
  }

  if (!description) description = null;

  // Create the reminder
  let meId = await RemindmeServices.addRemindMe(
    content,
    description,
    new Date(),
    targetDate,
    repetition,
    0,
    idCategory,
    user.id
  );

  // Add to listener queue
  const newReminder = await RemindmeServices.getRemindmesById(meId);
  if (newReminder && newReminder[0]) {
    const listener = ReminderListener.getInstance();
    await listener.addReminder(newReminder[0]);
  }

  return MessageManager.send(
    MessageManager.getSuccessCnst(),
    "Your reminder has been created successfully with the id " + meId,
    interaction
  );
};

const deleteReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");

  // Remove from listener queue
  const listener = ReminderListener.getInstance();
  await listener.removeReminder(id, "remindme");

  await RemindmeServices.removeRemindMe(id);

  const embed = new EmbedBuilder()
    .setTitle("Reminder deleted")
    .setDescription("Your reminder has been deleted")
    .setColor("#ff0000")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const listReminders = async (interaction: ChatInputCommandInteraction) => {
  let category = interaction.options.getString("category", false);
  let remindmes: Remindme[] = [];
  if (category) {
    remindmes = await RemindmeServices.getRemindmesByCategoryAndUserId(
      category,
      interaction.user.id
    );
  } else {
    remindmes = await RemindmeServices.getRemindmeByUserId(interaction.user.id);
  }

  let content;
  if (remindmes.length > 0) {
    content = remindmes
      .map((remindme) => {
        return `${remindme.meId} - ${
          remindme.content.length > 25
            ? remindme.content.substring(0, 25) + "..."
            : remindme.content
        }`;
      })
      .join("\n");
  } else {
    content = "You don't have any reminder";
  }

  const embed = new EmbedBuilder()
    .setTitle("List of your reminders")
    .setDescription(content)
    .setColor("#ff0000")
    .setThumbnail(IMG.BACKGROUND_ME)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const breakReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");

  // Remove from listener queue when paused
  const listener = ReminderListener.getInstance();
  await listener.removeReminder(id, "remindme");

  await RemindmeServices.pauseRemindme(id, 1);

  const embed = new EmbedBuilder()
    .setTitle("Reminder paused")
    .setDescription("Your reminder has been paused")
    .setColor("Blurple")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const restartReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");

  await RemindmeServices.pauseRemindme(id, 0);

  // Add back to listener queue when restarted
  const listener = ReminderListener.getInstance();
  await listener.addReminder(remindme[0]);

  const embed = new EmbedBuilder()
    .setTitle("Reminder started")
    .setDescription("Your reminder has been started")
    .setColor("Blurple")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const showReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");

  const embed = new EmbedBuilder()
    .setTitle("Reminder")
    .setDescription(
      `**Content:** ${remindme[0].content}\n**Description:** ${
        remindme[0].description ? remindme[0].description : "None"
        // }\n**Category:** ${
        //   remindme[0].category ? remindme[0].category : "None"
      }\n**Repetition:** ${
        remindme[0].repetition ? remindme[0].repetition : "None"
      }\n**Target date:** ${remindme[0].targetDate}\n**Creation date:** ${
        remindme[0].entryDate
      }\n**Entry date:** ${remindme[0].entryDate}
      }\n**Status:** ${remindme[0].isPaused ? "Paused" : "Active"}`
    )
    .setColor("Blurple")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const autoCompleteRemindMe = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const choicesRaw = await RemindmeServices.getRemindmeByUserId(
    interaction.user.id
  );
  choices = choicesRaw.map((choice) => {
    return {
      name:
        choice.content.length > 25
          ? choice.content.substring(0, 25) + "..."
          : choice.content,
      value: choice.meId,
    };
  });
  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

export default Remindme;
