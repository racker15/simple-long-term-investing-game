import { expect, it } from 'vitest';
import { parseYahooChart } from '../../scripts/normalize/yahoo-chart';

const response = (dates: string[], prices: unknown[]) =>
  JSON.stringify({
    chart: {
      error: null,
      result: [
        {
          meta: { symbol: 'TEST', currency: 'USD', dataGranularity: '1d' },
          timestamp: dates.map(
            (date) => Date.parse(`${date}T14:30:00Z`) / 1000,
          ),
          indicators: { adjclose: [{ adjclose: prices }] },
        },
      ],
    },
  });
it('adapts adjusted daily observations and selects calendar month-end endpoints', () => {
  expect(
    parseYahooChart(
      response(['2016-01-04', '2016-01-29', '2016-02-29'], [100, 105, 110]),
      'TEST',
      '2016-01',
      '2016-02',
    ),
  ).toEqual([
    { month: '2016-01', value: 105 },
    { month: '2016-02', value: 110 },
  ]);
});
it('rejects nulls, missing months, stale monthly starts, duplicates, and wrong currency/granularity', () => {
  const dates = ['2016-01-29', '2016-02-29'];
  expect(() =>
    parseYahooChart(response(dates, [100, null]), 'TEST', '2016-01', '2016-02'),
  ).toThrow('Malformed');
  expect(() =>
    parseYahooChart(response([dates[0]], [100]), 'TEST', '2016-01', '2016-02'),
  ).toThrow('endpoint');
  expect(() =>
    parseYahooChart(
      response(['2016-01-04', '2016-02-01'], [100, 110]),
      'TEST',
      '2016-01',
      '2016-02',
    ),
  ).toThrow('Stale');
  expect(() =>
    parseYahooChart(
      response([dates[0], dates[0], dates[1]], [100, 100, 110]),
      'TEST',
      '2016-01',
      '2016-02',
    ),
  ).toThrow('Duplicate');
  for (const replacement of ['EUR', '1mo']) {
    const payload = response(dates, [100, 110]).replace(
      replacement === 'EUR' ? 'USD' : '1d',
      replacement,
    );
    expect(() =>
      parseYahooChart(payload, 'TEST', '2016-01', '2016-02'),
    ).toThrow('daily');
  }
});
