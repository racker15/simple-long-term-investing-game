import { assertMonthlyValues, type MonthlyValue } from './monthly';

function number(value: string, label: string): number {
  if (!/^-?\d+(\.\d+)?$/.test(value.trim()))
    throw new Error(`Missing or invalid ${label}: ${value}`);
  const result = Number(value);
  if (!Number.isFinite(result)) throw new Error(`Non-finite ${label}`);
  return result;
}

// French files contain separate monthly and annual tables. Select the first
// six-digit monthly block after the exact expected header, never annual rows.
export function parseFrenchFactors(
  text: string,
): { month: string; market: number; rf: number }[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const header = lines.findIndex(
    (line) => line.replace(/\s/g, '') === ',Mkt-RF,SMB,HML,RF',
  );
  if (header < 0) throw new Error('French factor header not found');
  const rows: { month: string; market: number; rf: number }[] = [];
  for (const line of lines.slice(header + 1)) {
    if (!line.trim() && !rows.length) continue;
    const fields = line.split(',').map((field) => field.trim());
    if (!/^\d{6}$/.test(fields[0])) break;
    if (fields.length !== 5)
      throw new Error('Unexpected French factor column count');
    const excess = number(fields[1], 'Mkt-RF');
    const rf = number(fields[4], 'RF');
    if (excess <= -99.99 || rf <= -99.99)
      throw new Error('French missing-value sentinel');
    rows.push({
      month: `${fields[0].slice(0, 4)}-${fields[0].slice(4)}`,
      market: (excess + rf) / 100,
      rf: rf / 100,
    });
  }
  assertMonthlyValues(
    rows.map((row) => ({ month: row.month, value: row.market })),
  );
  return rows;
}

export function parseFredCsv(text: string, seriesId: string): MonthlyValue[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  if (![`observation_date,${seriesId}`, `DATE,${seriesId}`].includes(header))
    throw new Error(`Expected FRED CSV for ${seriesId}`);
  const rows = lines.map((line) => {
    const fields = line.split(',');
    if (fields.length !== 2 || !/^\d{4}-(0[1-9]|1[0-2])-01$/.test(fields[0]))
      throw new Error(`Invalid monthly FRED observation: ${line}`);
    return { month: fields[0].slice(0, 7), value: number(fields[1], seriesId) };
  });
  assertMonthlyValues(rows);
  return rows;
}

export function parseFrenchInternational(text: string): MonthlyValue[] {
  const lines = text.split(/\r?\n/);
  const title = lines.findIndex(
    (line) =>
      line.trim() ===
      'Value-Weight Dollar Returns      All 4 Data Items Not Reqd',
  );
  if (title < 0) throw new Error('Expected French USD total market table');
  const header = title + 2;
  if (
    lines[header]?.trim() !==
    'Mkt   High    Low   High    Low   High    Low   High    Low   Zero'
  )
    throw new Error('French international Mkt header not found');
  const rows: MonthlyValue[] = [];
  for (const line of lines.slice(header + 1)) {
    const fields = line.trim().split(/\s+/);
    if (!/^\d{6}$/.test(fields[0])) break;
    if (fields.length !== 11)
      throw new Error('Unexpected international column count');
    const value = number(fields[1], 'International Mkt');
    if (value <= -99.99) throw new Error('French missing-value sentinel');
    rows.push({
      month: `${fields[0].slice(0, 4)}-${fields[0].slice(4)}`,
      value: value / 100,
    });
  }
  assertMonthlyValues(rows);
  return rows;
}

// Pinned legacy Yahoo daily CSVs. Sort valid daily dates, then use the last
// available trading-day adjusted close in each calendar month. Never fill gaps.
export function parseYahooDailyCsv(
  text: string,
  symbol: string,
  start: string,
  end: string,
): MonthlyValue[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  if (header !== 'Symbol,Date,Open,High,Low,Close,Volume,Adj Close')
    throw new Error('Expected legacy Yahoo adjusted-price CSV');
  const seen = new Set<string>();
  const rows = lines
    .map((line) => {
      const fields = line.split(',');
      const date = fields[1];
      if (
        fields.length !== 8 ||
        fields[0] !== symbol ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
      )
        throw new Error(`Invalid ${symbol} daily price row`);
      if (seen.has(date)) throw new Error(`Duplicate daily date ${date}`);
      seen.add(date);
      return { date, value: number(fields[7], 'Adj Close') };
    })
    .filter(
      (row) => row.date.slice(0, 7) >= start && row.date.slice(0, 7) <= end,
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const months = new Map<string, number>();
  for (const row of rows) months.set(row.date.slice(0, 7), row.value);
  const prices = [...months].map(([month, value]) => ({ month, value }));
  assertMonthlyValues(prices);
  if (
    prices[0].month !== start ||
    prices.at(-1)!.month !== end ||
    prices.some((row) => row.value <= 0)
  )
    throw new Error(
      `Missing requested endpoint or invalid price for ${symbol}`,
    );
  return prices;
}

export function parseAdjustedCsv(text: string): MonthlyValue[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  if (header !== 'month,adjusted_close')
    throw new Error('Expected month,adjusted_close');
  const rows = lines.map((line) => {
    const fields = line.split(',');
    if (fields.length !== 2) throw new Error('Invalid adjusted price row');
    return { month: fields[0], value: number(fields[1], 'adjusted close') };
  });
  assertMonthlyValues(rows);
  if (rows.some((row) => row.value <= 0))
    throw new Error('Adjusted prices must be positive');
  return rows;
}
