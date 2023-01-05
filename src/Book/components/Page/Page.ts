import {
  Message,
  EmbedBuilder,
  ColorResolvable,
  TextBasedChannel,
} from "discord.js";

import Controller from "../Controller/Controller";

/** The maximum size of a page's content */
const SIZE_LIMIT = 4096;
/** The maximum size of a page's title */
const TITLE_LIMIT = 256;
/**
 * A page of a book
 */
class Page {
  protected _type = "PAGE";
  private _title: string;
  private _content: string;
  private _color: string;
  /**
   * Create a new page
   * @param title
   * @param content
   * @param color
   */
  constructor(title: string, content: string, color: string = "#5865F2") {
    if (content.length > SIZE_LIMIT)
      throw new Error("Content is too long for a single page");
    if (title.length > TITLE_LIMIT)
      throw new Error("Title is too long for a single page");
    this._title = title;
    this._content = content;
    this._color = color;
  }
  /**
   * Check if the content is too long for a single page
   * @param content
   * @returns
   */
  public static isContentTooLong(content: string): boolean {
    return content.length > SIZE_LIMIT;
  }
  /**
   * Check if the title is too long for a single page
   * @param title
   * @returns
   */
  public static isTitleTooLong(title: string): boolean {
    return title.length > TITLE_LIMIT;
  }
  /**
   * Main method to display the page
   * @param msg
   * @param index
   * @param maxPage
   * @returns
   */
  public async display(
    msg: Message,
    index: number,
    maxPage: number
  ): Promise<Message | undefined> {
    const embed = await this.generateEmbed(index, maxPage);
    if (!embed) return;
    return await msg.edit({
      embeds: [embed],
      components: [Controller.buildController(this)],
    });
  }
  /**
   * Send the page to a given channel
   */
  public async send(
    channel: TextBasedChannel,
    index: number,
    maxPage: number
  ): Promise<Message | undefined> {
    const embed = await this.generateEmbed(index, maxPage);
    if (!embed) return;
    return await channel.send({
      embeds: [embed],
      components: [Controller.buildController(this)],
    });
  }

  /**
   * Generate the embed of the page
   * @param msg
   * @param index
   * @param maxPage
   * @returns
   */
  public async generateEmbed(
    index: number,
    maxPage: number
  ): Promise<EmbedBuilder | undefined> {
    let embed = new EmbedBuilder()
      .setTitle(this._title)
      .setDescription(this._content)
      .setColor(this._color as ColorResolvable)
      .setFooter({ text: `${index}/${maxPage}` });
    return embed;
  }
  /**
   * Getter of the type
   * @returns
   */
  public get type(): string {
    return this._type;
  }
  /**
   * Getter of the title
   * @returns
   */
  public get title(): string {
    return this._title;
  }
  /**
   * Getter of the content
   * @returns
   * @see SIZE_LIMIT
   */
  public get content(): string {
    return this._content;
  }
  /**
   * Getter of the color
   * @returns
   * @see ColorResolvable
   * @see https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable
   */
  public get color(): string {
    return this._color;
  }
}

export default Page;
