import CategoryData from "./timelogger.data";

import BarData from "../GraphManager/bar.data";
import DonutData from "../GraphManager/donut.data";
import PolarData from "../GraphManager/polar.data";

const PrettyColors = {
  RED_PINK: "rgb(255, 99, 132)",
  LIGHT_BLUE: "rgb(75, 192, 192)",
  YELLOW: "rgb(255, 205, 86)",
  BLUE: "rgb(54, 162, 235)",
  PURPLE: "rgb(153, 102, 255)",
  GREEN_LIGHT: "rgb(75, 255, 192)",
  ORANGE: "rgb(255, 159, 64)",
  RED: "rgb(255, 0, 90)",
  GREY: "rgb(150, 150, 150)",
  GREEN: "rgb(100, 255, 100)",
};
const OTHER = "rgb(201, 203, 207)";

import BodyGuardData from "../GraphManager/bodyguard.data";

export default class CategoryTypeChartConverter {
  public static convertToBarData(data: CategoryData): BarData {
    const dataValues: number[] = data.getTasksTimeArray();
    const dataKeys: String[] = data.getTasksNameArray();
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    for (let i = 0; i < dataValues.length; i++) {
      let color = Object.values(PrettyColors)[i];
      borderColor.push(color);
      // The color looks like this: "rgb(255, 99, 132)"
      // We want to make it a bit transparent : "rgba(255, 99, 132, 0.2)"
      color = color.replace(")", ", 0.2)");
      color = color.replace("rgb", "rgba");
      backgroundColor.push(color);
    }
    const barData: BarData = {
      labels: dataKeys,
      datasets: [
        {
          label: data.getTitle(),
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
    return barData;
  }
}
