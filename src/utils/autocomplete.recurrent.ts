import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from "discord.js";
import { RCategoryServices } from "../tables/rcategory/rcategory.services";
import RCategoriesDefault from "./rcategories.enum";

export const autoCompleteTime = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  const focusedOption = interaction.options.getFocused(true);
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const firstChoicesRaw = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  const secondChoicesRaw = ["00", "15", "30", "45"];

  if (focusedOption.value.includes(":")) {
    const firstChoice = focusedOption.value.split(":")[0];
    const secondChoice = focusedOption.value.split(":")[1];
    choices = secondChoicesRaw
      .filter((choice) => choice.startsWith(secondChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}:${choice}`,
          value: `${firstChoice}:${choice}`,
        };
      });
  } else {
    choices = firstChoicesRaw
      .filter((choice) => choice.startsWith(focusedOption.value))
      .map((choice) => {
        return {
          name: choice,
          value: choice,
        };
      });
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

export const autoCompleteDate = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  const focusedOption = interaction.options.getFocused(true);
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const firstChoicesRaw = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  const secondChoicesRaw = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const thirdChoicesRaw = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  if (!focusedOption.value.includes("/")) {
    choices = firstChoicesRaw
      .filter((choice) => choice.startsWith(focusedOption.value))
      .map((choice) => {
        return {
          name: choice,
          value: choice,
        };
      });
  } else if (
    focusedOption.value.split("/").length === 2 ||
    focusedOption.value.length == 2
  ) {
    const firstChoice = focusedOption.value.split("/")[0];
    const secondChoice = focusedOption.value.split("/")[1];
    choices = secondChoicesRaw
      .filter((choice) => choice.startsWith(secondChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}/${choice}`,
          value: `${firstChoice}/${choice}`,
        };
      });
  } else if (
    focusedOption.value.split("/").length === 3 ||
    focusedOption.value.length == 5
  ) {
    const firstChoice = focusedOption.value.split("/")[0];
    const secondChoice = focusedOption.value.split("/")[1];
    const thirdChoice = focusedOption.value.split("/")[2];
    choices = thirdChoicesRaw
      .filter((choice) => choice.toString().startsWith(thirdChoice))
      .map((choice) => {
        return {
          name: `${firstChoice}/${secondChoice}/${choice}`,
          value: `${firstChoice}/${secondChoice}/${choice}`,
        };
      });
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};

export const autocompleteCategories = async (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> => {
  let choices: ApplicationCommandOptionChoiceData[] = [];
  const choicesRaw = RCategoriesDefault;
  choices = choicesRaw.map((choice) => {
    return {
      name: choice,
      value: choice,
    };
  });
  // Add custom categories from user
  const userCategories = await RCategoryServices.getRCategoriesByParentId(
    interaction.user.id
  );

  if (userCategories.length != 0) {
    choices = choices.concat(
      userCategories.map((choice) => {
        return {
          name: choice.name,
          value: choice.name,
        };
      })
    );
  }

  if (choices.length > 25) choices = choices.slice(0, 25);
  return choices;
};
