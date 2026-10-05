import manifest from '../../../data/scenarios/manifest.json';
import september1999 from '../../../data/scenarios/1999-09/known_at_start.json';
import type { KnownAtStart, Scenario } from '../lib/contracts';
import type { QueueEntry } from '../lib/queue';
import {
  decisionContext,
  loadScenario,
  structuralErrors,
} from '../lib/validation';

const starts: Record<string, unknown> = { '1999-09': september1999 };
if (
  manifest.schema_version !== 1 ||
  new Set(manifest.scenarios.map((entry) => entry.scenario_id)).size !==
    manifest.scenarios.length
)
  throw new Error('Invalid historical scenario manifest');
export const productionLibrary: QueueEntry[] = manifest.scenarios.map(
  (entry) => {
    const raw = starts[entry.scenario_id];
    if (structuralErrors('known_at_start', raw).length)
      throw new Error(`Invalid historical start ${entry.scenario_id}`);
    const known = raw as KnownAtStart;
    if (
      entry.data_kind !== 'historical' ||
      known.metadata.data_kind !== entry.data_kind ||
      known.metadata.scenario_id !== entry.scenario_id ||
      known.metadata.date !== entry.date ||
      known.metadata.selection.mode !== entry.selection_mode
    )
      throw new Error(
        `Manifest and starting metadata disagree for ${entry.scenario_id}`,
      );
    return {
      scenario_id: entry.scenario_id,
      selection_mode: known.metadata.selection.mode,
    };
  },
);

export function historicalDecisionContext(id: string) {
  if (!productionLibrary.some((entry) => entry.scenario_id === id))
    throw new Error(`Unknown historical scenario ${id}`);
  return decisionContext(starts[id] as KnownAtStart);
}

// Prepared static assets, requested only by the caller after the decision.
// No market-data service or HTTP API is involved at runtime.
export async function loadHistoricalScenario(id: string): Promise<Scenario> {
  historicalDecisionContext(id);
  if (id === '1999-09') {
    const [future, provenance] = await Promise.all([
      import('../../../data/scenarios/1999-09/future_outcomes.json'),
      import('../../../data/scenarios/1999-09/provenance.json'),
    ]);
    return loadScenario({
      known: starts[id],
      future: future.default,
      provenance: provenance.default,
    });
  }
  throw new Error(`No outcome loader for historical scenario ${id}`);
}
