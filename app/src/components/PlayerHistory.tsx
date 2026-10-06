import type { ScenarioResult } from '../lib/contracts';
import { aggregateResults } from '../lib/scorecards';
import { percent } from '../lib/format';
export function PlayerHistory({ results }: { results: ScenarioResult[] }) {
  if (!results.length) return null;
  const card = aggregateResults(results);
  return (
    <details>
      <summary>Your learning history — {card.count} scenarios</summary>
      <p>
        Only your first choices count here. Practice replays do not change this
        history. There is no single score to beat.
      </p>
      <dl>
        <div>
          <dt>Average in broad stock funds</dt>
          <dd>{percent(card.allocations.broad_equity)}</dd>
        </div>
        <div>
          <dt>Average in individual companies</dt>
          <dd>{percent(card.allocations.hot_stocks)}</dd>
        </div>
        <div>
          <dt>Average in bonds</dt>
          <dd>{percent(card.allocations.bonds)}</dd>
        </div>
        <div>
          <dt>Average in cash</dt>
          <dd>{percent(card.allocations.cash)}</dd>
        </div>
        <div>
          <dt>At least half in one investment</dt>
          <dd>
            {card.concentration_count} / {card.count}
          </dd>
        </div>
        <div>
          <dt>Winner predictions correct</dt>
          <dd>
            {card.prediction_hits} / {card.count} (
            {percent(card.prediction_hits / card.count)})
          </dd>
        </div>
        <div>
          <dt>Year-one winner changed by year five</dt>
          <dd>
            {card.leader_reversals} / {card.count}
          </dd>
        </div>
        <div>
          <dt>Value fell at least 20% from an earlier high</dt>
          <dd>
            {card.drawdown_20_count} / {card.count}
          </dd>
        </div>
      </dl>
      <p>
        Some dates overlap and some companies appear again. These are learning
        examples, not a prediction of future results.
      </p>
    </details>
  );
}
