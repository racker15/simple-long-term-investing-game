import { readFile } from 'node:fs/promises';
import type { BroadDataset } from '../lib/monthly';
import { cutoffMonth, monthIndex } from '../lib/monthly';
import { readJson, sha256, writeJson } from '../lib/files';
import {
  eligibleUniverse,
  OPERATIONAL_REASONS,
  randomWords,
  validateProtocol,
  type Draw,
  type OperationalExclusion,
  type SelectedDate,
  type SelectionProtocol,
} from './dates';

export type ProductionProtocol = SelectionProtocol & {
  audit_version: 2;
  replacement_order: 'finish-original-slot-before-next';
  exhaustion: 'persist-failed-audit';
};

// The pinned v1 pilot implementation remains unchanged. This separately
// preregistered version changes only repair ordering and failure persistence.
export function selectProductionDates(
  protocol: ProductionProtocol,
  broad: BroadDataset,
  cohort = 'production',
  exclusions: OperationalExclusion[] = [],
) {
  if (
    protocol.audit_version !== 2 ||
    protocol.replacement_order !== 'finish-original-slot-before-next' ||
    protocol.exhaustion !== 'persist-failed-audit'
  )
    throw new Error('Unsupported production audit policy');
  const strata = validateProtocol(protocol, cohort);
  const universe = eligibleUniverse(protocol, broad);
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
      throw new Error('Invalid operational exclusion');
    excluded.set(exclusion.date, exclusion);
  }
  const pools = new Map(
    strata.map((stratum) => [
      stratum.id,
      universe.eligible.filter(
        (date) =>
          date.slice(0, 7) >= stratum.start_month &&
          date.slice(0, 7) <= stratum.end_month,
      ),
    ]),
  );
  const random = randomWords(protocol.seed);
  const draws: Draw[] = [];
  const accepted: SelectedDate[] = [];
  const withdrawals: {
    draw_index: number;
    reason: OperationalExclusion['reason'];
    evidence: string;
  }[] = [];
  const progress: {
    failure: { reason: string; slot: number; stratum: string } | null;
  } = { failure: null };
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
        ...protocol.important_dates.map((entry) => entry.date),
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
        const entry = {
          date,
          stratum,
          draw_index: index,
          replacement_for: replacement,
        };
        accepted.push(entry);
        return entry;
      }
      replacement = index;
    }
    progress.failure = {
      reason: `Selection exhausted stratum ${stratum} for slot ${slot}`,
      slot,
      stratum,
    };
    return null;
  }

  // Keep the v1 initial draw byte-for-byte equivalent, including rejected words
  // and spacing attempts. Operational review starts after all initial slots.
  let slot = 0;
  initial: for (
    let round = 0;
    round < Math.max(...strata.map((s) => s.quota));
    round++
  )
    for (const stratum of strata)
      if (round < stratum.quota && !fill(slot++, stratum.id)) break initial;

  if (!progress.failure) {
    const originals = [...accepted];
    for (const original of originals) {
      let entry: SelectedDate | null = original;
      while (entry && excluded.has(entry.date)) {
        const exclusion = excluded.get(entry.date)!;
        withdrawals.push({
          draw_index: entry.draw_index,
          reason: exclusion.reason,
          evidence: exclusion.evidence,
        });
        accepted.splice(accepted.indexOf(entry), 1);
        entry = fill(
          draws[original.draw_index].slot,
          entry.stratum,
          entry.draw_index,
        );
      }
      if (progress.failure) break;
    }
  }
  return {
    schema_version: 2,
    audit_version: protocol.audit_version,
    status: progress.failure ? ('failed' as const) : ('complete' as const),
    failure: progress.failure,
    cohort,
    universe_id: protocol.universe_id,
    seed: protocol.seed,
    algorithm: protocol.algorithm,
    replacement_order: protocol.replacement_order,
    exhaustion: protocol.exhaustion,
    eligible_dates: universe.eligible,
    universe_exclusions: universe.unavailable.map((date) => ({
      date,
      reason: 'broad_history_unavailable',
    })),
    operational_exclusions: exclusions,
    important_dates: protocol.important_dates,
    draws,
    withdrawals,
    selected: accepted.sort(
      (a, b) => draws[a.draw_index].slot - draws[b.draw_index].slot,
    ),
  };
}

export async function writeProductionAudit(
  path: string,
  audit: ReturnType<typeof selectProductionDates>,
  inputPaths: string[],
) {
  const output = {
    ...audit,
    input_hashes: Object.fromEntries(
      await Promise.all(
        inputPaths.map(async (input) => [input, sha256(await readFile(input))]),
      ),
    ),
  };
  await writeJson(path, output);
  return output;
}

if (process.argv[1]?.endsWith('/select/production.ts')) {
  const cohort =
    process.argv.find((arg) => arg.startsWith('--cohort='))?.slice(9) ??
    'production';
  const protocolPath = 'data/selection/production-protocol-v2.json';
  const broadPath = 'data/normalized/broad-assets/monthly-returns.json';
  const exclusionsPath = 'data/selection/operational-exclusions.json';
  const protocol = await readJson<ProductionProtocol>(protocolPath);
  const broad = await readJson<BroadDataset>(broadPath);
  const exclusions = await readJson<{
    schema_version: number;
    exclusions: OperationalExclusion[];
  }>(exclusionsPath);
  if (exclusions.schema_version !== 1)
    throw new Error('Unsupported exclusions version');
  const audit = selectProductionDates(
    protocol,
    broad,
    cohort,
    exclusions.exclusions,
  );
  await writeProductionAudit('data/selection/production-draw-v2.json', audit, [
    protocolPath,
    broadPath,
    exclusionsPath,
    'scripts/select/dates.ts',
    'scripts/select/production.ts',
  ]);
  if (audit.status === 'failed') {
    console.error(audit.failure?.reason);
    process.exitCode = 1;
  }
}
