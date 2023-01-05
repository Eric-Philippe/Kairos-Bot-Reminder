import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import Page from "../Book/components/Page/Page";
import Book from "../Book/Book";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  run: async (client, interaction) => {
    const pages = [
      new Page("Hello world", "This is a test page"),
      new Page("Foo bar", "This is a test page"),
    ];
    new Book(pages, interaction, interaction.user);
  },
};

export default Test;
