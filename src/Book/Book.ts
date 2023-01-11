import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionResponse,
  User,
} from "discord.js";
import Page from "./components/Page/Page";
import Controller from "./components/Controller/Controller";
import TextPage from "./components/Page/TextPage";
import TextPageAgg from "./components/Page/TextPageAgg";
import GraphPage from "./components/Page/GraphPage";

class Book {
  _nCurrentPage: number;
  _currentPage: Page | TextPage | TextPageAgg | GraphPage | null = null;
  _pages: Page[];
  _interaction: ChatInputCommandInteraction;
  _interactionReply: InteractionResponse;
  _user: User;

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

  public async loadFirstPage(interaction: ChatInputCommandInteraction) {
    if (this._pages.length === 0) return;
    if (!interaction.channel) return;
    this._currentPage = this._pages[0];
    await this._pages[0].send(interaction, 0, this._pages.length);
    this.launchControllerCollector();
  }

  public async launchControllerCollector() {
    Controller.controllerListener(
      this._interactionReply,
      this._user.id,
      this.onInteractionReceived.bind(this)
    );
  }

  public async onInteractionReceived(interaction: ButtonInteraction) {
    switch (interaction.customId) {
      case "next":
        this.nextPage();
        break;
      case "previous":
        this.previousPage();
        break;
      case "download_xlsx":
        if (
          this._currentPage instanceof TextPage ||
          this._currentPage instanceof TextPageAgg
        )
          this._currentPage.sendFile(interaction);

        break;
      case "download_png":
        if (this._currentPage instanceof GraphPage)
          this._currentPage.sendFile(interaction);
        break;
    }
  }

  public get currentPage() {
    return this._nCurrentPage + 1;
  }

  public get pages() {
    return this._pages;
  }

  public get totalPages() {
    return this._pages.length;
  }

  public nextPage() {
    if (this._nCurrentPage < this.totalPages - 1) this._nCurrentPage++;
    else this._nCurrentPage = 0;
    this.updatePage();
  }

  public previousPage() {
    if (this._nCurrentPage > 0) this._nCurrentPage--;
    else this._nCurrentPage = this.totalPages - 1;
    this.updatePage();
  }

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
