import {
  AttachmentBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  User,
} from "discord.js";
const ChartJsImage = require("chartjs-to-image");

import Page from "./Page";

import GraphManager from "../GraphManager/GraphManager";
import PolarData from "../GraphManager/polar.data";
import DonutData from "../GraphManager/donut.data";
import BarData from "../GraphManager/bar.data";
import BodyGuardData from "../GraphManager/bodyguard.data";
import Controller from "../Controller/Controller";
/**
 * A GraphPage of a book
 * @extends Page
 * @see Page
 * @see Book
 */
class GraphPage extends Page {
  protected _type = "PAGE_GRAPH";
  private _dataSets: BarData | DonutData | PolarData;
  private _graphType: string;
  private _graph: any; // ChartJsImage
  private _graphTitle: string | null;
  /**
   * @param title
   * @param user
   * @param data
   * @param dataType {('bar' | 'doughnut' | 'polarArea')}
   * @param color
   */
  constructor(
    title: string,
    user: User,
    data: BarData | DonutData | PolarData,
    dataType: string,
    graphTitle: string | null = null,
    color: string = "#5865F2"
  ) {
    super(title, "🍩", user, color);
    this._dataSets = data;
    this._graphTitle = graphTitle;

    if (dataType == "bar" && BodyGuardData.isBarData(data))
      this._graphType = dataType;
    else if (dataType == "doughnut" && BodyGuardData.isDonutData(data))
      this._graphType = dataType;
    else if (dataType == "polarArea" && BodyGuardData.isPolarData(data))
      this._graphType = dataType;
    else throw new Error("Invalid data");
    this._graph = GraphManager.generateGraph(this._graphType, data);
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
  public async sendFile(
    interaction: ButtonInteraction | ChatInputCommandInteraction
  ) {
    if (!this.graph) return;
    const attachment = await GraphManager.chartToBuffer(this._graph);
    if (interaction.replied)
      await interaction.followUp({ files: [attachment], ephemeral: true });
    else await interaction.reply({ files: [attachment], ephemeral: true });
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
    embed.setDescription(this._graphTitle);
    embed.setThumbnail(null);
    embed.setImage("attachment://graph.png");
    return embed;
  }
  /**
   * Override of the Page's method "display" to add the graph to the embed
   */
  public override async display(
    interaction: ChatInputCommandInteraction,
    index: number,
    maxPage: number
  ) {
    if (!this._graph) return;
    const embed = await this.generateEmbed(index, maxPage);
    if (!embed) return;
    let attachment = new AttachmentBuilder(
      await GraphManager.chartToBuffer(this._graph)
    );
    attachment.setName("graph.png");
    await interaction.editReply({
      embeds: [embed],
      files: [attachment],
      components: Controller.buildController(this),
    });
  }
}

export default GraphPage;
