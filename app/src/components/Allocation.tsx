import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ALLOCATION_STEP,
  INITIAL_CAPITAL,
  type AssetId,
  type Allocations,
} from '../lib/contracts';
import type { DecisionContext } from '../lib/validation';
import { normalizeAllocations } from '../lib/portfolio';
import { money, percent } from '../lib/format';
import { readAllocationDraft } from '../lib/allocation-draft';
import {
  AllocationBar,
  InvestmentMark,
  InvestmentGuide,
} from './InvestmentVisual';
export type AllocationSnapshot = {
  allocations: Allocations;
  expected: AssetId | '';
  confirming: boolean;
};
export function Allocation({
  context,
  onCommit,
  storageKey,
  onSnapshot,
}: {
  context: DecisionContext;
  storageKey?: string;
  onSnapshot?: (snapshot: AllocationSnapshot) => void;
  onCommit: (
    allocation: Allocations,
    expected: AssetId,
  ) => boolean | void | Promise<void>;
}) {
  const ids = context.asset_definitions.map((asset) => asset.id);
  const [initial] = useState(() => {
    try {
      return {
        ...readAllocationDraft(
          storageKey ? localStorage.getItem(storageKey) : null,
          ids,
        ),
        warning: '',
      };
    } catch {
      return {
        draft: {},
        expected: '' as const,
        warning:
          'Your unfinished choice could not be restored. Please choose again; completed results are unchanged.',
      };
    }
  });
  const [draft, updateDraft] = useState<Partial<Allocations>>(initial.draft);
  const [expected, updateExpected] = useState<AssetId | ''>(initial.expected);
  const [warning, setWarning] = useState(initial.warning);
  const [saved, setSaved] = useState(false);
  const [undo, setUndo] = useState<Partial<Allocations> | null>(null);
  const [changed, setChanged] = useState<string[]>([]);
  function persist(
    nextDraft: Partial<Allocations>,
    nextExpected: AssetId | '',
  ) {
    if (!storageKey) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ draft: nextDraft, expected: nextExpected }),
      );
      setSaved(true);
      setWarning('');
    } catch {
      setSaved(false);
      setWarning(
        'Your edits could not be saved. Keep this tab open to finish your choice.',
      );
    }
  }
  function setDraft(next: Partial<Allocations>) {
    setUndo(draft);
    setChanged(['cash', ...ids.filter((id) => next[id] !== draft[id])]);
    persist(next, expected);
    updateDraft(next);
  }
  function setExpected(next: AssetId) {
    persist(draft, next);
    updateExpected(next);
  }
  const [confirming, setConfirming] = useState(false);
  const action = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  useLayoutEffect(() => {
    if (!confirming && !wasConfirming.current) return;
    wasConfirming.current = confirming;
    action.current?.focus({ preventScroll: true });
    action.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [confirming]);
  const explicit = Object.values(draft).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  const normalized = normalizeAllocations(ids, draft);
  useEffect(() => {
    onSnapshot?.({
      allocations: normalizeAllocations(ids, draft),
      expected,
      confirming,
    });
  }, [draft, expected, confirming, onSnapshot]);
  useEffect(() => {
    if (!changed.length) return;
    const timer = window.setTimeout(() => setChanged([]), 600);
    return () => window.clearTimeout(timer);
  }, [changed]);
  return (
    <section
      className={`panel allocation-panel${confirming ? ' allocation-locked' : ''}`}
      aria-labelledby="allocation-title"
    >
      <h2 id="allocation-title" tabIndex={-1}>
        Invest your $10,000
      </h2>
      {warning && <p role="status">{warning}</p>}
      <p className="small" role="status">
        {storageKey
          ? saved
            ? 'Saved on this browser. Other devices will not have this choice.'
            : 'Edits save on this browser when storage is available.'
          : 'Preview only: this choice is not saved.'}
      </p>
      <AllocationBar context={context} allocations={normalized} />
      <InvestmentGuide />
      <p>
        Move money in $500 steps. Cash is the amount remaining: adding to
        another investment reduces Cash, and removing money increases it.
      </p>
      {context.asset_definitions.map((asset) => (
        <div
          className={`allocation-row${changed.includes(asset.id) ? ' allocation-changed' : ''}`}
          key={asset.id}
        >
          <div>
            <strong>
              <InvestmentMark id={asset.id} ids={ids} />
              <span className="investment-name">{asset.name}</span>
            </strong>
            <p className="small">{asset.description}</p>
          </div>
          <div className="stepper">
            {asset.id === 'cash' ? (
              <>
                <span>Remaining</span>
                <output aria-label="Cash allocation">
                  {money(normalized.cash)}
                </output>
                <small>{percent(normalized.cash / INITIAL_CAPITAL)}</small>
              </>
            ) : (
              <>
                <button
                  className="secondary"
                  aria-label={`Remove $500 from ${asset.name}`}
                  disabled={confirming || !draft[asset.id]}
                  title={
                    confirming
                      ? 'Locked for review'
                      : !draft[asset.id]
                        ? 'Nothing to remove here'
                        : 'Move $500 back to cash'
                  }
                  onClick={() =>
                    setDraft({
                      ...draft,
                      [asset.id]: (draft[asset.id] ?? 0) - ALLOCATION_STEP,
                    })
                  }
                >
                  −
                </button>
                <output aria-label={`${asset.name} allocation`}>
                  {money(normalized[asset.id])}
                </output>
                <small>{percent(normalized[asset.id] / INITIAL_CAPITAL)}</small>
                <button
                  className="secondary"
                  aria-label={`Add $500 to ${asset.name}`}
                  disabled={confirming || explicit >= INITIAL_CAPITAL}
                  title={
                    confirming
                      ? 'Locked for review'
                      : explicit >= INITIAL_CAPITAL
                        ? 'All $10,000 is allocated'
                        : 'Move $500 from cash'
                  }
                  onClick={() =>
                    setDraft({
                      ...draft,
                      [asset.id]: (draft[asset.id] ?? 0) + ALLOCATION_STEP,
                    })
                  }
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      <p aria-live="polite">
        <strong>
          {money(INITIAL_CAPITAL)} / {money(INITIAL_CAPITAL)} allocated
        </strong>{' '}
        · {money(normalized.cash)} remaining in Cash.
      </p>
      {!confirming && undo && (
        <button
          className="secondary"
          onClick={() => {
            persist(undo, expected);
            updateDraft(undo);
            setUndo(null);
            setChanged([]);
          }}
        >
          Undo last allocation change
        </button>
      )}
      {!confirming && explicit >= INITIAL_CAPITAL && (
        <p className="small">
          All $10,000 is allocated. Remove money from an investment before
          adding elsewhere.
        </p>
      )}
      <fieldset disabled={confirming}>
        <legend>
          Which investment do you think will do best over the next five years?
        </legend>
        <div className="prediction-grid">
          {context.asset_definitions.map((asset) => (
            <label
              key={asset.id}
              className={
                expected === asset.id ? 'prediction-selected' : undefined
              }
            >
              <input
                type="radio"
                name="expected-winner"
                value={asset.id}
                checked={expected === asset.id}
                onChange={() => setExpected(asset.id)}
              />
              <InvestmentMark id={asset.id} ids={ids} />
              {asset.name}
            </label>
          ))}
        </div>
      </fieldset>
      {confirming && (
        <div className="allocation-lock" role="status">
          <strong>
            <span aria-hidden="true">✓ </span>Locked and ready
          </strong>
          <p>
            Your $10,000 choice for {context.display_date} is ready. Choose
            Invest to begin five years, or go back to make changes.
          </p>
        </div>
      )}
      {confirming ? (
        <div className="actions">
          <button
            ref={action}
            onClick={() => {
              if (!expected) return;
              const durablyCommitted = onCommit(normalized, expected);
              if (storageKey && durablyCommitted === true) {
                try {
                  localStorage.removeItem(storageKey);
                } catch {
                  /* The committed decision is stored separately. */
                }
              }
            }}
          >
            Invest and see what happens
          </button>
          <button className="secondary" onClick={() => setConfirming(false)}>
            Back to allocation
          </button>
        </div>
      ) : (
        <button
          ref={action}
          disabled={!expected}
          onClick={() => setConfirming(true)}
        >
          Review decision
        </button>
      )}
    </section>
  );
}
