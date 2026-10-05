import { describe, expect, it } from 'vitest';
import { buildSessionQueue, type QueueEntry } from '../../app/src/lib/queue';
const library: QueueEntry[] = Array.from({ length: 40 }, (_, i) => ({
  scenario_id: `scenario-${String(i).padStart(2, '0')}`,
  selection_mode: i < 20 ? 'important' : 'random',
}));
const cohort = (id: string) =>
  library.find((s) => s.scenario_id === id)!.selection_mode;
describe('session queues', () => {
  it.each([5, 10, 15, 20])(
    'builds seeded, unique, balanced %i-scenario sessions and alternating blocks',
    (size) => {
      const queue = buildSessionQueue(library, size, [], 'seed');
      expect(queue).toHaveLength(size);
      expect(new Set(queue).size).toBe(size);
      expect(buildSessionQueue(library, size, [], 'seed')).toEqual(queue);
      expect(
        buildSessionQueue([...library].reverse(), size, [], 'seed'),
      ).toEqual(queue);
      const important = queue.filter((id) => cohort(id) === 'important').length;
      expect(Math.abs(important - size / 2)).toBeLessThanOrEqual(0.5);
      const blocks = Array.from(
        { length: size / 5 },
        (_, i) =>
          queue
            .slice(i * 5, i * 5 + 5)
            .filter((id) => cohort(id) === 'important').length,
      );
      blocks.forEach((count, i) => {
        expect([2, 3]).toContain(count);
        if (i) expect(count).not.toBe(blocks[i - 1]);
      });
      expect(buildSessionQueue(library, size, [], 'other')).not.toEqual(queue);
    },
  );
  it('prefers unseen within both cohorts', () => {
    const played = library
      .filter((_, i) => i < 10 || (i >= 20 && i < 30))
      .map((s) => s.scenario_id);
    expect(
      buildSessionQueue(library, 20, played, 'test').some((id) =>
        played.includes(id),
      ),
    ).toBe(false);
  });
  it('maximizes unseen before balancing: does not replay random dates instead of unseen important dates', () => {
    const played = library
      .filter((s) => s.selection_mode === 'random')
      .map((s) => s.scenario_id);
    const queue = buildSessionQueue(library, 10, played, 'test');
    expect(queue.every((id) => cohort(id) === 'important')).toBe(true);
  });
  it('uses seen items only when unseen pool is exhausted', () => {
    const played = library.slice(0, 37).map((s) => s.scenario_id);
    const queue = buildSessionQueue(library, 10, played, 'test');
    expect(queue.filter((id) => !played.includes(id))).toHaveLength(3);
    expect(queue.filter((id) => cohort(id) === 'important')).toHaveLength(5);
  });
  it('gracefully handles scarce cohorts without inventing duplicates', () => {
    const sparse = library.filter((_, i) => i < 2 || i >= 20);
    const queue = buildSessionQueue(sparse, 20, [], 'test');
    expect(new Set(queue).size).toBe(20);
    expect(queue.filter((id) => cohort(id) === 'important')).toHaveLength(2);
  });
  it('preserves feasible 2/3 blocks when one cohort is scarce', () => {
    const sparse = library.filter((_, i) => i < 6 || i >= 20);
    const queue = buildSessionQueue(sparse, 15, [], 'scarce');
    const counts = [0, 1, 2].map(
      (i) =>
        queue.slice(i * 5, i * 5 + 5).filter((id) => cohort(id) === 'important')
          .length,
    );
    expect(counts).toEqual([2, 2, 2]);
  });
  it('rejects invalid sizes, insufficient libraries and duplicate IDs', () => {
    expect(() => buildSessionQueue(library, 6, [], 'test')).toThrow();
    expect(() => buildSessionQueue(library.slice(0, 3), 5, [], 'test')).toThrow(
      'unique',
    );
    expect(() =>
      buildSessionQueue([...library, library[0]], 5, [], 'test'),
    ).toThrow('duplicate');
  });
});
