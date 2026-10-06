import { useState } from 'react';
import type { ScenarioResult } from '../lib/contracts';
import { historicalDecisionContext } from '../data/historical';
import { AllocationBar } from './InvestmentVisual';
const KEY = 'investing-game:bookmarks:v1';
export function HistoryGallery({
  results,
  onReplay,
}: {
  results: ScenarioResult[];
  onReplay: (result: ScenarioResult) => void;
}) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return Array.isArray(value)
        ? value.filter(
            (id): id is string =>
              typeof id === 'string' &&
              results.some((result) => result.scenario_id === id),
          )
        : [];
    } catch {
      return [];
    }
  });
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [warning, setWarning] = useState('');
  if (!results.length) return null;
  function toggle(id: string) {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((value) => value !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setWarning('');
    } catch {
      setWarning(
        'This bookmark change lasts only in this tab because storage is unavailable.',
      );
    }
  }
  const visible = results.filter(
    (result) => !onlyBookmarks || bookmarks.includes(result.scenario_id),
  );
  return (
    <details className="history-gallery">
      <summary>Completed scenarios ({results.length})</summary>
      <p>
        Replay your original choices without changing them or adding another
        result.
      </p>
      <label>
        <input
          type="checkbox"
          checked={onlyBookmarks}
          onChange={(event) => setOnlyBookmarks(event.target.checked)}
        />
        Show bookmarks only
      </label>
      {warning && <p role="status">{warning}</p>}
      <div className="history-cards">
        {visible.map((result) => {
          const context = historicalDecisionContext(result.scenario_id);
          return (
            <article className="panel" key={result.scenario_id}>
              <h3>{context.display_date}</h3>
              <AllocationBar
                context={context}
                allocations={result.allocations}
              />
              <p className="small">
                Original prediction:{' '}
                {
                  context.asset_definitions.find(
                    (asset) => asset.id === result.expected_winner,
                  )?.name
                }
              </p>
              <div className="actions">
                <button onClick={() => onReplay(result)}>
                  Replay original {context.display_date}
                </button>
                <button
                  className="secondary"
                  aria-label={`Bookmark ${context.display_date}`}
                  aria-pressed={bookmarks.includes(result.scenario_id)}
                  onClick={() => toggle(result.scenario_id)}
                >
                  {bookmarks.includes(result.scenario_id)
                    ? '★ Bookmarked'
                    : '☆ Bookmark'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && <p>No bookmarked scenarios yet.</p>}
    </details>
  );
}
