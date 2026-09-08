import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly flameIcon: Locator;
  readonly slogan: Locator;
  readonly cartIcon: Locator;
  readonly languageSelector: Locator;
  readonly currencySelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('logo-text');
    this.flameIcon = page.getByTestId('logo-icon');
    this.slogan = page.getByTestId('logo-sub');
    this.cartIcon = page.getByTestId('cart-badge');
    this.languageSelector = page.getByTestId('lang-toggle');
    this.currencySelector = page.getByTestId('currency-toggle');
  }

  async openCart() {
    await this.cartIcon.click();
  }
  async getSlogan() {
    return await this.slogan.innerText();
  }
  async getTitle() {
    return await this.title.innerText();
  }
  async selectLanguage(lang: 'ru' | 'en' | 'la') {
    await this.languageSelector.locator(`[data-lang = "${lang}"]`).click();
  }
  async getActiveLanguage(): Promise<string> {
    const activeLangBtn = this.languageSelector.locator('.lang-btn.active');
    return (await this.page.locator('.lang-btn.active').getAttribute('data-lang')) || '';
  }
  async selectCurrency(currency: 'rub' | 'usd' | 'ducat') {
    await this.currencySelector.locator(`[data-currency = "${currency}"]`).click();
  }
  async getActiveCurrency(): Promise<string> {
    const activeCurrencyBtn = this.currencySelector.locator('.currency-btn.active');
    return (await this.page.locator('.currency-btn.active').getAttribute('data-currency')) || '';
  }
}
