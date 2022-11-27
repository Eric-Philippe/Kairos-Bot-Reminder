import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "src/types";

import { UsersServices } from "../tables/users/users.services";
import { RemindmeServices } from "../tables/remindme/remindme.services";

import { IMG } from "../assets/LOGOS.json";

const Rm: Command = {
  data: new SlashCommandBuilder()
    .setName("rm")
    .setDescription("Create a new reminder with a quick row of text")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time you want to set Ex: 8:00")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(5)
    )
    .addStringOption((option) =>
      option
        .setName("quick-date")
        .setDescription("The quick date you want to set Ex: tomorrow")
        .setRequired(true)
        .addChoices(
          {
            name: "Tomorrow",
            value: "tomorrow",
          },
          {
            name: "Tomorrow",
            value: "tomorrow",
          },
          {
            name: "In 2 days",
            value: "in2days",
          },
          {
            name: "Next Week",
            value: "nextweek",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reminder-content")
        .setDescription("The reminder content")
        .setRequired(true)
        .setMinLength(4)
    ),
  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
    let time: string = interaction.options.get("time")?.value?.toString()!;

    // Check if the time is valid
    // IsValid : 8:00 or 08:00 or 8:0 or 08:0
    if (!/^\d{1,2}:\d{1,2}$/.test(time))
      return interaction.reply("Invalid time format");

    let date: string = interaction.options
      .get("quick-reminder-date")
      ?.value?.toString()!;

    // Check if the date is valid and not in the past
    if (date === "today") {
      let today = new Date();
      let todayDate = today.getDate();
      let todayMonth = today.getMonth() + 1;
      let todayYear = today.getFullYear();
      date = todayYear + "-" + todayMonth + "-" + todayDate;
    } else if (date === "tomorrow") {
      let today = new Date();
      let todayDate = today.getDate() + 1;
      let todayMonth = today.getMonth() + 1;
      let todayYear = today.getFullYear();
      date = todayYear + "-" + todayMonth + "-" + todayDate;
    } else if (date === "in2days") {
      let today = new Date();
      let todayDate = today.getDate() + 2;
      let todayMonth = today.getMonth() + 1;
      let todayYear = today.getFullYear();
      date = todayYear + "-" + todayMonth + "-" + todayDate;
    } else if (date === "nextweek") {
      let today = new Date();
      let todayDate = today.getDate() + 7;
      let todayMonth = today.getMonth() + 1;
      let todayYear = today.getFullYear();
      date = todayYear + "-" + todayMonth + "-" + todayDate;
    } else {
      return interaction.reply("Invalid date format");
    }

    let targetDate = new Date(date + " " + time);

    if (new Date() > targetDate) {
      return interaction.reply("Enter a date in the future");
    }

    let content: string = interaction.options
      .get("reminder-content")
      ?.value?.toString()!;

    let entryDate: Date = new Date();

    await RemindmeServices.addRemindMe(
      content,
      null,
      entryDate,
      targetDate,
      null,
      0,
      null,
      interaction.user.id
    );

    let embed = new EmbedBuilder()
      .setTitle("📅 | Reminder created")
      .setDescription(`Reminder has been created !`)
      .setColor("Aqua")
      .setThumbnail(IMG.REMINDER_LOGO)
      .setTimestamp();
    await interaction.reply({
      embeds: [embed],
    });
  },
};

export default Rm;
