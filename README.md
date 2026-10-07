# SauceDemo Playwright Framework

Cross-browser UI automation for [SauceDemo](https://www.saucedemo.com/) using TypeScript and Playwright Test. The suite covers successful and unsuccessful login paths, a locked-out account, and a complete checkout of one product.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```powershell
npm install
npx playwright install chromium firefox
```

Copy `.env.example` to `.env` only if you need to customize the base URL. Playwright reads `BASE_URL` directly from the process environment; for example:

```powershell
$env:BASE_URL = 'https://www.saucedemo.com'
```

SauceDemo's public sample accounts and password are used by the tests. The login test suite verifies `standard_user`, invalid usernames/passwords, missing fields, and `locked_out_user`.

## Run Tests

```powershell
npm test                  # Chromium and Firefox, in parallel
npm run test:api           # Simple Books API tests
npm run test:chromium     # Chromium only
npm run test:firefox      # Firefox only
npm run test:headed       # Show the browser UI
npm run test:debug        # Playwright Inspector/debug mode
```

The Playwright configuration enables fully parallel test execution. By default, Playwright chooses the worker count based on available resources; CI runs use two workers and retry failures twice. Override workers when needed with `npx playwright test --workers=4`.

The API suite targets `https://simple-books-api.click` by default. Set `SIMPLE_BOOKS_API_URL` in the environment or `.env` to use another compatible API endpoint.

## Reports

Every run creates a Playwright HTML report and Allure result files:

```powershell
npx playwright show-report
npm run report:allure
npm run report:open
```

The HTML report is written to `playwright-report/`. Allure's generated report is written to `allure-report/`; both folders and raw test results are ignored by Git.

## Structure

```text
pages/                 Page Object Model classes
tests/                 Login and purchase scenarios
playwright.config.ts   Browser projects, parallelism, and reporters
```