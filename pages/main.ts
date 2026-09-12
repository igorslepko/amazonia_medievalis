import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { ToastComponent } from './components/toast';

export class MainPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly toast: ToastComponent;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly categoriesPanel: Locator;
  readonly productGrid: Locator;
  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.toast = new ToastComponent(page);
    this.searchButton = page.getByTestId('search-btn');
    this.searchInput = page.getByTestId('search-input');
    this.categoriesPanel = page.getByTestId('categories');
    this.productGrid = page.getByTestId('products-grid');
  }

  async goto() {
    await this.page.goto('/init.html');
  }
  // собираем локатор по названию категории
  categotyButton(category: 'all' | 'clothing' | 'books' | 'inquisition'): Locator {
    return this.page.locator(`[data-cat="${category}"]`);
  }

  async filterBy(category: 'all' | 'clothing' | 'books' | 'inquisition'): Promise<void> {
    await this.categotyButton(category).click();
  }
}

/*
tbd
  async expectVisibleProducts(ids: number[]): Promise<void> {
    for (const id of ids) {
      await expect(this.page.getByTestId(`product-${id}`)).toBeVisible();
    }
  }

  async expectHiddenProducts(ids: number[]): Promise<void> {
    for (const id of ids) {
      await expect(this.page.getByTestId(`product-${id}`)).not.toBeVisible();
    }
  }

  async expectEmptyCategory(): Promise<void> {
    await expect(this.productGrid).toContainText('пусто');
  }
}
  */
