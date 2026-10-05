import {
  DEFAULT_SESSION_LENGTH,
  SESSION_LENGTHS,
  type Session,
  type ScenarioResult,
} from './contracts';
import { validateSession } from './validation';
export function startSession(
  ids: string[],
  sessionId: string,
  startedAt: string,
  developmentMode = false,
): Session {
  const session: Session = {
    schema_version: 1,
    session_id: sessionId,
    target_count: (ids.length ||
      DEFAULT_SESSION_LENGTH) as (typeof SESSION_LENGTHS)[number],
    scenario_ids: [...ids],
    current_index: 0,
    completed: [],
    started_at: startedAt,
    development_mode: developmentMode,
    phase: 'decision',
  };
  if (!validateSession(session))
    throw new Error('Invalid session queue or metadata');
  return session;
}
export function lockResult(session: Session, result: ScenarioResult): Session {
  if (
    session.phase !== 'decision' ||
    result.scenario_id !== session.scenario_ids[session.current_index]
  )
    throw new Error('Result must match the current unlocked decision');
  const next: Session = {
    ...session,
    completed: [...session.completed, result],
    current_index: session.current_index + 1,
    phase: 'reveal',
  };
  if (!validateSession(next)) throw new Error('Invalid scenario result');
  return next;
}
export function finishSession(session: Session, endedAt: string): Session {
  if (
    session.phase !== 'checkpoint' &&
    !(
      session.phase === 'reveal' &&
      session.current_index === session.target_count
    )
  )
    throw new Error(
      'Sessions can end only at a checkpoint or target completion',
    );
  const next: Session = { ...session, phase: 'final', ended_at: endedAt };
  if (!validateSession(next)) throw new Error('Invalid session end');
  return next;
}
export function advanceSession(session: Session, now: string): Session {
  if (session.phase === 'checkpoint') return { ...session, phase: 'decision' };
  if (session.phase !== 'reveal')
    throw new Error('Only reveal/checkpoint phases can advance');
  if (session.current_index === session.target_count)
    return finishSession(session, now);
  return {
    ...session,
    phase: session.current_index % 5 === 0 ? 'checkpoint' : 'decision',
  };
}
