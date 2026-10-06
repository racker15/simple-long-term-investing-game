import { useEffect, useRef, useState } from 'react';
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
import { normalizeAllocations } from '../lib/portfolio';
import { createResult } from '../lib/results';
import { Allocation } from './Allocation';
import { Reveal } from './Reveal';
import { ScenarioView } from './ScenarioView';
type Choice = { allocations: Allocations; expected: AssetId };
export function PracticeReplay({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const context = historicalDecisionContext(id);
  const key = `investing-game:practice:${id}:v1`;
  const [warning, setWarning] = useState('');
  const [choice, setChoice] = useState<Choice | null>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(key) ?? 'null',
      ) as Choice | null;
      if (!saved) return null;
      const ids = context.asset_definitions.map((asset) => asset.id);
      if (
        !ids.includes(saved.expected) ||
        Object.keys(saved.allocations).length !== 7 ||
        Object.values(saved.allocations).reduce((a, b) => a + b, 0) !== 10000
      )
        return null;
      return {
        ...saved,
        allocations: normalizeAllocations(ids, saved.allocations),
      };
    } catch {
      return null;
    }
  });
  const locked = useRef(choice !== null);
  const [reveal, setReveal] = useState<{
    scenario: Scenario;
    result: ScenarioResult;
  } | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError('');
    if (!choice) {
      setReveal(null);
      return;
    }
    loadHistoricalScenario(id)
      .then((scenario) => {
        if (!cancelled)
          setReveal({
            scenario,
            result: createResult(scenario, choice.allocations, choice.expected),
          });
      })
      .catch(() => {
        if (!cancelled)
          setError(
            'The practice story could not load. Your choice is still saved in this tab.',
          );
      });
    return () => {
      cancelled = true;
    };
  }, [id, choice, retry]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [reveal]);
  function restart() {
    try {
      localStorage.removeItem(key);
    } catch {
      setWarning('Practice progress cannot be saved in this browser.');
    }
    locked.current = false;
    setChoice(null);
    setReveal(null);
    setError('');
  }
  return (
    <>
      <header>
        <a href="#main">Long-term investing</a>
        <span>Practice replay</span>
      </header>
      <main id="main">
        <aside className="development-notice">
          <strong>Practice replay.</strong> You have already explored this date.
          Trying another choice will not change your first-time history or
          session scorecards.
        </aside>
        <button className="secondary" onClick={onClose}>
          Back to sessions
        </button>
        {warning && <p role="status">{warning}</p>}
        {error ? (
          <section className="panel">
            <p role="alert">{error}</p>
            <button
              onClick={() => {
                try {
                  if (localStorage.getItem(key) === JSON.stringify(choice)) {
                    window.location.reload();
                    return;
                  }
                } catch {
                  /* Retain unsaved choice. */
                }
                setRetry((value) => value + 1);
              }}
            >
              Retry practice loading
            </button>
          </section>
        ) : reveal ? (
          <Reveal
            scenario={reveal.scenario}
            result={reveal.result}
            onNext={restart}
            isLast={false}
            continueLabel="Try another practice choice"
          />
        ) : choice ? (
          <p role="status">Loading the practice reveal…</p>
        ) : (
          <>
            <ScenarioView context={context} />
            <Allocation
              key={id + String(choice === null)}
              context={context}
              onCommit={(allocations, expected) => {
                if (locked.current) return;
                locked.current = true;
                const next = { allocations, expected };
                try {
                  localStorage.setItem(key, JSON.stringify(next));
                } catch {
                  setWarning(
                    'Practice progress could not be saved. Keep this tab open.',
                  );
                }
                setChoice(next);
              }}
            />
          </>
        )}
      </main>
    </>
  );
}
