import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { fixture } from '../../app/src/data/fixture';
import { createResult } from '../../app/src/lib/results';
import { calculatePortfolio } from '../../app/src/lib/portfolio';
import { money, percent } from '../../app/src/lib/format';
import {
  ReflectionSummary,
  BenchmarkBasket,
} from '../../app/src/components/ReflectionSummary';
import { investmentStyle } from '../../app/src/lib/investment-style';
import { assetIds } from '../../app/src/lib/contracts';
it('reflects the same original allocation at all three historical horizons', () => {
  const result = createResult(
    fixture,
    { us_total: 5000, cash: 5000 },
    'us_total',
  );
  const path = calculatePortfolio(
    fixture.future.monthly_returns,
    result.allocations,
  );
  const original = JSON.stringify(result);
  const html = renderToStaticMarkup(
    <ReflectionSummary scenario={fixture} result={result} />,
  );
  for (const month of [12, 36, 60]) {
    expect(html).toContain(`Year ${month / 12}`);
    expect(html).toContain(money(path.points[month - 1].total));
    expect(html).toContain(percent(path.points[month - 1].total / 10000 - 1));
  }
  expect(html).toContain('incomplete information');
  expect(JSON.stringify(result)).toBe(original);
});
it('uses distinguishable identities for the seven choices', () => {
  const ids = assetIds(fixture.known);
  expect(new Set(ids.map((id) => investmentStyle(id, ids).symbol)).size).toBe(
    7,
  );
  expect(new Set(ids.map((id) => investmentStyle(id, ids).color)).size).toBe(7);
  expect(investmentStyle('us_total', ids).explanation).toContain(
    'many US companies',
  );
});
it('explains the actual static comparison basket without presenting a score', () => {
  const html = renderToStaticMarkup(<BenchmarkBasket />);
  expect(html).toContain('60% US stocks');
  expect(html).toContain('20% international stocks');
  expect(html).toContain('20% bonds');
  expect(html).toContain('not a score or a promise');
});
