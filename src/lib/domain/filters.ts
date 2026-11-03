import type { CategoryKey, GovernorateKey, Listing, UseCaseKey } from "./types";

export interface ListingFilters {
  query?: string;
  category?: CategoryKey;
  useCase?: UseCaseKey;
  governorate?: GovernorateKey;
  guests?: number;
  maxPriceTnd?: number;
}

export function normalizeForSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function applyFilters(listings: readonly Listing[], f: ListingFilters): Listing[] {
  const q = f.query ? normalizeForSearch(f.query.trim()) : "";
  return listings.filter((l) => {
    if (f.category && l.category !== f.category) return false;
    if (f.useCase && !l.useCases.includes(f.useCase)) return false;
    if (f.governorate && l.location.governorate !== f.governorate) return false;
    if (f.guests && l.capacity.max < f.guests) return false;
    if (f.maxPriceTnd && l.price.amountTnd > f.maxPriceTnd) return false;
    if (q) {
      const haystack = normalizeForSearch(`${l.title} ${l.location.neighbourhood} ${l.description ?? ""}`);
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

