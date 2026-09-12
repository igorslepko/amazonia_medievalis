import { expect } from '@playwright/test';
import { test } from './fixtures';

test('Empty search toast check - all languages (ru, en, la)', async ({ mainPage }) => {
  const expectedTextData = [
    { lang: 'ru', text: 'Напиши что-нибудь, грешник!' },
    { lang: 'en', text: 'Write something, sinner!' },
    { lang: 'la', text: 'ALIQUID SCRIBE, PECCATOR!' },
  ];
  for (const { lang, text } of expectedTextData) {
    await mainPage.header.selectLanguage(lang as 'ru' | 'en' | 'la');
    await mainPage.searchButton.click();
    const actualToastText = await mainPage.toast.getToastText();
    expect(actualToastText).toContain(text);
    console.log(actualToastText);
  }
});

[
  { lang: 'ru', text: 'Напиши что-нибудь, грешник!' },
  { lang: 'en', text: 'Write something, sinner!' },
  { lang: 'la', text: 'ALIQUID SCRIBE, PECCATOR!' },
].forEach(({ lang, text }) => {
  test(`Empty search toast check with ${lang} language`, async ({ mainPage }) => {
    await mainPage.header.selectLanguage(lang as 'ru' | 'en' | 'la');
    await mainPage.searchButton.click();
    const actualToastText = await mainPage.toast.getToastText();
    expect(actualToastText).toContain(text);
    console.log(actualToastText);
  });
});
