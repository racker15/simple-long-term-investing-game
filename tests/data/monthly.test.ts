import { describe, expect, it } from 'vitest';
import {
  adjustedPriceReturns,
  assertMonthlyReturns,
  compound,
  cutoffMonth,
  getScenarioWindow,
  getTrailingReturns,
  shiftMonth,
  treasuryProxy,
  treasuryReturns,
  type MonthlyReturn,
} from '../../scripts/lib/monthly';
import {
  parseAdjustedCsv,
  parseFredCsv,
  parseFrenchFactors,
} from '../../scripts/lib/parsers';

const series: MonthlyReturn[] = Array.from({ length: 73 }, (_, i) => ({
  month: shiftMonth('1998-09', i),
  return: i % 2 ? 0.1 : -0.05,
}));

describe('monthly windows', () => {
  it('compounds known months through September close and starts the future in October', () => {
    const window = getScenarioWindow(series, '1999-09-30');
    expect(window.trailingThreeMonthReturn).toBeCloseTo(
      0.95 * 1.1 * 0.95 - 1,
      14,
    );
    expect(window.trailingOneYearReturn).toBeCloseTo((0.95 * 1.1) ** 6 - 1, 14);
    expect(window.futureMonthlyReturns).toHaveLength(60);
    expect(window.futureMonthlyReturns[0].month).toBe('1999-10');
    expect(window.futureMonthlyReturns.at(-1)!.month).toBe('2004-09');
    expect(window).toEqual(getScenarioWindow(series, '1999-09-30'));
    window.futureMonthlyReturns[0].return = 100;
    expect(series[13].return).toBe(0.1);
  });
  it('can build recent cards without any future observations', () => {
    const past = series.filter((row) => row.month <= '1999-09');
    expect(getTrailingReturns(past, '1999-09-30')).toEqual(
      getTrailingReturns(series, '1999-09-30'),
    );
    expect(() => getScenarioWindow(past, '1999-09-30')).toThrow(
      'Missing requested month 1999-10',
    );
  });
  it.each([
    ['duplicate', [...series.slice(0, 2), series[1], ...series.slice(2)]],
    ['gap', series.filter((row) => row.month !== '2001-01')],
    ['unsorted', [...series].reverse()],
    ['non-finite', [{ month: '1999-01', return: NaN }]],
    ['impossible loss', [{ month: '1999-01', return: -1.01 }]],
    ['bad month', [{ month: '1999-13', return: 0 }]],
    ['empty', []],
  ])('rejects %s series', (_, invalid) => {
    expect(() => assertMonthlyReturns(invalid)).toThrow();
  });
  it('fails missing trailing or final future months', () => {
    expect(() => getScenarioWindow(series.slice(3), '1999-09-30')).toThrow(
      '1998-10',
    );
    expect(() => getScenarioWindow(series.slice(0, -1), '1999-09-30')).toThrow(
      '2004-09',
    );
  });
  it('uses calendar month ends including leap years and rejects impossible dates', () => {
    expect(cutoffMonth('2000-02-29')).toBe('2000-02');
    expect(shiftMonth('1999-12', 1)).toBe('2000-01');
    expect(shiftMonth('2000-01', -1)).toBe('1999-12');
    for (const date of [
      '1999-09-29',
      '1999-02-29',
      '1999-02-30',
      '1999-13-31',
      'bad',
    ])
      expect(() => cutoffMonth(date)).toThrow();
  });
});

describe('return transformations', () => {
  it('earns the monthly coupon at constant yields; falling/rising yields change bond prices', () => {
    expect(treasuryProxy(6, 6)).toBeCloseTo(0.005, 12);
    expect(treasuryProxy(0, 0)).toBe(0);
    expect(treasuryProxy(6, 5)).toBeGreaterThan(0.005);
    expect(treasuryProxy(6, 7)).toBeLessThan(0);
    expect(() => treasuryProxy(-1, 2)).toThrow();
    expect(
      treasuryReturns([
        { month: '1999-08', value: 6 },
        { month: '1999-09', value: 6 },
      ])[0].month,
    ).toBe('1999-09');
  });
  it('telescopes adjusted price ratios without adding dividends twice', () => {
    const returns = adjustedPriceReturns([
      { month: '1999-06', value: 10 },
      { month: '1999-07', value: 12 },
      { month: '1999-08', value: 9 },
      { month: '1999-09', value: 15 },
    ]);
    expect(compound(returns)).toBeCloseTo(0.5, 14);
    expect(() =>
      adjustedPriceReturns([{ month: '1999-06', value: 0 }]),
    ).toThrow();
  });
});

describe('source parsers', () => {
  const french =
    'Source preamble\r\n\r\n,Mkt-RF,SMB,HML,RF\r\n199908, -1.00, 0.2,0.3,0.40\r\n199909, 5.00, 0.2,0.3,0.50\r\n\r\nAnnual Factors: January-December\r\n1999,20,1,2,5\r\n';
  it('adds RF to US excess market return and converts percent to decimal, ignoring annual data', () => {
    expect(parseFrenchFactors(french)).toEqual([
      { month: '1999-08', market: -0.006, rf: 0.004 },
      { month: '1999-09', market: 0.055, rf: 0.005 },
    ]);
    expect(() => parseFrenchFactors(french.replace('5.00', '-99.99'))).toThrow(
      'sentinel',
    );
    expect(() =>
      parseFrenchFactors(french.replace('199909', '199908')),
    ).toThrow();
    expect(() =>
      parseFrenchFactors(french.replace(',Mkt-RF', ',Market')),
    ).toThrow('header');
  });
  it('checks FRED monthly dates/series IDs and rejects missing-value dots', () => {
    expect(
      parseFredCsv(
        'observation_date,GS5\n1999-08-01,5.94\n1999-09-01,5.87',
        'GS5',
      ),
    ).toEqual([
      { month: '1999-08', value: 5.94 },
      { month: '1999-09', value: 5.87 },
    ]);
    expect(() => parseFredCsv('DATE,GS10\n1999-09-01,6', 'GS5')).toThrow();
    expect(() => parseFredCsv('DATE,GS5\n1999-09-01,.', 'GS5')).toThrow();
    expect(() => parseFredCsv('DATE,GS5\n1999-09-30,6', 'GS5')).toThrow();
  });
  it('checks normalized adjusted-price format and full monthly continuity', () => {
    expect(
      parseAdjustedCsv('month,adjusted_close\n1999-08,12.5\n1999-09,10'),
    ).toHaveLength(2);
    expect(() => parseAdjustedCsv('month,close\n1999-08,12')).toThrow();
    expect(() =>
      parseAdjustedCsv('month,adjusted_close\n1999-08,12\n1999-10,10'),
    ).toThrow();
  });
});
