import type { AmenityKey, CategoryKey, UseCaseKey } from "./types";

/** Raw category values found on the live site (mixed FR/EN, mixed case). */
const CATEGORY_MAP: Record<string, CategoryKey> = {
  pool: "pools",
  villa: "villas",
  salle: "pro",
  "professional space": "pro",
  "espace extérieur": "outdoor",
  "espace exterieur": "outdoor",
  garden: "outdoor",
  jardin: "outdoor",
  courtyard: "outdoor",
  rooftop: "rooftops",
  "cinema room": "cinema-gaming",
  "gaming room": "cinema-gaming",
  terrain: "sport",
  "padel court": "sport",
  "studio shooting": "studios",
  studio: "studios",
  yachts: "yachts",
  yacht: "yachts",
  café: "cafes",
  cafe: "cafes",
  hammam: "hammam",
};

export function normalizeCategory(raw: string | null | undefined): CategoryKey {
  if (!raw) return "other";
  return CATEGORY_MAP[raw.trim().toLowerCase()] ?? "other";
}

const USE_CASE_MAP: Record<string, UseCaseKey> = {
  celebrate: "celebrate",
  relax: "relax",
  shoot: "shoot",
  meet: "meet",
  play: "play",
  study: "study",
  work: "work",
  watch: "watch",
  create: "create",
};

export function normalizeUseCases(raw: readonly string[] | null | undefined): UseCaseKey[] {
  const out = new Set<UseCaseKey>();
  for (const value of raw ?? []) {
    const key = USE_CASE_MAP[value.trim().toLowerCase()];
    if (key) out.add(key);
  }
  return [...out];
}

const AMENITY_MAP: Record<string, AmenityKey> = {
  wifi: "wifi",
  toilets: "toilets",
  shower: "shower",
  garden: "garden",
  "private pool": "private-pool",
  sunbeds: "sunbeds",
  "salon extérieur": "outdoor-lounge",
  "salle a manger extérieure": "outdoor-dining",
  "salle à manger extérieure": "outdoor-dining",
  "cuisine extérieure": "outdoor-kitchen",
  cuisine: "kitchen",
  salon: "lounge",
  "tv grande taille": "large-tv",
  "projecteur cinéma": "cinema-projector",
  netflix: "netflix",
  "playstation 5": "playstation-5",
};

export function normalizeAmenities(raw: readonly string[] | null | undefined): AmenityKey[] {
  const out = new Set<AmenityKey>();
  for (const value of raw ?? []) {
    const key = AMENITY_MAP[value.trim().toLowerCase()];
    if (key) out.add(key);
  }
  return [...out];
}
