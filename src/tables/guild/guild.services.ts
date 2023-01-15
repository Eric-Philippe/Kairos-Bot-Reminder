import { GuildQueries } from "./guild.queries";
import { execute } from "../../database/mysql.connector";
import { Guild } from "./guild";
import { DEFAULT } from "src/utils/default.enum";

export const GuildServices = {
  isADBGuild: async (guildId: string): Promise<boolean> => {
    let result: Guild[] = await execute(GuildQueries.GetGuildById, [guildId]);
    if (result.length > 0) return true;
    else {
      GuildServices.addGuild(guildId);
      return false;
    }
  },
  addGuild: async (guildId: string): Promise<number> => {
    await execute(GuildQueries.AddGuild, [guildId, DEFAULT.TimeZoneId]);
    return 0;
  },
  removeGuild: async (guildId: string): Promise<number> => {
    await execute(GuildQueries.DeleteGuild, [guildId]);
    return 0;
  },
  getGuilds: async (): Promise<Guild[]> => {
    const result: Guild[] = await execute(GuildQueries.GetGuilds, []);
    return result;
  },
  getGuildById: async (guildId: string): Promise<Guild> => {
    const result: Guild[] = await execute(GuildQueries.GetGuildById, [guildId]);
    return result[0];
  },
  updateGuildCountry: async (
    guildId: string,
    countryId: string
  ): Promise<number> => {
    await execute(GuildQueries.UpdateGuildCountry, [countryId, guildId]);
    return 0;
  },
};
