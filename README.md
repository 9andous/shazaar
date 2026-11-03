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

Requires Node 22+ and pnpm 10 (`corepack enable`, or prefix commands with `npx pnpm@10`).

```bash
pnpm install
cp .env.example .env.local
pnpm dev                 # http://localhost:3200, style guide at /style-guide
```

| Command | What it does |
| --- | --- |
| `pnpm check` | Lint, typecheck and unit tests |
| `pnpm build && pnpm test:e2e` | Production build, then Playwright smoke + axe (FR/EN/AR, 360px and 1280px) |
| `pnpm snapshot:listings [--dev-images]` | Re-capture the public listings snapshot from the live site (read-only) |
| `pnpm fonts:copy` | Copy the self-hosted font subsets from the Fontsource packages |

## Layout

```
src/app/[locale]/       routes (fr unprefixed, /en, /ar)
src/components/         UI primitives, listing, motion, brand
src/lib/domain/         framework-free model, normalisation, pricing, currency (reusable by the mobile app)
src/lib/data/           data-access layer (mock adapter until Phase B)
src/config/             billing rules, exchange rates
src/messages/           typed message catalogs (fr is the source)
src/styles/             tokens.css (@theme), globals, fonts
mocks/                  public listings snapshot + image dimensions
tokens.json             design tokens for other platforms
```

## Documentation

- `DESIGN.md`: tokens, type, motion, components, do and don't
- `INTEGRATION.md`: every stub and what the backend must provide
- `docs/CONTENT_TO_CONFIRM.md`: open content and business questions
- `docs/baseline/lighthouse-live.md`: Lighthouse baseline of the live site
- `docs/image-audit.md`: listing photo audit
