import { Locator, Page } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;
  footer: Locator;
  constructor(page: Page) {
    this.page = page;
    this.footer = page.getByTestId('footer');
  }

  async getFooterText() {
    return await this.footer.innerText();
  }
}
