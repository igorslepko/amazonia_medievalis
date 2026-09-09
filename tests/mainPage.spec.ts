import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main';
import { HeaderComponent } from '../pages/components/header';

test.beforeEach(async ({ page }) => {
  await page.goto('/init.html');
});

test('Empty search toast check - all languages (ru, en, la)', async ({ page }) => {
  const expectedTextData = [
    { lang: 'ru', text: 'Напиши что-нибудь, грешник!' },
    { lang: 'en', text: 'Write something, sinner!' },
    { lang: 'la', text: 'ALIQUID SCRIBE, PECCATOR!' },
  ];
  const mainPage = new MainPage(page);
  const header = new HeaderComponent(page);
  for (const { lang, text } of expectedTextData) {
    await header.selectLanguage(lang as 'ru' | 'en' | 'la');
    await mainPage.searchButton.click();
    const actualToastText = await page.getByTestId('toast').innerText();
    expect(actualToastText).toContain(text);
  }
});
