import { expect } from '@playwright/test';
import { test } from './fixtures';
import { CartPage } from '../pages/CartPage';

test('Cart items counter on main page header shows correct values (default  = 2 as per fixture)', async ({
  mainPageWithCart,
}) => {
  await expect(mainPageWithCart.header.cartIcon.locator('.cart-count')).toHaveText('2');
});

test('Cart items counter in cart modal shows correct values (default  = 2 as per fixture)', async ({
  mainPageWithCart,
}) => {
  await mainPageWithCart.header.openCart();
  await expect(mainPageWithCart.cart.cartItems.locator('.cart-item')).toHaveCount(2);
});
test('Button clean cleans cart as expected - no items remain', async ({
  mainPageWithCart,
  page,
}) => {
  await mainPageWithCart.header.openCart();
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Clear the chest, sinner?');
    dialog.accept();
  });
  await mainPageWithCart.cart.cleanCartButton.click();
  await expect(mainPageWithCart.cart.cartItems.locator('.cart-item')).toHaveCount(0);
  await expect(mainPageWithCart.cart.emptyCartText).toBeVisible();
});
test('Button remove item removes item from cart as expected', async ({
  mainPageWithCart,
  page,
}) => {
  await mainPageWithCart.header.openCart();
  await mainPageWithCart.cart.removeItem(0);
  await expect(mainPageWithCart.cart.cartItems.locator('.cart-item')).toHaveCount(1);
  await expect(mainPageWithCart.cart.cartTotal).toHaveText('TOTAL: 6.60 $');
});
