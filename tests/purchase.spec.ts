import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('standard user can order one product from start to finish', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const productName = 'Sauce Labs Backpack';

  await test.step('sign in', async () => {
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();
  });

  await test.step('add exactly one product to the cart', async () => {
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.openCart();
    await cartPage.expectContainsSingleProduct(productName);
  });

  await test.step('complete checkout', async () => {
    await cartPage.checkout();
    await checkoutPage.enterCustomerDetails('Taylor', 'Tester', '90210');
    await checkoutPage.finishOrder();
  });
});