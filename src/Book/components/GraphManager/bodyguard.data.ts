import BarData from "./bar.data";
import DonutData from "./donut.data";
import PolarData from "./polar.data";

class BodyGuardData {
  /**
   * export interface BarData {
  labels: Array<String>;
  datasets: Array<datasets>;
}

interface datasets {
  label: String;
  data: Array<number>;
  backgroundColor: Array<String>;
  borderColor: Array<String>;
  borderWidth: number;
}

   * @param data 
   * @returns 
   */
  public static isBarData(data: any): data is BarData {
    if (!data.labels) return false;
    if (!data.datasets) return false;
    if (!Array.isArray(data.labels)) return false;
    if (!Array.isArray(data.datasets)) return false;
    if (data.datasets.length === 0) return false;
    if (data.datasets.length > 1) return false;
    if (!data.datasets[0].label) return false;
    if (!data.datasets[0].data) return false;
    if (!data.datasets[0].backgroundColor) return false;
    if (!data.datasets[0].borderColor) return false;
    if (!data.datasets[0].borderWidth) return false;
    if (typeof data.datasets[0].label != "string") return false;
    if (!Array.isArray(data.datasets[0].data)) return false;
    if (!Array.isArray(data.datasets[0].backgroundColor)) return false;
    if (!Array.isArray(data.datasets[0].borderColor)) return false;
    if (typeof data.datasets[0].borderWidth !== "number") return false;
    return true;
  }

  public static isDonutData(data: any): data is DonutData {
    if (!data.labels) return false;
    if (!data.datasets) return false;
    if (!Array.isArray(data.labels)) return false;
    if (!Array.isArray(data.datasets)) return false;
    if (data.datasets.length === 0) return false;
    if (data.datasets.length > 1) return false;
    if (!data.datasets[0].label) return false;
    if (!data.datasets[0].data) return false;
    if (!data.datasets[0].backgroundColor) return false;
    if (!data.datasets[0].hoverOffset) return false;
    if (!Array.isArray(data.datasets[0].label)) return false;
    if (!Array.isArray(data.datasets[0].data)) return false;
    if (!Array.isArray(data.datasets[0].backgroundColor)) return false;
    if (typeof data.datasets[0].hoverOffset !== "number") return false;
    return true;
  }

  public static isPolarData(data: any): data is PolarData {
    if (!data.labels) return false;
    if (!data.datasets) return false;
    if (!Array.isArray(data.labels)) return false;
    if (!Array.isArray(data.datasets)) return false;
    if (data.datasets.length === 0) return false;
    if (data.datasets.length > 1) return false;
    if (!data.datasets[0].label) return false;
    if (!data.datasets[0].data) return false;
    if (!data.datasets[0].backgroundColor) return false;
    if (!Array.isArray(data.datasets[0].label)) return false;
    if (!Array.isArray(data.datasets[0].data)) return false;
    if (!Array.isArray(data.datasets[0].backgroundColor)) return false;
    return true;
  }
}

export default BodyGuardData;
