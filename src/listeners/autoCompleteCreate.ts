import {
  CommandInteraction,
  Client,
  Interaction,
  AutocompleteInteraction,
} from "discord.js";
import Commands from "../Commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isAutocomplete()) return;
    await handleAutoComplete(client, interaction);
  });
};

const handleAutoComplete = async (
  client: Client,
  interaction: AutocompleteInteraction
): Promise<void> => {
  const command = Commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );

  if (!command) return;

  try {
    if (!command.autocomplete) return;
    await command.autocomplete(interaction);
  } catch (error) {
    console.error(error);
  }
};
