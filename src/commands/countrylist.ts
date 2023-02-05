import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import { CommandCategories } from "../commands_/categories";

import { UsersServices } from "../tables/users/users.services";
import { CountryServices } from "../tables/country/country.services";
import { Country } from "src/tables/country/country";

const CountryList: Command = {
  description: {
    name: "Country List",
    shortDescription: "List all countries",
    fullDescription: "List all countries",
    emoji: "🌎",
    categoryName: CommandCategories.GENERAL.name,
    usage: "/countrylist",
    example: "/countrylist",
  },
  data: new SlashCommandBuilder()
    .setName("countrylist")
    .setDescription("List all countries"),
  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
    let countries: Country[] = await CountryServices.getCountries();
    let msgContent = "";
    countries.forEach((country) => {
      msgContent += `${country.CId} - [GMT ${country.gmtOffset}] -  ${country.name}\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("List of all the countries")
      .setDescription(msgContent)
      .setColor("Aqua")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default CountryList;
