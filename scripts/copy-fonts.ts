/**
 * Copies the pre-subsetted WOFF2 files we self-host from the Fontsource
 * packages (SIL Open Font License) into src/fonts. Run after bumping a
 * @fontsource* dev dependency: `pnpm fonts:copy`.
 *
 * Subsets: Latin only for Fraunces / Manrope (covers French, English and
 * œ « » ’ €), Arabic only for Amiri / IBM Plex Sans Arabic (Latin runs inside
 * Arabic pages fall back to Manrope).
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const FILES = [
  "@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2",
  "@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2",
  "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  "@fontsource/amiri/files/amiri-arabic-400-normal.woff2",
  "@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2",
  "@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2",
  "@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2",
];

const outDir = join(process.cwd(), "src", "fonts");
mkdirSync(outDir, { recursive: true });

for (const file of FILES) {
  const name = file.split("/").pop()!;
  copyFileSync(join(process.cwd(), "node_modules", file), join(outDir, name));
  console.log(`copied ${name}`);
}
