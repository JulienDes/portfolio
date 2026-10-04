import { test, expect, type Page } from '@playwright/test';

test('loads the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/App/);
});

// ── Hero canvas helpers ──────────────────────────────────────────────────────
// The hero is `min-height: 100svh`, so its canvas is exactly viewport-height tall.
// Waiting on "the bitmap already matches the new box AND something is drawn" is the
// only condition that cannot be satisfied by the stale pre-resize frame.
const drawnAt = (page: Page, cssHeight: number) =>
  page.waitForFunction((expected) => {
    const c = document.querySelector<HTMLCanvasElement>('.neural-canvas');
    if (!c || !c.width) return false;
    if (Math.abs(c.getBoundingClientRect().height - expected) > 1) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (Math.abs(c.height - Math.round(expected * dpr)) > 1) return false;
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    for (let i = 3; i < data.length; i += 4) if (data[i] > 8) return true;
    return false;
  }, cssHeight);

// A normalised grid lines up two measurements taken at different sizes. Measure cell
// occupancy, not pixels: the strokes cover ~3.5% of the canvas, too little for pixel
// sampling to separate the two cases.
const fingerprint = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>('.neural-canvas')!;
    const { data, width, height } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    const G = 32;
    const cells = new Uint8Array(G * G);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 8) {
          cells[(((y / height) * G) | 0) * G + (((x / width) * G) | 0)] = 1;
        }
      }
    }
    return Array.from(cells);
  });

const iou = (a: number[], b: number[]) => {
  const inter = a.reduce((n, v, i) => n + (v && b[i] ? 1 : 0), 0);
  const union = a.reduce((n, v, i) => n + (v || b[i] ? 1 : 0), 0);
  return inter / union;
};

test('le réseau du hero survit à un changement de hauteur de viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAt(page, 844);
  const before = await fingerprint(page);

  await page.setViewportSize({ width: 390, height: 780 });
  await drawnAt(page, 780);
  const after = await fingerprint(page);

  // Remapping the field keeps the pattern recognisable (measured 0.87-0.97).
  // Re-seeding yields two independent random patterns (measured 0.00-0.04).
  expect(iou(before, after)).toBeGreaterThan(0.6);
});

test("le réseau survit au chrome natif d'une WebView qui s'anime au scroll", async ({ page }) => {
  // This is the LinkedIn in-app browser mechanism, reproduced without LinkedIn: the
  // host app animates its own native bar on scroll, which resizes the WebView frame,
  // so the CSS viewport height really does change several times per scroll gesture.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAt(page, 844);
  const atRest = await fingerprint(page);

  // The native bar collapsing, then expanding again. The hero has to stay in view:
  // the IntersectionObserver pauses the loop once it leaves, and a paused loop never
  // repaints the bitmap a resize just cleared.
  for (const height of [820, 800, 780, 764, 780, 800, 820, 844]) {
    await page.setViewportSize({ width: 390, height });
    await drawnAt(page, height);
  }
  const afterGesture = await fingerprint(page);

  // Remapping is reversible, so returning to the original height must return the
  // original pattern. Re-seeding on every step cannot.
  expect(iou(atRest, afterGesture)).toBeGreaterThan(0.6);
});
