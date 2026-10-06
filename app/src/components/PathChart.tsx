import { useEffect, useRef, useState } from 'react';
import { INITIAL_CAPITAL, type FutureOutcomes } from '../lib/contracts';
import type { PortfolioPath } from '../lib/portfolio';
import { activeFrameMilliseconds } from '../lib/playback-clock';
import { money, percent } from '../lib/format';
import { SignedReturn } from './SignedReturn';
export function PathChart({
  player,
  diversified,
  usTotal,
  hotStocks,
  startMonth,
  events,
  onFinished,
  focusPlay = false,
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
  focusPlay?: boolean;
}) {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [target, setTarget] = useState<12 | 36 | 60>(12);
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const paused = visible === target;
  const checkpointHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (paused && target < 60)
      checkpointHeading.current?.focus({ preventScroll: true });
  }, [paused, target]);
  const animation = useRef<number | null>(null);
  useEffect(() => {
    if (!started || reducedMotion) return;
    const from = target === 12 ? 0 : target === 36 ? 12 : 36;
    let previousFrame = performance.now();
    let playedMs = 0;
    function frame(now: number) {
      playedMs += activeFrameMilliseconds(
        now - previousFrame,
        document.visibilityState === 'visible',
      );
      previousFrame = now;
      const progress = Math.min(1, playedMs / 8000);
      setVisible(from + (target - from) * progress);
      if (progress < 1) animation.current = requestAnimationFrame(frame);
    }
    animation.current = requestAnimationFrame(frame);
    return () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
    };
  }, [target, reducedMotion, started]);
  useEffect(() => {
    if (visible === 60) onFinished();
  }, [visible, onFinished]);
  function skip() {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    setVisible(target);
  }
  function valueAt(values: number[]) {
    const month = Math.floor(visible);
    const fraction = visible - month;
    return (
      values[month] +
      (fraction ? (values[month + 1] - values[month]) * fraction : 0)
    );
  }
  function revealedValues(values: number[]) {
    const reached = values.slice(0, Math.floor(visible) + 1);
    if (!Number.isInteger(visible)) reached.push(valueAt(values));
    return reached;
  }
  function resume(next: 36 | 60) {
    setTarget(next);
    if (reducedMotion) setVisible(next);
  }
  const chartSeries = [
    {
      label: 'Your portfolio',
      endLabel: 'Your portfolio',
      path: player,
      color: '#164f45',
      width: 4,
      dash: undefined,
      testId: 'path-0',
      assetId: undefined,
    },
    {
      label: 'US Total Market',
      endLabel: 'US Total Market',
      path: usTotal,
      color: '#7b8392',
      width: 2,
      dash: undefined,
      testId: 'path-1',
      assetId: undefined,
    },
    {
      label: 'Diversified benchmark',
      endLabel: 'Diversified benchmark',
      path: diversified,
      color: '#ae7641',
      width: 2,
      dash: '6 4',
      testId: 'path-2',
      assetId: undefined,
    },
    ...hotStocks.map((stock, index) => ({
      label: `${stock.company_name} (${stock.ticker})`,
      endLabel: stock.ticker,
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
    revealedValues(values),
  );
  const hotStockValues = hotStockSeries.flatMap((values) =>
    revealedValues(values),
  );
  const portfolioMinimum = Math.min(...portfolioValues);
  const portfolioMaximum = Math.max(...portfolioValues);
  const hotStockMinimum = Math.min(...hotStockValues);
  const hotStockMaximum = Math.max(...hotStockValues);
  const portfolioSpan = Math.max(1, portfolioMaximum - portfolioMinimum);
  const hotStockSpan = Math.max(1, hotStockMaximum - hotStockMinimum);
  const plotStart = 165;
  const plotEnd = 540;
  const x = (index: number) =>
    plotStart + (index / target) * (plotEnd - plotStart);
  const portfolioY = (value: number) =>
    175 - ((value - portfolioMinimum) / portfolioSpan) * 135;
  const hotStockY = (value: number) =>
    355 - ((value - hotStockMinimum) / hotStockSpan) * 120;
  // Keep the three labels in each panel apart, while dots stay on exact values.
  const endpointLabels = [
    { offset: 0, values: portfolioSeries, y: portfolioY, top: 40, bottom: 175 },
    { offset: 3, values: hotStockSeries, y: hotStockY, top: 235, bottom: 355 },
  ].flatMap(({ offset, values, y, top, bottom }) => {
    const labels = values
      .map((points, i) => ({
        index: offset + i,
        value: valueAt(points),
        pointY: y(valueAt(points)),
        labelY: y(valueAt(points)),
      }))
      .sort((a, b) => a.pointY - b.pointY);
    labels.forEach((label, i) => {
      label.labelY = Math.max(
        label.pointY,
        i ? labels[i - 1].labelY + 38 : top,
      );
    });
    for (let i = labels.length - 1; i >= 0; i--) {
      labels[i].labelY = Math.min(
        labels[i].labelY,
        i === labels.length - 1 ? bottom : labels[i + 1].labelY - 38,
      );
    }
    return labels;
  });
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
        the months reached so far are shown. End labels show returns since the
        start; stock labels use their ticker symbols. Each reveal takes eight
        seconds. Movement between monthly observations is visual interpolation.
      </figcaption>
      <h2 ref={checkpointHeading} tabIndex={-1} aria-live="polite">
        {!started
          ? 'Ready to play'
          : paused
            ? target === 60
              ? 'Five-year path complete'
              : `Paused after ${target / 12} ${target === 12 ? 'year' : 'years'}`
            : `Revealing through year ${target / 12}…`}
      </h2>
      <div
        className="chart-scroll"
        tabIndex={0}
        role="region"
        aria-label="Investment paths; scroll horizontally on small screens"
      >
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
            shown only through the current reveal; later outcomes remain hidden.
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
              points={revealedValues(values)
                .map(
                  (value, index) =>
                    `${x(Math.min(index, visible))},${portfolioY(value)}`,
                )
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
                points={revealedValues(values)
                  .map(
                    (value, index) =>
                      `${x(Math.min(index, visible))},${hotStockY(value)}`,
                  )
                  .join(' ')}
              >
                <title>{chartSeries[seriesIndex].label}</title>
              </polyline>
            );
          })}
          {endpointLabels.map(({ index, value, pointY, labelY }) => (
            <g
              key={chartSeries[index].testId}
              data-testid={`chart-end-${index}`}
            >
              <title>
                {chartSeries[index].label}:{' '}
                {percent(value / INITIAL_CAPITAL - 1)} since the start
              </title>
              <circle
                cx={x(visible)}
                cy={pointY}
                r="4"
                fill={chartSeries[index].color}
                stroke="white"
                strokeWidth="1"
              />
              <path
                d={`M ${x(visible) + 4} ${pointY} L ${x(visible) + 23} ${labelY} L ${x(visible) + 31} ${labelY}`}
                fill="none"
                stroke={chartSeries[index].color}
              />
              <circle
                cx={x(visible) + 37}
                cy={labelY}
                r="4"
                fill={chartSeries[index].color}
              />
              <text
                className="endpoint-name"
                x={x(visible) + 49}
                y={labelY - 3}
              >
                {chartSeries[index].endLabel}
              </text>
              <text
                className={`endpoint-return${value < INITIAL_CAPITAL ? ' financial-return--negative' : ''}`}
                x={x(visible) + 49}
                y={labelY + 14}
              >
                {percent(value / INITIAL_CAPITAL - 1)}
              </text>
            </g>
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
      </div>
      <div className="legend" aria-label="Chart returns so far">
        {chartSeries.map((item, index) => (
          <span key={item.testId} data-testid={`chart-return-${index}`}>
            <span aria-hidden="true" style={{ color: item.color }}>
              {item.dash ? '┄' : '━'}
            </span>{' '}
            {item.label}:{' '}
            <SignedReturn
              value={valueAt(series[index]) / INITIAL_CAPITAL - 1}
            />{' '}
            ({money(valueAt(series[index]))})
          </span>
        ))}
      </div>
      <p>
        Returns above are from the starting date through the current reveal.
        Each comparison starts with $10,000.
      </p>
      {!started ? (
        <button
          autoFocus={focusPlay}
          onClick={() => {
            setStarted(true);
            if (reducedMotion) setVisible(12);
          }}
        >
          Play reveal
        </button>
      ) : paused && target < 60 ? (
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
        <button className="secondary" onClick={skip}>
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
