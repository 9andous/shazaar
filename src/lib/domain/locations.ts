import { titleCase } from "./text";
import type { GovernorateKey } from "./types";

/**
 * Host-entered locations are free text ("Lac 1, tunis", "Marsa", "Cap zbib,
 * Bizerte"). We split into neighbourhood + governorate:
 *  1. a recognised governorate after the comma wins (host-declared);
 *  2. otherwise the neighbourhood is looked up in NEIGHBOURHOODS;
 *  3. otherwise governorate = null (shown under "Autres", flagged for review).
 * Only mappings we are sure of are listed. Ambiguous ones stay null.
 */

const GOVERNORATE_ALIASES: Record<string, GovernorateKey> = {
  tunis: "tunis",
  ariana: "ariana",
  "ben arous": "ben-arous",
  manouba: "manouba",
  nabeul: "nabeul",
  bizerte: "bizerte",
  sousse: "sousse",
  monastir: "monastir",
  sfax: "sfax",
  medenine: "medenine",
  médenine: "medenine",
  gabes: "gabes",
  gabès: "gabes",
  zaghouan: "zaghouan",
};

interface Neighbourhood {
  name: string;
  governorate: GovernorateKey;
}

/** Keys are lower-case raw spellings, including the duplicates found live. */
const NEIGHBOURHOODS: Record<string, Neighbourhood> = {
  tunis: { name: "Tunis", governorate: "tunis" },
  "la fayette": { name: "La Fayette", governorate: "tunis" },
  "lac 1": { name: "Lac 1", governorate: "tunis" },
  "centre urbain nord": { name: "Centre Urbain Nord", governorate: "tunis" },
  marsa: { name: "La Marsa", governorate: "tunis" },
  "la marsa": { name: "La Marsa", governorate: "tunis" },
  gammarth: { name: "Gammarth", governorate: "tunis" },
  "marina gammarth": { name: "Marina Gammarth", governorate: "tunis" },
  "sidi bou saïd": { name: "Sidi Bou Saïd", governorate: "tunis" },
  "sidi bou said": { name: "Sidi Bou Saïd", governorate: "tunis" },
  carthage: { name: "Carthage", governorate: "tunis" },
  "la goulette": { name: "La Goulette", governorate: "tunis" },
  mutuelleville: { name: "Mutuelleville", governorate: "tunis" },
  mutelleville: { name: "Mutuelleville", governorate: "tunis" },
  monplaisir: { name: "Monplaisir", governorate: "tunis" },
  "el menzah 1": { name: "El Menzah 1", governorate: "tunis" },
  "el menzah 4": { name: "El Menzah 4", governorate: "tunis" },
  "cité olympique": { name: "Cité Olympique", governorate: "tunis" },
  "sidi hassine": { name: "Sidi Hassine", governorate: "tunis" },
  "ain zaghouen": { name: "Ain Zaghouen", governorate: "tunis" },
  manar: { name: "Manar", governorate: "tunis" },
  aouina: { name: "Aouina", governorate: "tunis" },
  ennasr: { name: "Ennasr", governorate: "ariana" },
  soukra: { name: "La Soukra", governorate: "ariana" },
  ariana: { name: "Ariana", governorate: "ariana" },
  "borj touil": { name: "Borj Touil", governorate: "ariana" },
  "kalaat el andalous / utique": { name: "Kalaat El Andalous", governorate: "ariana" },
  "ben arous": { name: "Ben Arous", governorate: "ben-arous" },
  "borj cédria": { name: "Borj Cédria", governorate: "ben-arous" },
  "el morneg": { name: "El Morneg", governorate: "ben-arous" },
  "el mourouj": { name: "El Mourouj", governorate: "ben-arous" },
  megrine: { name: "Mégrine", governorate: "ben-arous" },
  radés: { name: "Radès", governorate: "ben-arous" },
  radès: { name: "Radès", governorate: "ben-arous" },
  manouba: { name: "Manouba", governorate: "manouba" },
  hammamet: { name: "Hammamet", governorate: "nabeul" },
  "dar allouche": { name: "Dar Allouche", governorate: "nabeul" },
  "cap zebib": { name: "Cap Zebib", governorate: "bizerte" },
  "cap zbib": { name: "Cap Zebib", governorate: "bizerte" },
  sousse: { name: "Sousse", governorate: "sousse" },
  monastir: { name: "Monastir", governorate: "monastir" },
  sfax: { name: "Sfax", governorate: "sfax" },
  djerba: { name: "Djerba", governorate: "medenine" },
  zarzis: { name: "Zarzis", governorate: "medenine" },
  zaghouan: { name: "Zaghouan", governorate: "zaghouan" },
};

export interface NormalizedLocation {
  governorate: GovernorateKey | null;
  neighbourhood: string;
}

export function normalizeLocation(raw: string | null | undefined): NormalizedLocation {
  const value = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!value) return { governorate: null, neighbourhood: "" };

  const whole = NEIGHBOURHOODS[value.toLowerCase()];
  if (whole) return { governorate: whole.governorate, neighbourhood: whole.name };

  const [head = "", ...rest] = value.split(",").map((s) => s.trim());
  const tail = rest.join(", ");
  const known = NEIGHBOURHOODS[head.toLowerCase()];
  const declared = GOVERNORATE_ALIASES[tail.toLowerCase()];

  // "Nabeul, Hammamet": governorate first, place second.
  if (!declared && GOVERNORATE_ALIASES[head.toLowerCase()] && NEIGHBOURHOODS[tail.toLowerCase()]) {
    const n = NEIGHBOURHOODS[tail.toLowerCase()]!;
    return { governorate: n.governorate, neighbourhood: n.name };
  }

  // "Marina, Gammarth": the tail is a place, not a governorate.
  if (!declared && tail && NEIGHBOURHOODS[`${head} ${tail}`.toLowerCase()]) {
    const n = NEIGHBOURHOODS[`${head} ${tail}`.toLowerCase()]!;
    return { governorate: n.governorate, neighbourhood: n.name };
  }

  return {
    governorate: declared ?? known?.governorate ?? null,
    neighbourhood: known?.name ?? titleCase(head),
  };
}
