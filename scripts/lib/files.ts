import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { format, resolveConfig } from 'prettier';

export const sha256 = (contents: string | Buffer) =>
  createHash('sha256').update(contents).digest('hex');
export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}
export async function writeJson(path: string, value: unknown, check = false) {
  const content = await format(JSON.stringify(value), {
    ...(await resolveConfig(path)),
    parser: 'json',
  });
  if (check) {
    if ((await readFile(path, 'utf8')) !== content)
      throw new Error(`${path} is stale; rebuild data`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}
