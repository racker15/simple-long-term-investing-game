import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HotStockOutcomeCards } from '../../app/src/components/Reveal';
import type { FutureOutcomes } from '../../app/src/lib/contracts';

it('renders each hot-stock card with its matching future summary', () => {
  const hotStocks = [
    {
      id: 'hot:demo:alpha',
      company_name: 'Alpha Company',
      ticker: 'ALP',
      description: 'Alpha starting description.',
      path: { total_return: 0.2 },
    },
    {
      id: 'hot:demo:beta',
      company_name: 'Beta Company',
      ticker: 'BET',
      description: 'Beta starting description.',
      path: { total_return: -0.1 },
    },
    {
      id: 'hot:demo:gamma',
      company_name: 'Gamma Company',
      ticker: 'GAM',
      description: 'Gamma starting description.',
      path: { total_return: 0.05 },
    },
  ];
  const outcomes: FutureOutcomes['hot_stock_outcomes'] = [
    {
      asset_id: 'hot:demo:gamma',
      text: 'Gamma future summary.',
      source_ids: ['gamma-news'],
    },
    {
      asset_id: 'hot:demo:alpha',
      text: 'Alpha future summary.',
      source_ids: ['alpha-report'],
    },
    {
      asset_id: 'hot:demo:beta',
      text: 'Beta future summary.',
      source_ids: ['beta-news'],
    },
  ];

  const html = renderToStaticMarkup(
    <HotStockOutcomeCards hotStocks={hotStocks} outcomes={outcomes} />,
  );

  expect(html).toContain('Alpha future summary.');
  expect(html).toContain('Beta future summary.');
  expect(html).toContain('Gamma future summary.');
  expect(html).not.toContain('starting description.');
  expect(html.indexOf('Alpha future summary.')).toBeLessThan(
    html.indexOf('Beta future summary.'),
  );
  expect(html.indexOf('Beta future summary.')).toBeLessThan(
    html.indexOf('Gamma future summary.'),
  );
});
