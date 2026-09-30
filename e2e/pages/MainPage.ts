import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { ToastComponent } from './components/toast';
import { CartPage } from './CartPage';

export class MainPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly toast: ToastComponent;
  readonly cart: CartPage;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly categoriesPanel: Locator;
  readonly productGrid: Locator;
  readonly addToCartButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.toast = new ToastComponent(page);
    this.cart = new CartPage(page);
    this.searchButton = page.getByTestId('search-btn');
    this.searchInput = page.getByTestId('search-input');
    this.categoriesPanel = page.getByTestId('categories');
    this.productGrid = page.getByTestId('products-grid');
    this.addToCartButton = page.locator('.add-btn');
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

  async addToCart(productId: number): Promise<void> {
    await this.page.getByTestId(`product-${productId}`).locator('.add-btn').click();
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
