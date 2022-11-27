export const CountryQueries = {
  GetCountryById: `
        SELECT
        CId,
        name,
        gmtOffset
        FROM
        Country
        WHERE
        CId = ?;
        `,
  GetCountries: `SELECT
        CId,
        name,
        gmtOffset
        FROM
        Country;`,
};
