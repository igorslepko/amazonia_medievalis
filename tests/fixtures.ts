import { test as base } from '@playwright/test';
import { MainPage } from '../pages/main';

export const test = base.extend<{ mainPage: MainPage }>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.header.selectLanguage('en');
    await mainPage.header.selectCurrency('usd');
    await use(mainPage);
  },
});
