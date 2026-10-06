import { describe, expect, it } from 'vitest';
import { fixture } from '../../app/src/data/fixture';
import {
  validateScenario,
  loadScenario,
  decisionContext,
  structuralErrors,
} from '../../app/src/lib/validation';
import type { Scenario } from '../../app/src/lib/contracts';
const copy = () => structuredClone(fixture);
describe('scenario validation', () => {
  it('accepts the fixture and flags bankruptcy for review without rejection', () => {
    const report = validateScenario(fixture);
    expect(report.errors).toEqual([]);
    expect(report.valid).toBe(true);
    expect(report.warnings.some((issue) => issue.message.includes('80%'))).toBe(
      true,
    );
  });
  it.each([
    ['three hot stocks', (s: Scenario) => s.known.hot_stocks.pop()],
    ['seven assets', (s: Scenario) => s.known.asset_definitions.pop()],
    ['60 observations', (s: Scenario) => s.future.monthly_returns.cash.pop()],
    [
      'duplicate month',
      (s: Scenario) => {
        s.future.monthly_returns.cash[1].month =
          s.future.monthly_returns.cash[0].month;
      },
    ],
    [
      'unsorted months',
      (s: Scenario) => {
        s.future.monthly_returns.cash.reverse();
      },
    ],
    [
      'missing month',
      (s: Scenario) => {
        s.future.monthly_returns.cash[0].month = '2000-03';
      },
    ],
    [
      'NaN',
      (s: Scenario) => {
        s.future.monthly_returns.cash[0].return = NaN;
      },
    ],
    [
      'Infinity',
      (s: Scenario) => {
        s.known.macro[0].value = Infinity;
      },
    ],
    [
      'below -100%',
      (s: Scenario) => {
        s.future.monthly_returns.cash[0].return = -1.001;
      },
    ],
    [
      'invalid date',
      (s: Scenario) => {
        s.known.metadata.date = '2000-02-30';
      },
    ],
    [
      'not month-end',
      (s: Scenario) => {
        s.known.metadata.date = '2000-01-30';
      },
    ],
    [
      'future publication',
      (s: Scenario) => {
        s.provenance.sources[0].publication_date = '2000-02-01';
      },
    ],
    [
      'missing source',
      (s: Scenario) => {
        s.known.headlines[0].source_ids = ['missing'];
      },
    ],
    [
      'duplicate stock IDs',
      (s: Scenario) => {
        s.known.hot_stocks[1].id = s.known.hot_stocks[0].id;
      },
    ],
    [
      'wrong scenario hot ID',
      (s: Scenario) => {
        s.known.hot_stocks[0].id = 'hot:other:acme';
      },
    ],
    [
      'mismatched scenario ID',
      (s: Scenario) => {
        s.future.scenario_id = 'other';
      },
    ],
    [
      'duplicate broad recent returns',
      (s: Scenario) => {
        s.known.recent_returns[0].asset_id = 'bonds';
      },
    ],
    [
      'event outside window',
      (s: Scenario) => {
        s.future.events[0].month = '2000-01';
      },
    ],
  ])('rejects %s with actionable paths', (_, mutate) => {
    const scenario = copy();
    mutate(scenario);
    const report = validateScenario(scenario);
    expect(report.valid).toBe(false);
    expect(report.errors[0].path).toMatch(/^\//);
    expect(report.errors[0].message.length).toBeGreaterThan(5);
    expect(() => loadScenario(scenario)).toThrow();
  });
  it('rejects missing fields, invalid selection and random draws without provenance', () => {
    const scenario = copy();
    const invalid = {
      ...scenario.known,
      metadata: { ...scenario.known.metadata, selection: { mode: 'random' } },
    };
    expect(validateScenario({ ...scenario, known: invalid }).valid).toBe(false);
    expect(
      structuralErrors('metadata', {
        ...scenario.known.metadata,
        selection: { mode: 'unknown' },
      }),
    ).not.toEqual([]);
    expect(validateScenario({ ...scenario, known: {} }).valid).toBe(false);
    expect(
      validateScenario({
        ...scenario,
        known: { ...scenario.known, future_leak: 'winner' },
      }).valid,
    ).toBe(false);
  });
  it('accepts complete random metadata including zero draw index', () => {
    const scenario = copy();
    scenario.known.metadata.selection = {
      mode: 'random',
      draw_universe: 'test-months',
      random_seed: 'test',
      draw_index: 0,
      method: 'uniform',
      exclusions: [],
      replacement_for: null,
    };
    expect(validateScenario(scenario).valid).toBe(true);
  });
  it('allows an honestly undated outcome archive without treating retrieval as publication', () => {
    const scenario = copy();
    const source = scenario.provenance.sources.find(
      (record) => record.id === 'fictional-outcomes',
    )!;
    source.publication_date = null;
    source.notes =
      'Current retrospective archive; original publication date is unknown.';
    expect(validateScenario(scenario).errors).toEqual([]);
    expect(
      loadScenario(scenario).provenance.sources.find(
        (record) => record.id === source.id,
      )!.publication_date,
    ).toBeNull();
  });
  it('rejects undated starting evidence even when its observation and retrieval precede the cutoff', () => {
    const scenario = copy();
    const source = scenario.provenance.sources.find(
      (record) => record.id === 'fictional-start',
    )!;
    source.publication_date = null;
    source.retrieved_at = '2000-01-30';
    const report = validateScenario(scenario);
    expect(report.valid).toBe(false);
    expect(
      report.errors.some(
        (issue) =>
          issue.path.startsWith('/known/') &&
          issue.message.includes('established publication date'),
      ),
    ).toBe(true);
    expect(() => loadScenario(scenario)).toThrow();
  });
  it('checks cutoff recursively across all pre-investment fields', () => {
    const scenario = copy();
    scenario.known.hot_stocks[0].source_ids = ['fictional-outcomes'];
    expect(
      validateScenario(scenario).errors.some(
        (e) => e.path.includes('hot_stocks') && e.message.includes('cutoff'),
      ),
    ).toBe(true);
  });
  it('permits extreme legitimate returns but reports warnings', () => {
    const scenario = copy();
    scenario.future.monthly_returns.cash[0].return = 1.2;
    const report = validateScenario(scenario);
    expect(report.valid).toBe(true);
    expect(report.warnings.length).toBeGreaterThan(1);
  });
});
describe('information firewall', () => {
  it('decision projection works with only known data and hides cohort metadata', () => {
    const decision = decisionContext(fixture.known);
    expect(decision).not.toHaveProperty('metadata');
    expect(decision).not.toHaveProperty('future');
    expect(JSON.stringify(decision)).not.toContain('Developer-selected');
    expect(JSON.stringify(decision)).not.toContain(
      fixture.future.reflection.what_nobody_knew,
    );
    const changed = copy();
    changed.future.what_happened_next.text = 'SECRET_FUTURE';
    changed.known.metadata.selection = {
      mode: 'important',
      selection_reason: 'SECRET_CLASSIFICATION',
    };
    expect(decisionContext(changed.known)).toEqual(decision);
  });
});
