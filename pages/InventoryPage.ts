import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly heading: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Products', { exact: true });
    this.cartLink = page.locator('a.shopping_cart_link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.heading).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}