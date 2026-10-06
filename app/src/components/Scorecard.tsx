import { ResultHelp } from './ResultHelp';
import type { ScenarioResult } from '../lib/contracts';
import {
  blockScorecard,
  sessionScorecard,
  scorecardObservation,
  type Aggregate,
} from '../lib/scorecards';
import { money, percent } from '../lib/format';
export function Metrics({ card }: { card: Aggregate }) {
  return (
    <div className="context-grid">
      <section>
        <h3>Your decisions</h3>
        <dl>
          <div>
            <dt>Average broad-equity allocation</dt>
            <dd>{percent(card.allocations.broad_equity)}</dd>
          </div>
          <div>
            <dt>Average hot-stock allocation</dt>
            <dd>{percent(card.allocations.hot_stocks)}</dd>
          </div>
          <div>
            <dt>Average bonds allocation</dt>
            <dd>{percent(card.allocations.bonds)}</dd>
          </div>
          <div>
            <dt>Average cash allocation</dt>
            <dd>{percent(card.allocations.cash)}</dd>
          </div>
          <div>
            <dt>50%+ in one investment</dt>
            <dd>
              {card.concentration_count} / {card.count} (
              {percent(card.concentration_frequency)})
            </dd>
          </div>
        </dl>
      </section>
      <section>
        <h3>Your expectations and experience</h3>
        <dl>
          <div>
            <dt>Winner predictions correct</dt>
            <dd>
              {card.prediction_hits} / {card.count}
            </dd>
          </div>
          <div>
            <dt>Prediction finished in bottom three</dt>
            <dd>
              {card.prediction_bottom_half} / {card.count}
            </dd>
          </div>
          <div>
            <dt>Year-one leader changed by year five</dt>
            <dd>
              {card.leader_reversals} / {card.count}
            </dd>
          </div>
          <div>
            <dt>Average ending portfolio value</dt>
            <dd>{money(card.average_ending_value)}</dd>
          </div>
          <div>
            <dt>Average benchmark ending value</dt>
            <dd>{money(card.average_benchmark_value)}</dd>
          </div>
          <div>
            <dt>Finished above diversified benchmark</dt>
            <dd>
              {card.benchmark_beating_count} / {card.count}
            </dd>
          </div>
          <div>
            <dt>20%+ drawdowns</dt>
            <dd>
              {card.drawdown_20_count} / {card.count}
            </dd>
          </div>
          <div>
            <dt>Largest drawdown</dt>
            <dd>{percent(card.largest_drawdown)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
export function Checkpoint({
  results,
  onContinue,
  onEnd,
}: {
  results: ScenarioResult[];
  onContinue: () => void;
  onEnd: () => void;
}) {
  const card = blockScorecard(results.slice(-5));
  return (
    <section>
      <h1>
        How you are doing — Scenarios {results.length - 4}–{results.length}
      </h1>
      <ResultHelp />
      <div className="panel">
        <Metrics card={card} />
        <p>{scorecardObservation(card)}</p>
      </div>
      <div className="actions">
        <button onClick={onContinue}>Continue</button>
        <button className="secondary" onClick={onEnd}>
          End session now
        </button>
      </div>
    </section>
  );
}
export function FinalScorecard({
  results,
  onRestart,
}: {
  results: ScenarioResult[];
  onRestart: () => void;
}) {
  const card = sessionScorecard(results);
  return (
    <section>
      <h1>How you did</h1>
      <p>
        Each round began with $10,000. These results describe your choices in
        these scenarios; they do not predict how you would do in the future.
      </p>
      <ResultHelp />
      <section className="panel">
        <h2>Overall session — {results.length} scenarios</h2>
        <Metrics card={card.overall} />
        <p>
          Middle ending value (median):{' '}
          <strong>{money(card.median_ending_value)}</strong>
        </p>
        <p>
          Prediction hit rate: {percent(card.prediction_hit_rate)} · How often
          the year-one leader changed: {percent(card.reversal_frequency)}
        </p>
      </section>
      <section className="panel">
        <h2>Important vs. random history</h2>
        <p>
          Some dates were chosen for major historical events; others were drawn
          at random. Small groups can have very different results by chance.
        </p>
        {(['important', 'random'] as const).map((mode) => (
          <section key={mode}>
            <h3>{mode === 'important' ? 'Important' : 'Random'} cohort</h3>
            {card.cohorts[mode] ? (
              <Metrics card={card.cohorts[mode]} />
            ) : (
              <p>Too few examples for a useful comparison (fewer than five).</p>
            )}
          </section>
        ))}
        <details>
          <summary>Scenario cohort labels</summary>
          <ol>
            {results.map((result, i) => (
              <li key={i}>
                Scenario {i + 1}: {result.selection_mode}
              </li>
            ))}
          </ol>
        </details>
      </section>
      <h2>Each five-scenario block</h2>
      {card.blocks.map((block) => (
        <section className="panel" key={block.start}>
          <h3>
            Scenarios {block.start}–{block.end}
          </h3>
          <Metrics card={block} />
        </section>
      ))}
      <p>{scorecardObservation(card.overall)}</p>
      <button onClick={onRestart}>Start new session</button>
    </section>
  );
}
