import { readdir, readFile } from 'node:fs/promises';
import { loadScenario, validateScenario } from '../../app/src/lib/validation';
import {
  calculateComparisons,
  calculateWinners,
} from '../../app/src/lib/portfolio';
const directories = await readdir('data/scenarios', { withFileTypes: true });
let failures = 0;
for (const directory of directories.filter((entry) => entry.isDirectory())) {
  const read = async (name: string) =>
    JSON.parse(
      await readFile(`data/scenarios/${directory.name}/${name}.json`, 'utf8'),
    ) as unknown;
  try {
    const [known, future, provenance] = await Promise.all([
      read('known_at_start'),
      read('future_outcomes'),
      read('provenance'),
    ]);
    const report = validateScenario({ known, future, provenance });
    report.warnings.forEach((warning) =>
      console.warn(
        `${directory.name} REVIEW ${warning.path}: ${warning.message}`,
      ),
    );
    const scenario = loadScenario({ known, future, provenance });
    if (directory.name !== scenario.known.metadata.scenario_id)
      throw new Error('Directory name must match scenario ID');
    const comparisons = calculateComparisons(scenario.future.monthly_returns);
    const winners = calculateWinners(scenario.future.monthly_returns);
    console.log(
      `${directory.name}: valid (${scenario.known.metadata.data_kind}); benchmark $${comparisons.diversified.ending_value.toFixed(2)}; winner ${winners.actual_winner}`,
    );
  } catch (error) {
    failures++;
    console.error(`${directory.name}: ${String(error)}`);
  }
}
if (!directories.some((entry) => entry.isDirectory()))
  throw new Error('No scenarios found');
if (failures) process.exitCode = 1;
