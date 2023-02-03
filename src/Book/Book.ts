import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionResponse,
  User,
} from "discord.js";
/**  Book Components */
import Page from "./components/Page/Page";
import TextPage from "./components/Page/TextPage";
import GraphPage from "./components/Page/GraphPage";
import TextPageAgg from "./components/Page/TextPageAgg";
import Controller from "./components/Controller/Controller";
/**
 * Book class
 * @class
 * @author EricP
 * @description Main class for the Book
 */
class Book {
  /** index of the current page */
  _nCurrentPage: number;
  /** pointer of the current page */
  _currentPage: Page | TextPage | TextPageAgg | GraphPage | null = null;
  /** Array containing all the pages */
  _pages: Page[];
  /** Interaction that triggered the book */
  _interaction: ChatInputCommandInteraction;
  /** Interaction response that we'll edit */
  _interactionReply: InteractionResponse;
  /** User that triggered the book */
  _user: User;
  /**
   * Main constructor for the Book
   * @param pages Array of pages
   * @param rootInteraction Interaction that triggered the book
   * @param interactionReply Interaction response that we'll edit
   * @param user User that triggered the book
   */
  constructor(
    pages: Page[],
    rootInteraction: ChatInputCommandInteraction,
    interactionReply: InteractionResponse,
    user: User
  ) {
    this._nCurrentPage = 0;
    this._pages = pages;
    this._user = user;
    this._interaction = rootInteraction;
    this._interactionReply = interactionReply;
    this.loadFirstPage(rootInteraction);
  }
  /**
   * Method to load the first page of the book
   * @param interaction
   * @returns
   */
  public async loadFirstPage(interaction: ChatInputCommandInteraction) {
    if (this._pages.length === 0) return;
    if (!interaction.channel) return;
    this._currentPage = this._pages[0];
    await this._pages[0].send(interaction, 0, this._pages.length);
    this.launchControllerCollector();
  }
  /**
   * Launch the buttons collector and bind the onEvent method
   */
  public async launchControllerCollector() {
    Controller.controllerListener(
      this._interactionReply,
      this._user.id,
      this.onInteractionReceived.bind(this)
    );
  }
  /**
   * onEvent method
   * @param interaction
   */
  public async onInteractionReceived(interaction: ButtonInteraction) {
    switch (interaction.customId) {
      case Controller.NEXT:
        this.nextPage();
        break;
      case Controller.PREVIOUS:
        this.previousPage();
        break;
      case Controller.DOWNLOAD_XLSX:
        if (
          this._currentPage instanceof TextPage ||
          this._currentPage instanceof TextPageAgg
        )
          this._currentPage.sendFile(interaction);

        break;
      case Controller.DOWNLOAD_PNG:
        if (this._currentPage instanceof GraphPage)
          this._currentPage.sendFile(interaction);
        break;
    }
  }
  /** Getter for the currentPage */
  public get currentPage() {
    return this._nCurrentPage + 1;
  }
  /** Getter for the pages */
  public get pages() {
    return this._pages;
  }
  /** Getter for the totalPages */
  public get totalPages() {
    return this._pages.length;
  }
  /** NextPage */
  public nextPage() {
    if (this._nCurrentPage < this.totalPages - 1) this._nCurrentPage++;
    else this._nCurrentPage = 0;
    this.updatePage();
  }
  /** PreviousPage */
  public previousPage() {
    if (this._nCurrentPage > 0) this._nCurrentPage--;
    else this._nCurrentPage = this.totalPages - 1;
    this.updatePage();
  }
  /** Update the page with the new page */
  public async updatePage() {
    if (this._interaction) {
      await this._pages[this._nCurrentPage].display(
        this._interaction,
        this._nCurrentPage,
        this.totalPages
      );
    }
    this._currentPage = this._pages[this._nCurrentPage];
  }
}

export default Book;
