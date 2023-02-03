import { CountryQueries } from "./country.queries";
import { execute } from "../../database/mysql.connector";
import { Country } from "./country";

export const CountryServices = {
  getCountryById: async (countryId: string): Promise<Country> => {
    let result: Country[] = await execute(CountryQueries.GetCountryById, [
      countryId,
    ]);
    return result[0];
  },
  getCountries: async (): Promise<Country[]> => {
    let result: Country[] = await execute(CountryQueries.GetCountries, []);
    return result;
  },
  isValidIdCountry: async (countryId: string): Promise<boolean> => {
    let result: Country[] = await execute(CountryQueries.GetCountryById, [
      countryId,
    ]);
    if (result.length > 0) return true;
    else return false;
  },
};
