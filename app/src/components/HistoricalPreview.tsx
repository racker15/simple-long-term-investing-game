import { useLayoutEffect, useState } from 'react';
import {
  historicalDecisionContext,
  loadHistoricalScenario,
  productionLibrary,
} from '../data/historical';
import type {
  Allocations,
  AssetId,
  Scenario,
  ScenarioResult,
} from '../lib/contracts';
import { createResult } from '../lib/results';
import { DecisionView } from './DecisionView';
import { Reveal } from './Reveal';

export default function HistoricalPreview() {
  const requested =
    new URLSearchParams(window.location.search).get('scenario') ?? '1999-09';
  const id = productionLibrary.some((entry) => entry.scenario_id === requested)
    ? requested
    : '1999-09';
  const context = historicalDecisionContext(id);
  const [reveal, setReveal] = useState<{
    scenario: Scenario;
    result: ScenarioResult;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useLayoutEffect(() => {
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [reveal]);
  async function commit(allocations: Allocations, expected: AssetId) {
    setLoading(true);
    setError('');
    try {
      const scenario = await loadHistoricalScenario(id);
      setReveal({
        scenario,
        result: createResult(scenario, allocations, expected),
      });
    } catch {
      setError('The prepared scenario could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <header>
        <a href="#main">Long-term investing</a>
        <span>Historical preview</span>
      </header>
      <main id="main" tabIndex={-1}>
        <aside className="development-notice">
          <strong>Single-scenario development preview.</strong> Historical
          public data uses documented proxies. This preview is separate from
          production sessions and does not save session progress.
        </aside>
        {requested !== id && (
          <p role="alert">
            Unknown scenario. Showing the September 1999 preview.
          </p>
        )}
        <nav
          className="historical-previews"
          aria-label="Historical scenario previews"
        >
          {productionLibrary.map((entry) => (
            <a
              key={entry.scenario_id}
              href={`?scenario=${entry.scenario_id}`}
              aria-current={entry.scenario_id === id ? 'page' : undefined}
            >
              {historicalDecisionContext(entry.scenario_id).display_date}
            </a>
          ))}
        </nav>
        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p role="status">Loading the five-year reveal…</p>
        ) : reveal ? (
          <Reveal
            scenario={reveal.scenario}
            result={reveal.result}
            isLast={false}
            onNext={() => setReveal(null)}
            continueLabel="Restart preview"
          />
        ) : (
          <>
            <DecisionView context={context} onCommit={commit} />
          </>
        )}
      </main>
      <footer>
        Decisions use information available at the starting date. Outcomes
        unfold after you invest.
      </footer>
    </>
  );
}
