import localFont from "next/font/local";

/**
 * Self-hosted, subsetted WOFF2 (see scripts/copy-fonts.ts). next/font adds
 * size-adjusted fallbacks so swapping in the web font causes no layout shift.
 * Latin fonts are preloaded; Arabic fonts load only where :lang(ar) uses them.
 */
export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-opsz-normal.woff2", weight: "300 600", style: "normal" },
    { path: "../fonts/fraunces-latin-opsz-italic.woff2", weight: "300 600", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const manrope = localFont({
  src: [{ path: "../fonts/manrope-latin-wght-normal.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const amiri = localFont({
  src: [{ path: "../fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
  fallback: ["serif"],
});

export const plexArabic = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
  fallback: ["Tahoma", "sans-serif"],
});

export const fontVariables = [fraunces, manrope, amiri, plexArabic].map((f) => f.variable).join(" ");
