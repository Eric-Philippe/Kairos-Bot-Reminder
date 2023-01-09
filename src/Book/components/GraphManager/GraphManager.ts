import { Chart } from "chart.js";
import { ChatInputCommandInteraction } from "discord.js";
const ChartJsImage = require("chartjs-to-image");

import BarData from "./bar.data";
import DonutData from "./donut.data";
import PolarData from "./polar.data";
import BodyGuardData from "./bodyguard.data";

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

const GraphTypes = {
  BAR: "bar",
  DOUGHNUT: "doughnut",
  POLAR: "polarArea",
};

class GraphManager {
  public static generateGraph(
    type: string,
    data: BarData | DonutData | PolarData
  ) {
    // If the given type is inside the GraphTypes object
    if (!Object.values(GraphTypes).includes(type))
      throw new Error("Invalid type");

    // If the given data is an instance of the right class
    if (type === GraphTypes.BAR && !BodyGuardData.isBarData(data))
      throw new Error("Invalid data given with type : " + type);
    if (type === GraphTypes.DOUGHNUT && !BodyGuardData.isDonutData(data))
      throw new Error("Invalid data given with type : " + type);
    if (type === GraphTypes.POLAR && !BodyGuardData.isPolarData(data))
      throw new Error("Invalid data given with type : " + type);

    const chart = new ChartJsImage();
    chart.setConfig({
      type: type,
      data: data,
    });
    return chart;
  }

  public static async chartToBuffer(chart: any): Promise<Buffer> {
    const buf = await chart.toBinary();
    return buf;
  }

  public static async chartToPng(chart: any): Promise<string> {
    const path = await chart.toFile("./graph.png");
    return path;
  }
  /**
   * @deprecated Only for testing purpose
   * @returns
   */
  public static async sendMyGraph(
    interaction: ChatInputCommandInteraction,
    chart?: Chart
  ) {
    if (!chart) chart = this.generateRandomPolarChart();
    const buffer = await this.chartToBuffer(chart);
    const attachment = {
      name: "graph.png",
      attachment: buffer,
    };
    interaction.reply({ files: [attachment] });
  }
  /**
   * @deprecated Only for testing purpose
   * @returns
   */
  public static generateRandomPolarChart() {
    const chart = new ChartJsImage();
    chart.setConfig({
      type: "bar",
      data: {
        labels: ["Hello world", "Foo bar"],
        datasets: [{ label: "Foo", data: [1, 2] }],
      },
    });
    return chart;
  }
}

export default GraphManager;
