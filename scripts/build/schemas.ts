import { format, resolveConfig } from 'prettier';
import { readFile, writeFile } from 'node:fs/promises';
import { schemaRegistry } from '../../app/src/lib/contracts';
for (const [name, schema] of Object.entries(schemaRegistry)) {
  const path = `schemas/${name}.schema.json`;
  const contents = await format(
    JSON.stringify({
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...schema,
    }),
    { ...(await resolveConfig(path)), parser: 'json' },
  );
  if (process.argv.includes('--check')) {
    if ((await readFile(path, 'utf8')) !== contents)
      throw new Error(`${path} is stale; run npm run schemas`);
  } else await writeFile(path, contents);
}
