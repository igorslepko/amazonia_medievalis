import { test, expect } from '@playwright/test';
import { FooterComponent } from '../pages/components/footer';
import { HeaderComponent } from '../pages/components/header';

test.beforeEach(async ({ page }) => {
  await page.goto('/init.html');
});

test('Проверка текста футера на всех языках', async ({ page }) => {
  const allFooterTexts = [
    {
      lang: 'ru',
      footerText:
        '🏰 ДОСТАВЛЯЕМ БЫСТРЕЕ, ЧЕМ ЧУМА ПО ЕВРОПЕ\n© 1347 — 2026 · AMAZONIA MEDIEVALIS · ВСЕ ГРЕХИ ПРОЩЕНЫ',
    },
    {
      lang: 'en',
      footerText:
        '🏰 WE DELIVER FASTER THAN THE PLAGUE ACROSS EUROPE\n© 1347 — 2026 · AMAZONIA MEDIEVALIS · ALL SINS FORGIVEN',
    },
    {
      lang: 'la',
      footerText:
        '🏰 CITIUS QUAM PESTIS PER EUROPA\n© ANNO DOMINI MCCCXLVII — MMXXVI · AMAZONIA MEDIEVALIS · OMNIA PECCATA DIMISSA',
    },
  ];
  const footer = new FooterComponent(page);
  const header = new HeaderComponent(page);
  for (const { lang, footerText } of allFooterTexts) {
    await header.selectLanguage(lang as 'ru' | 'en' | 'la');
    const actualFooterText = await footer.getFooterText();
    expect(actualFooterText).toBe(footerText);
  }
});
