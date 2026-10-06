import { test, expect, type Page } from '@playwright/test';
const key = 'investing-game:historical-history:v1';
async function invest(page: Page) {
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
}
async function history(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
}
test('real historical session completes, restores, archives once and chooses unseen dates', async ({
  page,
}) => {
  const futureRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('future_outcomes'))
      futureRequests.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByText('50 unseen scenarios available.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByLabel('How many scenarios?')).toHaveValue('10');
  await page.getByLabel('How many scenarios?').selectOption('5');
  await page.getByRole('button', { name: 'Begin session' }).click();
  const queue = (await history(page)).active.scenario_ids;
  expect(new Set(queue).size).toBe(5);
  expect(futureRequests).toHaveLength(0);
  await expect(
    page.getByRole('heading', { name: 'Important vs. random history' }),
  ).toHaveCount(0);
  await page.reload();
  expect((await history(page)).active.scenario_ids).toEqual(queue);
  for (let i = 0; i < 5; i++) {
    await invest(page);
    if (i === 0) {
      await page.reload();
      await expect(
        page.getByRole('heading', { name: 'Expectation vs. reality' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Review decision' }),
      ).toHaveCount(0);
      expect((await history(page)).active.completed).toHaveLength(1);
    }
    await page
      .getByRole('button', {
        name: i === 4 ? 'View final scorecard' : 'Next scenario',
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole('heading', { name: 'How you did', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'How you did', exact: true }),
  ).toBeVisible();
  expect((await history(page)).finished).toHaveLength(1);
  await expect(
    page.getByText('Development scorecard', { exact: false }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Start new session' }).click();
  await expect(
    page.getByText('45 unseen scenarios available.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Begin session' }).click();
  expect(
    (await history(page)).active.scenario_ids.every(
      (id: string) => !queue.includes(id),
    ),
  ).toBe(true);
});
test('checkpoint can end a historical session after five rounds and reopen its scorecard', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  for (let i = 0; i < 5; i++) {
    await invest(page);
    await page
      .getByRole('button', { name: 'Next scenario', exact: true })
      .click();
  }
  await expect(
    page.getByRole('heading', { name: 'How you are doing — Scenarios 1–5' }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'End session now' }).click();
  await expect(
    page.getByRole('heading', { name: 'Overall session — 5 scenarios' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Start new session' }).click();
  await page.getByText('Past session scorecards (1)', { exact: true }).click();
  await page.getByRole('button', { name: /View 5-scenario session/ }).click();
  await expect(
    page.getByRole('heading', { name: 'How you did', exact: true }),
  ).toBeVisible();
  expect((await history(page)).finished).toHaveLength(1);
});
test('failed outcome fetch retains committed choice through refresh and retry', async ({
  page,
}) => {
  await page.route('**/*future_outcomes*', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('button', { name: 'Retry loading' }),
  ).toBeVisible();
  expect((await history(page)).pending.expected).toBe('cash');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Retry loading' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Review decision' }),
  ).toHaveCount(0);
  await page.unroute('**/*future_outcomes*');
  // Retry reloads the document while retaining the committed decision.
  await page.getByRole('button', { name: 'Retry loading' }).click();
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
  expect((await history(page)).active.completed).toHaveLength(1);
  expect((await history(page)).pending).toBeNull();
});
test('invalid saved historical progress shows a recoverable warning', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate((k) => localStorage.setItem(k, '{broken'), key);
  await page.reload();
  await expect(
    page.getByText('Saved progress could not be read.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Begin session' }).click();
  await expect(
    page.getByText('Scenario 1 of 10', { exact: true }),
  ).toBeVisible();
});

test('long sessions expose all available multiples of five without leaking outcomes', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#session-length option')).toHaveCount(10);
  await page.getByLabel('How many scenarios?').selectOption('50');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await expect(
    page.getByText('Scenario 1 of 50', { exact: true }),
  ).toBeVisible();
  expect(new Set((await history(page)).active.scenario_ids).size).toBe(50);
  await page.reload();
  await expect(
    page.getByText('Scenario 1 of 50', { exact: true }),
  ).toBeVisible();
});
