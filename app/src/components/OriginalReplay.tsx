import { useEffect, useState } from 'react';
import type { Scenario, ScenarioResult } from '../lib/contracts';
import { loadHistoricalScenario } from '../data/historical';
import { Reveal } from './Reveal';
export function OriginalReplay({
  result,
  onClose,
}: {
  result: ScenarioResult;
  onClose: () => void;
}) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError('');
    loadHistoricalScenario(result.scenario_id)
      .then((value) => {
        if (!cancelled) setScenario(value);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            'The saved story could not load. Your original choice is unchanged.',
          );
      });
    return () => {
      cancelled = true;
    };
  }, [result.scenario_id, retry]);
  return (
    <>
      <header>
        <a href="#main">Long-term investing</a>
        <span>Original-choice replay</span>
      </header>
      <main id="main" tabIndex={-1}>
        <button className="secondary" onClick={onClose}>
          Back to history
        </button>
        <p>
          This is your original locked choice. Replaying does not change your
          history.
        </p>
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button onClick={() => setRetry((value) => value + 1)}>
              Retry saved replay
            </button>
          </>
        ) : scenario ? (
          <Reveal
            scenario={scenario}
            result={result}
            onNext={onClose}
            isLast={false}
            continueLabel="Back to completed scenarios"
          />
        ) : (
          <p role="status">Loading your saved reveal…</p>
        )}
      </main>
    </>
  );
}
