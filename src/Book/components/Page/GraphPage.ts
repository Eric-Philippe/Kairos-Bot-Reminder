import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
const ChartJsImage = require("chartjs-to-image");

import Page from "./Page";

import GraphManager from "../GraphManager/GraphManager";
import PolarData from "../GraphManager/polar.data";
import DonutData from "../GraphManager/donut.data";
import BarData from "../GraphManager/bar.data";
/**
 * A GraphPage of a book
 * @extends Page
 * @see Page
 * @see Book
 */
class GraphPage extends Page {
  private _graph: any; // ChartJsImage
  /**
   * @param title
   * @param content
   * @param color
   */
  constructor(title: string, content: string, color: string = "#5865F2") {
    super(title, content, color);
  }
  /**
   * Setter for the graph
   */
  public setGraph(type: string, data: BarData | DonutData | PolarData) {
    this._graph = GraphManager.generateGraph(type, data);
  }
  /**
   * Generate the .png file of the graph
   */
  public async generateFile() {
    if (!this._graph) return;
    try {
      GraphManager.chartToPng(this._graph);
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Reply to a given interaction with the .png file of the graph
   * @param interaction
   * @returns
   */
  public async sendFile(interaction: ChatInputCommandInteraction) {
    if (!this._graph) return;
    const attachment = await GraphManager.chartToBuffer(this._graph);
    if (interaction.replied)
      await interaction.editReply({ files: [attachment] });
    else await interaction.reply({ files: [attachment] });
  }
  /**
   * Getter for the graph
   * @returns
   */
  public get graph() {
    return this._graph;
  }
  /**
   * Override of the Page's method "generateEmbed" to add the graph to the embed
   */
  public override async generateEmbed(
    index: number,
    maxPage: number
  ): Promise<EmbedBuilder | undefined> {
    if (!this._graph) return;
    const embed = await super.generateEmbed(index, maxPage);
    if (!embed) return;
    embed.setImage("attachment://graph.png");
    return embed;
  }
  /**
   * Override of the Page's method "display" to add the graph to the embed
   */
  public override async display(
    msg: Message<boolean>,
    index: number,
    maxPage: number
  ): Promise<Message<boolean> | undefined> {
    if (!this._graph) return;
    const embed = await this.generateEmbed(index, maxPage);
    if (!embed) return;
    return await msg.edit({ embeds: [embed] });
  }
}

export default GraphPage;
