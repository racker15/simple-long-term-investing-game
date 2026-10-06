import { useEffect, useRef, useState } from 'react';
import {
  historicalDecisionContext,
  loadHistoricalScenario,
  productionLibrary,
} from './data/historical';
import {
  DEFAULT_SESSION_LENGTH,
  SESSION_LENGTHS,
  type Allocations,
  type AssetId,
  type Scenario,
} from './lib/contracts';
import {
  startSession,
  lockResult,
  advanceSession,
  finishSession,
} from './lib/session';
import { buildSessionQueue } from './lib/queue';
import { createResult } from './lib/results';
import {
  HISTORY_KEY,
  emptyHistory,
  readHistory,
  rememberSession,
  playedIds,
  firstTimeResults,
  type PlayerHistory,
} from './lib/history';
import { ScenarioView } from './components/ScenarioView';
import { Allocation } from './components/Allocation';
import { Reveal } from './components/Reveal';
import { Checkpoint, FinalScorecard } from './components/Scorecard';
import { PlayerHistory as LearningHistory } from './components/PlayerHistory';
import { PracticeReplay } from './components/PracticeReplay';
const PRACTICE_KEY = 'investing-game:practice-open:v1';
const assets = (id: string) =>
  historicalDecisionContext(id).asset_definitions.map((asset) => asset.id);
