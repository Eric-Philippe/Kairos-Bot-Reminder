import TextPage from "./TextPage";

import ColumnType from "../ExcelManager/columnType.enum";

import CategoryData from "../plugins/timelogger.data";

import DateWorker from "../../../utils/date.worker";
/**
 * This class works as a TextPage, but works with not only one but multiple categoryData
 * allowing to aggregate the data of multiple categories
 */
export default class TextPageAgg extends TextPage {
  private _dataSet: CategoryData[];
  public _type = "PAGE_TEXT";
  /**
   * Create a new TextPageAgg
   * @param title
   * @param content
   * @param dataSet
   * @param color
   */
  constructor(
    title: string,
    content: string,
    data: CategoryData,
    dataSet: CategoryData[],
    color: string = "#5865F2"
  ) {
    super(title, content, data, false, color);
    this._dataSet = dataSet;
    this.fillExcel();
  }

  /**
   * Override the fillExcel method to aggregate the data
   */
  public override fillExcel(): void {
    // Get the result of getSummary that will return an array of two string, the first one is the label, the second one is the time
    this.Excel.addRow(
      "TOTAL CATEGORY TIME",
      ColumnType.CATEGORY,
      DateWorker.timeToReadable(this.getTotalTime())
    );
    this.Excel.addSeparatorLine();

    for (const data of this._dataSet) {
      const result = data.getSummary();
      this.Excel.addRow(
        result[0].toString(),
        ColumnType.CATEGORY,
        result[1].toString()
      );

      for (const [key, value] of data.getActivities()) {
        const result = data.getSummaryOfActivity(key);
        this.Excel.addRow(
          result[0].toString(),
          ColumnType.ACTIVITY,
          result[1].toString()
        );
        for (const [taskKey, taskValue] of value) {
          const result = data.getSummaryOfTaskActivity(taskKey, key);
          this.Excel.addRow(
            result[0].toString(),
            ColumnType.TASK,
            result[1].toString()
          );
        }
      }

      if (data.getTasks().size > 0) this.Excel.addBlankLine();

      for (const [key, value] of data.getTasks()) {
        const result = data.getSummaryOfTaskCategory(key);
        this.Excel.addRow(
          result[0].toString(),
          ColumnType.TASK,
          result[1].toString(),
          this.Excel.ITALIC_STYLE
        );
      }
      this.Excel.addSeparatorLine();
    }
  }
  /**
   * Calculate the total time of the dataSet
   * @returns the total time of the dataSet
   */
  public getTotalTime(): number {
    let totalTime = 0;
    for (const data of this._dataSet) {
      totalTime += data.getTotalElapsed();
    }
    return totalTime;
  }
}
