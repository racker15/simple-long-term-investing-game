import type { Locator, Page, TestInfo } from '@playwright/test';

// Capture successful checkpoints only for an intentional visual review.
// Playwright still captures every failed test through its shared config.
export async function captureEvidence(
  target: Page | Locator,
  testInfo: TestInfo,
  name: string,
  options: { fullPage?: boolean } = {},
) {
  if (process.env.CAPTURE_SCREENSHOTS !== '1') return;
  await target.screenshot({ path: testInfo.outputPath(name), ...options });
}
