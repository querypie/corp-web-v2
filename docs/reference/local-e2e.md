# Local-only Playwright E2E

This repository keeps browser E2E checks for deployed environments as local-only commands.
They are intentionally separate from `vitest`, `test:run`, and GitHub Actions.

## Purpose

Use these tests when a contact form or similar browser flow needs real page-level verification against the deployed stage site.
They are useful for checking behavior that unit and component tests cannot fully prove, such as rendered form wiring, button enablement, and hosted submit outcomes.

## Current scope

### Contact Us

- Route: `/company/contact-us`
- Default base URL: `https://stage-v2.querypie.com`
- Test file: `tests-local/src/app/company/contact-us/page.e2e.mjs`
- Playwright config: `playwright.local.config.mjs`
- Script: `npm run e2e:local:contact-us:stage`

## How to run

Install dependencies first if needed.

```bash
npm install
npx playwright install chromium
npm run e2e:local:contact-us:stage
```

## Environment overrides

These tests use the following optional environment variables.

- `LOCAL_E2E_BASE_URL`
  - Overrides the default stage base URL.
  - Example: `LOCAL_E2E_BASE_URL=http://127.0.0.1:3000`
- `CONTACT_US_E2E_ROUTE_PATH`
  - Overrides the default route path.
  - Default: `/company/contact-us`
- `CONTACT_US_E2E_EMAIL`
  - Email used for the submit-flow test.
  - Default: `stage-e2e@querypie.ai`
- `CONTACT_US_E2E_MESSAGE`
  - Message used for the submit-flow test.
- `CONTACT_US_EXPECTED_SUBMIT_OUTCOME`
  - Expected submit result for the final assertion.
  - Supported values: `success`, `failure`
  - Default: `success`

Example:

```bash
LOCAL_E2E_BASE_URL=http://127.0.0.1:3000 \
CONTACT_US_EXPECTED_SUBMIT_OUTCOME=success \
npm run e2e:local:contact-us:stage
```

## What the contact-us E2E verifies

1. The deployed page renders the expected English contact form shell.
2. The submit button stays disabled until all required text fields, required select fields, a product checkbox, and the message are filled.
3. A fully valid submission reaches the current hosted outcome and shows either the success screen or the configured failure message expectation.
4. The actual button-click submit regression is covered in `src/components/pages/contact/ContactForm.test.tsx`, while the Playwright submit-flow test uses form submission after the button becomes enabled so the hosted API/UI path can still be checked against the currently deployed target.

## Non-goals

- Do not add these local-only browser checks to CI unless explicitly requested.
- Do not treat them as a replacement for the existing Vitest coverage in `src/components/pages/contact/ContactForm.test.tsx` and related API tests.
- Do not broaden this document to unrelated E2E flows unless those tests are actually added to this repository.
