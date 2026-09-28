import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartModal: Locator;
  readonly cleanCartButton: Locator;
  readonly closeCartButton: Locator;
  readonly emptyCartText: Locator;
  readonly cartItemCounter: Locator;
  readonly cartItems: Locator;
  readonly itemRemoveButton: Locator;
  readonly cartTotal: Locator;
  constructor(page: Page) {
    this.page = page;
    this.cartModal = page.locator('.cartModal');
    this.cleanCartButton = page.locator('.clear-btn');
    this.closeCartButton = page.locator('modal-close-btn');
    this.emptyCartText = page.locator('.cart-empty');
    this.cartItemCounter = page.locator('.cart-total');
    this.cartItems = page.locator('#cartItems');
    this.itemRemoveButton = page.locator('.item-remove');
    this.cartTotal = page.locator('#cartTotal');
  }

  async removeItem(itemNumber: number): Promise<void> {
    await this.page.locator('.cart-item').nth(itemNumber).locator('.item-remove').click();
  }
}
