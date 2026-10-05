import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { sha256 } from './files';

export type SourceManifest = {
  schema_version: 1;
  sources: {
    id: string;
    source_name: string;
    canonical_url: string;
    download_url: string;
    upstream_download_url?: string;
    series_id: string;
    raw_path: string;
    sha256: string;
    retrieved_at: string;
    transformation: string;
    archive_member?: string;
  }[];
};

export async function readLockedSources(
  manifest: SourceManifest,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const source of manifest.sources) {
    if (source.id in result)
      throw new Error(`Duplicate source ID ${source.id}`);
    const raw = await readFile(source.raw_path);
    if (sha256(raw) !== source.sha256)
      throw new Error(`Raw checksum mismatch for ${source.id}`);
    result[source.id] = source.archive_member
      ? execFileSync(
          'python3',
          [
            '-c',
            'import sys, zipfile; sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))',
            source.raw_path,
            source.archive_member,
          ],
          { maxBuffer: 16 * 1024 * 1024 },
        ).toString('utf8')
      : raw.toString('utf8');
  }
  return result;
}
