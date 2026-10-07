import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const booksApiURL = process.env.SIMPLE_BOOKS_API_URL ?? 'https://simple-books-api.click';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }]
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/*.api.spec.ts',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      testIgnore: '**/*.api.spec.ts',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'api',
      testMatch: '**/*.api.spec.ts',
      use: { baseURL: booksApiURL }
    }
  ]
});