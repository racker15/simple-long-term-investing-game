import type { AssetId, Allocations } from '../lib/contracts';
import type { DecisionContext } from '../lib/validation';
import { investmentStyle } from '../lib/investment-style';
import { money, percent } from '../lib/format';
export function InvestmentMark({ id, ids }: { id: AssetId; ids: AssetId[] }) {
  const style = investmentStyle(id, ids);
  return (
    <span
      className="investment-mark"
      aria-hidden="true"
      style={{ color: style.color }}
    >
      {style.symbol}
    </span>
  );
}
export function AllocationBar({
  context,
  allocations,
}: {
  context: DecisionContext;
  allocations: Allocations;
}) {
  const ids = context.asset_definitions.map((asset) => asset.id);
  const held = context.asset_definitions.filter(
    (asset) => allocations[asset.id] > 0,
  );
  return (
    <>
      <div
        className="allocation-bar"
        role="img"
        aria-label={held
          .map(
            (asset) =>
              `${asset.name}: ${money(allocations[asset.id])}, ${percent(allocations[asset.id] / 10000)}`,
          )
          .join('; ')}
      >
        {held.map((asset) => (
          <span
            key={asset.id}
            title={`${asset.name}: ${percent(allocations[asset.id] / 10000)}`}
            style={{
              width: `${allocations[asset.id] / 100}%`,
              backgroundColor: investmentStyle(asset.id, ids).color,
            }}
          >
            {investmentStyle(asset.id, ids).symbol}
          </span>
        ))}
      </div>
      <p className="small allocation-description">
        {held
          .map(
            (asset) =>
              `${percent(allocations[asset.id] / 10000)} in ${asset.name}`,
          )
          .join(' · ')}
      </p>
    </>
  );
}
export function StageStrip({
  stage,
}: {
  stage: 'explore' | 'choose' | 'watch' | 'reflect';
}) {
  return (
    <ol className="stage-strip" aria-label="Round stages">
      {[
        ['explore', 'Explore the moment'],
        ['choose', 'Make your choice'],
        ['watch', 'Watch time pass'],
        ['reflect', 'Reflect'],
      ].map(([id, label], i) => (
        <li key={id} aria-current={stage === id ? 'step' : undefined}>
          <span aria-hidden="true">{i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

export function InvestmentGuide() {
  const choices = [
    {
      key: 'cash',
      name: 'Cash',
      text: 'Money held in cash.',
      path: 'M5 12h54v32H5z M26 28a6 6 0 1 0 12 0a6 6 0 1 0 -12 0',
    },
    {
      key: 'bonds',
      name: 'Bonds',
      text: 'Loans to governments or companies.',
      path: 'M15 5h34v48H15z M22 16h20 M22 24h20 M22 32h13 M36 39l6 8l6 -8',
    },
    {
      key: 'us_total',
      name: 'A stock basket',
      text: 'Small shares in many companies. US and international funds hold different groups.',
      path: 'M9 22h46l-6 28H15z M21 22l6 -14 M43 22L37 8 M24 28v15 M40 28v15',
    },
    {
      key: 'company',
      name: 'One company',
      text: 'A share of ownership in one business.',
      path: 'M12 50V22l13 8V18l15 9V8h11v42z M20 37v7 M31 37v7 M43 37v7',
    },
  ];
  return (
    <details className="investment-guide">
      <summary>What am I buying?</summary>
      <div className="investment-guide-grid">
        {choices.map((choice) => (
          <article key={choice.key}>
            <svg viewBox="0 0 64 60" aria-hidden="true">
              <path
                d={choice.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
            <h3>{choice.name}</h3>
            <p>{choice.text}</p>
          </article>
        ))}
      </div>
    </details>
  );
}
