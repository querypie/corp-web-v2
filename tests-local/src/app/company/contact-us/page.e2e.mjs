import { test, expect } from '@playwright/test';

const expectedSubmitOutcome = process.env.CONTACT_US_EXPECTED_SUBMIT_OUTCOME ?? 'success';
const sampleEmail = process.env.CONTACT_US_E2E_EMAIL ?? 'stage-e2e@querypie.ai';
const sampleMessage =
  process.env.CONTACT_US_E2E_MESSAGE ??
  'Stage E2E verification from Hermes. Please ignore this test submission.';
const routePath = process.env.CONTACT_US_E2E_ROUTE_PATH ?? '/company/contact-us';

async function gotoContactUs(page, baseURL) {
  await page.goto(`${baseURL}${routePath}`, { waitUntil: 'networkidle' });
}

async function fillRequiredTextFields(page, { email = sampleEmail, message = sampleMessage } = {}) {
  await page.getByRole('textbox', { name: 'First Name' }).fill('Hermes');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Agent');
  await page.getByRole('textbox', { name: 'Business Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Company Name' }).fill('QueryPie AI');
  await page.getByRole('textbox', { name: 'Department / Title' }).fill('QA Automation');
  await page.getByRole('textbox', { name: 'Questions or Additional Information' }).fill(message);
}

async function selectRequiredChoices(page) {
  await page.locator('select[name="inquiryType"]').selectOption({ label: 'Request for Product Demo' });
  await page.getByRole('checkbox', { name: 'AI Platform QueryPie AIP' }).check();
  await page.locator('select[name="plannedImplementationDate"]').selectOption({ label: 'Within 3 months' });
}

test('contact-us page renders core form fields on stage', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL);

  await expect(page).toHaveTitle('QueryPie Contacts');
  await expect(page.getByRole('heading', { name: 'Connect with our experts. Accelerate your success.' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Business Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
});

test('contact-us page keeps submit disabled until all required fields are satisfied on stage', async ({
  page,
  baseURL,
}) => {
  await gotoContactUs(page, baseURL);

  const submitButton = page.getByRole('button', { name: 'Submit' });

  await fillRequiredTextFields(page);
  await expect(submitButton).toBeDisabled();

  await page.getByRole('checkbox', { name: 'AI Platform QueryPie AIP' }).check();
  await expect(submitButton).toBeDisabled();

  await page.locator('select[name="inquiryType"]').selectOption({ label: 'Request for Product Demo' });
  await expect(submitButton).toBeDisabled();

  await page.locator('select[name="plannedImplementationDate"]').selectOption({ label: 'Within 3 months' });
  await expect(submitButton).toBeEnabled();
});

test('contact-us page submit flow matches the current expected stage outcome', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL);

  await fillRequiredTextFields(page);
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('010-1234-5678');
  await selectRequiredChoices(page);
  await page.getByRole('checkbox', { name: 'Keep me updated on QueryPie news, events, & product info.' }).check();

  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeEnabled();
  await page.locator('form').evaluate((form) => form.requestSubmit());

  if (expectedSubmitOutcome === 'success') {
    await expect(page.getByRole('heading', { name: 'Submission Complete' })).toBeVisible();
    await expect(page.getByText('Our team will review it and get back to you shortly.')).toBeVisible();
    return;
  }

  await expect(page.getByText('Failed to submit the form. Please try again later.')).toBeVisible();
});