function restore() {
  try {
    return {
      history: readHistory(localStorage.getItem(HISTORY_KEY), assets),
      warning: '',
    };
  } catch {
    return {
      history: emptyHistory(),
      warning:
        'Saved progress could not be read. You can start a new session. Browser storage may be unavailable.',
    };
  }
}
export default function App() {
  const [initial] = useState(restore);
  const [history, setHistory] = useState(initial.history);
  const current = useRef(history);
  const [practiceId, setPracticeId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(PRACTICE_KEY);
      return !initial.history.active &&
        saved &&
        playedIds(initial.history).includes(saved)
        ? saved
        : null;
    } catch {
      return null;
    }
  });
  const [warning, setWarning] = useState(initial.warning);
  const [target, setTarget] = useState<number>(DEFAULT_SESSION_LENGTH);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const session = history.active;
  const pending = history.pending;
  function save(next: PlayerHistory) {
    current.current = next;
    let persisted = false;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      persisted = true;
    } catch {
      setWarning(
        'Progress could not be saved. Keep this tab open to finish your session.',
      );
    }
    setHistory(next);
    return persisted;
  }
  const id =
    session?.scenario_ids[
      session.phase === 'reveal'
        ? session.current_index - 1
        : session.current_index
    ];
  useEffect(() => {
    let cancelled = false;
    setScenario(null);
    setError('');
    if (!id || (!pending && session?.phase !== 'reveal')) return;
    const snapshot = history;
    loadHistoricalScenario(id)
      .then((loaded) => {
        if (cancelled || current.current !== snapshot) return;
        setScenario(loaded);
        if (snapshot.pending && snapshot.active)
          save(
            rememberSession(
              snapshot,
              lockResult(
                snapshot.active,
                createResult(
                  loaded,
                  snapshot.pending.allocations,
                  snapshot.pending.expected,
                ),
              ),
            ),
          );
      })
      .catch(() => {
        if (!cancelled)
          setError(
            'The five-year story could not load. Your decision is locked. Try loading it again.',
          );
      });
    return () => {
      cancelled = true;
    };
  }, [id, pending, session?.phase, retry]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [session?.phase, session?.current_index]);
  const played = playedIds(history);
  const unseen = productionLibrary.filter(
    (entry) => !played.includes(entry.scenario_id),
  );
  const lengths = SESSION_LENGTHS.filter((count) => count <= unseen.length);
  const chosenTarget = lengths.includes(
    target as (typeof SESSION_LENGTHS)[number],
  )
    ? target
    : lengths.at(-1);
  const next = () =>
    session &&
    save(
      rememberSession(
        history,
        advanceSession(session, new Date().toISOString()),
      ),
    );
  function commit(allocations: Allocations, expected: AssetId) {
    if (current.current.pending || current.current.active?.phase !== 'decision')
      return false;
    return save({ ...current.current, pending: { allocations, expected } });
  }
  if (practiceId)
    return (
      <PracticeReplay
        key={practiceId}
        id={practiceId}
        onClose={() => {
          try {
            localStorage.removeItem(PRACTICE_KEY);
          } catch {
            /* Current tab can still close practice. */
          }
          setPracticeId(null);
        }}
      />
    );
  return (
    <>
      <header>
        <a href="#main">Long-term investing</a>
        <span>50 historical scenarios</span>
      </header>
      <main id="main">
        {warning && (
          <p role="status" className="storage-warning">
            {warning}
          </p>
        )}
        {!session ? (
          <section className="panel start">
            <p className="eyebrow">
              A decision today. A future you cannot see.
            </p>
            <h1>Try a long-term investing decision</h1>
            <p>
              Travel to a moment in history. Choose how to invest $10,000,
              predict a winner, then see what happened over five years.
            </p>
            <p>
              Every five scenarios, pause to explore your choices. You can
              finish there or keep going. Progress saves in this browser.
            </p>
            <p>
              {unseen.length} unseen scenarios available. Each round starts
              fresh with $10,000.
            </p>
            {chosenTarget ? (
              <>
                <label htmlFor="session-length">How many scenarios?</label>
                <select
                  id="session-length"
                  value={chosenTarget}
                  onChange={(e) => setTarget(Number(e.target.value))}
                >
                  {lengths.map((count) => (
                    <option key={count} value={count}>
                      {count} scenarios{count === 10 ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const seed = crypto.randomUUID();
                    save(
                      rememberSession(
                        history,
                        startSession(
                          buildSessionQueue(unseen, chosenTarget, [], seed),
                          seed,
                          new Date().toISOString(),
                        ),
                      ),
                    );
                  }}
                >
                  Begin session
                </button>
              </>
            ) : (
              <p>
                You’ve explored all 50 historical scenarios. Your completed
                scorecards are saved below.
              </p>
            )}
            <LearningHistory results={firstTimeResults(history)} />
            {played.length > 0 && (
              <details>
                <summary>Practice a completed scenario</summary>
                <p>
                  Try different choices without changing your first-time
                  results.
                </p>
                {played.map((completedId) => (
                  <p key={completedId}>
                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem(PRACTICE_KEY, completedId);
                        } catch {
                          setWarning(
                            'Practice cannot be restored after refresh in this browser.',
                          );
                        }
                        setPracticeId(completedId);
                      }}
                    >
                      Replay{' '}
                      {historicalDecisionContext(completedId).display_date}
                    </button>
                  </p>
                ))}
              </details>
            )}
            {history.finished.length > 0 && (
              <details>
                <summary>
                  Past session scorecards ({history.finished.length})
                </summary>
                {history.finished.map((saved) => (
                  <p key={saved.session_id}>
                    <button
                      onClick={() =>
                        save({ ...history, active: saved, pending: null })
                      }
                    >
                      View {saved.completed.length}-scenario session from{' '}
                      {saved.started_at.slice(0, 10)}
                    </button>
                  </p>
                ))}
              </details>
            )}
          </section>
        ) : (
          <>
            <p className="progress">
              {session.phase === 'decision' || session.phase === 'reveal'
                ? `Scenario ${session.current_index + (session.phase === 'decision' ? 1 : 0)} of ${session.target_count}`
                : `${session.current_index} of ${session.target_count} scenarios completed`}
            </p>
            {error ? (
              <section className="panel">
                <p role="alert">{error}</p>
                <button
                  onClick={() => {
                    try {
                      if (
                        localStorage.getItem(HISTORY_KEY) ===
                        JSON.stringify(current.current)
                      ) {
                        window.location.reload();
                        return;
                      }
                    } catch {
                      /* Keep an unsaved decision in this tab. */
                    }
                    setRetry((value) => value + 1);
                  }}
                >
                  Retry loading
                </button>
              </section>
            ) : pending || (session.phase === 'reveal' && !scenario) ? (
              <p role="status">Loading the five-year reveal…</p>
            ) : session.phase === 'decision' && id ? (
              <>
                <ScenarioView context={historicalDecisionContext(id)} />
                <Allocation
                  key={id}
                  context={historicalDecisionContext(id)}
                  storageKey={`investing-game:draft:${session.session_id}:${id}:v1`}
                  onCommit={commit}
                />
              </>
            ) : session.phase === 'reveal' && scenario ? (
              <Reveal
                key={id}
                scenario={scenario}
                result={session.completed.at(-1)!}
                onNext={next}
                isLast={session.current_index === session.target_count}
              />
            ) : session.phase === 'checkpoint' ? (
              <Checkpoint
                results={session.completed}
                onContinue={next}
                onEnd={() =>
                  save(
                    rememberSession(
                      history,
                      finishSession(session, new Date().toISOString()),
                    ),
                  )
                }
              />
            ) : session.phase === 'final' ? (
              <FinalScorecard
                results={session.completed}
                onRestart={() =>
                  save({ ...history, active: null, pending: null })
                }
              />
            ) : null}
          </>
        )}
      </main>
      <footer>
        Learn from history. These examples use approximate historical data and
        are not investment advice.
      </footer>
    </>
  );
}
