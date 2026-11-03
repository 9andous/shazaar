/**
 * Domain model shared by the web app, the future API (/api/v1) and the mobile
 * app. Framework-free: no React, no Next imports.
 */

export const CATEGORY_KEYS = [
  "pools",
  "villas",
  "pro",
  "outdoor",
  "rooftops",
  "cinema-gaming",
  "sport",
  "studios",
  "yachts",
  "cafes",
  "hammam",
  "other",
] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];

/** Primary chips shown in the bar; the rest go under "Plus". */
export const PRIMARY_CATEGORIES: readonly CategoryKey[] = [
  "pools",
  "villas",
  "pro",
  "outdoor",
  "rooftops",
  "cinema-gaming",
  "sport",
  "studios",
];
export const OVERFLOW_CATEGORIES: readonly CategoryKey[] = ["yachts", "cafes", "hammam", "other"];

/** The 4 intents are photographic tiles; the others are secondary filter chips. */
export const INTENT_KEYS = ["celebrate", "relax", "shoot", "meet"] as const;
export const SECONDARY_USE_CASE_KEYS = ["play", "study", "work", "watch", "create"] as const;
export type IntentKey = (typeof INTENT_KEYS)[number];
export type UseCaseKey = IntentKey | (typeof SECONDARY_USE_CASE_KEYS)[number];

export const GOVERNORATE_KEYS = [
  "tunis",
  "ariana",
  "ben-arous",
  "manouba",
  "nabeul",
  "bizerte",
  "sousse",
  "monastir",
  "sfax",
  "medenine",
  "gabes",
  "zaghouan",
] as const;
export type GovernorateKey = (typeof GOVERNORATE_KEYS)[number];

export const AMENITY_KEYS = [
  "wifi",
  "toilets",
  "shower",
  "garden",
  "private-pool",
  "sunbeds",
  "outdoor-lounge",
  "outdoor-dining",
  "outdoor-kitchen",
  "kitchen",
  "lounge",
  "large-tv",
  "cinema-projector",
  "netflix",
  "playstation-5",
] as const;
export type AmenityKey = (typeof AMENITY_KEYS)[number];

/** What the displayed price is for. Billing is hourly-only in v1. */
export type PriceUnit = "hour" | "90min" | "night";

/** Reasons a listing must be reviewed with its host before (re)publication. */
export type ReviewFlag =
  | "price_unit_non_hourly"
  | "price_outlier"
  | "missing_currency"
  | "single_photo"
  | "location_unmapped";

export interface Photo {
  src: string;
  width: number;
  height: number;
}

export interface Listing {
  id: string;
  slug: string;
  /** Host-entered French text: render with lang="fr" in every locale. */
  title: string;
  description: string | null;
  category: CategoryKey;
  location: {
    governorate: GovernorateKey | null;
    neighbourhood: string;
  };
  photos: Photo[];
  price: {
    amountTnd: number;
    unit: PriceUnit;
  };
  capacity: {
    included: number;
    max: number;
  };
  amenities: AmenityKey[];
  useCases: UseCaseKey[];
  rules: string | null;
  openingHours: string | null;
  isPopular: boolean;
  /** Position in the curated popular order, if any. */
  popularRank: number | null;
  /**
   * Shown as « Vérifié ». Mirrors the live site, where every published listing
   * carries the badge. The verification process itself is pending confirmation.
   */
  isVerified: boolean;
  hostFirstName: string | null;
  offerLabel: string | null;
  instantBook: false;
  allowDogs: boolean;
  /** Per-listing override of the global dog fee; null = global default. */
  dogFeeTnd: number | null;
  /** Per-listing override of the extra-guest fee; null = global default. */
  extraGuestFeeTnd: number | null;
  availabilityStatus: "available" | "almost_full";
  sortOrder: number;
  reviewFlags: ReviewFlag[];
}
