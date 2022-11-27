import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "src/types";

import { UsersServices } from "../tables/users/users.services";
import { CountryServices } from "../tables/country/country.services";

export const SetCountry: Command = {
  name: "setcountry",
  description: "Set your country",
  options: [
    {
      name: "country",
      description: "The country you want to set",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
    let country: string = interaction.options
      .get("country")
      ?.value?.toString()!;
    if (await !CountryServices.isValidIdCountry(country))
      return interaction.reply({ content: "Invalid country", ephemeral: true });
    await UsersServices.updateUserCountry(interaction.user.id, country);
    await interaction.reply({ content: "Country set" });
  },
};
