import manifest from '../../../data/scenarios/manifest.json';
import type { KnownAtStart, Scenario } from '../lib/contracts';
import type { QueueEntry } from '../lib/queue';
import {
  decisionContext,
  loadScenario,
  structuralErrors,
} from '../lib/validation';

const startingModules = import.meta.glob(
  '../../../data/scenarios/*/known_at_start.json',
  { eager: true, import: 'default' },
);
const futureModules = import.meta.glob(
  '../../../data/scenarios/*/future_outcomes.json',
  { import: 'default' },
);
const provenanceModules = import.meta.glob(
  '../../../data/scenarios/*/provenance.json',
  { import: 'default' },
);
const starts: Record<string, unknown> = Object.fromEntries(
  manifest.scenarios.map((entry) => [
    entry.scenario_id,
    startingModules[
      `../../../data/scenarios/${entry.scenario_id}/known_at_start.json`
    ],
  ]),
);
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
  const futureLoader =
    futureModules[`../../../data/scenarios/${id}/future_outcomes.json`];
  const provenanceLoader =
    provenanceModules[`../../../data/scenarios/${id}/provenance.json`];
  if (!futureLoader || !provenanceLoader)
    throw new Error(`No outcome loader for historical scenario ${id}`);
  const [future, provenance] = await Promise.all([
    futureLoader(),
    provenanceLoader(),
  ]);
  return loadScenario({ known: starts[id], future, provenance });
}
