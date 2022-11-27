import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";
import { CountryServices } from "../tables/country/country.services";

const SetCountry: Command = {
  data: new SlashCommandBuilder()
    .setName("setcountry")
    .setDescription("Set your country")
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription("Your country")
        .setMaxLength(3)
        .setMinLength(2)
        .setRequired(true)
    ),

  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
    let country: string = interaction.options
      .get("country")
      ?.value?.toString()!;
    if (!country.startsWith("#")) country = "#" + country;
    if (await !CountryServices.isValidIdCountry(country))
      return interaction.reply({
        content: "❌ | Invalid country",
        ephemeral: true,
      });
    await UsersServices.updateUserCountry(interaction.user.id, country);
    await interaction.reply({ content: "🗺️ | Country set ✅" });
  },
};

export default SetCountry;
