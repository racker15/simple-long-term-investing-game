import { readFile } from 'node:fs/promises';
import { BROAD_ASSET_IDS } from '../../app/src/lib/contracts';
import {
  assertMonthlyReturns,
  cutoffMonth,
  monthIndex,
  shiftMonth,
  type BroadDataset,
} from '../lib/monthly';
import { readJson, sha256, writeJson } from '../lib/files';

export type SelectionProtocol = {
  schema_version: 1;
  universe_id: string;
  seed: string;
  algorithm: 'fnv1a-utf16-mulberry32-unbiased-v1';
  start_month: string;
  end_month: string;
  trailing_months: 12;
  future_months: 60;
  minimum_spacing_months: number;
  strata: {
    id: string;
    start_month: string;
    end_month: string;
    weight: number;
  }[];
  cohorts: Record<string, number>;
  important_dates: { date: string; reason: string }[];
};
export const OPERATIONAL_REASONS = [
  'starting_sources_unavailable',
  'stock_history_unreconstructable',
  'broad_history_unavailable',
] as const;
export type OperationalExclusion = {
  date: string;
  reason: (typeof OPERATIONAL_REASONS)[number];
  evidence: string;
};
export type Draw = {
  index: number;
  slot: number;
  stratum: string;
  date: string;
  population: number;
  words: number[];
  status: 'accepted' | 'rejected' | 'withdrawn';
  reason: string;
  replacement_for: number | null;
};
export type SelectedDate = {
  date: string;
  stratum: string;
  draw_index: number;
  replacement_for: number | null;
};

// Explicit uint32 wrap avoids relying on a growing floating-point state.
export function randomWords(seed: string) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++)
    state = Math.imul(state ^ seed.charCodeAt(i), 16777619) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return (value ^ (value >>> 14)) >>> 0;
  };
}

export function monthEnd(month: string) {
  monthIndex(month);
  return new Date(
    Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0),
  )
    .toISOString()
    .slice(0, 10);
}

export function validateProtocol(protocol: SelectionProtocol, cohort: string) {
  if (
    protocol.schema_version !== 1 ||
    protocol.algorithm !== 'fnv1a-utf16-mulberry32-unbiased-v1' ||
    !protocol.seed ||
    !protocol.universe_id ||
    protocol.trailing_months !== 12 ||
    protocol.future_months !== 60
  )
    throw new Error('Unsupported selection protocol');
  if (
    !Number.isInteger(protocol.minimum_spacing_months) ||
    protocol.minimum_spacing_months < 1
  )
    throw new Error('Spacing must be a positive integer');
  const first = monthIndex(protocol.start_month),
    last = monthIndex(protocol.end_month);
  if (first > last || !protocol.strata.length)
    throw new Error('Empty universe');
  const count = protocol.cohorts[cohort];
  if (!Number.isInteger(count) || count < 1)
    throw new Error('Unknown or invalid cohort');
  const weight = protocol.strata.reduce(
    (sum, stratum) => sum + stratum.weight,
    0,
  );
  const ids = new Set<string>();
  let next = first;
  for (const stratum of protocol.strata) {
    if (
      !stratum.id ||
      ids.has(stratum.id) ||
      monthIndex(stratum.start_month) !== next ||
      monthIndex(stratum.end_month) < next ||
      !Number.isInteger(stratum.weight) ||
      stratum.weight < 1 ||
      !Number.isInteger((count * stratum.weight) / weight)
    )
      throw new Error(
        'Strata must partition the universe with unique IDs and integral weighted quotas',
      );
    ids.add(stratum.id);
    next = monthIndex(stratum.end_month) + 1;
  }
  if (next !== last + 1) throw new Error('Strata must cover the universe');
  const dates = new Set<string>();
  for (const entry of protocol.important_dates) {
    const month = cutoffMonth(entry.date);
    if (
      !entry.reason.trim() ||
      dates.has(entry.date) ||
      monthIndex(month) < first ||
      monthIndex(month) > last
    )
      throw new Error('Invalid important date');
    dates.add(entry.date);
  }
  return protocol.strata.map((stratum) => ({
    ...stratum,
    quota: (count * stratum.weight) / weight,
  }));
}

// Eligibility reads only month labels. No future return magnitudes or winners
// enter the selection algorithm; malformed numerical inputs still fail closed.
export function eligibleUniverse(
  protocol: SelectionProtocol,
  broad: BroadDataset,
) {
  const coverage = BROAD_ASSET_IDS.map((id) => {
    assertMonthlyReturns(broad.series[id].observations);
    return new Set(broad.series[id].observations.map((row) => row.month));
  });
  const eligible: string[] = [],
    unavailable: string[] = [];
  for (
    let i = monthIndex(protocol.start_month);
    i <= monthIndex(protocol.end_month);
    i++
  ) {
    const month = shiftMonth(
      protocol.start_month,
      i - monthIndex(protocol.start_month),
    );
    const complete = coverage.every((months) => {
      for (let offset = -11; offset <= 60; offset++)
        if (!months.has(shiftMonth(month, offset))) return false;
      return true;
    });
    (complete ? eligible : unavailable).push(monthEnd(month));
  }
  return { eligible, unavailable };
}

