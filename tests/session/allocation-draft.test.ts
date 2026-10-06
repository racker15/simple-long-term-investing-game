import { expect, it } from 'vitest';
import { readAllocationDraft } from '../../app/src/lib/allocation-draft';
import { assetIds } from '../../app/src/lib/contracts';
import { fixture } from '../../app/src/data/fixture';
const ids = assetIds(fixture.known);
it('restores a valid unfinished allocation and prediction', () => {
  const value = { draft: { us_total: 1500, bonds: 500 }, expected: 'cash' };
  expect(readAllocationDraft(JSON.stringify(value), ids)).toEqual(value);
  expect(readAllocationDraft(null, ids)).toEqual({ draft: {}, expected: '' });
});
it.each([
  { draft: { cash: 500 }, expected: 'cash' },
  { draft: { us_total: null }, expected: 'cash' },
  { draft: { us_total: 10500 }, expected: 'cash' },
  { draft: { us_total: 250 }, expected: 'cash' },
  { draft: { us_total: -500 }, expected: 'cash' },
  { draft: { unknown: 500 }, expected: 'cash' },
  { draft: { us_total: 500 }, expected: 'unknown' },
  { draft: [], expected: '' },
  { draft: null, expected: '' },
])('rejects invalid saved choices without silently changing them', (value) => {
  expect(() => readAllocationDraft(JSON.stringify(value), ids)).toThrow();
});
