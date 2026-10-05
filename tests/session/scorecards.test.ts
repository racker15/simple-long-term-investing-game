import { describe, expect, it } from 'vitest';
import {
  aggregateResults,
  blockScorecard,
  sessionScorecard,
  CONCENTRATION_THRESHOLD,
  COHORT_MINIMUM_SAMPLE,
} from '../../app/src/lib/scorecards';
import { createResult, resultExpectations } from '../../app/src/lib/results';
import { fixture } from '../../app/src/data/fixture';
import {
  startSession,
  lockResult,
  advanceSession,
  finishSession,
} from '../../app/src/lib/session';
import {
  structuralErrors,
  validateSession,
} from '../../app/src/lib/validation';
import type { AssetId, ScenarioResult } from '../../app/src/lib/contracts';
const base = createResult(
  fixture,
  {
    us_total: 5000,
    bonds: 2000,
    international_ex_us: 1000,
    'hot:dev-fictional:retail': 1000,
  },
  'hot:dev-fictional:retail',
);
const result = (i: number): ScenarioResult => ({
  ...structuredClone(base),
  selection_mode: i < 5 ? 'important' : 'random',
  ending_portfolio_value: 10000 + i * 1000,
  ending_benchmark_value: 12000,
  max_drawdown: i === 0 ? 0.2 : 0.1,
  expected_winner:
    i % 2 === 0 ? 'hot:dev-fictional:retail' : 'hot:dev-fictional:telecom',
});
describe('scorecards', () => {
  it('uses explicit concentration and subgroup thresholds', () => {
    expect(CONCENTRATION_THRESHOLD).toBe(0.5);
    expect(COHORT_MINIMUM_SAMPLE).toBe(5);
  });
  it('computes exact five-result allocation, expectation and experience measures', () => {
    const block = blockScorecard(
      Array.from({ length: 5 }, (_, i) => result(i)),
    );
    expect(block.allocations).toEqual({
      broad_equity: 0.6,
      hot_stocks: 0.1,
      bonds: 0.2,
      cash: 0.1,
    });
    expect(block.concentration_count).toBe(5);
    expect(block.concentration_frequency).toBe(1);
    expect(block.prediction_hits).toBe(3);
    expect(block.prediction_bottom_half).toBe(2);
    expect(block.leader_reversals).toBe(5);
    expect(block.average_ending_value).toBe(12000);
    expect(block.average_benchmark_value).toBe(12000);
    expect(block.benchmark_beating_count).toBe(2);
    expect(block.drawdown_20_count).toBe(1);
    expect(block.largest_drawdown).toBe(0.2);
  });
  it('builds full-session summaries, medians, cohorts and every block', () => {
    const final = sessionScorecard(
      Array.from({ length: 10 }, (_, i) => result(i)),
    );
    expect(final.overall.average_ending_value).toBe(14500);
    expect(final.median_ending_value).toBe(14500);
    expect(final.prediction_hit_rate).toBe(0.5);
    expect(final.reversal_frequency).toBe(1);
    expect(final.blocks.map((b) => [b.start, b.end])).toEqual([
      [1, 5],
      [6, 10],
    ]);
    expect(final.cohorts.important?.count).toBe(5);
    expect(final.cohorts.random?.count).toBe(5);
    expect(
      sessionScorecard(Array.from({ length: 5 }, (_, i) => result(i)))
        .median_ending_value,
    ).toBe(12000);
    const small = Array.from({ length: 5 }, (_, i) => ({
      ...result(i),
      selection_mode: i < 3 ? ('important' as const) : ('random' as const),
    }));
    expect(sessionScorecard(small).cohorts).toEqual({
      important: null,
      random: null,
    });
    expect(final).not.toHaveProperty('score');
  });
  it('excludes middle rank four from bottom half and treats ties with documented ranking', () => {
    const tied = structuredClone(base);
    Object.keys(tied.asset_ending_values).forEach((id) => {
      tied.asset_ending_values[id as AssetId] = 10000;
    });
    tied.expected_winner = 'international_ex_us';
    expect(resultExpectations(tied).expected_winner_rank).toBe(4);
    expect(aggregateResults([tied]).prediction_bottom_half).toBe(0);
  });
  it('rejects incomplete blocks and empty summaries', () => {
    expect(() => blockScorecard([base])).toThrow();
    expect(() => sessionScorecard([])).toThrow();
    expect(() => aggregateResults([])).toThrow();
  });
});
describe('session lifecycle', () => {
  it('locks decisions once, checkpoints after five, permits early end, and stores schema-valid state', () => {
    let session = startSession(
      Array(10).fill('dev-fictional'),
      'test',
      '2026-10-05T12:00:00Z',
      true,
    );
    for (let i = 0; i < 5; i++) {
      session = lockResult(session, base);
      expect(() => lockResult(session, base)).toThrow();
      expect(validateSession(JSON.parse(JSON.stringify(session)))).toBe(true);
      session = advanceSession(session, '2026-10-05T12:01:00Z');
    }
    expect(session.phase).toBe('checkpoint');
    expect(session.completed).toHaveLength(5);
    expect(advanceSession(session, '2026-10-05T12:02:00Z').phase).toBe(
      'decision',
    );
    const ended = finishSession(session, '2026-10-05T12:02:00Z');
    expect(ended.phase).toBe('final');
    expect(validateSession(ended)).toBe(true);
    expect(structuralErrors('scenario_result', base)).toEqual([]);
  });
  it('finishes at the target and forbids early ending between checkpoints', () => {
    let session = startSession(
      Array(5).fill('dev-fictional'),
      'test',
      '2026-10-05T12:00:00Z',
      true,
    );
    expect(() => finishSession(session, '2026-10-05T12:01:00Z')).toThrow();
    for (let i = 0; i < 5; i++)
      session = advanceSession(
        lockResult(session, base),
        '2026-10-05T12:02:00Z',
      );
    expect(session.phase).toBe('final');
    expect(session.current_index).toBe(5);
  });
  it('rejects duplicate production queues and corrupt saved state', () => {
    expect(() =>
      startSession(Array(5).fill('same'), 'test', '2026-10-05T12:00:00Z'),
    ).toThrow();
    const session = startSession(
      Array(5).fill('dev-fictional'),
      'test',
      '2026-10-05T12:00:00Z',
      true,
    );
    expect(validateSession({ ...session, current_index: 3 })).toBe(false);
    expect(validateSession({ ...session, phase: 'final' })).toBe(false);
    expect(
      validateSession({ ...session, scenario_ids: ['dev-fictional'] }),
    ).toBe(false);
  });
});
