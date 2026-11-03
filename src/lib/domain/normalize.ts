import { PRICE_OUTLIER_TND } from "@/config/billing";
import { normalizeAmenities, normalizeCategory, normalizeUseCases } from "./categories";
import { normalizeLocation } from "./locations";
import { cleanOptional, cleanText, slugify } from "./text";
import type { Listing, Photo, PriceUnit, ReviewFlag } from "./types";

/** Shape of a listing as captured from the live site (public fields only). */
export interface RawListing {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  images: string[];
  price: number;
  currency: string | null;
  duration_label: string | null;
  capacity: number | null;
  max_capacity: number | null;
  availability: string | null;
  opening_hours: string | null;
  amenities: string[] | null;
  use_cases: string[] | null;
  rules: string | null;
  status: string | null;
  availability_status: string | null;
  badge_popular: boolean | null;
  hosted_by: string | null;
  offer_label: string | null;
  instant_book: boolean | null;
  allow_dogs: boolean | null;
  sort_order: number | null;
}

export interface NormalizeContext {
  popularOrder?: readonly string[];
  resolvePhoto: (path: string) => Photo | null;
  /** Offer labels matching these are dropped (expired seasonal promotions). */
  expiredOffers?: readonly RegExp[];
}

export const EXPIRED_OFFERS: readonly RegExp[] = [/hallowe+n/i];

/** "/ heure", "/ hr", "/HR", "1hr", "heure trente", "/ nuit" -> unit. */
export function normalizePriceUnit(label: string | null | undefined): PriceUnit {
  const v = (label ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  if (/nuit|night/.test(v)) return "night";
  if (/trente|1h30|90/.test(v)) return "90min";
  return "hour";
}

export function normalizeListing(raw: RawListing, ctx: NormalizeContext): Listing {
  const title = cleanText(raw.title);
  const unit = normalizePriceUnit(raw.duration_label);
  const location = normalizeLocation(raw.location);
  const photos = raw.images.map(ctx.resolvePhoto).filter((p): p is Photo => p !== null);
  const included = Math.max(0, raw.capacity ?? 0);
  const max = Math.max(included, raw.max_capacity ?? 0);

  const offer = cleanOptional(raw.offer_label);
  const expired = (ctx.expiredOffers ?? EXPIRED_OFFERS).some((re) => offer && re.test(offer));

  const flags: ReviewFlag[] = [];
  if (unit !== "hour") flags.push("price_unit_non_hourly");
  if (raw.price > PRICE_OUTLIER_TND) flags.push("price_outlier");
  if (!raw.currency) flags.push("missing_currency");
  if (photos.length <= 1) flags.push("single_photo");
  if (!location.governorate) flags.push("location_unmapped");

  const rank = ctx.popularOrder?.indexOf(raw.id) ?? -1;
  const hostFirstName = cleanOptional(raw.hosted_by);

  return {
    id: raw.id,
    slug: `${slugify(title) || "espace"}-${raw.id.slice(0, 6)}`,
    title,
    description: cleanOptional(raw.description),
    category: normalizeCategory(raw.category),
    location,
    photos,
    price: { amountTnd: raw.price, unit },
    capacity: { included, max },
    amenities: normalizeAmenities(raw.amenities),
    useCases: normalizeUseCases(raw.use_cases),
    rules: cleanOptional(raw.rules),
    openingHours: cleanOptional(raw.opening_hours),
    isPopular: raw.badge_popular === true,
    popularRank: rank >= 0 ? rank : null,
    isVerified: raw.status === "published",
    hostFirstName: hostFirstName ? hostFirstName.split(" ")[0]! : null,
    offerLabel: expired ? null : offer,
    instantBook: false,
    allowDogs: raw.allow_dogs !== false,
    dogFeeTnd: null,
    extraGuestFeeTnd: null,
    availabilityStatus: raw.availability_status === "almost_full" ? "almost_full" : "available",
    sortOrder: raw.sort_order ?? 0,
    reviewFlags: flags,
  };
}
