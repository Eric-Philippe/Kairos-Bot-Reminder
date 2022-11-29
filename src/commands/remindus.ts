import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";

import { Command } from "src/CommandTemplate";

import { Repetition } from "../utils/repetition.enum";
import RCategoriesDefault from "../utils/rcategories.enum";
import { GuildServices } from "../tables/guild/guild.services";
import { RCategoryServices } from "../tables/rcategory/rcategory.services";
import { RemindusServices } from "../tables/remindus/remindus.services";
import {
  autoCompleteTime,
  autoCompleteDate,
  autocompleteCategories,
} from "../utils/autocomplete.recurrent";

import { IMG } from "../assets/LOGOS.json";
import { Remindus } from "src/tables/remindus/remindus";

const Remindus: Command = {
  data: new SlashCommandBuilder()
    .setName("remindus")
    .setDescription("Group Reminders")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set a reminder")
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription("The ReminderUs's target time")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("The ReminderUs's target date")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the reminder")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The ReminderUs's content")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The ReminderUs's description")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("The ReminderUs's category")
            .setRequired(false)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("repetition")
            .setDescription("The ReminderUs's repetition")
            .setRequired(false)
            .addChoices(
              Repetition.DAILY,
              Repetition.DAILY_EXCEPT_WEEKENDS,
              Repetition.WEEKLY,
              Repetition.MONTHLY,
              Repetition.YEARLY
            )
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to mention")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ReminderUs's id")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all reminders")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("The ReminderUs's category")
            .setRequired(false)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("break")
        .setDescription("Break a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ReminderUs's id")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("restart")
        .setDescription("Restart a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ReminderUs's id")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("show")
        .setDescription("Show a reminder")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ReminderUs's id")
            .setRequired(true)
        )
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let choices: ApplicationCommandOptionChoiceData[] = [];

    switch (focusedValue.name) {
      case "time":
        choices = await autoCompleteTime(interaction);
        break;
      case "date":
        choices = await autoCompleteDate(interaction);
        break;
      case "category":
        choices = await autocompleteCategories(interaction);
        break;
      case "id":
        choices = await autoCompleteRemindUs(interaction);
        break;
    }

    await interaction.respond(choices);
  },
  run: async (client, interaction) => {
    // If the interaction is sent in a DM, return
    if (!interaction.guildId)
      return interaction.reply({
        content: "This command is not available in DMs",
      });
    0;
    // If the user doesn't have the MANAGE_MESSAGES permission, return
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        content:
          "You don't have the required permissions \nYou need the `MANAGE_MESSAGES` permission to use this command",
        ephemeral: true,
      });

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "set":
        await createReminder(interaction);
        break;
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
      case "show":
        await showReminder(interaction);
        break;
    }
  },
};

const autoCompleteRemindUs = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const choicesRaw = await RemindusServices.getRemindusByGuildId(
    interaction.guildId?.toString() || ""
  );
  choices = choicesRaw.map((choice) => {
    return {
      name:
        choice.content.length > 25
          ? choice.content.substring(0, 25) + "..."
          : choice.content,
      value: choice.usId,
    };
  });
  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

