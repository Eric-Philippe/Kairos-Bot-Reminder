export const GuildQueries = {
  GetGuilds: `
    SELECT
    *
    FROM
    Guild;`,

  GetGuildById: `
    SELECT
    *
    FROM
    Guild
    WHERE
    guildId = ?;`,

  AddGuild: `
    INSERT INTO Guild VALUES (?, ?);`,

  DeleteGuild: `
    DELETE FROM Guild WHERE guildId = ?;`,

  UpdateGuildCountry: `
    UPDATE Guild SET cId = ? WHERE guildId = ?;`,
};
