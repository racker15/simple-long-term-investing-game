import type { Allocations, AssetId, Session } from './contracts';
import { validateSession } from './validation';

export const HISTORY_KEY = 'investing-game:historical-history:v1';
export type PendingDecision = { allocations: Allocations; expected: AssetId };
export type PlayerHistory = {
  version: 1;
  active: Session | null;
  pending: PendingDecision | null;
  finished: Session[];
};
export const emptyHistory = (): PlayerHistory => ({
  version: 1,
  active: null,
  pending: null,
  finished: [],
});
export function readHistory(
  raw: string | null,
  assets: (id: string) => readonly string[],
): PlayerHistory {
  if (!raw) return emptyHistory();
  const value = JSON.parse(raw) as PlayerHistory;
  const validSession = (session: Session) => {
    if (!validateSession(session) || session.development_mode) return false;
    try {
      return (
        session.scenario_ids.every((id) => assets(id).length === 7) &&
        session.completed.every((result) => {
          const ids = assets(result.scenario_id);
          return Object.keys(result.allocations).every((id) =>
            ids.includes(id),
          );
        })
      );
    } catch {
      return false;
    }
  };
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.finished) ||
    !value.finished.every((s) => validSession(s) && s.phase === 'final') ||
    new Set(value.finished.map((s) => s.session_id)).size !==
      value.finished.length ||
    (value.active !== null && !validSession(value.active))
  )
    throw new Error('Invalid saved history');
  if (value.pending !== null) {
    const session = value.active;
    if (!session || session.phase !== 'decision' || !value.pending)
      throw new Error('Invalid pending decision');
    const ids = assets(session.scenario_ids[session.current_index]);
    const { allocations, expected } = value.pending;
    if (
      !allocations ||
      Object.keys(allocations).length !== 7 ||
      !ids.every(
        (id) =>
          Number.isInteger(allocations[id as AssetId]) &&
          allocations[id as AssetId] >= 0 &&
          allocations[id as AssetId] % 500 === 0,
      ) ||
      Object.values(allocations).reduce((a, b) => a + b, 0) !== 10000 ||
      !ids.includes(expected)
    )
      throw new Error('Invalid pending allocation');
  }
  return value;
}
export function rememberSession(
  history: PlayerHistory,
  session: Session,
): PlayerHistory {
  return {
    ...history,
    active: session,
    pending: null,
    finished:
      session.phase === 'final' &&
      !history.finished.some((s) => s.session_id === session.session_id)
        ? [...history.finished, session]
        : history.finished,
  };
}
export function playedIds(history: PlayerHistory): string[] {
  return [
    ...new Set(
      [
        ...history.finished.flatMap((s) => s.completed),
        ...(history.active?.completed ?? []),
      ].map((r) => r.scenario_id),
    ),
  ];
}
