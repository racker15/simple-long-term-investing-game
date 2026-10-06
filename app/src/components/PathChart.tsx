import { useEffect, useState } from 'react';
import { INITIAL_CAPITAL, type FutureOutcomes } from '../lib/contracts';
import type { PortfolioPath } from '../lib/portfolio';
import { money } from '../lib/format';
import { SignedReturn } from './SignedReturn';
export function PathChart({
  player,
  diversified,
  usTotal,
  hotStocks,
  startMonth,
  events,
  onFinished,
}: {
  player: PortfolioPath;
  diversified: PortfolioPath;
  usTotal: PortfolioPath;
  hotStocks: {
    id: string;
    company_name: string;
    ticker: string;
    path: PortfolioPath;
  }[];
  startMonth: string;
  events: FutureOutcomes['events'];
  onFinished: () => void;
}) {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [target, setTarget] = useState<12 | 36 | 60>(12);
  const [visible, setVisible] = useState(reducedMotion ? 12 : 0);
  const paused = visible === target;
  useEffect(() => {
    if (visible >= target) {
      if (target === 60) onFinished();
      return;
    }
    const timer = window.setTimeout(
      () => setVisible((value) => Math.min(target, value + 2)),
      80,
    );
    return () => window.clearTimeout(timer);
  }, [visible, target, onFinished]);
  function resume(next: 36 | 60) {
    setTarget(next);
    if (reducedMotion) setVisible(next);
  }
  const chartSeries = [
    {
      label: 'Your portfolio',
      path: player,
      color: '#164f45',
      width: 4,
      dash: undefined,
      testId: 'path-0',
      assetId: undefined,
    },
    {
      label: 'US Total Market',
      path: usTotal,
      color: '#7b8392',
      width: 2,
      dash: undefined,
      testId: 'path-1',
      assetId: undefined,
    },
    {
      label: 'Diversified benchmark',
      path: diversified,
      color: '#ae7641',
      width: 2,
      dash: '6 4',
      testId: 'path-2',
      assetId: undefined,
    },
    ...hotStocks.map((stock, index) => ({
      label: `${stock.company_name} (${stock.ticker})`,
      path: stock.path,
      color: ['#2475a8', '#b34f65', '#7657a4'][index],
      width: 2.5,
      dash: undefined,
      testId: `hot-stock-path-${index}`,
      assetId: stock.id,
    })),
  ];
  const series = chartSeries.map(({ path }) => [
    INITIAL_CAPITAL,
    ...path.points.map((point) => point.total),
  ]);
  const portfolioSeries = series.slice(0, 3);
  const hotStockSeries = series.slice(3);
  const portfolioValues = portfolioSeries.flatMap((values) =>
    values.slice(0, visible + 1),
  );
  const hotStockValues = hotStockSeries.flatMap((values) =>
    values.slice(0, visible + 1),
  );
  const portfolioMinimum = Math.min(...portfolioValues);
  const portfolioMaximum = Math.max(...portfolioValues);
  const hotStockMinimum = Math.min(...hotStockValues);
  const hotStockMaximum = Math.max(...hotStockValues);
  const portfolioSpan = Math.max(1, portfolioMaximum - portfolioMinimum);
  const hotStockSpan = Math.max(1, hotStockMaximum - hotStockMinimum);
  const plotStart = 165;
  const plotEnd = 780;
  const x = (index: number) =>
    plotStart + (index / target) * (plotEnd - plotStart);
  const portfolioY = (value: number) =>
    175 - ((value - portfolioMinimum) / portfolioSpan) * 135;
  const hotStockY = (value: number) =>
    355 - ((value - hotStockMinimum) / hotStockSpan) * 120;
  const yearLabels = [
    { month: 0, year: startMonth.slice(0, 4) },
    ...[12, 24, 36, 48, 60].map((month) => ({
      month,
      year: player.points[month - 1].month.slice(0, 4),
    })),
  ].filter((label) => label.month <= target);
  const markers = events
    .map((event, i) => ({ event, i }))
    .filter(
      ({ event, i }) =>
        events.findIndex((row) => row.month === event.month) === i,
    );
  return (
    <figure className="chart">
      <figcaption>
        Your portfolio and market comparisons are above. The hot stocks below
        use their own dollar scale. The timeline expands as you continue. Only
        the months reached so far are shown.
      </figcaption>
      <h2 aria-live="polite">
        {paused
          ? target === 60
            ? 'Five-year path complete'
            : `Paused after ${target / 12} ${target === 12 ? 'year' : 'years'}`
          : `Revealing through year ${target / 12}…`}
      </h2>
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-labelledby="path-title path-description"
      >
        <title id="path-title">Five-year portfolio path</title>
        <desc id="path-description">
          Two chart panels share the same timeline and use separate dollar
          scales. The upper panel shows your portfolio and two broad
          comparisons. The lower panel shows all three hot stocks. Values are
          shown only through month {visible}; later outcomes remain hidden.
        </desc>
        <text x={plotStart} y="20">
          Your portfolio and broad comparisons
        </text>
        {[
          portfolioMinimum,
          (portfolioMinimum + portfolioMaximum) / 2,
          portfolioMaximum,
        ]
          .filter(
            (value) =>
              Math.abs(portfolioY(value) - portfolioY(INITIAL_CAPITAL)) > 30,
          )
          .map((value) => (
            <g key={value}>
              <line
                x1={plotStart}
                x2={plotEnd}
                y1={portfolioY(value)}
                y2={portfolioY(value)}
                stroke="#d7ded9"
              />
              <text x="150" y={portfolioY(value) + 4} textAnchor="end">
                {money(value)}
              </text>
            </g>
          ))}
        <g data-testid="starting-value-reference-portfolio">
          <line
            x1={plotStart}
            x2={plotEnd}
            y1={portfolioY(INITIAL_CAPITAL)}
            y2={portfolioY(INITIAL_CAPITAL)}
            stroke="#89998f"
            strokeWidth="1.5"
            strokeDasharray="2 5"
          />
          <text x="150" y={portfolioY(INITIAL_CAPITAL) + 4} textAnchor="end">
            {money(INITIAL_CAPITAL)}
          </text>
        </g>
        {portfolioSeries.map((values, i) => (
          <polyline
            key={i}
            data-testid={chartSeries[i].testId}
            fill="none"
            stroke={chartSeries[i].color}
            strokeWidth={chartSeries[i].width}
            strokeDasharray={chartSeries[i].dash}
            points={values
              .slice(0, visible + 1)
              .map((value, index) => `${x(index)},${portfolioY(value)}`)
              .join(' ')}
          >
            <title>{chartSeries[i].label}</title>
          </polyline>
        ))}
        <text x={plotStart} y="215">
          Hot stocks (shown on their own dollar scale)
        </text>
        {[
          hotStockMinimum,
          (hotStockMinimum + hotStockMaximum) / 2,
          hotStockMaximum,
        ]
          .filter(
            (value) =>
              Math.abs(hotStockY(value) - hotStockY(INITIAL_CAPITAL)) > 30,
          )
          .map((value) => (
            <g key={value}>
              <line
                x1={plotStart}
                x2={plotEnd}
                y1={hotStockY(value)}
                y2={hotStockY(value)}
                stroke="#d7ded9"
              />
              <text x="150" y={hotStockY(value) + 4} textAnchor="end">
                {money(value)}
              </text>
            </g>
          ))}
        <g data-testid="starting-value-reference-hot-stocks">
          <line
            x1={plotStart}
            x2={plotEnd}
            y1={hotStockY(INITIAL_CAPITAL)}
            y2={hotStockY(INITIAL_CAPITAL)}
            stroke="#89998f"
            strokeWidth="1.5"
            strokeDasharray="2 5"
          />
          <text x="150" y={hotStockY(INITIAL_CAPITAL) + 4} textAnchor="end">
            {money(INITIAL_CAPITAL)}
          </text>
        </g>
        {hotStockSeries.map((values, i) => {
          const seriesIndex = i + 3;
          return (
            <polyline
              key={chartSeries[seriesIndex].testId}
              data-testid={chartSeries[seriesIndex].testId}
              data-asset-id={chartSeries[seriesIndex].assetId}
              fill="none"
              stroke={chartSeries[seriesIndex].color}
              strokeWidth={chartSeries[seriesIndex].width}
              points={values
                .slice(0, visible + 1)
                .map((value, index) => `${x(index)},${hotStockY(value)}`)
                .join(' ')}
            >
              <title>{chartSeries[seriesIndex].label}</title>
            </polyline>
          );
        })}
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
                  cy={portfolioY(player.points[index].total)}
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
        {yearLabels.map(({ month, year }) => (
          <text
            key={month}
            data-testid="chart-year"
            x={x(month)}
            y="400"
            textAnchor={
              month === 0 ? 'start' : month === target ? 'end' : 'middle'
            }
          >
            {year}
          </text>
        ))}
      </svg>
      <div className="legend" aria-label="Chart returns so far">
        {chartSeries.map((item, index) => (
          <span
            key={item.testId}
            data-testid={`chart-return-${index}`}
            style={{ color: item.color }}
          >
            {item.dash ? '┄' : '━'} {item.label}:{' '}
            <SignedReturn
              value={series[index][visible] / INITIAL_CAPITAL - 1}
            />{' '}
            ({money(series[index][visible])})
          </span>
        ))}
      </div>
      <p>
        Returns above are from the starting date through month {visible}. Each
        comparison starts with $10,000.
      </p>
      {paused && target < 60 ? (
        <>
          <p>
            The story is not finished. Notice the ups and downs so far before
            continuing.
          </p>
          <button onClick={() => resume(target === 12 ? 36 : 60)}>
            Continue to year {target === 12 ? 3 : 5}
          </button>
        </>
      ) : !paused ? (
        <button className="secondary" onClick={() => setVisible(target)}>
          Skip animation to year {target / 12}
        </button>
      ) : null}
      <details>
        <summary>Monthly values</summary>
        <div className="table-scroll">
          <table>
            <caption>
              Monthly values so far for your portfolio, both comparisons, and
              all three hot stocks
            </caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Your portfolio</th>
                <th>US Total</th>
                <th>Diversified</th>
                {hotStocks.map((stock) => (
                  <th key={stock.id}>
                    {stock.company_name} ({stock.ticker})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {player.points.slice(0, visible).map((point, i) => (
                <tr key={point.month}>
                  <th scope="row">{point.month}</th>
                  <td>{money(point.total)}</td>
                  <td>{money(usTotal.points[i].total)}</td>
                  <td>{money(diversified.points[i].total)}</td>
                  {hotStocks.map((stock) => (
                    <td key={stock.id}>{money(stock.path.points[i].total)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
