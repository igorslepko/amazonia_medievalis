import { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly searchButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByTestId('search-btn');
  }

  //   async navigate() {
  //     await this.page.goto('https://osstep.github.io/cart');
  //   }
}
