import { buildSessionQueue } from '../../app/src/lib/queue';
import {
  startSession,
  lockResult,
  advanceSession,
} from '../../app/src/lib/session';
import { createResult } from '../../app/src/lib/results';
import { loadScenario } from '../../app/src/lib/validation';
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
  await expect(page.locator('main')).toBeFocused();
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
  await page.getByRole('button', { name: 'Play reveal', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Paused after 1 year', exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1000);
  for (const months of [12, 36]) {
    await expect(page.getByTestId('chart-return-1')).toHaveCSS(
      'color',
      'rgb(98, 107, 121)',
    );
    await expect(page.getByTestId('chart-return-2')).toHaveCSS(
      'color',
      'rgb(98, 107, 121)',
    );
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

test('keyboard focus follows new screens without interrupting allocation edits', async ({
  page,
}) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main).toBeFocused();
  await page.getByRole('button', { name: 'Begin session' }).focus();
  await page.keyboard.press('Enter');
  await expect(main).toBeFocused();
  const add = page.getByRole('button', {
    name: 'Add $500 to US Total Market',
    exact: true,
  });
  await add.focus();
  await page.keyboard.press('Enter');
  await expect(add).toBeFocused();
  await invest(page);
  await expect(main).toBeFocused();
  await page
    .getByRole('button', { name: 'Next scenario', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(main).toBeFocused();
  await expect(
    page.getByText('Scenario 2 of 10', { exact: true }),
  ).toBeVisible();
});

test('a restored fifty-round session finishes all blocks and exhausts first-time dates', async ({
  page,
}) => {
  const manifest = JSON.parse(
    readFileSync('data/scenarios/manifest.json', 'utf8'),
  );
  const library = manifest.scenarios.map(
    (entry: {
      scenario_id: string;
      selection_mode: 'important' | 'random';
    }) => ({
      scenario_id: entry.scenario_id,
      selection_mode: entry.selection_mode,
    }),
  );
  const queue = buildSessionQueue(library, 50, [], 'full-library-recovery');
  let saved = startSession(
    queue,
    'fifty-round-recovery',
    '2026-10-06T00:00:00Z',
  );
  for (const id of queue.slice(0, 49)) {
    const scenario = loadScenario({
      known: JSON.parse(
        readFileSync(`data/scenarios/${id}/known_at_start.json`, 'utf8'),
      ),
      future: JSON.parse(
        readFileSync(`data/scenarios/${id}/future_outcomes.json`, 'utf8'),
      ),
      provenance: JSON.parse(
        readFileSync(`data/scenarios/${id}/provenance.json`, 'utf8'),
      ),
    });
    saved = lockResult(saved, createResult(scenario, { cash: 10000 }, 'cash'));
    saved = advanceSession(saved, '2026-10-06T00:10:00Z');
    if (saved.phase === 'checkpoint')
      saved = advanceSession(saved, '2026-10-06T00:10:00Z');
  }
  await page.goto('/');
  await page.evaluate(
    ({ key, saved }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          active: saved,
          pending: null,
          finished: [],
        }),
      ),
    { key, saved },
  );
  await page.reload();
  await expect(
    page.getByText('Scenario 50 of 50', { exact: true }),
  ).toBeVisible();
  await invest(page);
  await page
    .getByRole('button', { name: 'View final scorecard', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Overall session — 50 scenarios',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Scenarios 46–50', exact: true }),
  ).toBeVisible();
  expect((await history(page)).finished).toHaveLength(1);
  await page
    .getByRole('button', { name: 'Start new session', exact: true })
    .click();
  await expect(page.getByRole('button', { name: 'Begin session' })).toHaveCount(
    0,
  );
  await expect(
    page.getByText('You’ve explored all 50 historical scenarios.', {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByText('Practice a completed scenario', { exact: true })
    .click();
  await expect(page.getByRole('button', { name: /^Replay / })).toHaveCount(50);
  await page.reload();
  await expect(
    page.getByText('Your learning history — 50 scenarios', { exact: true }),
  ).toBeVisible();
  expect((await history(page)).finished).toHaveLength(1);
});

test('review keeps the allocation in place and makes the next action visible', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  const add = page.getByRole('button', {
    name: 'Add $500 to US Total Market',
    exact: true,
  });
  await add.click();
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  const review = page.getByRole('button', { name: 'Review decision' });
  await review.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({
    scroll: window.scrollY,
    rows: [...document.querySelectorAll('.allocation-row')].map(
      (row) => row.getBoundingClientRect().top + window.scrollY,
    ),
  }));
  await review.click();
  const investButton = page.getByRole('button', {
    name: 'Invest and see what happens',
  });
  await expect(investButton).toBeFocused();
  await expect(investButton).toBeInViewport({ ratio: 1 });
  await expect(
    page.getByRole('status').filter({ hasText: 'Locked and ready' }),
  ).toBeVisible();
  await expect(page.locator('.allocation-panel')).toHaveClass(
    /allocation-locked/,
  );
  await expect(add).toBeDisabled();
  await expect(
    page.getByRole('radio', { name: 'Cash', exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel('US Total Market allocation')).toHaveText(
    '$500',
  );
  const after = await page.evaluate(() => ({
    scroll: window.scrollY,
    rows: [...document.querySelectorAll('.allocation-row')].map(
      (row) => row.getBoundingClientRect().top + window.scrollY,
    ),
  }));
  expect(after.rows).toEqual(before.rows);
  expect(after.scroll).toBeGreaterThanOrEqual(before.scroll - 1);
  await page.screenshot({
    path: testInfo.outputPath('session-locked-allocation.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Back to allocation' }).click();
  await expect(review).toBeFocused();
  await expect(review).toBeInViewport({ ratio: 1 });
  await expect(add).toBeEnabled();
  await expect(
    page.getByRole('radio', { name: 'Cash', exact: true }),
  ).toBeChecked();
  await expect(page.locator('.allocation-panel')).not.toHaveClass(
    /allocation-locked/,
  );
  await expect(page.getByLabel('US Total Market allocation')).toHaveText(
    '$500',
  );
  await review.click();
  await expect(investButton).toBeInViewport({ ratio: 1 });
  await investButton.click();
  await finishReplay(page);
});

test('right-hand labels match every line and return at each reveal', async ({
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
  await page.getByRole('button', { name: 'Play reveal', exact: true }).click();
  for (const months of [12, 36, 60]) {
    await expect(
      page.getByRole('heading', {
        name:
          months === 60
            ? 'Five-year path complete'
            : `Paused after ${months / 12} ${months === 12 ? 'year' : 'years'}`,
        exact: true,
      }),
    ).toBeVisible();
    for (let i = 0; i < 6; i++) {
      const label = page.getByTestId(`chart-end-${i}`);
      const line = page.getByTestId(
        i < 3 ? `path-${i}` : `hot-stock-path-${i - 3}`,
      );
      const color = await line.getAttribute('stroke');
      await expect(label.locator('circle').first()).toHaveAttribute(
        'fill',
        color!,
      );
      const endpoint = (await line.getAttribute('points'))!
        .split(' ')
        .at(-1)!
        .split(',');
      await expect(label.locator('circle').first()).toHaveAttribute(
        'cx',
        endpoint[0],
      );
      await expect(label.locator('circle').first()).toHaveAttribute(
        'cy',
        endpoint[1],
      );
      const name = await label.locator('.endpoint-name').textContent();
      const result = await label.locator('.endpoint-return').textContent();
      await expect(page.getByTestId(`chart-return-${i}`)).toContainText(name!);
      await expect(page.getByTestId(`chart-return-${i}`)).toContainText(
        result!,
      );
    }
    const cashValue = future.monthly_returns.cash
      .slice(0, months)
      .reduce(
        (total: number, row: { return: number }) => total * (1 + row.return),
        10000,
      );
    await expect(
      page.getByTestId('chart-end-0').locator('.endpoint-return'),
    ).toHaveText(percent(cashValue / 10000 - 1));
    const positions = await page
      .locator('.endpoint-name')
      .evaluateAll((nodes) =>
        nodes.map((node) => Number(node.getAttribute('y'))),
      );
    for (const offset of [0, 3]) {
      const ys = positions.slice(offset, offset + 3).sort((a, b) => a - b);
      expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(38);
      expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(38);
    }
    await page.locator('.chart-scroll').evaluate((node) => {
      node.scrollLeft = node.scrollWidth;
    });
    await page.getByTestId('chart-end-5').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('chart-end-5')).toBeInViewport();
    await page.locator('.chart').screenshot({
      path: testInfo.outputPath(`session-end-labels-${months}.png`),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (months < 60)
      await page
        .getByRole('button', {
          name: `Continue to year ${months === 12 ? 3 : 5}`,
          exact: true,
        })
        .click();
  }
});

test('each reveal waits for Play and animates for eight seconds with moving endpoint labels', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-06T00:00:00Z') });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Ready to play', exact: true }),
  ).toBeVisible();
  await page.clock.runFor(15000);
  await expect(page.getByTestId('path-0')).toHaveAttribute('points', /^\S+$/);
  await expect(
    page.getByTestId('chart-end-0').locator('.endpoint-return'),
  ).toHaveText('0%');
  await page.getByRole('button', { name: 'Play reveal', exact: true }).click();
  for (const year of [1, 3, 5]) {
    const revealing = page.getByRole('heading', {
      name: `Revealing through year ${year}…`,
      exact: true,
    });
    await expect(revealing).toBeVisible();
    const dot = page.getByTestId('chart-end-0').locator('circle').first();
    const startX = Number(await dot.getAttribute('cx'));
    await page.clock.runFor(4000);
    await expect(revealing).toBeVisible();
    const middleX = Number(await dot.getAttribute('cx'));
    expect(middleX).toBeGreaterThan(startX);
    expect(middleX).toBeLessThan(540);
    for (let i = 0; i < 6; i++) {
      const line = page.getByTestId(
        i < 3 ? `path-${i}` : `hot-stock-path-${i - 3}`,
      );
      const endpoint = (await line.getAttribute('points'))!
        .split(' ')
        .at(-1)!
        .split(',');
      const label = page.getByTestId(`chart-end-${i}`);
      await expect(label.locator('circle').first()).toHaveAttribute(
        'cx',
        endpoint[0],
      );
      await expect(label.locator('circle').first()).toHaveAttribute(
        'cy',
        endpoint[1],
      );
      await expect(label.locator('.endpoint-return')).not.toContainText('NaN');
    }
    await page.clock.runFor(3990);
    await expect(revealing).toBeVisible();
    await page.clock.runFor(40);
    await expect(
      page.getByRole('heading', {
        name:
          year === 5
            ? 'Five-year path complete'
            : `Paused after ${year} ${year === 1 ? 'year' : 'years'}`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(dot).toHaveAttribute('cx', '540');
    await expect(page.getByTestId('path-0')).toHaveAttribute(
      'points',
      new RegExp(`\\S+( \\S+){${year * 12}}$`),
    );
    if (year < 5) {
      await page.clock.runFor(6000);
      await expect(
        page.getByRole('heading', { name: 'Five years later', exact: true }),
      ).toHaveCount(0);
      await page
        .getByRole('button', {
          name: `Continue to year ${year === 1 ? 3 : 5}`,
          exact: true,
        })
        .click();
    }
  }
});

test('replay reveal keeps the locked choice and never records a second result', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page
    .getByRole('button', { name: 'Add $500 to Bonds', exact: true })
    .click();
  await page.getByRole('radio', { name: 'Bonds', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Ready to play', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toHaveCount(0);
  await finishReplay(page);
  const saved = await history(page);
  const ending = await page.locator('.ending').textContent();
  for (let attempt = 0; attempt < 2; attempt++) {
    await page
      .getByRole('button', { name: 'Replay reveal', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Play reveal', exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole('heading', { name: 'Ready to play', exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId('path-0')).toHaveAttribute('points', /^\S+$/);
    await expect(
      page.getByRole('heading', { name: 'Five years later', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Invest your $10,000', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Next scenario', exact: true }),
    ).toHaveCount(0);
    expect(await history(page)).toEqual(saved);
    if (attempt === 1) {
      await page.reload();
      await expect(
        page.getByRole('heading', { name: 'Ready to play', exact: true }),
      ).toBeVisible();
      expect(await history(page)).toEqual(saved);
    }
    await finishReplay(page);
    await expect(page.locator('.ending')).toHaveText(ending!);
    expect(await history(page)).toEqual(saved);
  }
  await page
    .getByRole('button', { name: 'Next scenario', exact: true })
    .click();
  await expect(
    page.getByText('Scenario 2 of 10', { exact: true }),
  ).toBeVisible();
  expect((await history(page)).active.completed).toHaveLength(1);
});


test('a long suspended frame gap cannot consume a reveal stage', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.clock.install({ time: new Date('2026-10-06T00:00:00Z') });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await page.getByRole('button', { name: 'Play reveal', exact: true }).click();
  await page.clock.runFor(2000);
  const before = await page.getByTestId('path-0').getAttribute('points');
  await page.clock.fastForward(10000);
  await expect(page.getByTestId('path-0')).toHaveAttribute('points', before!);
  await expect(
    page.getByRole('heading', {
      name: 'Revealing through year 1…',
      exact: true,
    }),
  ).toBeVisible();
  await page.clock.runFor(6100);
  await expect(
    page.getByRole('heading', { name: 'Paused after 1 year', exact: true }),
  ).toBeVisible();
});
