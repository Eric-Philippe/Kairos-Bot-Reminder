import { Column, Row, Workbook, Worksheet } from "exceljs";

import ColumnType from "./columnType.enum";
/**
 * Class to generate all the tools required to generate an Excel file
 * @Eric-Philippe
 */
class ExcelManager {
  _workbook: Workbook;
  _sheet: Worksheet;
  _category: Column;
  _activity: Column;
  _task: Column;
  _time: Column;
  _currentRow: Row;
  _nCurrentRow = 2;
  /**
   * Main Constructor for the Excel Manager
   */
  constructor() {
    this._workbook = new Workbook();
    this._workbook.creator = "Kairos | EricP";
    this._workbook.created = new Date();
    this._sheet = this._workbook.addWorksheet("Display Time");
    this._sheet.columns = [
      {
        header: "Category",
        key: "category",
        width: 32,
      },
      {
        header: "Activity",
        key: "activity",
        width: 24,
      },
      {
        header: "Task",
        key: "task",
        width: 28,
      },
      {
        header: "Total Time",
        key: "time",
        width: 11,
      },
    ];
    this._category = this._sheet.getColumn("category");
    this._activity = this._sheet.getColumn("activity");
    this._task = this._sheet.getColumn("task");
    this._time = this._sheet.getColumn("time");
    this._category.header = "Category";
    this._sheet.getRow(1).getCell(1).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._sheet.getRow(1).getCell(2).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._sheet.getRow(1).getCell(3).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._sheet.getRow(1).getCell(4).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._activity.header = "Activity";
    this._task.header = "Task";
    this._time.header = "Total Time";
    this._currentRow = this._sheet.getRow(this._nCurrentRow);
  }
  /**
   * Function to create a new line in the Excel file
   */
  private async newLine() {
    this._currentRow = this._sheet.getRow(this._nCurrentRow++);
  }
  /**
   * Method to create a blank line in the Excel file
   */
  public async addBlankLine() {
    this.newLine();
  }
  /**
   * Method to add a separator line in the Excel file
   */
  public async addSeparatorLine() {
    this.newLine();
    this._currentRow.getCell(1).value =
      "----------------------------------------------------";
    this._currentRow.getCell(1).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._currentRow.getCell(2).value =
      "----------------------------------------";
    this._currentRow.getCell(2).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._currentRow.getCell(3).value =
      "---------------------------------------------";
    this._currentRow.getCell(3).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
    this._currentRow.getCell(4).value = "------------------";
    this._currentRow.getCell(4).style = {
      font: {
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };
  }
  /**
   * getter for the current row
   */
  public get TITLE_STYLE() {
    return "TITLE";
  }
  public get VALUE_STYLE() {
    return "VALUE";
  }
  public get ITALIC_STYLE() {
    return "ITALIC";
  }
  /**
   * Choose the style
   * @param {Title | Value | Italic}
   */
  private chooseStyle(type: string) {
    let style = {};
    switch (type) {
      case "TITLE":
        style = {
          font: {
            bold: true,
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        };
        break;
      case "VALUE":
        style = {
          font: {
            bold: false,
          },
          border: {},
        };
        break;
      case "ITALIC":
        style = {
          font: {
            bold: false,
            italic: true,
          },
          border: {},
        };
        break;
    }
    return style;
  }
  /**
   * Add a row to the Excel file with the given parameters
   * @param label
   * @param type
   * @param time
   */
  public async addRow(
    label: string,
    type: string,
    time: string,
    styleType: string = "VALUE"
  ) {
    this.newLine();
    let valueStyle = this.chooseStyle(styleType);
    switch (type) {
      case ColumnType.CATEGORY:
        this._currentRow.getCell(1).value = label;
        this._currentRow.getCell(1).style = valueStyle;
        break;
      case ColumnType.ACTIVITY:
        this._currentRow.getCell(2).value = label;
        this._currentRow.getCell(2).style = valueStyle;
        break;
      case ColumnType.TASK:
        this._currentRow.getCell(3).value = label;
        this._currentRow.getCell(3).style = valueStyle;
        break;
    }
    this._currentRow.getCell(4).value = time;
    this._currentRow.getCell(4).style = valueStyle;
  }
  /**
   * Function to generate the Excel file
   */
  public async generateXLSXFile() {
    await this._workbook.xlsx.writeFile("./DisplayTime.xlsx");
  }
  /**
   * Function to generate the Excel file as a buffer
   * @returns
   */
  public async generateBuffer() {
    return await this._workbook.xlsx.writeBuffer();
  }
}

export default ExcelManager;
