import { expect, it } from 'vitest';
import { activeFrameMilliseconds } from '../../app/src/lib/playback-clock';
it('counts short visible frames but not hidden time or suspension gaps', () => {
  expect(activeFrameMilliseconds(16, true)).toBe(16);
  expect(activeFrameMilliseconds(100, true)).toBe(100);
  expect(activeFrameMilliseconds(16, false)).toBe(0);
  expect(activeFrameMilliseconds(10000, true)).toBe(0);
  expect(activeFrameMilliseconds(-1, true)).toBe(0);
});
