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
