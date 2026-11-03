import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import tokens from "../../tokens.json";
import { AA_MIN, CONTRAST_PAIRS, FORBIDDEN_PAIRS, contrastRatio } from "@/lib/a11y/contrast";

const css = readFileSync(join(__dirname, "tokens.css"), "utf8");
const colors = tokens.color as Record<string, string>;

describe("tokens.css mirrors tokens.json", () => {
  it.each(Object.entries(colors))("color %s", (name, hex) => {
    expect(css.toLowerCase()).toContain(`--color-${name}: ${hex.toLowerCase()};`);
  });
  it.each(Object.entries(tokens.radius))("radius %s", (name, value) => {
    expect(css).toContain(`--radius-${name}: ${value};`);
  });
  it.each(Object.entries(tokens.shadow))("shadow %s", (name, value) => {
    expect(css).toContain(`--shadow-${name}: ${value};`);
  });
});

describe("contrast (WCAG 2.2 AA)", () => {
  it.each(CONTRAST_PAIRS.map((p) => [p.note, p] as const))("%s", (_note, p) => {
    expect(contrastRatio(colors[p.fg]!, colors[p.bg]!)).toBeGreaterThanOrEqual(AA_MIN[p.use]);
  });
  it.each(FORBIDDEN_PAIRS.map((p) => [p.note, p] as const))("forbidden: %s fails AA", (_n, p) => {
    expect(contrastRatio(colors[p.fg]!, colors[p.bg]!)).toBeLessThan(AA_MIN[p.use]);
  });
});
