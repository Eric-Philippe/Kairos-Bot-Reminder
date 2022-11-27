import { Command } from "./types";
import { Time } from "./commands/time";
import { Test } from "./commands/test";
import { SetCountry } from "./commands/setcountry";
import { CountryList } from "./commands/countrylist";

export const Commands: Command[] = [Time, Test, SetCountry, CountryList];
