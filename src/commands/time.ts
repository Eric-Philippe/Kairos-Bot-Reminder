import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../plugins/categories";

const Time: Command = {
  description: {
    name: "Time",
    shortDescription: "Give the current time for many locations",
    fullDescription: "Give the current time for many locations",
    emoji: "⏲️",
    categoryName: CommandCategories.GENERAL.name,
    usage: "/time",
    example: "/time",
  },
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Give the current time for many locations"),
  run: async (client, interaction) => {
    let template = "It is currently {time} in {country}.";
    let cities = [
      {
        city: "New York",
        time: new Date().toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
        }),
      },
      {
        city: "London",
        time: new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/London",
        }),
      },
      {
        city: "Paris",
        time: new Date().toLocaleTimeString("fr-FR", {
          timeZone: "Europe/Paris",
        }),
      },
      {
        city: "Adelaide",
        time: new Date().toLocaleTimeString("en-AU", {
          timeZone: "Australia/Adelaide",
        }),
      },
      {
        city: "Tokyo",
        time: new Date().toLocaleTimeString("ja-JP", {
          timeZone: "Asia/Tokyo",
        }),
      },
      {
        city: "Sydney",
        time: new Date().toLocaleTimeString("en-AU", {
          timeZone: "Australia/Sydney",
        }),
      },
      {
        city: "New Delhi",
        time: new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    ];

    let response = cities
      .map((city) => {
        return template
          .replace("{time}", city.time)
          .replace("{country}", city.city);
      })
      .join("\n");

    await interaction.reply({ content: response });
  },
};

export default Time;
