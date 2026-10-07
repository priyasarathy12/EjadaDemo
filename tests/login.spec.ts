import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const password = 'secret_sauce';

test.describe('SauceDemo login', () => {
  test('standard user can log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', password);
    await inventoryPage.expectLoaded();
  });

  test('rejects an unknown username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('not_a_user', password);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('rejects an incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'incorrect_password');
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('shows an error when username is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('', password);
    await loginPage.expectError('Username is required');
  });

  test('shows an error when password is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', '');
    await loginPage.expectError('Password is required');
  });

  test('prevents a locked-out user from logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', password);
    await loginPage.expectError('Sorry, this user has been locked out');
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});