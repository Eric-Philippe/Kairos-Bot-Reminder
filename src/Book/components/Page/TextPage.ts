import {
  AttachmentBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Page from "./Page";

import ExcelManager from "../ExcelManager/ExcelManager";
import ColumnType from "../ExcelManager/columnType.enum";
import CategoryData from "../../../plugins/timelogger.data";
/** The assets {logos}
 * @console.warn("You can't use this file without the assets folder");
 */
import { IMG } from "../../../assets/LOGOS.json";
/**
 * A TextPage of a book
 * @extends Page
 * @see Page
 * @see Book
 */
class TextPage extends Page {
  protected _type = "PAGE_TEXT";
  private _Excel: ExcelManager;
  private _data: CategoryData;
  /**
   * Create a new TextPage
   * @param title
   * @param content
   * @param loadExcel
   * @param color
   */
  constructor(
    title: string,
    content: string,
    data: CategoryData,
    loadExcel: boolean = true,
    color: string = "#5865F2"
  ) {
    super(title, content, color);
    this._Excel = new ExcelManager();
    this._data = data;
    if (loadExcel) this.fillExcel();
  }
  /**
   * Getter of the ExcelManager
   */
  public get Excel(): ExcelManager {
    return this._Excel;
  }
  /**
   * Fill the excel with the data
   */
  public fillExcel(): void {
    // Get the result of getSummary that will return an array of two string, the first one is the label, the second one is the time
    const result = this._data.getSummary();
    this._Excel.addRow(
      result[0].toString(),
      ColumnType.CATEGORY,
      result[1].toString()
    );

    for (const [key, value] of this._data.getActivities()) {
      const result = this._data.getSummaryOfActivity(key);
      this._Excel.addRow(
        result[0].toString(),
        ColumnType.ACTIVITY,
        result[1].toString()
      );
      for (const [taskKey, taskValue] of value) {
        const result = this._data.getSummaryOfTaskActivity(taskKey, key);
        this._Excel.addRow(
          result[0].toString(),
          ColumnType.TASK,
          result[1].toString()
        );
      }
    }

    if (this._data.getTasks().size > 0) this._Excel.addBlankLine();

    for (const [key, value] of this._data.getTasks()) {
      const result = this._data.getSummaryOfTaskCategory(key);
      this._Excel.addRow(
        result[0].toString(),
        ColumnType.TASK,
        result[1].toString(),
        this._Excel.ITALIC_STYLE
      );
    }
  }
  /**
   * Generate the .xlsx file linked to the content of the page
   * @returns
   */
  public async generateFile(): Promise<AttachmentBuilder> {
    const buffer = await this._Excel.generateBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const finalBuffer = Buffer.from(await blob.arrayBuffer());
    const attachment = new AttachmentBuilder(finalBuffer);

    attachment.setName("DisplayTime.xlsx");
    return attachment;
  }
  /**
   * Reply to a given interaction with the .xlsx file linked to the content of the page
   * @param interaction
   * @returns
   */
  public async sendFile(
    interaction: ButtonInteraction | ChatInputCommandInteraction
  ): Promise<Boolean> {
    const attachment = await this.generateFile();
    await interaction.reply({ files: [attachment], ephemeral: true });
    return true;
  }
  /**
   * Add a row to the .xlsx file linked to the content of the page
   * @param label
   * @param type
   * @param time
   * @returns
   */
  public addRow(label: string, type: string, time: string): number {
    this._Excel.addRow(label, type, time);
    return 0;
  }
  /**
   * Override the embed generator to add elements specific to the TextPage
   * @param msg
   * @param index
   * @param maxPage
   * @returns
   */
  public override async generateEmbed(
    index: number,
    maxPage: number
  ): Promise<EmbedBuilder | undefined> {
    const embed = await super.generateEmbed(index, maxPage);
    if (!embed) return;
    embed.setThumbnail(IMG.CLOCK_LOGO);
    return embed;
  }
}

export default TextPage;
