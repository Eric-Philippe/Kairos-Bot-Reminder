import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Page from "./Page";

import ExcelManager from "../ExcelManager/ExcelManager";
/**
 * A TextPage of a book
 * @extends Page
 * @see Page
 * @see Book
 */
class TextPage extends Page {
  protected _type = "PAGE_TEXT";
  private _Excel: ExcelManager;
  /**
   * Create a new TextPage
   * @param title
   * @param content
   * @param color
   */
  constructor(title: string, content: string, color: string = "#5865F2") {
    super(title, content, color);
    this._Excel = new ExcelManager();
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
    interaction: ChatInputCommandInteraction
  ): Promise<Boolean> {
    const attachment = await this.generateFile();
    if (interaction.replied)
      await interaction.editReply({ files: [attachment] });
    else await interaction.reply({ files: [attachment] });
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
    embed.setAuthor({ name: "TextPage" });
    return embed;
  }
}

export default TextPage;
