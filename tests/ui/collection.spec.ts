import { finishReplay } from './replay-helpers';
import { test, expect, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { percent } from '../../app/src/lib/format';
import { calculatePortfolio } from '../../app/src/lib/portfolio';

async function expectReturnDisplay(display: Locator, value: number) {
  await expect(display).toHaveText(percent(value));
  await expect(display).toHaveClass(
    value < 0 ? 'financial-return--negative' : '',
  );
}

const manifest = JSON.parse(
  readFileSync('data/scenarios/manifest.json', 'utf8'),
);
const ids: string[] = manifest.scenarios.map(
  (entry: { scenario_id: string }) => entry.scenario_id,
);
for (const id of ids) {
  test(`${id} commits before requesting outcomes and reveals sixty months`, async ({
    page,
  }, testInfo) => {
    const known = JSON.parse(
      readFileSync(`data/scenarios/${id}/known_at_start.json`, 'utf8'),
    );
    const future = JSON.parse(
      readFileSync(`data/scenarios/${id}/future_outcomes.json`, 'utf8'),
    );
    const requests: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('request', (request) => {
      if (/\/(future_outcomes|provenance)\.json/.test(request.url()))
        requests.push(request.url());
    });
    await page.goto(`/?scenario=${id}`);
    await expect(
      page.getByRole('heading', {
        name: known.metadata.display_date,
        exact: true,
      }),
    ).toBeVisible();
    const recentRows = page.locator('.recent-performance tbody tr');
    for (const [index, asset] of known.recent_returns.entries()) {
      const row = recentRows.nth(index);
      for (const [column, value] of [
        asset.three_month,
        asset.one_year,
      ].entries()) {
        const display = row.locator('td').nth(column).locator('span');
        await expectReturnDisplay(display, value);
      }
    }
    for (const [index, stock] of known.hot_stocks.entries()) {
      const displays = page
        .locator('.stock-grid article')
        .nth(index)
        .locator('p')
        .nth(1)
        .locator('span');
      for (const [column, value] of [
        stock.three_month,
        stock.one_year,
      ].entries()) {
        await expectReturnDisplay(displays.nth(column), value);
      }
    }
    await expect(page.getByRole('radio')).toHaveCount(7);
    await expect(
      page.getByRole('heading', { name: 'Five years later' }),
    ).toHaveCount(0);
    await expect(
      page.locator('[data-testid^="hot-stock-outcome-"]'),
    ).toHaveCount(0);
    await expect(page.locator('[data-testid^="hot-stock-path-"]')).toHaveCount(
      0,
    );
    for (const event of future.events)
      await expect(page.getByText(event.title, { exact: true })).toHaveCount(0);
    await expect(
      page.getByText(future.what_happened_next.text, { exact: true }),
    ).toHaveCount(0);
    for (const label of ['Important cohort', 'Random cohort'])
      await expect(page.getByRole('heading', { name: label })).toHaveCount(0);
    expect(requests).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`${id}-decision.png`),
      fullPage: true,
    });
    await page.getByRole('radio', { name: 'Cash', exact: true }).check();
    await page.getByRole('button', { name: 'Review decision' }).click();
    expect(requests).toEqual([]);
    await page
      .getByRole('button', { name: 'Invest and see what happens' })
      .click();
    await finishReplay(page);
    await expect(
      page.getByRole('heading', { name: 'Five years later', exact: true }),
    ).toBeVisible();
    const story = page
      .getByRole('heading', { name: 'What happened next?', exact: true })
      .locator('..');
    await expect(story.locator(':scope > p')).toHaveText(
      future.what_happened_next.text.split(/\n\s*\n/),
    );
    await expect(
      page.locator('[data-testid^="hot-stock-outcome-"]'),
    ).toHaveCount(3);
    await expect(page.locator('[data-testid^="hot-stock-path-"]')).toHaveCount(
      3,
    );
    for (const [index, stock] of known.hot_stocks.entries()) {
      const expectedReturn = calculatePortfolio(future.monthly_returns, {
        [stock.id]: 10_000,
      }).total_return;
      const outcome = page.getByTestId(`hot-stock-outcome-${index}`);
      await expect(outcome).toContainText(stock.company_name);
      await expect(outcome).toContainText(stock.ticker);
      await expect(outcome).toContainText(stock.description);
      await expect(outcome).toContainText(percent(expectedReturn));
      await expect(outcome.locator('.financial-return--negative')).toHaveCount(
        expectedReturn < 0 ? 1 : 0,
      );
      const path = page.getByTestId(`hot-stock-path-${index}`);
      await expect(path).toHaveAttribute('data-asset-id', stock.id);
      await expect(path).toHaveAttribute('points', /\S+( \S+){60}$/);
    }
    expect(
      requests.some((url) => url.includes(`/${id}/future_outcomes.json`)),
    ).toBe(true);
    expect(requests.some((url) => url.includes(`/${id}/provenance.json`))).toBe(
      true,
    );
    await page.getByText('Monthly values', { exact: true }).click();
    await expect(page.locator('figure tbody tr')).toHaveCount(60);
    await expect(page.locator('figure tbody tr').first()).toContainText(
      future.monthly_returns.cash[0].month,
    );
    await expect(page.locator('figure tbody tr').last()).toContainText(
      future.monthly_returns.cash[59].month,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`${id}-reveal.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
