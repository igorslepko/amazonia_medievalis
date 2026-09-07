import { test, expect } from '@playwright/test';
import { MainPage } from '../../pages/ts/main';

test.beforeEach(async ({ page }) => {
  await page.goto('/init.html');
});

test('Проверка тоста при пустом поиске', async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.searchButton.click();
  await expect(page.getByTestId('toast')).toContainText('Напиши что-нибудь, грешник!');
});
