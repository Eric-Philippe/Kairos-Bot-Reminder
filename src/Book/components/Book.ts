import { Message } from "discord.js";
import Page from "./Page/Page";

class Book {
  _currentPage: number;
  _pages: Page[];
  _message: Message | null = null;

  constructor(pages: Page[], rootMsg: Message) {
    this._currentPage = 0;
    this._pages = pages;
    this.loadFirstPage(rootMsg);
  }

  public async loadFirstPage(msg: Message) {
    let m = await this._pages[0].display(msg, 1, this.totalPages);
    if (m) this._message = m;
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
    return this._currentPage;
  }

  public previousPage() {
    if (this._currentPage > 0) this._currentPage--;
    return this._currentPage;
  }
}

export default Book;
