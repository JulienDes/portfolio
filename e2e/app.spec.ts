import { test, expect, type Page } from '@playwright/test';

test('loads the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/App/);
});

// ── Hero canvas helpers ──────────────────────────────────────────────────────
// The hero height is frozen at startup, so a height-only viewport change no longer
// resizes the canvas. Width changes still do — that is the orientation-change path,
// and it is what these tests drive.

const canvasBox = (page: Page) =>
  page.evaluate(() => {
    const r = document.querySelector('.neural-canvas')!.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });

// Waits for "the bitmap already matches the expected box AND something is drawn".
// Both halves matter: the box check cannot be satisfied by the stale pre-resize frame,
// and the ink check cannot be satisfied by the blank bitmap a resize just produced.
const drawnAtBox = (page: Page, w: number, h: number) =>
  page.waitForFunction(
    ({ w, h }) => {
      const c = document.querySelector<HTMLCanvasElement>('.neural-canvas');
      if (!c || !c.width) return false;
      const r = c.getBoundingClientRect();
      if (Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 1) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (Math.abs(c.width - Math.round(w * dpr)) > 1) return false;
      const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
      for (let i = 3; i < data.length; i += 4) if (data[i] > 8) return true;
      return false;
    },
    { w, h },
  );

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

test('le réseau du hero survit à un redimensionnement du canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAtBox(page, 390, 844);
  const before = await fingerprint(page);

  // A width change is a real re-measure (orientation change), so the canvas resizes.
  await page.setViewportSize({ width: 360, height: 844 });
  await drawnAtBox(page, 360, 844);
  const after = await fingerprint(page);

  // Remapping the field keeps the pattern recognisable; re-seeding yields two
  // independent random patterns (measured ~0.03).
  expect(iou(before, after)).toBeGreaterThan(0.6);
});

test("le chrome natif d'une WebView qui s'anime au scroll ne touche plus à rien", async ({
  page,
}) => {
  // The LinkedIn/Messenger in-app browser mechanism without the app: the host animates
  // its native bar on scroll, which resizes the WebView frame, so the CSS viewport
  // height really does change several times per gesture.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAtBox(page, 390, 844);
  const box = await canvasBox(page);
  const atRest = await fingerprint(page);

  for (const height of [820, 800, 780, 764, 780, 800, 820, 844]) {
    await page.setViewportSize({ width: 390, height });
    // The frozen hero height must absorb every one of these: the canvas box may not move.
    expect(await canvasBox(page)).toEqual(box);
  }

  expect(iou(atRest, await fingerprint(page))).toBeGreaterThan(0.6);
});

test("le canvas reste peint quand un resize arrive sans trame d'animation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAtBox(page, 390, 844);

  // Reproduces how WKWebView suspends requestAnimationFrame for the duration of a
  // scroll gesture while ResizeObserver keeps delivering.
  await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
  });

  await page.setViewportSize({ width: 360, height: 844 });
  // Wait for the ResizeObserver to have taken the new box, without any frame running.
  await page.waitForFunction(() => {
    const c = document.querySelector<HTMLCanvasElement>('.neural-canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return !!c && Math.abs(c.width - Math.round(360 * dpr)) <= 1;
  });

  const ink = await page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>('.neural-canvas')!;
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    let n = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 8) n++;
    return n;
  });

  // Resizing the bitmap clears it; the repaint must not wait for a frame that will
  // never come during the gesture.
  expect(ink).toBeGreaterThan(0);
});

test('le bloc du hero ne bouge pas quand la hauteur du viewport change', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await drawnAtBox(page, 390, 844);

  // Absolute position in the document, so scrolling cannot confound the reading.
  const nameTop = () =>
    page.evaluate(() => {
      const el = document.querySelector('.hero-name')!;
      return el.getBoundingClientRect().top + window.scrollY;
    });

  const before = await nameTop();
  // A collapsing native bar grows the WebView frame.
  await page.setViewportSize({ width: 390, height: 900 });
  const after = await nameTop();

  // Centred content in a viewport-height box moves by half the delta; a frozen hero
  // height keeps it put.
  expect(Math.abs(after - before)).toBeLessThan(2);
});
