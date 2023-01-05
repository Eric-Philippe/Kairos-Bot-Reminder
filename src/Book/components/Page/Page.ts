import { Message, EmbedBuilder, ColorResolvable } from "discord.js";

/** The maximum size of a page's content */
const SIZE_LIMIT = 4096;
/** The maximum size of a page's title */
const TITLE_LIMIT = 256;
/**
 * A page of a book
 */
class Page {
  _title: string;
  _content: string;
  _color: string;
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
  ): Promise<Message> {
    const embed = await this.generateEmbed(msg, index, maxPage);
    return await msg.edit({ embeds: [embed] });
  }
  /**
   * Generate the embed of the page
   * @param msg
   * @param index
   * @param maxPage
   * @returns
   */
  public async generateEmbed(msg: Message, index: number, maxPage: number) {
    let embed = new EmbedBuilder()
      .setTitle(this._title)
      .setDescription(this._content)
      .setColor(this._color as ColorResolvable)
      .setFooter({ text: `${index}/${maxPage}` });
    return embed;
  }
}

export default Page;
