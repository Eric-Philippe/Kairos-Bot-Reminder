import TextPage from "./TextPage";

import ColumnType from "../ExcelManager/columnType.enum";

import CategoryData from "../plugins/timelogger.data";

import DateWorker from "../../../utils/date.worker";
import { User } from "discord.js";
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
   * @param user
   * @param data
   * @param dataSet
   * @param color
   */
  constructor(
    title: string,
    content: string,
    user: User,
    data: CategoryData,
    dataSet: CategoryData[],
    color: string = "#5865F2"
  ) {
    super(title, content, user, data, false, color);
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
  /**
   * Cut an array of string as much as needed to fit the discord message limit
   */
  public static createEnoughTextPageAgg(originalArray: string[]): string[] {
    const newArray: string[] = [];
    let currentString = "";

    let i = 0;
    while (i < originalArray.length) {
      // check if the current string and the next two elements would still be under the limit
      if (
        currentString.length +
          originalArray[i].length +
          originalArray[i + 1].length <
        4096
      ) {
        currentString += originalArray[i];
        currentString += originalArray[i + 1];
        i += 2;
      } else {
        newArray.push(currentString);
        currentString = "";
      }
    }

    // Push the remaining string if there's any
    if (currentString) {
      newArray.push(currentString);
    }

    return newArray;
  }
}
