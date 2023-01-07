import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import Page from "../Book/components/Page/Page";
import Book from "../Book/Book";
import TextPage from "../Book/components/Page/TextPage";

import TimeLoggerLoad from "../plugins/timelogger.load";
import CategoryData from "../plugins/timelogger.data";

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
      new TextPage("Self care", categories.toString()),
      new TextPage("House care", cat.toString()),
    ];

    new Book(pages, interaction, interaction.user);
  },
};

export default Test;
