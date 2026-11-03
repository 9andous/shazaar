# Lighthouse baseline: live site

Run on 2026-11-03 against `https://www.shazaar.tn/` with Lighthouse 12.8.2 (CLI, headless Chrome, default throttling). Single run per device, so expect a few points of variance.

| Device | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | **60** | 96 | 96 | 100 |
| Desktop | **83** | 96 | 96 | 100 |

| Metric | Mobile | Desktop |
| --- | --- | --- |
| First Contentful Paint | 6.2 s | 1.6 s |
| Largest Contentful Paint | 11.2 s | 2.0 s |
| Total Blocking Time | 0 ms | 0 ms |
| Cumulative Layout Shift | 0.001 | 0.001 |
| Speed Index | 6.2 s | 1.9 s |
| Total page weight | 3,791 KiB | 4,259 KiB |

Main failing audits (both devices): render-blocking resources (Google Fonts CSS, two stylesheets), no text compression on some responses, no HTTP/2, unsized images, images not served responsively, short cache TTLs, unused and legacy JavaScript, large DOM (all 194 listings rendered in the first HTML), console errors, touch targets too small, label/name mismatch.

## New build, for reference

Phase 1 has no real homepage yet, so this only checks the foundations (fonts, CSS, layout shell), mobile:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` (placeholder) | 94 | 100 | 100 | 100 |
| `/style-guide` | 87 | 97 | 100 | 63 (noindex on purpose) |

Accessibility on `/style-guide` reports the deliberate low-contrast samples in the contrast table (forbidden pairings shown for documentation). The real comparison starts with the hero prototype (Phase 2a) and the homepage (Phase 2b), measured on a Vercel preview deployment.
