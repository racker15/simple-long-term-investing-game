import { expect, it } from 'vitest';
import { fixture } from '../../app/src/data/fixture';
import { assetIds } from '../../app/src/lib/contracts';
import {
  startSession,
  lockResult,
  finishSession,
} from '../../app/src/lib/session';
import { createResult } from '../../app/src/lib/results';
import {
  emptyHistory,
  readHistory,
  rememberSession,
  playedIds,
  firstTimeResults,
} from '../../app/src/lib/history';
const ids = ['a', 'b', 'c', 'd', 'e'];
const started = () => startSession(ids, 'session', '2026-10-06T00:00:00Z');
const assets = () => assetIds(fixture.known);
it('restores a historical queue without loading any future outcomes', () => {
  const history = { ...emptyHistory(), active: started() };
  expect(readHistory(JSON.stringify(history), assets)).toEqual(history);
});
it('preserves a committed pending choice across refresh', () => {
  const result = createResult(fixture, { cash: 10000 }, 'cash');
  const history = {
    ...emptyHistory(),
    active: started(),
    pending: { allocations: result.allocations, expected: 'cash' },
  };
  expect(readHistory(JSON.stringify(history), assets)).toEqual(history);
  history.pending.allocations.cash = 9500;
  expect(() => readHistory(JSON.stringify(history), assets)).toThrow();
});
it('rejects fictional saves, unknown scenarios, and broken pending predictions', () => {
  const history = { ...emptyHistory(), active: started() };
  history.active.development_mode = true;
  expect(() => readHistory(JSON.stringify(history), assets)).toThrow();
  history.active.development_mode = false;
  expect(() =>
    readHistory(JSON.stringify(history), () => {
      throw new Error('unknown');
    }),
  ).toThrow();
  expect(() => readHistory('{broken', assets)).toThrow();
});
it('archives a completed session once and retains first-time played IDs', () => {
  let session = started();
  // These synthetic results exercise persistence, not historical numerical data.
  for (const id of ids) {
    const result = {
      ...createResult(fixture, { cash: 10000 }, 'cash'),
      scenario_id: id,
    };
    result.allocations = Object.fromEntries(
      Object.entries(result.allocations).map(([k, v]) => [
        k.replace(fixture.known.metadata.scenario_id, id),
        v,
      ]),
    ) as typeof result.allocations;
    result.asset_ending_values = Object.fromEntries(
      Object.entries(result.asset_ending_values).map(([k, v]) => [
        k.replace(fixture.known.metadata.scenario_id, id),
        v,
      ]),
    ) as typeof result.asset_ending_values;
    result.year_one_leader = 'cash';
    session = lockResult({ ...session, phase: 'decision' }, result);
  }
  session = finishSession(session, '2026-10-06T01:00:00Z');
  const history = rememberSession(
    rememberSession(emptyHistory(), session),
    session,
  );
  expect(history.finished).toHaveLength(1);
  expect(firstTimeResults(history)).toHaveLength(5);
  expect(playedIds(history)).toEqual(ids);
  expect(playedIds({ ...history, active: null })).toEqual(ids);
});
