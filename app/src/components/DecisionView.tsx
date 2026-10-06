import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Allocation, type AllocationSnapshot } from './Allocation';
import { ScenarioView } from './ScenarioView';
import { AllocationBar, StageStrip } from './InvestmentVisual';
import { normalizeAllocations } from '../lib/portfolio';
export function DecisionView(props: ComponentProps<typeof Allocation>) {
  const ids = props.context.asset_definitions.map((asset) => asset.id);
  const [snapshot, setSnapshot] = useState<AllocationSnapshot>({
    allocations: normalizeAllocations(ids, {}),
    expected: '',
    confirming: false,
  });
  const [choosing, setChoosing] = useState(false);
  const allocation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setChoosing(entry.isIntersecting),
      { threshold: 0 },
    );
    if (allocation.current) observer.observe(allocation.current);
    return () => observer.disconnect();
  }, []);
  function goToChoice() {
    allocation.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    allocation.current
      ?.querySelector<HTMLElement>('h2')
      ?.focus({ preventScroll: true });
  }
  return (
    <div className="decision-experience">
      <div className="decision-toolbar">
        <span className="date-badge">{props.context.display_date}</span>
        <span className="small">Only information available at this date</span>
      </div>
      <StageStrip stage={choosing ? 'choose' : 'explore'} />
      <div className="decision-layout">
        <div className="decision-content">
          <ScenarioView context={props.context} />
          <div ref={allocation} className="allocation-anchor">
            <Allocation {...props} onSnapshot={setSnapshot} />
          </div>
        </div>
        <aside className="decision-tray panel" aria-label="Your decision tray">
          <h2>Your $10,000</h2>
          <AllocationBar
            context={props.context}
            allocations={snapshot.allocations}
          />
          <p>
            Prediction:{' '}
            <strong>
              {props.context.asset_definitions.find(
                (asset) => asset.id === snapshot.expected,
              )?.name ?? 'Not chosen yet'}
            </strong>
          </p>
          <p className="small">
            {snapshot.confirming
              ? 'Locked for review. Go back to edit before investing.'
              : 'One choice today. Hold it for five years.'}
          </p>
          {!choosing && <button onClick={goToChoice}>Make your choice</button>}
        </aside>
      </div>
      {!choosing && (
        <div className="mobile-choice-bar">
          <span>{props.context.display_date}</span>
          <button onClick={goToChoice}>Make your choice</button>
        </div>
      )}
    </div>
  );
}
