# Content to confirm

Unanswered items. Nothing here is shown in production until it is confirmed. Updated at every phase review.

## From the founder

| # | Item | Default in the build until answered |
| --- | --- | --- |
| 1 | Insurance | Nothing claimed anywhere. |
| 2 | Verification process (what is checked, documents, by whom) | « Vérifié » badge shown as on the live site; the process text is a hidden placeholder. |
| 3 | Support hours and response time | Hidden placeholder. |
| 4 | Host onboarding steps, documents, approval time | Hidden placeholder. |
| 5 | Commission and settlement terms | « communiquées lors de l'inscription » only. |
| 6 | Host presence during bookings | Hidden placeholder. |
| 7 | Pause listing / block dates | Hidden placeholder. |
| 8 | Full street address | « Tunis, Tunisie » only. |
| 9 | Basis of the 509 TND/day figure | Shown with no claim about its basis, pending answer. No calculator. Popular average 69.9 × 7 = 489, median 59 × 7 = 413, mean 92.5 × 7 = 647; none gives 509. |
| 10 | Default cancellation policy | Per-listing text only; no default shown. |
| 11 | Dog supplement | Global 13 TND/dog/hour, per-listing override (approved default). |
| 12 | Canonical social URLs | Live URLs: tiktok.com/@shazaar.co, instagram.com/shazaar.co, linkedin.com/in/shazaar, facebook.com/61592091354471. Confirm, especially the LinkedIn personal-profile URL. |
| 13 | Owner of the cloud accounts (Vercel, Supabase, Resend, Google OAuth) | Not created yet. |
| 14 | Domain/DNS access and email sender domain | Not configured. |
| 15 | Who can export the existing listings (DB dump or JSON + `/storage`) | Fallback: import from the public snapshot. |
| 16 | Dispute handling | Hidden placeholder. |
| 17 | Legal entity name and registered address (blank in live Terms) | Hidden placeholder; Terms/Privacy pages "pending legal review". |
| 18 | Half-hour billing rule (live bills 30 min as 0.65 h) | Linear half-hour billing (approved default). |
| 19 | GA4 measurement ID (live uses G-77KZPP4LR9) | Not added; added last, with consent mode. |
| 20 | Logo SVG (mark + wordmark) | Live PNG mark + Fraunces wordmark. |
| 21 | Photo rights (listings, intent tiles) | Mock phase only; see `docs/image-audit.md`. |
| 22 | Who runs the nginx server hosting the live site, DB and images | Needed for export and cut-over. |
| 23 | INPDP declaration and cross-border transfer (EU-hosted data) | Needs legal confirmation. |

## From the data

| Item | Default |
| --- | --- |
| Governorate of "Charguia" and "Franceville" | Listed under « Autres » in the city filter. |
| "Sidi Thabet, Bizerte" and "Oued Ellil, Ariana": host-declared governorates look wrong (Ariana and Manouba respectively) | Host-declared value kept; to correct with hosts. |
| "Suite avec balcon" priced per night, "Terrain Padel" per 1h30 | Unit label shown; flagged "needs host review"; billing stays hourly. |
| Yachts (304 to 1,384 TND) and two restaurants (599, 699 TND) labelled per hour | Shown as is; flagged `price_outlier` for host review. |
| One listing with no currency | Treated as TND; flagged. |
| 22 non-expired offer labels (free text, some are pricing rules such as « Au-delà de 5 heures l'heure à 100 DT ») | Shown as plain text, emojis stripped. Halloween offers (18) dropped as expired. |

## Translations

All Arabic strings are drafts for review by a native speaker (`TRANSLATIONS_REVIEW.md` arrives in Phase 3). The Arabic tagline « احجز الاستثنائي. » needs particular attention.
