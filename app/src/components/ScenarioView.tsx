import type { DecisionContext } from '../lib/validation';
import { percent } from '../lib/format';
// This component cannot accept future outcomes. It renders only the starting snapshot.
export function ScenarioView({ context }: { context: DecisionContext }) {
  const name = (id: string) =>
    context.asset_definitions.find((asset) => asset.id === id)?.name ?? id;
  return (
    <section aria-labelledby="scenario-date">
      <h1 id="scenario-date">{context.display_date}</h1>
      <p>
        You have $10,000 to invest for the next five years. You will not be able
        to change your investments after today.
      </p>
      <div className="context-grid">
        <section className="panel">
          <h2>In the news</h2>
          <ul className="stories">
            {context.headlines.map((story) => (
              <li key={story.headline}>
                <strong>{story.headline}</strong>
                <p>{story.summary}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>The world right now</h2>
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
          <h3>Contemporary outlook</h3>
          {context.forecasts.map((forecast) => (
            <p key={forecast.text}>{forecast.text}</p>
          ))}
        </section>
      </div>
      <section className="panel recent-performance">
        <h2>Recent performance</h2>
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
                  <th scope="row">{name(asset.asset_id)}</th>
                  <td>{percent(asset.three_month)}</td>
                  <td>{percent(asset.one_year)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Stocks everyone is talking about</h2>
        <div className="stock-grid">
          {context.hot_stocks.map((stock) => (
            <article className="panel" key={stock.id}>
              <h3>{stock.company_name}</h3>
              <p>{stock.ticker}</p>
              <p>
                {percent(stock.three_month)} over 3 months ·{' '}
                {percent(stock.one_year)} over 1 year
              </p>
              <p>{stock.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
