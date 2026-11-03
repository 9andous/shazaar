/**
 * Data-access layer for listings. Components only ever call these functions.
 *
 * INTEGRATION POINT (Phase B): replace the mock adapter below with Supabase
 * queries against the `public_listings` view. Signatures stay the same.
 */
import "server-only";
import { cache } from "react";
import type { CategoryKey, GovernorateKey, Listing, UseCaseKey } from "@/lib/domain/types";
import { applyFilters, type ListingFilters } from "@/lib/domain/filters";
import { loadMockListings } from "./mock-adapter";

export type { ListingFilters };

export interface Page<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export const PAGE_SIZE = 12;

const all = cache(async (): Promise<Listing[]> => loadMockListings());

export async function getListings(
  filters: ListingFilters = {},
  { offset = 0, limit = PAGE_SIZE }: { offset?: number; limit?: number } = {},
): Promise<Page<Listing>> {
  const filtered = applyFilters(await all(), filters);
  const items = filtered.slice(offset, offset + limit);
  return { items, total: filtered.length, offset, limit, hasMore: offset + limit < filtered.length };
}

/** Best-selling spaces for the hero, in curated order. */
export async function getPopularListings(): Promise<Listing[]> {
  return (await all())
    .filter((l) => l.isPopular && l.photos.length > 0)
    .sort((a, b) => (a.popularRank ?? 999) - (b.popularRank ?? 999));
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return (await all()).find((l) => l.slug === slug) ?? null;
}

export async function countPublished(): Promise<number> {
  return (await all()).length;
}

/** Categories / governorates that actually have listings (empty ones are hidden). */
export async function getFacets(): Promise<{
  categories: Partial<Record<CategoryKey, number>>;
  governorates: Partial<Record<GovernorateKey, number>>;
  useCases: Partial<Record<UseCaseKey, number>>;
}> {
  const categories: Partial<Record<CategoryKey, number>> = {};
  const governorates: Partial<Record<GovernorateKey, number>> = {};
  const useCases: Partial<Record<UseCaseKey, number>> = {};
  for (const l of await all()) {
    categories[l.category] = (categories[l.category] ?? 0) + 1;
    if (l.location.governorate) {
      governorates[l.location.governorate] = (governorates[l.location.governorate] ?? 0) + 1;
    }
    for (const u of l.useCases) useCases[u] = (useCases[u] ?? 0) + 1;
  }
  return { categories, governorates, useCases };
}
