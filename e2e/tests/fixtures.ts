import { test as base } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

type Fixtures = {
  mainPage: MainPage;
  mainPageWithCart: MainPage;
};

export const test = base.extend<Fixtures>({
  mainPage: async ({ page }, use) => {
    await page.route('**/api/products', async (route) => {
      const returned_products_all = [
        {
          id: 1,
          emoji: '🧻',
          category: 'books',
          name: 'Свитки для уединения',
          desc: 'Пока сидишь — читаешь. Мудрые изречения и забавные истории. Два в одном!',
          price: 333,
          oldPrice: null,
        },
        {
          id: 2,
          emoji: '🧥',
          category: 'clothing',
          name: 'Мантия "Переживший Чуму"',
          desc: 'Ограниченный тираж 1348 года. Согреет после любого апокалипсиса. 100% шерсть.',
          price: 600,
          oldPrice: null,
        },
        {
          id: 3,
          emoji: '🔒',
          category: 'clothing',
          name: 'Пояс верности',
          desc: 'Первое в мире средство контрацепции. Надёжно, как каменная стена.',
          price: 1500,
          oldPrice: null,
        },
        {
          id: 4,
          emoji: '📜',
          category: 'books',
          name: 'Индульгенция на неделю',
          desc: 'Все грехи прощены до следующего вторника. Действует только на этой неделе.',
          price: 500,
          oldPrice: null,
        },
        {
          id: 5,
          emoji: '🐴',
          category: null,
          name: 'Запасная лошадь',
          desc: 'Никогда не знаешь, когда понадобится.',
          price: 1800,
          oldPrice: 2500,
        },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(returned_products_all),
      });
    });
    await page.route('**/api/products?lang=ru&category=clothing', async (route) => {
      const returned_products_clothing = [
        {
          id: 2,
          emoji: '🧥',
          category: 'clothing',
          name: 'Мантия "Переживший Чуму"',
          desc: 'Ограниченный тираж 1348 года. Согреет после любого апокалипсиса. 100% шерсть.',
          price: 600,
          oldPrice: null,
        },
        {
          id: 3,
          emoji: '🔒',
          category: 'clothing',
          name: 'Пояс верности',
          desc: 'Первое в мире средство контрацепции. Надёжно, как каменная стена.',
          price: 1500,
          oldPrice: null,
        },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(returned_products_clothing),
      });
    });
    await page.route('**/api/products?lang=ru&category=books', async (route) => {
      const returned_products_books = [
        {
          id: 1,
          emoji: '🧻',
          category: 'books',
          name: 'Свитки для уединения',
          desc: 'Пока сидишь — читаешь. Мудрые изречения и забавные истории. Два в одном!',
          price: 333,
          oldPrice: null,
        },
        {
          id: 4,
          emoji: '📜',
          category: 'books',
          name: 'Индульгенция на неделю',
          desc: 'Все грехи прощены до следующего вторника. Действует только на этой неделе.',
          price: 500,
          oldPrice: null,
        },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(returned_products_books),
      });
    });

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
