# Shazaar

Website and backend for **Shazaar**, a Tunisian marketplace for renting private spaces by the hour: pools, rooftops, gardens, villas, cinema and gaming rooms, courts, studios and more.

> Reserve the Extraordinary. · Réservez l'extraordinaire.

## Status

Greenfield rebuild in progress on branch `feat/redesign`. `main` only receives reviewed, approved work.

| Phase | Scope |
| --- | --- |
| 1 | Foundations: tokens, fonts, primitives, style guide, mock data layer |
| 2a / 2b | Hero prototype, then French homepage |
| 3 | English + Arabic (RTL), currency display |
| B1–B3 | Backend: Supabase, auth, listings, bookings, messaging |
| 4 / 5 | Remaining pages, QA |

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · next-intl · Supabase (Postgres, Auth, Storage, RLS) · Vercel · Resend · pnpm · Vitest · Playwright + axe.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Further documentation lives in `DESIGN.md`, `INTEGRATION.md`, `TRANSLATIONS_REVIEW.md` and `docs/` as the phases land.