export function selectDates(
  protocol: SelectionProtocol,
  broad: BroadDataset,
  cohort: string,
  exclusions: OperationalExclusion[] = [],
) {
  const strata = validateProtocol(protocol, cohort);
  const universe = eligibleUniverse(protocol, broad);
  const unavailable = new Set(universe.unavailable);
  const excluded = new Map<string, OperationalExclusion>();
  for (const exclusion of exclusions) {
    const month = cutoffMonth(exclusion.date);
    if (
      !OPERATIONAL_REASONS.includes(exclusion.reason) ||
      !exclusion.evidence?.trim() ||
      excluded.has(exclusion.date) ||
      month < protocol.start_month ||
      month > protocol.end_month
    )
      throw new Error(
        'Invalid operational exclusion: use a predeclared reason and concrete evidence',
      );
    excluded.set(exclusion.date, exclusion);
  }
  const pools = new Map(
    strata.map((s) => [
      s.id,
      universe.eligible.filter(
        (date) =>
          date.slice(0, 7) >= s.start_month && date.slice(0, 7) <= s.end_month,
      ),
    ]),
  );
  const random = randomWords(protocol.seed);
  const draws: Draw[] = [],
    accepted: SelectedDate[] = [];
  const reserved = protocol.important_dates.map((entry) => entry.date);
  const near = (a: string, b: string) =>
    Math.abs(monthIndex(a.slice(0, 7)) - monthIndex(b.slice(0, 7))) <
    protocol.minimum_spacing_months;
  function fill(
    slot: number,
    stratum: string,
    replacement: number | null = null,
  ) {
    const pool = pools.get(stratum)!;
    while (pool.length) {
      const words: number[] = [];
      const limit = Math.floor(4294967296 / pool.length) * pool.length;
      let word: number;
      do {
        word = random();
        words.push(word);
      } while (word >= limit);
      const population = pool.length;
      const [date] = pool.splice(word % population, 1);
      const conflict = [
        ...reserved,
        ...accepted.map((entry) => entry.date),
      ].find((other) => near(date, other));
      const index = draws.length;
      draws.push({
        index,
        slot,
        stratum,
        date,
        population,
        words,
        status: conflict ? 'rejected' : 'accepted',
        reason: conflict ? `spacing:${conflict}` : 'eligible',
        replacement_for: replacement,
      });
      if (!conflict) {
        accepted.push({
          date,
          stratum,
          draw_index: index,
          replacement_for: replacement,
        });
        return;
      }
      replacement = index;
    }
    throw new Error(`Selection exhausted stratum ${stratum} for slot ${slot}`);
  }
  // Round-robin strata, repeated by integer weighted quotas. Pilot is a prefix
  // of the initial production draw; post-draw repairs are appended afterward.
  let slot = 0;
  for (let round = 0; round < Math.max(...strata.map((s) => s.quota)); round++)
    for (const stratum of strata)
      if (round < stratum.quota) fill(slot++, stratum.id);
  // Preserve every unaffected acceptance; continue the same PRNG and remaining
  // pools, repair in slot order, and never erase the original accepted record.
  const withdrawals: {
    draw_index: number;
    reason: string;
    evidence: string;
  }[] = [];
  for (let repair = 0; repair < accepted.length;) {
    const entry = accepted[repair],
      exclusion = excluded.get(entry.date);
    if (!exclusion) {
      repair++;
      continue;
    }
    const original = draws[entry.draw_index];
    withdrawals.push({
      draw_index: entry.draw_index,
      reason: exclusion.reason,
      evidence: exclusion.evidence,
    });
    accepted.splice(repair, 1);
    // Draw records retain the original acceptance; withdrawal events are separate.
    fill(original.slot, entry.stratum, original.index);
    repair = 0;
  }
  return {
    schema_version: 1,
    cohort,
    universe_id: protocol.universe_id,
    seed: protocol.seed,
    algorithm: protocol.algorithm,
    eligible_dates: universe.eligible,
    universe_exclusions: [...unavailable].map((date) => ({
      date,
      reason: 'broad_history_unavailable',
    })),
    operational_exclusions: exclusions,
    draws,
    withdrawals,
    selected: accepted.sort(
      (a, b) => draws[a.draw_index].slot - draws[b.draw_index].slot,
    ),
  };
}

if (process.argv[1]?.endsWith('/select/dates.ts')) {
  const cohort =
    process.argv.find((arg) => arg.startsWith('--cohort='))?.split('=')[1] ??
    'pilot';
  const protocolPath = 'data/selection/protocol.json',
    broadPath = 'data/normalized/broad-assets/monthly-returns.json',
    exclusionsPath = 'data/selection/operational-exclusions.json';
  const protocol = await readJson<SelectionProtocol>(protocolPath);
  const broad = await readJson<BroadDataset>(broadPath);
  const exclusions = await readJson<{
    schema_version: number;
    exclusions: OperationalExclusion[];
  }>(exclusionsPath);
  if (exclusions.schema_version !== 1)
    throw new Error('Unsupported exclusions version');
  const output = {
    ...selectDates(protocol, broad, cohort, exclusions.exclusions),
    input_hashes: Object.fromEntries(
      await Promise.all(
        [
          protocolPath,
          broadPath,
          exclusionsPath,
          'scripts/select/dates.ts',
        ].map(async (path) => [path, sha256(await readFile(path))]),
      ),
    ),
    important_dates: protocol.important_dates,
  };
  await writeJson(
    `data/selection/${cohort}-draw.json`,
    output,
    process.argv.includes('--check'),
  );
}
