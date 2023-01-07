import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import Page from "../Book/components/Page/Page";
import Book from "../Book/Book";
import TextPage from "../Book/components/Page/TextPage";

import TimeLoggerLoad from "../plugins/timelogger.load";
import CategoryData from "../plugins/timelogger.data";
import TextPageAgg from "../Book/components/Page/TextPageAgg";

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
    const cat = await TimeLoggerLoad.loadCategory(
      interaction.user.id,
      "house care"
    );
    if (categories === null || cat === null) return;
    const pages = [
      new Page("Test", "Test"),
      new TextPageAgg("Self care", categories.toString(), categories, [
        categories,
        cat,
      ]),
      new TextPageAgg("House care", cat.toString(), cat, [categories, cat]),
    ];

    new Book(pages, interaction, interaction.user);
  },
};

export default Test;
