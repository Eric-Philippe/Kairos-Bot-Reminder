import { ApplicationCommandType } from "discord.js";
import { Command } from "src/types";

import { UsersServices } from "../tables/users/users.services";

export const Test: Command = {
  name: "test",
  description: "Give the current time for many locations",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    // get the gmt offset
    let answer = UsersServices.isAdmin(interaction.user.id);
    console.log(answer);

    await interaction.reply({ content: Boolean(answer).toString() });
  },
};
