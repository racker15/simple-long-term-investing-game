import { ResultHelp } from './ResultHelp';
import { useCallback, useMemo, useState } from 'react';
import type { Scenario, ScenarioResult } from '../lib/contracts';
import { calculatePortfolio, calculateComparisons } from '../lib/portfolio';
import { resultExpectations } from '../lib/results';
import { money, percent } from '../lib/format';
import { PathChart } from './PathChart';
import { SignedReturn } from './SignedReturn';
export function Reveal({
  scenario,
  result,
  onNext,
  isLast,
  continueLabel,
}: {
  scenario: Scenario;
  result: ScenarioResult;
  onNext: () => void;
  isLast: boolean;
  continueLabel?: string;
}) {
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => setFinished(true), []);
  const monthlyReturns = scenario.future.monthly_returns;
  const portfolio = useMemo(
    () => calculatePortfolio(monthlyReturns, result.allocations),
    [monthlyReturns, result.allocations],
  );
  const comparisons = useMemo(
    () => calculateComparisons(monthlyReturns),
    [monthlyReturns],
  );
  const hotStocks = useMemo(
    () =>
      scenario.known.hot_stocks.map((stock) => ({
        ...stock,
        path: calculatePortfolio(monthlyReturns, { [stock.id]: 10_000 }),
      })),
    [monthlyReturns, scenario.known.hot_stocks],
  );
  const expectations = resultExpectations(result);
  const name = (id: string) =>
    scenario.known.asset_definitions.find((asset) => asset.id === id)?.name ??
    id;
  return (
    <section>
      <h1>See what happened</h1>
      <p>
        {scenario.known.metadata.display_date} →{' '}
        {portfolio.points.at(-1)!.month}
      </p>
      <PathChart
        player={portfolio}
        diversified={comparisons.diversified}
        usTotal={comparisons.us_total}
        hotStocks={hotStocks}
        startMonth={scenario.known.metadata.date.slice(0, 7)}
        events={scenario.future.events}
        onFinished={finish}
      />
      {finished && (
        <>
          <section className="panel">
            <h2>Five years later</h2>
            <p className="ending">
              Your $10,000 became{' '}
              <strong>{money(portfolio.ending_value)}</strong>
            </p>
            <dl>
              <div>
                <dt>Total five-year return</dt>
                <dd>
                  <SignedReturn value={portfolio.total_return} />
                </dd>
              </div>
              <div>
                <dt>Highest monthly value (including start)</dt>
                <dd>{money(portfolio.highest_value)}</dd>
              </div>
              <div>
                <dt>Lowest monthly value (including start)</dt>
                <dd>{money(portfolio.lowest_value)}</dd>
              </div>
              <div>
                <dt>Largest fall from an earlier high</dt>
                <dd>{percent(portfolio.max_drawdown)}</dd>
              </div>
              <div>
                <dt>US Total Market</dt>
                <dd>{money(comparisons.us_total.ending_value)}</dd>
              </div>
              <div>
                <dt>Diversified benchmark (60/20/20)</dt>
                <dd>{money(comparisons.diversified.ending_value)}</dd>
              </div>
            </dl>
            <ResultHelp />
          </section>
          <section className="panel" aria-labelledby="hot-stock-outcomes-title">
            <h2 id="hot-stock-outcomes-title">
              What happened to the hot stocks?
            </h2>
            <ul className="hot-stock-outcomes">
              {hotStocks.map((stock, index) => (
                <li
                  className="hot-stock-outcome"
                  data-testid={`hot-stock-outcome-${index}`}
                  key={stock.id}
                >
                  <h3>
                    {stock.company_name} <span>({stock.ticker})</span>
                  </h3>
                  <p>{stock.description}</p>
                  <p>
                    Five-year return:{' '}
                    <strong>
                      <SignedReturn value={stock.path.total_return} />
                    </strong>
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2>Expectation vs. reality</h2>
            <p>
              You expected <strong>{name(result.expected_winner)}</strong> to do
              best. It finished{' '}
              <strong>{expectations.expected_winner_rank} of 7</strong>.
            </p>
            <p>
              Actual best performer:{' '}
              <strong>{name(expectations.actual_winner)}</strong>.
            </p>
            <p>
              {name(result.year_one_leader)} led after year one.{' '}
              {expectations.leader_reversed
                ? 'The leader changed by year five.'
                : 'It also led after five years.'}
            </p>
          </section>
          <section className="panel">
            <h2>
              {scenario.known.metadata.data_kind === 'historical'
                ? 'Major events during the period'
                : 'Major events during the fictional period'}
            </h2>
            <p>
              These events show what was happening. They do not explain every
              rise or fall in prices.
            </p>
            {scenario.future.events.map((event, i) => (
              <details id={`event-${i}`} key={`${event.month}:${event.title}`}>
                <summary>
                  {event.month} — {event.title}
                </summary>
                <p>{event.description}</p>
              </details>
            ))}
          </section>
          <section className="panel">
            <h2>What happened next?</h2>
            {scenario.future.what_happened_next.text
              .split(/\n\s*\n/)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            {[
              [
                'What people were focused on',
                scenario.future.reflection.what_people_were_focused_on,
              ],
              [
                'What actually mattered',
                scenario.future.reflection.what_actually_mattered,
              ],
              ['What faded away', scenario.future.reflection.what_faded_away],
              ['What nobody knew', scenario.future.reflection.what_nobody_knew],
            ].map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </section>
          <button onClick={onNext}>
            {continueLabel ??
              (isLast ? 'View final scorecard' : 'Next scenario')}
          </button>
        </>
      )}
    </section>
  );
}
