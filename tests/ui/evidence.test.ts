import { afterEach, expect, it, vi } from 'vitest';
import type { Page, TestInfo } from '@playwright/test';
import { captureEvidence } from './evidence';

const screenshot = vi.fn().mockResolvedValue(Buffer.from(''));
const page = { screenshot } as unknown as Page;
const testInfo = {
  outputPath: (name: string) => `test-results/development/${name}`,
} as TestInfo;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

it.each([undefined, '', '0'])(
  'skips success screenshots for %s',
  async (value) => {
    vi.stubEnv('CAPTURE_SCREENSHOTS', value);
    await captureEvidence(page, testInfo, 'decision.png');
    expect(screenshot).not.toHaveBeenCalled();
  },
);

it('captures the requested checkpoint only when explicitly enabled', async () => {
  vi.stubEnv('CAPTURE_SCREENSHOTS', '1');
  await captureEvidence(page, testInfo, 'decision.png', { fullPage: true });
  expect(screenshot).toHaveBeenCalledExactlyOnceWith({
    path: 'test-results/development/decision.png',
    fullPage: true,
  });
});
