import { test, expect } from '@playwright/test';

// A representative sample of tools covering different UI layouts and heavy dependencies
const TOOLS_TO_TEST = [
  '/', // Homepage
  '/developer/hash-generator',
  '/pdf-tools/pdf-editor',
  '/utilities/qr-code-generator',
  '/calculators/nps-calculator',
  '/media/image-compressor'
];

test.describe('Visual Regression & Layout Stability', () => {
  for (const path of TOOLS_TO_TEST) {
    test(`Visual Snapshot for ${path}`, async ({ page }) => {
      await page.goto(path);
      
      // Wait for any skeleton loaders or heavy workers to finish
      // For Next.js client components, we wait until the network is idle
      await page.waitForLoadState('networkidle');

      // We use fullPage screenshots to ensure nothing overflows the bounding box or gets cut off
      await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.05 });
    });
  }
});
