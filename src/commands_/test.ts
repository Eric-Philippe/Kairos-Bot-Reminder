import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import CategoryTypeChartConverter from "../Book/components/GraphManager/Convertissor/timelogger.convertissor";

import Page from "../Book/components/Page/Page";
import Book from "../Book/Book";
import TextPage from "../Book/components/Page/TextPage";

import TimeLoggerLoad from "../Book/components/plugins/timelogger.load";
import CategoryData from "../Book/components/plugins/timelogger.data";
import TextPageAgg from "../Book/components/Page/TextPageAgg";
import GraphPage from "../Book/components/Page/GraphPage";

const Test: Command = {
  description: {
    name: "Test",
    shortDescription: "Test command",
    fullDescription: "Test command",
    emoji: "🧪",
    categoryName: "Test",
  },
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    interaction.deferReply();
  },
};

export default Test;
