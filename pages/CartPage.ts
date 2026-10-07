import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async expectContainsSingleProduct(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    const cartItems = this.page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.first()).toContainText(productName);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}