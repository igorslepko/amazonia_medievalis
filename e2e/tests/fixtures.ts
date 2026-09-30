import { test as base } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

type Fixtures = {
  mainPage: MainPage;
  mainPageWithCart: MainPage;
};

export const test = base.extend<Fixtures>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.header.selectLanguage('en');
    await mainPage.header.selectCurrency('usd');
    await use(mainPage);
  },

  mainPageWithCart: async ({ mainPage }, use) => {
    await mainPage.addToCart(1);
    await mainPage.addToCart(2);
    await use(mainPage);
  },
});
