import { finishReplay } from './replay-helpers';
import { test, expect, type Page } from '@playwright/test';
async function invest(page: Page) {
  await page
    .getByRole('radio', { name: 'Acme Computing', exact: true })
    .check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  await finishReplay(page);
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
}
async function next(page: Page, last = false) {
  await page
    .getByRole('button', {
      name: last ? 'View final scorecard' : 'Next scenario',
    })
    .click();
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
test('five-scenario vertical slice, allocation controls, locked refresh, final scorecard', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/?demo=1');
  await expect(page.getByLabel('How many scenarios?')).toHaveValue('10');
  await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('start.png') });
  await page.getByLabel('How many scenarios?').selectOption('5');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await expect(
    page.getByText('Scenario 1 of 5', { exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath('decision.png'),
    fullPage: true,
  });
  await expect(
    page.getByText('Example Telecom becomes worthless', { exact: false }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Important cohort' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Review decision' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', {
      name: 'Remove $500 from US Total Market',
      exact: true,
    }),
  ).toBeDisabled();
  await expect(page.getByLabel('Cash allocation', { exact: true })).toHaveText(
    '$10,000',
  );
  await expect(
    page.getByRole('button', { name: 'Add $500 to Cash', exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Remove $500 from Cash', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole('radio')).toHaveCount(7);
  const totalAllocation = async () =>
    expect(
      await page
        .locator('.allocation-row output')
        .evaluateAll((outputs) =>
          outputs.reduce(
            (total, output) =>
              total + Number(output.textContent!.replace(/[^0-9]/g, '')),
            0,
          ),
        ),
    ).toBe(10000);
  await totalAllocation();
  for (const asset of [
    'Bonds',
    'US Total Market',
    'International ex-US',
    'Acme Computing',
    'Example Telecom',
    'Sample Retail',
  ]) {
    await page
      .getByRole('button', { name: `Add $500 to ${asset}`, exact: true })
      .click();
    await expect(
      page.getByLabel(`${asset} allocation`, { exact: true }),
    ).toHaveText('$500');
    await expect(
      page.getByLabel('Cash allocation', { exact: true }),
    ).toHaveText('$9,500');
    await totalAllocation();
    await page
      .getByRole('button', { name: `Remove $500 from ${asset}`, exact: true })
      .click();
    await expect(
      page.getByLabel(`${asset} allocation`, { exact: true }),
    ).toHaveText('$0');
    await expect(
      page.getByLabel('Cash allocation', { exact: true }),
    ).toHaveText('$10,000');
    await totalAllocation();
  }
  for (let i = 0; i < 20; i++)
    await page
      .getByRole('button', { name: 'Add $500 to US Total Market', exact: true })
      .click();
  await expect(page.getByLabel('Cash allocation', { exact: true })).toHaveText(
    '$0',
  );
  await totalAllocation();
  await expect(
    page.getByRole('button', { name: 'Add $500 to Bonds', exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('button', {
      name: 'Remove $500 from US Total Market',
      exact: true,
    })
    .click();
  await expect(page.getByLabel('Cash allocation', { exact: true })).toHaveText(
    '$500',
  );
  await page
    .getByRole('radio', { name: 'Acme Computing', exact: true })
    .check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  const confirmation = page.locator('[aria-labelledby="allocation-title"] dl');
  await expect(confirmation.locator('dt')).toHaveText([
    'Cash',
    'Bonds',
    'US Total Market',
    'International ex-US',
    'Acme Computing',
    'Example Telecom',
    'Sample Retail',
  ]);
  await expect(confirmation.locator('dd')).toHaveText([
    '$500',
    '$0',
    '$9,500',
    '$0',
    '$0',
    '$0',
    '$0',
  ]);
  await page.getByRole('button', { name: 'Back to allocation' }).click();
  await invest(page);
  await expect(page.getByTestId('path-0')).toHaveAttribute(
    'points',
    /\S+( \S+){60}$/,
  );
  await page.getByText('Monthly values', { exact: true }).click();
  await expect(page.locator('figure tbody tr')).toHaveCount(60);
  await page
    .getByText('2003-01 — Example Telecom becomes worthless', { exact: true })
    .click();
  await noOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath('reveal.png'),
    fullPage: true,
  });
  await page.getByText('Monthly values', { exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('reveal-viewport.png') });
  await page.reload();
  await finishReplay(page);
  await expect(
    page.getByRole('heading', { name: 'Expectation vs. reality' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Review decision' }),
  ).toHaveCount(0);
  await next(page);
  for (let i = 1; i < 5; i++) {
    await invest(page);
    await next(page, i === 4);
  }
  await expect(
    page.getByRole('heading', { name: 'How you did', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Scenarios 1–5', exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath('final.png'),
    fullPage: true,
  });
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'How you did', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          localStorage.getItem('investing-game:development-summaries:v1')!,
        ).length,
    ),
  ).toBe(1);
  await page.getByRole('button', { name: 'Start new session' }).click();
  await expect(
    page.getByRole('button', { name: 'Begin session' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test('checkpoint continues and supports ending after a whole block', async ({
  page,
}) => {
  await page.goto('/?demo=1');
  await page.getByLabel('How many scenarios?').selectOption('15');
  await page.getByRole('button', { name: 'Begin session' }).click();
  for (let i = 0; i < 5; i++) {
    await invest(page);
    await next(page);
  }
  await expect(
    page.getByRole('heading', { name: 'How you are doing — Scenarios 1–5' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Important cohort' }),
  ).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByText('Scenario 6 of 15', { exact: true }),
  ).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await invest(page);
    await next(page);
  }
  await expect(
    page.getByRole('heading', { name: 'How you are doing — Scenarios 6–10' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'End session now' }).click();
  await expect(
    page.getByRole('heading', { name: 'Overall session — 10 scenarios' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Scenarios 1–5', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Scenarios 6–10', exact: true }),
  ).toBeVisible();
  await noOverflow(page);
});
test('animation skips only to its next required pause', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-06T00:00:00Z') });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Begin session' }).click();
  await page.getByRole('radio', { name: 'Cash', exact: true }).check();
  await page.getByRole('button', { name: 'Review decision' }).click();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page
    .getByRole('button', { name: 'Invest and see what happens' })
    .click();
  for (const year of [1, 3, 5]) {
    await page
      .getByRole('button', {
        name: `Skip animation to year ${year}`,
        exact: true,
      })
      .click();
    if (year < 5) {
      await expect(
        page.getByRole('heading', {
          name: `Paused after ${year} ${year === 1 ? 'year' : 'years'}`,
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Five years later', exact: true }),
      ).toHaveCount(0);
      await page.clock.runFor(10000);
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
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toBeVisible();
});
