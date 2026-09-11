import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { ToastComponent } from './components/toast';

export class MainPage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly toast: ToastComponent;
  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.toast = new ToastComponent(page);
    this.searchButton = page.getByTestId('search-btn');
  }

  async goto() {
    await this.page.goto('/init.html');
  }
}
