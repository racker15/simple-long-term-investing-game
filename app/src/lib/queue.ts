import { SESSION_LENGTHS, type ScenarioMetadata } from './contracts';
export type QueueEntry = {
  scenario_id: string;
  selection_mode: ScenarioMetadata['selection']['mode'];
};
export function seededRandom(seed: string) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++)
    state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(input: T[], random: () => number): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function buildSessionQueue(
  library: QueueEntry[],
  target: number,
  previouslyCompleted: readonly string[],
  seed: string,
): string[] {
  if (!SESSION_LENGTHS.includes(target as (typeof SESSION_LENGTHS)[number]))
    throw new Error('Session length must be 5, 10, 15, or 20');
  if (new Set(library.map((s) => s.scenario_id)).size !== library.length)
    throw new Error('Scenario library contains duplicate IDs');
  if (
    library.some(
      (s) =>
        !s.scenario_id || !['important', 'random'].includes(s.selection_mode),
    )
  )
    throw new Error('Invalid scenario queue metadata');
  if (library.length < target)
    throw new Error(`Need ${target} unique scenarios, have ${library.length}`);
  const random = seededRandom(seed);
  const played = new Set(previouslyCompleted);
  const pools = (['important', 'random'] as const).map((mode) => {
    const cohort = library
      .filter((s) => s.selection_mode === mode)
      .sort((a, b) => a.scenario_id.localeCompare(b.scenario_id));
    return {
      unseen: shuffle(
        cohort.filter((s) => !played.has(s.scenario_id)),
        random,
      ),
      seen: shuffle(
        cohort.filter((s) => played.has(s.scenario_id)),
        random,
      ),
    };
  });
  const [important, ordinary] = pools;
  const maxUnseen = Math.min(
    target,
    important.unseen.length + ordinary.unseen.length,
  );
  const candidates = Array.from({ length: target + 1 }, (_, i) => i).filter(
    (i) =>
      i <= important.unseen.length + important.seen.length &&
      target - i <= ordinary.unseen.length + ordinary.seen.length &&
      Math.min(i, important.unseen.length) +
        Math.min(target - i, ordinary.unseen.length) ===
        maxUnseen,
  );
  const bestDistance = Math.min(
    ...candidates.map((i) => Math.abs(target / 2 - i)),
  );
  const tied = candidates.filter(
    (i) => Math.abs(target / 2 - i) === bestDistance,
  );
  let remainingImportant = tied[Math.floor(random() * tied.length)];
  const selectedImportant = [...important.unseen, ...important.seen].slice(
    0,
    remainingImportant,
  );
  const selectedRandom = [...ordinary.unseen, ...ordinary.seen].slice(
    0,
    target - remainingImportant,
  );
  let preferThree =
    target % 10 === 5 ? remainingImportant > target / 2 : random() >= 0.5;
  const queue: string[] = [];
  for (let offset = 0; offset < target; offset += 5) {
    const slotsAfter = target - offset - 5;
    const minimum = Math.max(0, remainingImportant - slotsAfter);
    const maximum = Math.min(5, remainingImportant);
    const blocksAfter = slotsAfter / 5;
    const possibleBalancedBlocks = (
      importantCount: number,
      blockCount: number,
    ) =>
      Math.min(
        blockCount,
        Math.floor(importantCount / 2),
        Math.floor((5 * blockCount - importantCount) / 2),
      );
    // Preserve the maximum feasible number of 2/3 blocks before choosing the alternating split.
    const quotas = Array.from(
      { length: maximum - minimum + 1 },
      (_, i) => minimum + i,
    );
    const balancedCount = (quota: number) =>
      Number(quota === 2 || quota === 3) +
      possibleBalancedBlocks(remainingImportant - quota, blocksAfter);
    const bestCount = Math.max(...quotas.map(balancedCount));
    const quota = quotas
      .filter((candidate) => balancedCount(candidate) === bestCount)
      .sort(
        (a, b) =>
          Math.abs(a - (preferThree ? 3 : 2)) -
          Math.abs(b - (preferThree ? 3 : 2)),
      )[0];
    const block = [
      ...selectedImportant.splice(0, quota),
      ...selectedRandom.splice(0, 5 - quota),
    ];
    queue.push(...shuffle(block, random).map((s) => s.scenario_id));
    remainingImportant -= quota;
    preferThree = quota === 2 ? true : quota === 3 ? false : !preferThree;
  }
  return queue;
}
