import type { DecisionContext } from '../lib/validation';
import { InvestmentMark } from './InvestmentVisual';
import { SignedReturn } from './SignedReturn';
// This component cannot accept future outcomes. It renders only the starting snapshot.
export function ScenarioView({ context }: { context: DecisionContext }) {
  const ids = context.asset_definitions.map((asset) => asset.id);
  const name = (id: string) =>
    context.asset_definitions.find((asset) => asset.id === id)?.name ?? id;
  return (
    <section aria-labelledby="scenario-date">
      <div className="era-heading">
        <div>
          <p className="eyebrow">Step into history</p>
          <h1 id="scenario-date">{context.display_date}</h1>
        </div>
        <svg
          className="era-illustration"
          viewBox="0 0 150 110"
          aria-hidden="true"
        >
          <rect
            x="18"
            y="10"
            width="115"
            height="90"
            rx="4"
            fill="#f2e7d3"
            stroke="#927149"
          />
          <path
            d="M30 38h90M30 48h48M30 58h48M30 68h48M30 78h90M30 88h90"
            stroke="#927149"
            strokeWidth="3"
          />
          <rect x="88" y="47" width="31" height="22" fill="#cfb898" />
          <text x="75" y="31" textAnchor="middle" fill="#4c4438" fontSize="18">
            {context.date.slice(0, 4)}
          </text>
        </svg>
      </div>
      <p>
        You have $10,000 to invest for the next five years. You will not be able
        to change your investments after today.
      </p>
      <div className="context-grid">
        <section className="panel">
          <h2>
            <span aria-hidden="true">▤ </span>In the news
          </h2>
          <ul className="stories">
            {context.headlines.map((story, index) => (
              <li key={story.headline}>
                <details open={index < 2}>
                  <summary>{story.headline}</summary>
                  <p>{story.summary}</p>
                </details>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>
            <span aria-hidden="true">◎ </span>The world right now
          </h2>
          <dl>
            {context.macro.map((indicator) => (
              <div key={indicator.label}>
                <dt>{indicator.label}</dt>
                <dd>
                  {indicator.value}
                  {indicator.unit === '%' ? '%' : ` ${indicator.unit}`}
                </dd>
              </div>
            ))}
          </dl>
          <h3>
            <span aria-hidden="true">◇ </span>What experts expected
          </h3>
          <p className="small">
            Forecasts describe expectations, not promises.
          </p>
          {context.forecasts.map((forecast) => (
            <p key={forecast.text}>{forecast.text}</p>
          ))}
        </section>
      </div>
      <section className="panel recent-performance">
        <h2>
          <span aria-hidden="true">↗ </span>Recent performance
        </h2>
        <div className="table-scroll">
          <table>
            <caption>Returns available at the starting date</caption>
            <thead>
              <tr>
                <th>Investment</th>
                <th>3 months</th>
                <th>1 year</th>
              </tr>
            </thead>
            <tbody>
              {context.recent_returns.map((asset) => (
                <tr key={asset.asset_id}>
                  <th scope="row">
                    <InvestmentMark id={asset.asset_id} ids={ids} />
                    {name(asset.asset_id)}
                  </th>
                  <td>
                    <SignedReturn value={asset.three_month} />
                  </td>
                  <td>
                    <SignedReturn value={asset.one_year} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>
          <span aria-hidden="true">▦ </span>Stocks everyone is talking about
        </h2>
        <div className="stock-grid">
          {context.hot_stocks.map((stock) => (
            <article className="panel" key={stock.id}>
              <h3>
                <InvestmentMark id={stock.id} ids={ids} />
                {stock.company_name}
              </h3>
              <p>{stock.ticker}</p>
              <p>
                <SignedReturn value={stock.three_month} /> over 3 months ·{' '}
                <SignedReturn value={stock.one_year} /> over 1 year
              </p>
              <p>{stock.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
