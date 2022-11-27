import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { Command } from "src/CommandTemplate";

import { Repetition } from "../utils/repetition.enum";
import RCategoriesDefault from "../utils/rcategories.enum";
import { UsersServices } from "../tables/users/users.services";
import { RCategoryServices } from "../tables/rcategory/rcategory.services";
import { RemindmeServices } from "../tables/remindme/remindme.services";

import { IMG } from "../assets/LOGOS.json";

const Remindme: Command = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a reminder")
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
      subCommand.setName("list").setDescription("List all your reminders")
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
    return interaction.reply("Invalid time format");

  let hours = parseInt(time.split(":")[0]);
  let minutes = parseInt(time.split(":")[1]);

  // Check if the date is valid If there is not year, add the current year, if there is not month, add the current month
  let splittedDate = date.split("/");
  // If there is only one number, it's the day
  if (splittedDate.length === 1) {
    splittedDate = [
      splittedDate[0],
      new Date().getMonth().toString(),
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
    return interaction.reply("Invalid date format");

  let year = parseInt(splittedDate[2]);
  let month = parseInt(splittedDate[1]) - 1;
  let day = parseInt(splittedDate[0]);

  let targetDate = new Date(year, month, day, hours, minutes);

  if (targetDate < new Date())
    return interaction.reply("The date is in the past");

  // Check if the repetition is inside the enum
  if (
    repetition &&
    !Object.values(Repetition).find((r) => r.value === repetition)
  )
    return interaction.reply("Invalid repetition");

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

  const embed = new EmbedBuilder()
    .setTitle("Reminder created")
    .setDescription(
      "Your reminder has been created successfully with the id " + meId
    )
    .setColor("#00ff00")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const deleteReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");
  await RemindmeServices.removeRemindMe(id);

  const embed = new EmbedBuilder()
    .setTitle("Reminder deleted")
    .setDescription("Your reminder has been deleted")
    .setColor("#ff0000")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const listReminders = async (interaction: ChatInputCommandInteraction) => {
  const remindmes = await RemindmeServices.getRemindmeByUserId(
    interaction.user.id
  );
  const embed = new EmbedBuilder()
    .setTitle("List of your reminders")
    .setDescription(
      remindmes
        .map((remindme) => {
          return `${remindme.meId} - ${
            remindme.content.length > 25
              ? remindme.content.substring(0, 25) + "..."
              : remindme.content
          }`;
        })
        .join("\n")
    )
    .setColor("#ff0000")
    .setThumbnail(IMG.REMINDER_LOGO)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const breakReminder = async (interaction: ChatInputCommandInteraction) => {
  const id = interaction.options.getString("id", true);
  const remindme = await RemindmeServices.getRemindmesById(id);
  if (!remindme) return interaction.reply("This reminder doesn't exist");
  if (remindme[0].userId !== interaction.user.id)
    return interaction.reply("This reminder doesn't exist");
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

  const embed = new EmbedBuilder()
    .setTitle("Reminder started")
    .setDescription("Your reminder has been started")
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

const autoCompleteTime = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  const focusedOption = interaction.options.getFocused(true);
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const firstChoicesRaw = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  const secondChoicesRaw = ["00", "15", "30", "45"];

  if (focusedOption.value.includes(":")) {
    const firstChoice = focusedOption.value.split(":")[0];
    const secondChoice = focusedOption.value.split(":")[1];
    choices = secondChoicesRaw
      .filter((choice) => choice.startsWith(secondChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}:${choice}`,
          value: `${firstChoice}:${choice}`,
        };
      });
  } else {
    choices = firstChoicesRaw
      .filter((choice) => choice.startsWith(focusedOption.value))
      .map((choice) => {
        return {
          name: choice,
          value: choice,
        };
      });
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

const autoCompleteDate = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  const focusedOption = interaction.options.getFocused(true);
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const firstChoicesRaw = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  const secondChoicesRaw = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const thirdChoicesRaw = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  if (!focusedOption.value.includes("/")) {
    choices = firstChoicesRaw
      .filter((choice) => choice.startsWith(focusedOption.value))
      .map((choice) => {
        return {
          name: choice,
          value: choice,
        };
      });
  } else if (
    focusedOption.value.split("/").length === 2 ||
    focusedOption.value.length == 2
  ) {
    const firstChoice = focusedOption.value.split("/")[0];
    const secondChoice = focusedOption.value.split("/")[1];
    choices = secondChoicesRaw
      .filter((choice) => choice.startsWith(secondChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}/${choice}`,
          value: `${firstChoice}/${choice}`,
        };
      });
  } else if (
    focusedOption.value.split("/").length === 3 ||
    focusedOption.value.length == 5
  ) {
    const firstChoice = focusedOption.value.split("/")[0];
    const secondChoice = focusedOption.value.split("/")[1];
    const thirdChoice = focusedOption.value.split("/")[2];
    choices = thirdChoicesRaw
      .filter((choice) => choice.toString().startsWith(thirdChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}/${secondChoice}/${choice}`,
          value: `${firstChoice}/${secondChoice}/${choice}`,
        };
      });
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

const autocompleteCategories = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const choicesRaw = RCategoriesDefault;
  choices = choicesRaw.map((choice) => {
    return {
      name: choice,
      value: choice,
    };
  });
  // Add custom categories from user
  const userCategories = await RCategoryServices.getRCategoriesByParentId(
    interaction.user.id
  );

  if (userCategories.length != 0) {
    choices = choices.concat(
      userCategories.map((choice) => {
        return {
          name: choice.name,
          value: choice.name,
        };
      })
    );
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

export default Remindme;
