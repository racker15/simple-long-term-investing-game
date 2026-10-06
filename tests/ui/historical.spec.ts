import { test, expect } from '@playwright/test';

for (const { scenario, years, firstMonth, lastMonth } of [
  {
    scenario: '1982-08',
    years: ['1982', '1983', '1984', '1985', '1986', '1987'],
    firstMonth: '1982-09',
    lastMonth: '1987-08',
  },
  {
    scenario: '1999-09',
    years: ['1999', '2000', '2001', '2002', '2003', '2004'],
    firstMonth: '1999-10',
    lastMonth: '2004-09',
  },
  {
    scenario: '2016-02',
    years: ['2016', '2017', '2018', '2019', '2020', '2021'],
    firstMonth: '2016-03',
    lastMonth: '2021-02',
  },
]) {
  test(`${scenario} reveal uses historical year labels and a $10,000 reference`, async ({
    page,
  }) => {
    await page.goto(`/?scenario=${scenario}`);
    await expect(page.getByTestId('chart-year')).toHaveCount(0);
    await expect(
      page.locator('[data-testid^="starting-value-reference-"]'),
    ).toHaveCount(0);
    await page.getByRole('radio', { name: 'Cash', exact: true }).check();
    await page.getByRole('button', { name: 'Review decision' }).click();
    await page
      .getByRole('button', { name: 'Invest and see what happens' })
      .click();

    await expect(page.getByTestId('chart-year')).toHaveText(years);
    for (const [panel, pathId] of [
      ['portfolio', 'path-0'],
      ['hot-stocks', 'hot-stock-path-0'],
    ]) {
      const reference = page.getByTestId(`starting-value-reference-${panel}`);
      await expect(reference).toContainText('$10,000');
      await expect(reference.locator('line')).toHaveAttribute(
        'stroke-dasharray',
        '2 5',
      );
      const referenceY = Number(
        await reference.locator('line').getAttribute('y1'),
      );
      const firstPathPoint = (await page
        .getByTestId(pathId)
        .getAttribute('points'))!
        .split(' ')[0]
        .split(',');
      expect(Number(firstPathPoint[1])).toBeCloseTo(referenceY, 5);
      expect(await reference.locator('line').getAttribute('y2')).toBe(
        String(referenceY),
      );
    }

    await page.getByText('Monthly values', { exact: true }).click();
    await expect(page.locator('figure tbody tr').first()).toContainText(
      firstMonth,
    );
    await expect(page.locator('figure tbody tr').last()).toContainText(
      lastMonth,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}

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
    page.getByText('Technology shares reach a peak', {
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
    page.getByText('50 unseen scenarios available.', {
      exact: false,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem('investing-game:historical-history:v1'),
    ),
  ).toBeNull();
  expect(errors).toEqual([]);
});
