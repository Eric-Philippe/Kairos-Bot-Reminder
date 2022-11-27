import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "src/types";

import { UsersServices } from "../tables/users/users.services";
import { CountryServices } from "../tables/country/country.services";
import { Country } from "src/tables/country/country";

export const CountryList: Command = {
  name: "countrylist",
  description: "Give the list of all the countries",
  type: ApplicationCommandType.ChatInput,
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
