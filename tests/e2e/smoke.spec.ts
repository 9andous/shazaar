import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const LOCALES = [
  { path: "/", lang: "fr", dir: "ltr" },
  { path: "/en", lang: "en", dir: "ltr" },
  { path: "/ar", lang: "ar", dir: "rtl" },
];

for (const { path, lang, dir } of LOCALES) {
  test(`${path} renders lang/dir on the server`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    expect(html).toContain(`<html lang="${lang}" dir="${dir}"`);
  });

  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("style guide is noindex", async ({ request }) => {
  const html = await (await request.get("/style-guide")).text();
  expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
});

test("style guide components pass axe (contrast table samples excluded)", async ({ page }) => {
  await page.goto("/style-guide");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .exclude("table")
    .analyze();
  expect(results.violations).toEqual([]);
});
