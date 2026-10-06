import type { Scenario, ScenarioResult } from '../lib/contracts';
import { calculatePortfolio, rankAssets } from '../lib/portfolio';
import { resultExpectations } from '../lib/results';
import { money, percent } from '../lib/format';
import { InvestmentMark } from './InvestmentVisual';
export function ReflectionSummary({
  scenario,
  result,
}: {
  scenario: Scenario;
  result: ScenarioResult;
}) {
  const context = scenario.known;
  const ids = context.asset_definitions.map((asset) => asset.id);
  const name = (id: string) =>
    context.asset_definitions.find((asset) => asset.id === id)?.name ?? id;
  const actual = resultExpectations(result).actual_winner;
  const portfolio = calculatePortfolio(
    scenario.future.monthly_returns,
    result.allocations,
  );
  const assets = ids.map((id) => ({
    id,
    path: calculatePortfolio(scenario.future.monthly_returns, { [id]: 10000 }),
  }));
  return (
    <section
      className="panel reflection-summary"
      aria-label="What this path teaches"
    >
      <h2>A takeaway from this moment</h2>
      <p className="takeaway">{scenario.future.reflection.what_nobody_knew}</p>
      <div className="expectation-pair">
        <div>
          <h3>You expected</h3>
          <p>
            <InvestmentMark id={result.expected_winner} ids={ids} />
            {name(result.expected_winner)}
          </p>
        </div>
        <div>
          <h3>What happened</h3>
          <p>
            <InvestmentMark id={actual} ids={ids} />
            {name(actual)} finished highest after five years.
          </p>
        </div>
      </div>
      <p className="small">
        An outcome alone does not tell us whether the original reasoning was
        good. Everyone had incomplete information at the start.
      </p>
      <div
        className="milestone-comparison"
        aria-label="The same choice at three horizons"
      >
        {[12, 36, 60].map((month) => {
          const values = Object.fromEntries(
            assets.map((asset) => [
              asset.id,
              asset.path.points[month - 1].total,
            ]),
          );
          const leader = rankAssets(values)[0];
          const value = portfolio.points[month - 1].total;
          return (
            <article key={month}>
              <h3>Year {month / 12}</h3>
              <p>
                {money(value)}{' '}
                <span
                  className={
                    value < 10000 ? 'financial-return--negative' : undefined
                  }
                >
                  ({percent(value / 10000 - 1)})
                </span>
              </p>
              <p className="small">Leading investment: {name(leader)}</p>
            </article>
          );
        })}
      </div>
      <p className="small">
        Each column judges the same locked choice at a different time. A lead at
        one point did not guarantee the finish.
      </p>
      <div className="expectation-pair">
        <div>
          <h3>What people were saying then</h3>
          <p>{context.headlines[0].headline}</p>
          <p className="small">{context.headlines[0].summary}</p>
        </div>
        <div>
          <h3>What we learned later</h3>
          <p>{scenario.future.reflection.what_actually_mattered}</p>
        </div>
      </div>
    </section>
  );
}
export function BenchmarkBasket() {
  return (
    <details className="benchmark-basket">
      <summary>What is the comparison basket?</summary>
      <div
        className="allocation-bar"
        role="img"
        aria-label="Benchmark starts with 60% US stocks, 20% international stocks and 20% bonds"
      >
        <span style={{ width: '60%', background: '#346da4' }}>60%</span>
        <span style={{ width: '20%', background: '#247c7a' }}>20%</span>
        <span style={{ width: '20%', background: '#986127' }}>20%</span>
      </div>
      <p>
        60% US stocks · 20% international stocks · 20% bonds. It holds these
        investments for five years. It is a comparison, not a score or a
        promise.
      </p>
    </details>
  );
}
