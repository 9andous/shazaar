import { test } from "@playwright/test";

/**
 * Review screenshots for phase stops. Opt-in:
 *   SCREENSHOTS=phase-1 pnpm test:e2e review-screenshots
 */
const phase = process.env.SCREENSHOTS;
const PAGES = [
  { name: "style-guide-fr", path: "/style-guide" },
  { name: "style-guide-ar", path: "/ar/style-guide" },
];
const WIDTHS = [360, 768, 1280, 1920];

test.skip(!phase, "set SCREENSHOTS=<phase> to capture");

for (const p of PAGES) {
  for (const width of WIDTHS) {
    test(`${p.name} @${width}`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop-1280", "capture once");
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(p.path, { waitUntil: "networkidle" });
      // Trigger lazy images before a full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: `docs/review/${phase}/${p.name}-${width}.jpg`,
        fullPage: true,
        type: "jpeg",
        quality: 70,
      });
    });
  }
}
