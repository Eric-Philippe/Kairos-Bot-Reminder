import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Command {
  data:
    | Omiy<SlashCommandBuilder, "addSubCommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
  run: (client: Client, interaction: CommandInteraction) => Promise<any>;
}
