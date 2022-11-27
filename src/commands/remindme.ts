import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import { Command } from "src/types";

import { MYSQL_TABLES } from "../utils/mysql_tables.enum";

import { UsersServices } from "../tables/users/users.services";
import { getAvailableIdentifiant } from "../tables/identifiant/identifiant.services";
import { RemindmeServices } from "../tables/remindme/remindme.services";

import { IMG } from "../assets/LOGOS.json";
// export const Remindme: Command = {
//     name: "remindme",
//     description: "Create a new reminder !",
//     .addSu
// };
