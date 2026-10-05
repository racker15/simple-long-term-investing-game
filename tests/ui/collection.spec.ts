import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ids = ['1982-08', '1987-01', '1999-09', '2004-05', '2008-09', '2016-02'];
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
    await expect(page.getByRole('radio')).toHaveCount(7);
    await expect(
      page.getByRole('heading', { name: 'Five years later' }),
    ).toHaveCount(0);
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
    await expect(
      page.getByRole('heading', { name: 'Five years later', exact: true }),
    ).toBeVisible();
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
