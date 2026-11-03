/**
 * Mock adapter: reads the public snapshot in /mocks and normalises it.
 * Photos in the small dev subset are served locally from /dev-images; all
 * others are loaded from the live origin until the backend owns the images.
 */
import devImages from "@mocks/dev-images.json";
import imageMeta from "@mocks/image-meta.json";
import snapshot from "@mocks/listings.snapshot.json";
import { normalizeListing, type RawListing } from "@/lib/domain/normalize";
import type { Listing, Photo } from "@/lib/domain/types";

export const LIVE_ORIGIN = "https://www.shazaar.tn";

const local = new Set<string>(devImages as string[]);
const meta = (imageMeta as { images: Record<string, { w: number; h: number }> }).images;

function resolvePhoto(path: string): Photo | null {
  const m = meta[path];
  if (!m) return null; // no known dimensions -> skip to keep zero CLS
  const src = local.has(path) ? `/dev-images/${path.split("/").pop()}` : `${LIVE_ORIGIN}${path}`;
  return { src, width: m.w, height: m.h };
}

export function loadMockListings(): Listing[] {
  const { listings, popularOrder } = snapshot as unknown as {
    listings: RawListing[];
    popularOrder: string[];
  };
  return listings
    .map((raw) => normalizeListing(raw, { popularOrder, resolvePhoto }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
