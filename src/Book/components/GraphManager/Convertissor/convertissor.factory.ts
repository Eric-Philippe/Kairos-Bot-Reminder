import CategoryData from "../../plugins/timelogger.data";
import BarData from "../bar.data";
import DonutData from "../donut.data";
import PolarData from "../polar.data";
import CategoryTypeChartConverter from "./timelogger.convertissor";

interface ConvertissorFunctionUnit {
  (data: CategoryData): BarData | DonutData | PolarData;
}

interface ConvertissorFunctionList {
  (data: CategoryData[]): BarData | DonutData | PolarData;
}
/**
 *
 * @param {('bar' | 'doughnut' | 'polarArea')} dataType
 * @param {('unit' | 'list)} range
 * @param {('category' | 'activity' | 'task')} target
 */
export function ConvertissorFactory(
  dataType: string,
  range: string,
  target: string
): ConvertissorFunctionUnit | ConvertissorFunctionList | null {
  switch (range) {
    case "unit":
      switch (dataType) {
        case "bar":
          switch (target) {
            case "category":
              return null;
            case "task":
              return CategoryTypeChartConverter.convertToBarDataTask;
            case "activity":
              return null;
          }
        case "doughnut":
          switch (target) {
            case "category":
              return null;
            case "task":
              return CategoryTypeChartConverter.convertToDonutDataTask;
            case "activity":
              return null;
          }
        case "polarArea":
          switch (target) {
            case "category":
              return null;
            case "task":
              return null;
            case "activity":
              return CategoryTypeChartConverter.convertToPolarDataActivity;
          }
      }
    case "list":
      switch (dataType) {
        case "bar":
          switch (target) {
            case "category":
              return null;
            case "activity":
              return null;
            case "task":
              return null;
          }
        case "doughnut":
          switch (target) {
            case "category":
              return null;
            case "activity":
              return CategoryTypeChartConverter.convertToDonutDataActivties;
            case "task":
              return null;
          }
        case "polarArea":
          switch (target) {
            case "category":
              return CategoryTypeChartConverter.convertToPolarDataCategories;
            case "activity":
              return null;
            case "task":
              return null;
          }
      }
  }
  return null;
}
