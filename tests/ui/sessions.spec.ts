import { readFileSync } from 'node:fs';
import { percent } from '../../app/src/lib/format';
import { finishReplay } from './replay-helpers';
import { test, expect, type Page } from '@playwright/test';
const key = 'investing-game:historical-history:v1';
async function invest(page: Page) {
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await finishReplay(page);
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
}
async function history(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
}
test('real historical session completes, restores, archives once and chooses unseen dates', async ({
  page,
}, testInfo) => {
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
  await page.screenshot({
    path: testInfo.outputPath('session-start.png'),
    fullPage: true,
  });
  await page.getByLabel('How many scenarios?').selectOption('5');
  await page.getByRole('button', { name: 'Begin session' }).click();
  const queue = (await history(page)).active.scenario_ids;
  expect(new Set(queue).size).toBe(5);
  expect(futureRequests).toHaveLength(0);
  await page.screenshot({
    path: testInfo.outputPath('session-decision.png'),
    fullPage: true,
  });
  await expect(
    page.getByRole('heading', { name: 'Important vs. random history' }),
  ).toHaveCount(0);
  await page.reload();
  expect((await history(page)).active.scenario_ids).toEqual(queue);
  for (let i = 0; i < 5; i++) {
    await invest(page);
    if (i === 0) {
      await page.screenshot({
        path: testInfo.outputPath('session-reveal.png'),
        fullPage: true,
      });
      await page
        .getByText('What do these numbers mean?', { exact: true })
        .click();
      await expect(
        page.getByText('A fall from an earlier high.', { exact: false }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.reload();
      await finishReplay(page);
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
  await page.screenshot({
    path: testInfo.outputPath('session-final.png'),
    fullPage: true,
  });
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
  await expect(
    page.getByText('Your learning history — 5 scenarios', { exact: true }),
  ).toBeVisible();
  await page
    .getByText('Your learning history — 5 scenarios', { exact: true })
    .click();
  await page.screenshot({
    path: testInfo.outputPath('session-history.png'),
    fullPage: true,
  });
  const beforePractice = await history(page);
  await page
    .getByText('Practice a completed scenario', { exact: true })
    .click();
  await page
    .getByRole('button', { name: /^Replay / })
    .first()
    .click();
  await expect(
    page.getByText('Practice replay.', { exact: true }),
  ).toBeVisible();
  const practiceKey = `investing-game:practice:${beforePractice.finished[0].completed[0].scenario_id}:v1`;
  await page
    .getByRole('button', { name: 'Add $500 to Bonds', exact: true })
    .click();
  await page.evaluate((k) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw new DOMException('Quota full', 'QuotaExceededError');
      original.call(this, key, value);
    };
  }, practiceKey);
  await invest(page);
  await expect(
    page.getByText('Practice progress could not be saved.', { exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate((k) => localStorage.getItem(k), `${practiceKey}:draft`),
  ).not.toBeNull();
  await page.reload();
  await expect(page.getByLabel('Bonds allocation', { exact: true })).toHaveText(
    '$500',
  );
  await expect(
    page.getByRole('radio', { name: 'Cash', exact: true }),
  ).toBeChecked();
  await invest(page);
  await page.reload();
  await finishReplay(page);
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
  expect(await history(page)).toEqual(beforePractice);
  await page
    .getByRole('button', { name: 'Try another practice choice' })
    .click();
  await expect(
    page.getByRole('button', { name: 'Review decision' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Back to sessions' }).click();
  expect(await history(page)).toEqual(beforePractice);

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
  await finishReplay(page);
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

test('year-one and year-three pauses show only returns reached so far', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  const id = (await history(page)).active.scenario_ids[0];
  const future = JSON.parse(
    readFileSync(`data/scenarios/${id}/future_outcomes.json`, 'utf8'),
  );
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Paused after 1 year', exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1000);
  for (const months of [12, 36]) {
    await expect(page.getByTestId('path-0')).toHaveAttribute(
      'points',
      new RegExp(`\\S+( \\S+){${months}}$`),
    );
    const value = future.monthly_returns.cash
      .slice(0, months)
      .reduce(
        (total: number, row: { return: number }) => total * (1 + row.return),
        10000,
      );
    await expect(page.getByTestId('chart-return-0')).toContainText(
      percent(value / 10000 - 1),
    );
    await expect(
      page.getByRole('heading', { name: 'Expectation vs. reality' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'What happened next?' }),
    ).toHaveCount(0);
    await page.getByText('Monthly values', { exact: true }).click();
    await expect(page.locator('figure tbody tr')).toHaveCount(months);
    await page.getByText('Monthly values', { exact: true }).click();
    await page.screenshot({
      path: testInfo.outputPath(`session-pause-${months}.png`),
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole('button', {
        name: `Continue to year ${months === 12 ? 3 : 5}`,
        exact: true,
      })
      .click();
    if (months === 12)
      await expect(
        page.getByRole('heading', {
          name: 'Paused after 3 years',
          exact: true,
        }),
      ).toBeVisible();
  }
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toBeVisible();
  expect((await history(page)).active.completed).toHaveLength(1);
});

test('unfinished allocation and prediction survive refresh without loading outcomes', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('future_outcomes')) requests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page
    .getByRole('button', { name: 'Add $500 to US Total Market', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Add $500 to Bonds', exact: true })
    .click();
  await page
    .getByRole('radio', { name: 'US Total Market', exact: true })
    .check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page.reload();
  await expect(
    page.getByLabel('US Total Market allocation', { exact: true }),
  ).toHaveText('$500');
  await expect(page.getByLabel('Bonds allocation', { exact: true })).toHaveText(
    '$500',
  );
  await expect(page.getByLabel('Cash allocation', { exact: true })).toHaveText(
    '$9,000',
  );
  await expect(
    page.getByRole('radio', { name: 'US Total Market', exact: true }),
  ).toBeChecked();
  expect(requests).toHaveLength(0);
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await finishReplay(page);
  expect((await history(page)).active.completed[0].allocations.us_total).toBe(
    500,
  );
  await page
    .getByRole('button', { name: 'Next scenario', exact: true })
    .click();
  await expect(
    page.getByLabel('US Total Market allocation', { exact: true }),
  ).toHaveText('$0');
  await expect(
    page.getByRole('button', { name: 'Review decision' }),
  ).toBeDisabled();
});

test('quota failure during commitment preserves the durable unfinished choice', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page
    .getByRole('button', { name: 'Add $500 to US Total Market', exact: true })
    .click();
  await page
    .getByRole('radio', { name: 'US Total Market', exact: true })
    .check();
  const saved = await history(page);
  const draftKey = `investing-game:draft:${saved.active.session_id}:${saved.active.scenario_ids[0]}:v1`;
  const before = await page.evaluate((k) => localStorage.getItem(k), draftKey);
  await page.evaluate((k) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw new DOMException('Quota full', 'QuotaExceededError');
      original.call(this, key, value);
    };
  }, key);
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByText('Progress could not be saved.', { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), draftKey)).toBe(
    before,
  );
  await page.reload();
  await expect(
    page.getByLabel('US Total Market allocation', { exact: true }),
  ).toHaveText('$500');
  await expect(
    page.getByRole('radio', { name: 'US Total Market', exact: true }),
  ).toBeChecked();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await finishReplay(page);
  expect(
    await page.evaluate((k) => localStorage.getItem(k), draftKey),
  ).toBeNull();
  expect((await history(page)).active.completed).toHaveLength(1);
});
