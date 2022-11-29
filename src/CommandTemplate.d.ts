import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

export interface Command {
  data:
    | Omiy<SlashCommandBuilder, "addSubCommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  run: (
    client: Client,
    interaction: ChatInputCommandInteraction
  ) => Promise<any>;
}
