import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

type Book = {
  id: number;
  type: string;
  name: string;
  available: boolean;
};

type Order = {
  id: string;
  bookId: number;
  customerName: string;
};

test.describe('Simple Books API', () => {
  test('reports service status', async ({ request }) => {
    const response = await request.get('/status');

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    await expect(response.json()).resolves.toMatchObject({ status: 'OK' });
  });

  test('filters books by type and respects the limit', async ({ request }) => {
    const response = await request.get('/books', {
      params: { type: 'fiction', limit: 2 }
    });

    expect(response.status()).toBe(200);
    const books = (await response.json()) as Book[];

    expect(books).toHaveLength(2);
    expect(books.every((book) => book.type === 'fiction')).toBe(true);
    expect(books.every((book) => Number.isInteger(book.id) && book.name.length > 0)).toBe(true);
  });

  test('returns a single book and a not-found response for an unknown id', async ({ request }) => {
    const bookResponse = await request.get('/books/1');
    expect(bookResponse.status()).toBe(200);
    await expect(bookResponse.json()).resolves.toMatchObject({ id: 1 });

    const missingBookResponse = await request.get('/books/999999');
    expect(missingBookResponse.status()).toBe(404);
  });

  test('rejects protected order access without a token', async ({ request }) => {
    const listResponse = await request.get('/orders');
    expect(listResponse.status()).toBe(401);

    const createResponse = await request.post('/orders', {
      data: { bookId: 1, customerName: 'Unauthenticated Request' }
    });
    expect(createResponse.status()).toBe(401);
  });

  test('creates, reads, updates, and deletes an authenticated order', async ({ request }) => {
    const unique = randomUUID();
    const clientName = `Playwright ${unique}`;
    const clientEmail = `playwright-${unique}@example.com`;
    const registrationResponse = await request.post('/api-clients/', {
      data: { clientName, clientEmail }
    });

    expect(registrationResponse.status()).toBe(201);
    const registration = (await registrationResponse.json()) as { accessToken: string };
    expect(registration.accessToken).toBeTruthy();

    const headers = { Authorization: `Bearer ${registration.accessToken}` };
    const createResponse = await request.post('/orders', {
      headers,
      data: { bookId: 1, customerName: 'Initial Customer' }
    });

    expect(createResponse.status()).toBe(201);
    const created = (await createResponse.json()) as { created: boolean; orderId: string };
    expect(created.created).toBe(true);
    expect(created.orderId).toBeTruthy();

    const listResponse = await request.get('/orders', { headers });
    expect(listResponse.status()).toBe(200);
    const orders = (await listResponse.json()) as Order[];
    expect(orders.some((order) => order.id === created.orderId)).toBe(true);

    const getResponse = await request.get(`/orders/${created.orderId}`, { headers });
    expect(getResponse.status()).toBe(200);
    await expect(getResponse.json()).resolves.toMatchObject({
      id: created.orderId,
      bookId: 1,
      customerName: 'Initial Customer'
    });

    const updatedName = 'Updated Customer';
    const updateResponse = await request.patch(`/orders/${created.orderId}`, {
      headers,
      data: { customerName: updatedName }
    });
    expect(updateResponse.status()).toBe(204);

    const updatedOrderResponse = await request.get(`/orders/${created.orderId}`, { headers });
    expect(updatedOrderResponse.status()).toBe(200);
    await expect(updatedOrderResponse.json()).resolves.toMatchObject({ customerName: updatedName });

    const deleteResponse = await request.delete(`/orders/${created.orderId}`, { headers });
    expect(deleteResponse.status()).toBe(204);

    const deletedOrderResponse = await request.get(`/orders/${created.orderId}`, { headers });
    expect(deletedOrderResponse.status()).toBe(404);
  });
});