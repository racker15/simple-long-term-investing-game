import { execFileSync } from 'node:child_process';
import manifest from '../../data/scenarios/manifest.json';
for (const entry of manifest.scenarios.filter(
  (row) => row.scenario_id !== '1999-09',
)) {
  for (const stage of [[], ['--outcome']])
    execFileSync(
      process.execPath,
      [
        '--import',
        'tsx',
        'scripts/normalize/yahoo-chart.ts',
        `--scenario=${entry.scenario_id}`,
        ...stage,
        ...(process.argv.includes('--check') ? ['--check'] : []),
      ],
      { stdio: 'inherit' },
    );
  execFileSync(
    'python3',
    [
      'scripts/normalize/stock-actions.py',
      entry.scenario_id,
      ...(process.argv.includes('--check') ? ['--check'] : []),
    ],
    { stdio: 'inherit' },
  );
}
