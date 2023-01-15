import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";
import DateWorker from "../utils/date.worker";
import MessageManager from "../messages/MessageManager";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("converttime")
    .setDescription("Convert minutes to hours and minutes")
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Minutes to convert")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const minutes = interaction.options.getInteger("minutes");
    let result = DateWorker.timeToReadable(minutes);
    MessageManager.send(
      MessageManager.getSuccessCnst(),
      `${minutes} corresponds to ${result}`,
      interaction
    );
  },
};

export default Test;
