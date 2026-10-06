import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

import { DecisionView } from './components/DecisionView';
import { Reveal } from './components/Reveal';
import { Checkpoint, FinalScorecard } from './components/Scorecard';
import { PlayerHistory as LearningHistory } from './components/PlayerHistory';
import { HistoryGallery } from './components/HistoryGallery';
import { OriginalReplay } from './components/OriginalReplay';
import { PracticeReplay } from './components/PracticeReplay';
const BREAK_KEY = 'investing-game:break:v1';
const ORIGINAL_KEY = 'investing-game:original-replay:v1';
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
  const [originalReview, setOriginalReview] = useState(() => {
    try {
      const id = localStorage.getItem(ORIGINAL_KEY);
      return !initial.history.active || initial.history.active.phase === 'final'
        ? (firstTimeResults(initial.history).find(
            (result) => result.scenario_id === id,
          ) ?? null)
        : null;
    } catch {
      return null;
    }
  });
  const [takingBreak, setTakingBreak] = useState(() => {
    try {
      return (
        !!initial.history.active &&
        localStorage.getItem(BREAK_KEY) === initial.history.active.session_id
      );
    } catch {
      return false;
    }
  });
  const breakScroll = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (takingBreak) {
      document.getElementById('main')?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } else if (breakScroll.current !== null) {
      document.getElementById('main')?.focus({ preventScroll: true });
      window.scrollTo(0, breakScroll.current);
      breakScroll.current = null;
    }
  }, [takingBreak]);
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
  useLayoutEffect(() => {
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [
    session?.phase,
    session?.current_index,
    practiceId,
    originalReview?.scenario_id,
  ]);
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
  function toggleBreak(next: boolean) {
    if (next) breakScroll.current = window.scrollY;
    setTakingBreak(next);
    try {
      if (next && session) localStorage.setItem(BREAK_KEY, session.session_id);
      else localStorage.removeItem(BREAK_KEY);
    } catch {
      setWarning(
        'Your break position could not be saved. Keep this tab open to resume.',
      );
    }
  }
  if (originalReview)
    return (
      <OriginalReplay
        result={originalReview}
        onClose={() => {
          try {
            localStorage.removeItem(ORIGINAL_KEY);
          } catch {
            setWarning(
              'The replay view may reopen after refresh. Your saved choices are unchanged.',
            );
          }
          setOriginalReview(null);
        }}
      />
    );
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
      <main id="main" tabIndex={-1}>
        {warning && (
          <p role="status" className="storage-warning">
            {warning}
          </p>
        )}
        {session &&
          session.phase !== 'final' &&
          (takingBreak ? (
            <section className="panel break-panel">
              <h1>Take your time</h1>
              <p>
                There is no deadline or streak to protect. Your current screen
                stays here while you take a break.
              </p>
              <p className="small">
                Successfully saved choices return in this browser. If saving is
                blocked, keep this tab open.
              </p>
              <button onClick={() => toggleBreak(false)}>Resume session</button>
            </section>
          ) : (
            <button
              className="secondary break-action"
              onClick={() => toggleBreak(true)}
            >
              Take a break
            </button>
          ))}
        <div hidden={takingBreak && !!session}>
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
              <HistoryGallery
                results={firstTimeResults(history)}
                onReplay={(result) => {
                  try {
                    localStorage.setItem(ORIGINAL_KEY, result.scenario_id);
                  } catch {
                    setWarning(
                      'This original replay will not reopen automatically after refresh.',
                    );
                  }
                  setOriginalReview(result);
                }}
              />
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
              <ol
                className="round-journey"
                aria-label="This five-scenario block"
              >
                {Array.from(
                  { length: Math.min(5, session.target_count) },
                  (_, i) => {
                    const activeRound =
                      session.phase === 'decision'
                        ? session.current_index + 1
                        : Math.max(1, session.current_index);
                    const round = Math.floor((activeRound - 1) / 5) * 5 + i + 1;
                    const currentRound =
                      (session.phase === 'decision' ||
                        session.phase === 'reveal') &&
                      round === activeRound;
                    return (
                      <li
                        key={round}
                        aria-current={currentRound ? 'step' : undefined}
                      >
                        {round}
                        {round <= session.current_index && !currentRound
                          ? ' ✓'
                          : ''}
                      </li>
                    );
                  },
                )}
              </ol>
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
                  <DecisionView
                    key={id}
                    context={historicalDecisionContext(id)}
                    storageKey={`investing-game:draft:${session.session_id}:${id}:v1`}
                    onCommit={commit}
                  />
                </>
              ) : session.phase === 'reveal' && scenario ? (
                <Reveal
                  key={id}
                  suspended={takingBreak}
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
        </div>
      </main>
      <footer>
        Learn from history. These examples use approximate historical data and
        are not investment advice.
      </footer>
    </>
  );
}
