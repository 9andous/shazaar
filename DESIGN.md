# Shazaar design system

Warm editorial luxury: a boutique hotel or private members' club, not a SaaS template. Cream canvas, ink type, gold as a thread, large photography, quiet chrome. Live reference: `/style-guide` (noindex), which shows every token and component in LTR (French) and RTL (Arabic) with a live contrast table.

Source of truth: `tokens.json` (for the future mobile app), mirrored in `src/styles/tokens.css` (Tailwind v4 `@theme`). `src/styles/tokens.test.ts` fails if they drift.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| canvas | `#FAF6EF` | Page background |
| surface | `#FEFCF8` | Cards, dialogs, inputs |
| sunk | `#F1ECE4` | Recessed panels, image placeholders, skeletons |
| ink | `#1B1410` | Text, primary buttons |
| ink-muted | `#5C534E` | Secondary text (6.95:1 on canvas) |
| on-ink | `#FDFAF3` | Text on ink |
| gold | `#B26F06` | Accents, icons, rules, focus ring, display-size text only (3.78:1) |
| gold-deep | `#934400` | Body-size gold text and links (6.35:1) |
| gold-soft | `#F2DBB1` | Badge and highlight backgrounds |
| gold-logo | `#C17F25` | The logo mark only |
| line | `#E4DDD3` | Decorative hairlines |
| line-strong | `#8C827B` | Form control borders (3.48:1, meets 3:1 for UI) |
| success | `#007A55` | Success text |
| error | `#B3261E` | Error text and invalid borders |
| scrim | `#0E0B08` | Image overlays, dialog backdrop |

All palette values were re-verified against the live production CSS (oklch converted to sRGB).

**Do:** ink primary buttons; gold for a 2px rule, an icon, a focus ring, an underline, a large Fraunces numeral.
**Don't:** gold body text (use gold-deep); light text on a gold fill (3.90:1); large flat gold fills; gradients; glows.

## Type

- Display: **Fraunces** (variable, optical size on), light/regular, for headings and the tagline.
- UI: **Manrope** (variable) for everything else.
- Arabic: **Amiri** (display) and **IBM Plex Sans Arabic** (UI). `:lang(ar)` raises the scale by 8% and line-height by 12%, wherever the block sits. A French title inside an Arabic page (`lang="fr"`) switches back to Latin fonts.
- Self-hosted, subsetted WOFF2 (Latin for FR/EN, Arabic for AR), `font-display: swap`, size-adjusted fallbacks from `next/font` (no layout shift). Latin fonts preload; Arabic fonts download only on Arabic pages.
- Fluid scale `text-xs` to `text-5xl` (`clamp()`), defined in the inline theme.
- Eyebrows: Manrope 600, uppercase, 0.22em tracking; in Arabic no case, no tracking.
- Host-entered titles and descriptions are French: always rendered with `lang="fr"`.

## Shape and depth

- Radii **2 / 8 / 16 only** (`rounded-sharp`, `rounded-soft`, `rounded-card`). `rounded-full` is reserved for circular controls (icon buttons, dots).
- 1px hairlines (`border-line`).
- Two shadows: `shadow-raise` (cards on hover) and `shadow-float` (dialogs, hero cards).

## Layout

- Mobile first, 360px to 1920px+. Page gutter 16 / 32 / 56px (`page-x`), max width 1440px.
- Logical properties only (`ms-`, `pe-`, `start-`, `text-start`) so RTL needs no overrides.
- Asymmetric editorial layouts, generous whitespace, large photography.

## Icons

Lucide through `<Icon>` only: 1.5px stroke, decorative by default (`aria-hidden`), `label` when meaningful, `directional` to mirror arrows/chevrons in RTL. Social marks: Simple Icons as inline monochrome SVG. **No emojis anywhere** (a test scans the message catalogs; the normaliser strips them from host text).

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(.22,.61,.36,1)` | Default easing |
| `--duration-ui` | 200ms | Hover, press, colour |
| `--duration-reveal` | 700ms | Scroll reveals (80ms stagger) |
| `--duration-fade` | 1200ms | Hero cross-fade |
| `--hero-dwell` | 6000ms | Hero auto-advance |

- `<Reveal>`: IntersectionObserver fade + 16px lift. Never hides content that is already on screen at load, and never wraps the LCP element.
- Ken Burns (`shz-kenburns`): transform only, slow, hero only.
- `prefers-reduced-motion`: no auto-advance, no Ken Burns, no reveals, transitions near zero.

## Components (src/components)

| Component | Notes |
| --- | --- |
| `Button`, `ButtonLink`, `IconButton` | Variants: primary (ink), secondary (outline), ghost, quiet (gold underline), on-image. Sizes sm/md/lg (44px+ touch targets from md). |
| `Chip`, `Badge` | Filter chips use `aria-pressed`. Badges: gold-deep on gold-soft. |
| `Field`, `Input`, `Select` | Label, hint and error wired with `aria-describedby` and `aria-invalid`. Native select. |
| `Tabs` | WAI-ARIA tabs, arrow keys follow reading direction, Home/End, hash deep links. |
| `Accordion` | Heading + button + region, several open, `/#item-id` opens and scrolls to an item. |
| `Dialog` | Native `<dialog>`: dialog, side sheet, bottom sheet. Focus trap and Escape from the browser. |
| `Skeleton`, `ListingCardSkeleton` | Quiet pulse, static with reduced motion. |
| `Price` | « à partir de 54 DT / heure ». Converted currencies show "≈" and the TND-on-site note. |
| `LocaleSwitcher`, `CurrencySwitcher` | Locale: crawlable links. Currency: only currencies with a configured rate. |
| `ResponsiveImage` | `next/image`, explicit dimensions, AVIF/WebP, lazy unless `priority`. |
| `Reveal` | See Motion. |
| `ListingCard` | Photo, type · neighbourhood, title, capacity, price, Vérifié, Populaire, host first name, wishlist, Réserver. |
| `Logo` | Live PNG mark + Fraunces wordmark. Never redrawn. SVG pending. |

## Accessibility

WCAG 2.2 AA. One focus style (2px gold ring, 3px offset). Skip link. Every allowed colour pairing is unit-tested. axe runs in Playwright on every locale at 360px and 1280px.
