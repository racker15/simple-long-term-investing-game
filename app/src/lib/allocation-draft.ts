import type { Allocations, AssetId } from './contracts';
import { normalizeAllocations } from './portfolio';
export type AllocationDraft = {
  draft: Partial<Allocations>;
  expected: AssetId | '';
};
export function readAllocationDraft(
  raw: string | null,
  ids: AssetId[],
): AllocationDraft {
  if (!raw) return { draft: {}, expected: '' };
  const value = JSON.parse(raw) as AllocationDraft;
  if (
    !value ||
    typeof value !== 'object' ||
    !value.draft ||
    typeof value.draft !== 'object' ||
    Array.isArray(value.draft) ||
    Object.values(value.draft).some(
      (amount) => typeof amount !== 'number' || !Number.isFinite(amount),
    ) ||
    Object.keys(value.draft).some(
      (id) => id === 'cash' || !ids.includes(id as AssetId),
    ) ||
    (value.expected !== '' && !ids.includes(value.expected))
  )
    throw new Error('Invalid unfinished choice');
  normalizeAllocations(ids, value.draft);
  return { draft: value.draft, expected: value.expected };
}
