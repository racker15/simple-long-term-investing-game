import { useEffect, useLayoutEffect, useState } from 'react';
import { fixture } from './data/fixture';
import {
  DEFAULT_SESSION_LENGTH,
  SESSION_LENGTHS,
  type Session,
} from './lib/contracts';
import { decisionContext, validateSession } from './lib/validation';
import {
  startSession,
  lockResult,
  advanceSession,
  finishSession,
} from './lib/session';
import { createResult } from './lib/results';
import { sessionScorecard } from './lib/scorecards';
import { ScenarioView } from './components/ScenarioView';
import { Allocation } from './components/Allocation';
import { Reveal } from './components/Reveal';
import { Checkpoint, FinalScorecard } from './components/Scorecard';
const ACTIVE_KEY = 'investing-game:development-active:v1';
const ARCHIVE_KEY = 'investing-game:development-summaries:v1';
function restore(): { session: Session | null; warning: string } {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return { session: null, warning: '' };
    const saved: unknown = JSON.parse(raw);
    if (
      validateSession(saved) &&
      saved.development_mode &&
      saved.scenario_ids.every(
        (id) => id === fixture.known.metadata.scenario_id,
      )
    )
      return { session: saved, warning: '' };
    return {
      session: null,
      warning: 'Saved development progress was invalid. Start a new session.',
    };
  } catch {
    return {
      session: null,
      warning:
        'Browser storage is unavailable or unreadable. You can play, but progress may not survive refresh.',
    };
  }
}
export default function App() {
  const [initial] = useState(restore);
  const [session, setSession] = useState<Session | null>(initial.session);
  const [warning, setWarning] = useState(initial.warning);
  const [target, setTarget] = useState<number>(DEFAULT_SESSION_LENGTH);
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
        if (session.phase === 'final') {
          const raw: unknown = JSON.parse(
            localStorage.getItem(ARCHIVE_KEY) ?? '[]',
          );
          const archive: {
            session_id: string;
            ended_at: string;
            summary: unknown;
          }[] = Array.isArray(raw) ? raw : [];
          if (
            !archive.some((saved) => saved?.session_id === session.session_id)
          )
            localStorage.setItem(
              ARCHIVE_KEY,
              JSON.stringify([
                ...archive,
                {
                  session_id: session.session_id,
                  ended_at: session.ended_at,
                  summary: sessionScorecard(session.completed),
                },
              ]),
            );
        }
      } else localStorage.removeItem(ACTIVE_KEY);
    } catch {
      setWarning(
        'Progress could not be saved in this browser. Keep this tab open to finish your session.',
      );
    }
  }, [session]);
  useLayoutEffect(() => {
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [session?.phase, session?.current_index]);
  const context = decisionContext(fixture.known);
  const next = () =>
    session && setSession(advanceSession(session, new Date().toISOString()));
  return (
    <>
      <header>
        <a href="#main">Long-term investing</a>
        <span>Development fixture</span>
      </header>
      <main id="main" tabIndex={-1}>
        <aside className="development-notice">
          <strong>Development mode — all content is fictional.</strong> This
          demo repeats one test scenario to exercise checkpoints. It contains no
          real historical data.
        </aside>
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
              You’ll make one long-term investing decision in each historical
              moment. Every five scenarios, we’ll pause and look at how your
              decisions and expectations are turning out.
            </p>
            <label htmlFor="session-length">How many scenarios?</label>
            <select
              id="session-length"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
            >
              {SESSION_LENGTHS.map((count) => (
                <option key={count} value={count}>
                  {count} scenarios{count === 10 ? ' (default)' : ''}
                </option>
              ))}
            </select>
            <p>
              This development session repeats the same fictional setting. Try
              different decisions to inspect their paths.
            </p>
            <button
              onClick={() =>
                setSession(
                  startSession(
                    Array(target).fill(fixture.known.metadata.scenario_id),
                    crypto.randomUUID(),
                    new Date().toISOString(),
                    true,
                  ),
                )
              }
            >
              Begin session
            </button>
          </section>
        ) : (
          <>
            <p className="progress">
              {session.phase === 'decision'
                ? `Scenario ${session.current_index + 1} of ${session.target_count}`
                : `${session.current_index} of ${session.target_count} scenarios completed`}
            </p>
            {session.phase === 'decision' && (
              <>
                <ScenarioView context={context} />
                <Allocation
                  key={session.current_index}
                  context={context}
                  onCommit={(allocation, expected) =>
                    setSession(
                      lockResult(
                        session,
                        createResult(fixture, allocation, expected),
                      ),
                    )
                  }
                />
              </>
            )}
            {session.phase === 'reveal' && (
              <Reveal
                key={session.current_index}
                scenario={fixture}
                result={session.completed.at(-1)!}
                onNext={next}
                isLast={session.current_index === session.target_count}
              />
            )}
            {session.phase === 'checkpoint' && (
              <Checkpoint
                results={session.completed}
                onContinue={next}
                onEnd={() =>
                  setSession(finishSession(session, new Date().toISOString()))
                }
              />
            )}
            {session.phase === 'final' && (
              <FinalScorecard
                results={session.completed}
                onRestart={() => setSession(null)}
              />
            )}
          </>
        )}
      </main>
      <footer>
        Decisions use information available now. Outcomes unfold in a future
        nobody gets to see.
      </footer>
    </>
  );
}
