# Listing photo audit

From `mocks/image-meta.json` (header reads of every photo on 2026-11-03).

| | |
| --- | --- |
| Photos | 786 across 194 listings (775 WebP, 10 JPEG, 1 PNG) |
| Orientation | 245 portrait, 230 landscape, 311 square |
| Long side | min 649px, 10th percentile 1024px, median 1376px, max 6000px |
| Short side under 720px | 10 photos |
| Long side under 1000px | 12 photos, in 11 listings |
| File size | median 192 KB, 90th percentile 395 KB, max 3.2 MB; 213 MB in total |
| Listings with a single photo | 13 |
| Popular listings (hero) | 20 first photos: 9 portrait, 3 square, 8 landscape; smallest 768x1376 (2 photos), all others 1024px+ wide |

## Consequences for the design

- Hero cards are portrait (4:5) and at most about 520 CSS px wide, so 1040px at 2x. 18 of the 20 popular first photos cover that; the two 768px-wide ones are slightly soft on 2x screens (fine at 1x and on phones). Landscape photos are cropped to the centre. Focal points may need adjusting per photo (`object-position`) once we see them in the prototype.
- No full-bleed landscape hero (as the brief says): the source photos would be upscaled on wide screens.
- The 13 single-photo listings get a single-image card (no dots).
- The 3.2 MB and 6000px originals must go through the Phase B image pipeline (resize to 1600px max, WebP/AVIF).

## Open items

- **Image rights**: who owns the listing photos and the four intent-tile photos (`celebrate`, `relax`, `shoot`, `meet`)? Do hosts grant Shazaar a licence to reuse them in marketing (hero, social)?
- 311 square photos (1254x1254 in many cases) suggest re-encoding or generation by some tool; worth checking visually that none are AI-generated or watermarked before they appear in the hero.
- Hosts with low-resolution or single photos should be asked for better ones during re-onboarding.
