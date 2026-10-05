import manifest from '../../data/scenarios/manifest.json';
import { buildStartingScenario } from './historical';
import { buildOutcomeScenario } from './outcomes';

// Deterministic offline assembly; only already qualified registry entries.
const check = process.argv.includes('--check');
for (const entry of manifest.scenarios) {
  await buildStartingScenario(entry.scenario_id, check);
  await buildOutcomeScenario(entry.scenario_id, check);
}
