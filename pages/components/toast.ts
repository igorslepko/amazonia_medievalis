import { Locator, Page } from '@playwright/test';

export class ToastComponent {
  readonly page: Page;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toast = page.getByTestId('toast');
  }
  async getToastText() {
    return await this.toast.innerText();
  }
}
