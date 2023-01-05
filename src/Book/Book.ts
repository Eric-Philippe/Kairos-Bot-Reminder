import { ChatInputCommandInteraction, Message, User } from "discord.js";
import Page from "./components/Page/Page";
import Controller from "./components/Controller/Controller";
import { channel } from "diagnostics_channel";

class Book {
  _currentPage: number;
  _pages: Page[];
  _message: Message | null = null;
  _user: User;

  constructor(
    pages: Page[],
    rootInteraction: ChatInputCommandInteraction,
    user: User
  ) {
    this._currentPage = 0;
    this._pages = pages;
    this._user = user;
    this.loadFirstPage(rootInteraction);
  }

  public async loadFirstPage(interaction: ChatInputCommandInteraction) {
    if (this._pages.length === 0) return;
    if (!interaction.channel) return;
    let m = await this._pages[0].send(interaction.channel, 1, this.totalPages);
    interaction.reply({ content: "Here are your results !" });
    if (m) {
      this._message = m;
      this.launchControllerCollector(m);
    }
  }

  public async launchControllerCollector(m: Message) {
    Controller.controllerListener(
      m,
      this._user.id,
      this.onInteractionReceived.bind(this)
    );
  }

  public async onInteractionReceived(interactionId: string) {
    if (interactionId === "next") {
      this.nextPage();
    } else if (interactionId === "previous") {
      this.previousPage();
    }
  }

  public get currentPage() {
    return this._currentPage + 1;
  }

  public get pages() {
    return this._pages;
  }

  public get totalPages() {
    return this._pages.length;
  }

  public nextPage() {
    if (this._currentPage < this.totalPages - 1) this._currentPage++;
    else this._currentPage = 0;
    this.updatePage();
  }

  public previousPage() {
    if (this._currentPage > 0) this._currentPage--;
    else this._currentPage = this.totalPages - 1;
    this.updatePage();
  }

  public async updatePage() {
    if (this._message) {
      let m = await this._pages[this._currentPage].display(
        this._message,
        this.currentPage,
        this.totalPages
      );
      if (m) {
        this._message = m;
      }
    }
  }
}

export default Book;
