import { expect, type Page } from '@playwright/test';
export async function finishReplay(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Paused after 1 year', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Paused after 1 year', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('region', {
      name: 'Investment paths; scroll horizontally on small screens',
    }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Continue to year 3', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId('path-0')).toHaveAttribute(
    'points',
    /\S+( \S+){12}$/,
  );
  await page
    .getByRole('button', { name: 'Continue to year 3', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Paused after 3 years', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Paused after 3 years', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId('path-0')).toHaveAttribute(
    'points',
    /\S+( \S+){36}$/,
  );
  await page
    .getByRole('button', { name: 'Continue to year 5', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Five years later', exact: true }),
  ).toBeVisible();
}
