import { CommandInteraction, Client, Interaction } from "discord.js";
import Commands from "../Commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    await handleSlashCommand(client, interaction);
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );
  if (!slashCommand) return;
  if (!interaction.isChatInputCommand()) return;

  try {
    await slashCommand.run(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};
