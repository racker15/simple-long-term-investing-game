import { useEffect, useState } from 'react';
import type { FutureOutcomes } from '../lib/contracts';
import type { PortfolioPath } from '../lib/portfolio';
import { money } from '../lib/format';
export function PathChart({
  player,
  diversified,
  usTotal,
  events,
  onFinished,
}: {
  player: PortfolioPath;
  diversified: PortfolioPath;
  usTotal: PortfolioPath;
  events: FutureOutcomes['events'];
  onFinished: () => void;
}) {
  const [visible, setVisible] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 0,
  );
  useEffect(() => {
    if (visible >= 60) {
      onFinished();
      return;
    }
    const timer = window.setTimeout(
      () => setVisible((value) => Math.min(60, value + 2)),
      80,
    );
    return () => window.clearTimeout(timer);
  }, [visible, onFinished]);
  const series = [player, usTotal, diversified].map((path) => [
    10000,
    ...path.points.map((point) => point.total),
  ]);
  const minimum = Math.min(...series.flat()),
    maximum = Math.max(...series.flat());
  const span = Math.max(1, maximum - minimum);
  const x = (index: number) => 125 + (index / 60) * 655;
  const y = (value: number) => 245 - ((value - minimum) / span) * 215;
  const markers = events
    .map((event, i) => ({ event, i }))
    .filter(
      ({ event, i }) =>
        events.findIndex((row) => row.month === event.month) === i,
    );
  return (
    <figure className="chart">
      <figcaption>
        Value of your original $10,000 · 60 monthly returns
      </figcaption>
      <svg
        viewBox="0 0 800 300"
        role="img"
        aria-labelledby="path-title path-description"
      >
        <title id="path-title">Five-year portfolio path</title>
        <desc id="path-description">
          Your portfolio, US Total Market, and diversified benchmark compared
          over sixty months. A complete monthly value table follows.
        </desc>
        {[minimum, (minimum + maximum) / 2, maximum].map((value) => (
          <g key={value}>
            <line
              x1="125"
              x2="780"
              y1={y(value)}
              y2={y(value)}
              stroke="#d7ded9"
            />
            <text x="110" y={y(value) + 4} textAnchor="end">
              {money(value)}
            </text>
          </g>
        ))}
        {series.map((values, i) => (
          <polyline
            key={i}
            data-testid={`path-${i}`}
            fill="none"
            stroke={['#164f45', '#7b8392', '#ae7641'][i]}
            strokeWidth={i === 0 ? 4 : 2}
            strokeDasharray={i === 2 ? '6 4' : undefined}
            points={values
              .slice(0, visible + 1)
              .map((value, index) => `${x(index)},${y(value)}`)
              .join(' ')}
          />
        ))}
        {visible >= 60 &&
          markers.map(({ event, i }) => {
            const title = events
              .filter((row) => row.month === event.month)
              .map((row) => row.title)
              .join('; ');
            const index = player.points.findIndex(
              (point) => point.month === event.month,
            );
            return (
              <a
                key={`${event.month}:${event.title}`}
                href={`#event-${i}`}
                aria-label={`${event.month}: ${title}`}
              >
                <circle
                  cx={x(index + 1)}
                  cy={y(player.points[index].total)}
                  r="6"
                  fill="#164f45"
                  stroke="white"
                  strokeWidth="2"
                >
                  <title>
                    {event.month}: {title}
                  </title>
                </circle>
              </a>
            );
          })}
        <text x="125" y="278" textAnchor="middle">
          Start
        </text>
        {[12, 24, 36, 48, 60].map((month) => (
          <text key={month} x={x(month)} y="278" textAnchor="end">
            Year {month / 12}
          </text>
        ))}
      </svg>
      <p className="legend">
        <span className="player-key">━ Your portfolio</span>
        <span>━ US Total Market</span>
        <span className="benchmark-key">┄ Diversified benchmark</span>
      </p>
      {visible < 60 && (
        <button className="secondary" onClick={() => setVisible(60)}>
          Show complete path
        </button>
      )}
      <details>
        <summary>Monthly values</summary>
        <div className="table-scroll">
          <table>
            <caption>
              Complete monthly values for all three portfolio paths
            </caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Your portfolio</th>
                <th>US Total</th>
                <th>Diversified</th>
              </tr>
            </thead>
            <tbody>
              {player.points.slice(0, visible).map((point, i) => (
                <tr key={point.month}>
                  <th scope="row">{point.month}</th>
                  <td>{money(point.total)}</td>
                  <td>{money(usTotal.points[i].total)}</td>
                  <td>{money(diversified.points[i].total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
