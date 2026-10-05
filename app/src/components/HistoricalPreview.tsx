import { useEffect, useState } from 'react';
import {
  historicalDecisionContext,
  loadHistoricalScenario,
} from '../data/historical';
import type {
  Allocations,
  AssetId,
  Scenario,
  ScenarioResult,
} from '../lib/contracts';
import { createResult } from '../lib/results';
import { Allocation } from './Allocation';
import { Reveal } from './Reveal';
import { ScenarioView } from './ScenarioView';

const context = historicalDecisionContext('1999-09');
export default function HistoricalPreview() {
  const [reveal, setReveal] = useState<{
    scenario: Scenario;
    result: ScenarioResult;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [reveal]);
  async function commit(allocations: Allocations, expected: AssetId) {
    setLoading(true);
    setError('');
    try {
      const scenario = await loadHistoricalScenario('1999-09');
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
      <main id="main">
        <aside className="development-notice">
          <strong>Single-scenario development preview.</strong> Historical
          public data uses documented proxies. This preview is separate from
          production sessions and does not save session progress.
        </aside>
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
            <ScenarioView context={context} />
            <Allocation context={context} onCommit={commit} />
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
