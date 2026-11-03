/** WCAG 2.x relative luminance and contrast ratio for #RRGGBB colours. */

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type ContrastUse = "text" | "large-text" | "ui";

/** Minimum AA ratio for a use: 4.5 body text, 3 large text and UI components. */
export const AA_MIN: Record<ContrastUse, number> = { text: 4.5, "large-text": 3, ui: 3 };

export interface ContrastPair {
  fg: string;
  bg: string;
  use: ContrastUse;
  note: string;
}

/** Every foreground/background pairing the design system allows. */
export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: "ink", bg: "canvas", use: "text", note: "Default text" },
  { fg: "ink", bg: "surface", use: "text", note: "Text on cards" },
  { fg: "ink", bg: "sunk", use: "text", note: "Text on sunk panels" },
  { fg: "ink", bg: "gold-soft", use: "text", note: "Text on gold-soft highlight" },
  { fg: "ink-muted", bg: "canvas", use: "text", note: "Secondary text" },
  { fg: "ink-muted", bg: "surface", use: "text", note: "Secondary text on cards" },
  { fg: "ink-muted", bg: "sunk", use: "text", note: "Secondary text on sunk" },
  { fg: "gold-deep", bg: "canvas", use: "text", note: "Body-size gold text, links" },
  { fg: "gold-deep", bg: "surface", use: "text", note: "Body-size gold text on cards" },
  { fg: "gold-deep", bg: "gold-soft", use: "text", note: "Badge text" },
  { fg: "gold", bg: "canvas", use: "large-text", note: "Gold display text, icons, rules" },
  { fg: "gold", bg: "surface", use: "large-text", note: "Gold accents on cards" },
  { fg: "gold", bg: "canvas", use: "ui", note: "Focus ring on canvas" },
  { fg: "gold-soft", bg: "ink", use: "text", note: "Gold-soft on ink (dark bands)" },
  { fg: "on-ink", bg: "ink", use: "text", note: "Primary button label" },
  { fg: "line-strong", bg: "canvas", use: "ui", note: "Form control borders" },
  { fg: "line-strong", bg: "surface", use: "ui", note: "Form control borders on cards" },
  { fg: "success", bg: "canvas", use: "text", note: "Success messages" },
  { fg: "error", bg: "canvas", use: "text", note: "Error messages" },
  { fg: "error", bg: "surface", use: "text", note: "Error messages on cards" },
];

/** Pairings that are explicitly forbidden (documented, not used). */
export const FORBIDDEN_PAIRS: ContrastPair[] = [
  { fg: "gold", bg: "canvas", use: "text", note: "Gold body text: use gold-deep" },
  { fg: "on-ink", bg: "gold", use: "text", note: "Light text on gold fill" },
  { fg: "gold-logo", bg: "canvas", use: "text", note: "Logo gold is for the mark only" },
];
