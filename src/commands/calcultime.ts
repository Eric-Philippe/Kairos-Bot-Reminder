import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../plugins/categories";
import DateWorker from "../utils/date.worker";
import MessageManager from "../messages/MessageManager";

const Test: Command = {
  description: {
    name: "Calcul Time",
    shortDescription: "Calcul difference and sum of time",
    fullDescription: "Calcul difference and sum of time",
    emoji: "⌚",
    categoryName: CommandCategories.GENERAL.name,
    usage:
      "/calcultime <ahours> <aminutes> <operation> <bhours> <bminutes> <format>",
    example: "/calcultime 1 30 sum 2 30 hm",
  },
  data: new SlashCommandBuilder()
    .setName("calcultime")
    .setDescription("Calcul difference and sum of time")
    .addIntegerOption((option) =>
      option
        .setName("ahours")
        .setDescription("A - Hours to calcul")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("aminutes")
        .setDescription("A - Minutes to calcul")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("operation")
        .setDescription("Operation to do")
        .setRequired(true)
        .addChoices(
          {
            name: "Addition",
            value: "sum",
          },
          {
            name: "Soustraction",
            value: "diff",
          }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("bhours")
        .setDescription("B - Hours to calcul")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("bminutes")
        .setDescription("B - Minutes to calcul")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("format")
        .setDescription("Format of the result")
        .addChoices(
          {
            name: "Hours and minutes",
            value: "hm",
          },
          {
            name: "Minutes",
            value: "m",
          },
          {
            name: "24h limit",
            value: "24",
          }
        )
    ),
  run: async (client, interaction) => {
    const hours = interaction.options.getInteger("ahours") || 0;
    const minutes = interaction.options.getInteger("aminutes") || 0;
    const operation = interaction.options.getString("operation") || "sum";
    const hoursB = interaction.options.getInteger("bhours") || 0;
    const minutesB = interaction.options.getInteger("bminutes") || 0;
    const format = interaction.options.getString("format") || "hm";

    let result = DateWorker.calculTime(
      hours,
      minutes,
      operation,
      hoursB,
      minutesB,
      format
    );

    MessageManager.send(
      MessageManager.getSuccessCnst(),
      String(result),
      interaction
    );
  },
};

export default Test;
