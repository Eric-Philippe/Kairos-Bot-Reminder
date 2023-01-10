import CategoryData from "../../plugins/timelogger.data";

import BarData from "../bar.data";
import DonutData from "../donut.data";
import PolarData from "../polar.data";

const PrettyColors = {
  RED_PINK: "rgb(255, 99, 132)",
  LIGHT_BLUE: "rgb(75, 192, 192)",
  YELLOW: "rgb(255, 205, 86)",
  BLUE: "rgb(54, 162, 235)",
  PURPLE: "rgb(153, 102, 255)",
  GREEN_LIGHT: "rgb(75, 255, 192)",
  ORANGE: "rgb(255, 159, 64)",
  RED: "rgb(255, 0, 90)",
  GREEN: "rgb(100, 255, 100)",
};
const OTHER = "rgb(201, 203, 207)";

const rgbToRgba = function (string: string, alpha: number): string {
  if (alpha > 1) alpha = 1;
  if (alpha < 0) alpha = 0;
  return string.replace(")", `, ${alpha})`).replace("rgb", "rgba");
};

export default class CategoryTypeChartConverter {
  public static convertToBarDataTask(data: CategoryData): BarData {
    const dataValues: number[] = data.getTasksTimeArray();
    const dataKeys: string[] = data.getTasksNameArray();
    let map = new Map<string, number>();
    for (let i = 0; i < dataKeys.length; i++) {
      map.set(dataKeys[i], dataValues[i]);
    }
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // If we have more than 10 elements, gather the 10th element and the others lower elements in the "Other" category
    dataValues.splice(0, dataValues.length, ...map.values());
    dataKeys.splice(0, dataKeys.length, ...map.keys());
    if (dataValues.length > 9) {
      const otherValue = dataValues.slice(9).reduce((a, b) => a + b, 0);
      dataValues.splice(10, dataValues.length - 9, otherValue);
      dataKeys.splice(10, dataKeys.length - 9, "Other");
    }
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i < dataValues.length; i++) {
      let color;
      if (i < Object.values(PrettyColors).length)
        color = Object.values(PrettyColors)[i];
      else color = OTHER;
      borderColor.push(color);
      backgroundColor.push(rgbToRgba(color, 0.2));
    }
    const barData: BarData = {
      labels: dataKeys,
      datasets: [
        {
          label: "Tasks by keyword",
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
    return barData;
  }

  public static convertToDonutDataTask(data: CategoryData): DonutData {
    const dataValues: number[] = data.getTasksTimeArray();
    const dataKeys: string[] = data.getTasksNameArray();
    let map = new Map<string, number>();
    for (let i = 0; i < dataKeys.length; i++) {
      map.set(dataKeys[i], dataValues[i]);
    }
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // If we have more than 10 elements, gather the 10th element and the others lower elements in the "Other" category
    dataValues.splice(0, dataValues.length, ...map.values());
    dataKeys.splice(0, dataKeys.length, ...map.keys());
    if (dataValues.length > 9) {
      const otherValue = dataValues.slice(9).reduce((a, b) => a + b, 0);
      dataValues.splice(10, dataValues.length - 9, otherValue);
      dataKeys.splice(10, dataKeys.length - 9, "Other");
    }
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i < dataValues.length; i++) {
      let color;
      if (i <= Object.values(PrettyColors).length)
        color = Object.values(PrettyColors)[i];
      else color = OTHER;
      borderColor.push(color);
      backgroundColor.push(rgbToRgba(color, 0.2));
    }
    const donutData: DonutData = {
      labels: dataKeys,
      datasets: [
        {
          label: data.getTitle(),
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    };
    return donutData;
  }

  public static convertToDonutDataActivties(data: CategoryData[]): DonutData {
    // Add all tge getActivitiesTimeArray in the dataValues
    let dataValues: number[] = [];
    let dataKeys: string[] = [];
    for (let i = 0; i < data.length; i++) {
      dataValues = dataValues.concat(data[i].getActivitiesTimeArray());
      dataKeys = dataKeys.concat(data[i].getActivitiesNameArray());
    }

    // Create a map with the dataKeys as keys and the dataValues as values
    let map = new Map<string, number>();
    for (let i = 0; i < dataKeys.length; i++) {
      map.set(dataKeys[i], dataValues[i]);
    }
    // Sort the map by values
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // If we have more than 10 elements, gather the 10th element and the others lower elements in the "Other" category
    dataValues.splice(0, dataValues.length, ...map.values());
    dataKeys.splice(0, dataKeys.length, ...map.keys());
    if (dataValues.length > 9) {
      const otherValue = dataValues.slice(9).reduce((a, b) => a + b, 0);
      dataValues.splice(10, dataValues.length - 9, otherValue);
      dataKeys.splice(10, dataKeys.length - 9, "Other");
    }
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i < dataValues.length; i++) {
      let color;
      if (i <= Object.values(PrettyColors).length)
        color = Object.values(PrettyColors)[i];
      else color = OTHER;
      borderColor.push(color);
      backgroundColor.push(rgbToRgba(color, 0.2));
    }
    const donutData: DonutData = {
      labels: dataKeys,
      datasets: [
        {
          label: "Activities",
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    };
    return donutData;
  }

  public static convertToPolarDataCategories(data: CategoryData[]): PolarData {
    const dataValues: number[] = data.map((d) => d.getTotalElapsed());
    const dataKeys: string[] = data.map((d) => d.getTitle());
    // Create a map with the dataKeys as keys and the dataValues as values
    let map = new Map<string, number>();
    for (let i = 0; i < dataKeys.length; i++) {
      map.set(dataKeys[i], dataValues[i]);
    }
    // Sort the map by values
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // If we have more than 10 elements, gather the 10th element and the others lower elements in the "Other" category
    dataValues.splice(0, dataValues.length, ...map.values());
    dataKeys.splice(0, dataKeys.length, ...map.keys());
    if (dataValues.length > 9) {
      const otherValue = dataValues.slice(9).reduce((a, b) => a + b, 0);
      dataValues.splice(10, dataValues.length - 9, otherValue);
      dataKeys.splice(10, dataKeys.length - 9, "Other");
    }
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i < dataValues.length; i++) {
      let color;
      if (i <= Object.values(PrettyColors).length)
        color = Object.values(PrettyColors)[i];
      else color = OTHER;
      borderColor.push(color);
      backgroundColor.push(rgbToRgba(color, 0.2));
    }
    const polarData: PolarData = {
      labels: dataKeys,
      datasets: [
        {
          label: "Categories",
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    };
    return polarData;
  }

  public static convertToPolarDataActivity(data: CategoryData): PolarData {
    // PolarData of all the activities from the data
    const dataValues: number[] = data.getActivitiesTimeArray();
    const dataKeys: string[] = data.getActivitiesNameArray();
    // Create a map with the dataKeys as keys and the dataValues as values
    let map = new Map<string, number>();
    for (let i = 0; i < dataKeys.length; i++) {
      map.set(dataKeys[i], dataValues[i]);
    }
    // Sort the map by values
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // If we have more than 10 elements, gather the 10th element and the others lower elements in the "Other" category
    dataValues.splice(0, dataValues.length, ...map.values());
    dataKeys.splice(0, dataKeys.length, ...map.keys());
    if (dataValues.length > 9) {
      const otherValue = dataValues.slice(9).reduce((a, b) => a + b, 0);
      dataValues.splice(10, dataValues.length - 9, otherValue);
      dataKeys.splice(10, dataKeys.length - 9, "Other");
    }
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i <= dataValues.length; i++) {
      let color;
      if (i <= Object.values(PrettyColors).length)
        color = Object.values(PrettyColors)[i];
      else color = OTHER;
      borderColor.push(color);
      backgroundColor.push(rgbToRgba(color, 0.2));
    }
    const polarData: PolarData = {
      labels: dataKeys,
      datasets: [
        {
          label: data.getTitle(),
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ],
    };
    return polarData;
  }
}
