import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import CategoryTypeChartConverter from "../Book/components/plugins/d";

import Page from "../Book/components/Page/Page";
import Book from "../Book/Book";
import TextPage from "../Book/components/Page/TextPage";

import TimeLoggerLoad from "../Book/components/plugins/timelogger.load";
import CategoryData from "../Book/components/plugins/timelogger.data";
import TextPageAgg from "../Book/components/Page/TextPageAgg";
import GraphPage from "../Book/components/Page/GraphPage";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    interaction.deferReply();
    const categories = await TimeLoggerLoad.loadCategory(
      interaction.user.id,
      "self care"
    );
    if (categories === null) return;
    const datasets = CategoryTypeChartConverter.convertToBarData(categories);
    const pages = [
      new Page("Test", "Test"),
      new GraphPage("Test", "Test", datasets, "#5865F2"),
    ];

    new Book(pages, interaction, interaction.user);
  },
};

export default Test;
