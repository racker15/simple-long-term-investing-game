import { test, expect } from '@playwright/test';

test('historical preview holds outcomes until investment and keeps production sessions separate', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  const historicalOutcomeRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (/1999-09\/(future_outcomes|provenance)/.test(request.url()))
      historicalOutcomeRequests.push(request.url());
  });
  await page.goto('/?scenario=1999-09');
  await expect(
    page.getByRole('heading', { name: 'September 30, 1999' }),
  ).toBeVisible();
  await expect(
    page.getByText('Single-scenario development preview.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Serena Williams wins the US Open', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Dreamcast arrives amid gaming excitement', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(7);
  await expect(page.getByRole('button', { name: 'Begin session' })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('heading', { name: 'See what happened' }),
  ).toHaveCount(0);
  await expect(
    page.getByText('The Nasdaq reaches its technology-boom peak', {
      exact: true,
    }),
  ).toHaveCount(0);
  expect(historicalOutcomeRequests).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('historical-decision.png'),
    fullPage: true,
  });
  await page
    .getByRole('button', { name: 'Add $500 to Microsoft', exact: true })
    .click();
  await page.getByRole('radio', { name: 'Microsoft', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  expect(historicalOutcomeRequests).toEqual([]);
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Five years later' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Major events during the period',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Major events during the fictional period',
    }),
  ).toHaveCount(0);
  expect(historicalOutcomeRequests.length).toBeGreaterThanOrEqual(2);
  await page.getByText('Monthly values', { exact: true }).click();
  await expect(page.locator('figure tbody tr')).toHaveCount(60);
  await expect(page.locator('figure tbody tr').first()).toContainText(
    '1999-10',
  );
  await expect(page.locator('figure tbody tr').last()).toContainText('2004-09');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('historical-reveal.png'),
    fullPage: true,
  });
  expect(
    await page.evaluate(() =>
      localStorage.getItem('investing-game:development-active:v1'),
    ),
  ).toBeNull();
  await page.getByRole('button', { name: 'Restart preview' }).click();
  await expect(
    page.getByRole('heading', { name: 'September 30, 1999' }),
  ).toBeVisible();
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Begin session' }),
  ).toBeVisible();
  await expect(
    page.getByText('Development mode — all content is fictional.', {
      exact: true,
    }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
