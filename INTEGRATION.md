# Integration points

Every place the front end fakes something the backend will own. Each entry says what exists today and what Phase B must provide. Search the code for `INTEGRATION POINT` to find them.

## Data snapshot (mocks)

`/mocks/listings.snapshot.json` is a capture of the listings rendered on the live homepage on 2026-11-03 (194 listings, 20 `badge_popular`), produced by `pnpm snapshot:listings`.

**Removed on purpose, never committed:** `address`, `maps_url`, `host_id`, `contact_whatsapp` (and the always-null `slug`). Addresses and contact details are only revealed to a guest after a booking is confirmed, and host IDs identify people. The live site currently ships all four for every listing in public HTML. A unit test (`src/lib/domain/domain.test.ts`) fails if any of these fields reappear.

`/mocks/image-meta.json` holds width, height, format and size of all 786 photos (read from image headers with ranged requests) so every image renders with explicit dimensions.

`/mocks/dev-images.json` + `public/dev-images/` hold the first photo of each of the 20 popular listings (4.5 MB), used by the hero prototype. All other photos load from `https://www.shazaar.tn/storage/property-images/` during the mock phase (allowed in `next.config.ts` → `images.remotePatterns`; remove when the backend serves images). The full photo set is not committed. **Photo rights are an open item.**

## Stubs

| Stub | Where | Today | Phase B needs |
| --- | --- | --- | --- |
| Listings read | `src/lib/data/listings.ts` (`getListings`, `getPopularListings`, `getListingBySlug`, `countPublished`, `getFacets`) | Normalised mock snapshot | Supabase query on a `public_listings` view (public columns only), same signatures. Pagination with `offset/limit`. |
| Normalisation | `src/lib/domain/normalize.ts` | Cleans raw live data at read time | Becomes the import mapping (B3); new listings are entered clean through onboarding. `reviewFlags` become an admin queue. |
| Listing photos | `src/components/ui/responsive-image.tsx` | `next/image` on dev subset + live origin | Pre-generated WebP/AVIF variants in Supabase Storage, custom `next/image` loader. |
| Wishlist | `src/components/listing/wishlist-button.tsx` | Local state only | `wishlist_items` table, auth check, optimistic update. Anonymous user → sign-in first. |
| Currency preference | `src/components/currency/currency-provider.tsx` | Cookie `shz_currency`, applied after hydration | Nothing required. Optionally a `profiles.currency` preference. |
| Exchange rates | `src/config/currency.ts` | EUR 3.38 TND (as of 2026-07-31), USD empty (hidden) | Manual monthly update (agreed). Automate later. |
| Billing rules | `src/config/billing.ts`, `src/lib/domain/pricing.ts` | Linear half-hour, 7 TND extra guest, 13 TND dog, per-listing overrides | Same rules enforced server-side when a booking request is priced; price snapshot stored on the booking. |
| Verified badge | `Listing.isVerified` | `true` for every published listing (as on the live site) | Set from `verification_records` once the process is confirmed. |
| Auth, booking request, host onboarding | not built yet (Phase 2b+) | UI-only | B1/B2 per the approved plan. |

## Review flags from the import

`Listing.reviewFlags` marks listings to check with hosts. Counts on the current snapshot:

- `price_unit_non_hourly`: 2 (Suite avec balcon "/ nuit", Terrain Padel "heure trente")
- `price_outlier` (> 300 TND/h): 9 (7 yachts, 2 restaurants)
- `missing_currency`: 1
- `single_photo`: 13
- `location_unmapped`: 2 (Charguia, Franceville: governorate not certain)