const createReminder = async (interaction: ChatInputCommandInteraction) => {
  let time = interaction.options.getString("time", true);
  let date = interaction.options.getString("date", true);
  let channel = interaction.options.getChannel("channel", true);
  let content = interaction.options.getString("content", true);
  let description = interaction.options.getString("description", false);
  let repetition = interaction.options.getString("repetition", false);
  let category = interaction.options.getString("category", false);
  let role = interaction.options.getRole("role", false);

  const guild = interaction.guild;
  if (!guild) return;
  if (await !GuildServices.isADBGuild(guild.id)) {
    GuildServices.addGuild(guild.id);
  }

  // Check if the time is valid (HH:MM)
  if (!/^\d{1,2}:\d{1,2}$/.test(time))
    return interaction.reply("Invalid time format");

  let hours = parseInt(time.split(":")[0]);
  let minutes = parseInt(time.split(":")[1]);

  if (hours > 23 || hours < 0 || minutes > 59 || minutes < 0) {
    return interaction.reply("Invalid time format");
  }

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

  if (month > 11 || month < 0 || day > 31 || day < 0) {
    return interaction.reply("Invalid date format");
  }

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
      await RCategoryServices.getRCategoryByNameAndParentId(category, guild.id);
    if (!categoryExists && !RCategoriesDefault.includes(category)) {
      //Create the category
      idCategory = await RCategoryServices.addRCategory(category, guild.id, 1);
    } else {
      idCategory = categoryExists.RCId || "#000";
    }
  }

  // Check if bot can mention the role
  let idRole = null;
  if (role) {
    if (role.mentionable) {
      idRole = role.id;
    } else {
      return interaction.reply("The role is not mentionable");
    }
  }

  // Check if the channel is a text channel
  if (channel.type != ChannelType.GuildText) {
    return interaction.reply("The channel is not a text channel");
  }

  if (!description) description = null;

  if (!interaction.guildId) return;

  // Create the reminder
  let meId = await RemindusServices.addRemindus(
    interaction.guildId,
    channel.id,
    content,
    description,
    new Date(),
    targetDate,
    repetition,
    idRole,
    0,
    idCategory
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
  let id = interaction.options.getString("id", true);

  const guild = interaction.guild;
  if (!guild) return;
  if (await !GuildServices.isADBGuild(guild.id)) {
    await GuildServices.addGuild(guild.id);
  }

  const remindus = await RemindusServices.getRemindusById(id);
  if (!remindus) {
    return interaction.reply("The reminder doesn't exist");
  }

  if (remindus[0].usId != guild.id) {
    return interaction.reply("The reminder doesn't exist");
  }

  await RemindusServices.removeRemindus(id);

  const embed = new EmbedBuilder()
    .setTitle("Reminder deleted")
    .setDescription("Your reminder has been deleted successfully")
    .setColor("#00ff00")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const breakReminder = async (interaction: ChatInputCommandInteraction) => {
  let id = interaction.options.getString("id", true);

  let guild = await interaction.guild;

  const remindus = await RemindusServices.getRemindusById(id);
  if (!remindus) {
    return interaction.reply("The reminder doesn't exist");
  }

  if (remindus[0].guildId != guild?.id) {
    return interaction.reply("The reminder doesn't exist");
  }

  await RemindusServices.breakRemindus(id, 1);

  const embed = new EmbedBuilder()
    .setTitle("Reminder broken")
    .setDescription("Your reminder has been broken successfully")
    .setColor("#00ff00")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const restartReminder = async (interaction: ChatInputCommandInteraction) => {
  let id = interaction.options.getString("id", true);

  let guild = await interaction.guild;

  const remindus = await RemindusServices.getRemindusById(id);
  if (!remindus) {
    return interaction.reply("The reminder doesn't exist");
  }

  if (remindus[0].guildId != guild?.id) {
    return interaction.reply("The reminder doesn't exist");
  }

  await RemindusServices.breakRemindus(id, 0);

  const embed = new EmbedBuilder()
    .setTitle("Reminder restarted")
    .setDescription("Your reminder has been restarted successfully")
    .setColor("#00ff00")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const listReminders = async (interaction: ChatInputCommandInteraction) => {
  let category = interaction.options.getString("category", false);
  let reminduss: Remindus[] = [];
  if (category) {
    reminduss = await RemindusServices.getRemindusByCategoryAndGuildId(
      interaction.guildId?.toString() || "",
      category
    );
  } else {
    reminduss = await RemindusServices.getRemindusByGuildId(
      interaction.guildId?.toString() || ""
    );
  }

  let content;
  if (reminduss.length > 0) {
    content = reminduss
      .map((r) => {
        return `${r.usId} - ${
          r.content.length > 25 ? r.content.substring(0, 25) + "..." : r.content
        }`;
      })
      .join("\n");
  } else {
    content = "No reminders";
  }

  const embed = new EmbedBuilder()
    .setTitle("Guild reminders list")
    .setDescription(content)
    .setColor("#00ff00")
    .setThumbnail(IMG.REMINDER_LOGO)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

const showReminder = async (interaction: ChatInputCommandInteraction) => {
  let id = interaction.options.getString("id", true);

  const remindus = await RemindusServices.getRemindusById(id);
  if (!remindus) {
    return interaction.reply("The reminder doesn't exist");
  }

  const embed = new EmbedBuilder()
    .setTitle("Reminder details")
    .setDescription(
      `**Content:** ${remindus[0].content} \n**Description:** ${
        remindus[0].description ? remindus[0].description : "None"
      } \n**Target date:** ${remindus[0].targetDate} \n**Repetition:** ${
        remindus[0].repetition ? remindus[0].repetition : "None"
      } \n**Role:** ${
        remindus[0].mentionId ? remindus[0].mentionId : "None"
        //   } \n**Category:** ${
        //     remindus[0].category ? remindus[0].category : "None"
      } \n**Status:** ${remindus[0].isPaused ? "Paused" : "Active"}
     \n**Channel:** <#${remindus[0].channelId}>`
    )
    .setColor("#00ff00")
    .setThumbnail(IMG.REMINDER_LOGO)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
};

export default Remindus;
