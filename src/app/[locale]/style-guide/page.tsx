import { ArrowRight, BadgeCheck, ChevronRight, Heart, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import tokens from "../../../../tokens.json";
import { Logo } from "@/components/brand/logo";
import { ListingCard } from "@/components/listing/listing-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { ListingCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { CurrencySwitcher, LocaleSwitcher } from "@/components/ui/switchers";
import { AA_MIN, CONTRAST_PAIRS, FORBIDDEN_PAIRS, contrastRatio } from "@/lib/a11y/contrast";
import { getPopularListings } from "@/lib/data/listings";
import type { Listing } from "@/lib/domain/types";
import ar from "@/messages/ar.json";
import fr from "@/messages/fr.json";
import { InteractiveDemos } from "./demos";

export const metadata: Metadata = {
  title: "Style guide · Shazaar",
  robots: { index: false, follow: false },
};

const colors = tokens.color as Record<string, string>;

// Literal class names so Tailwind generates them.
const TEXT = {
  "5xl": "text-5xl",
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
  lg: "text-lg",
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t py-14">
      <h2 className="eyebrow text-gold-deep mb-8">{title}</h2>
      {children}
    </section>
  );
}

/** Every component once, in the language/direction of the surrounding block. */
async function Specimens({ locale, listing }: { locale: "fr" | "ar"; listing: Listing }) {
  const t = await getTranslations({ locale });
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <p className="eyebrow text-ink-muted">{t("useCases.celebrate")} · {t("governorates.tunis")}</p>
        <h3 className="text-5xl font-light">{t("brand.tagline")}</h3>
        <p className="text-ink-muted max-w-prose text-lg">{t("meta.description")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg">{t("nav.signIn")}</Button>
        <Button variant="secondary">{t("nav.listSpace")}</Button>
        <Button variant="ghost">
          {t("nav.findSpace")}
          <Icon icon={ArrowRight} size={18} directional />
        </Button>
        <Button variant="quiet">{t("listing.view")}</Button>
        <Button disabled>{t("listing.book")}</Button>
      </div>

      <div className="bg-ink rounded-card flex flex-wrap items-center gap-4 p-6">
        <Button variant="on-image" size="lg">{t("listing.book")}</Button>
        <LocaleSwitcher tone="light" />
        <CurrencySwitcher tone="light" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="light">
          <Icon icon={BadgeCheck} size={13} className="text-gold-deep" />
          {t("listing.verified")}
        </Badge>
        <Badge>{t("listing.popular")}</Badge>
        <Badge tone="ink">{t("categories.yachts")}</Badge>
        <Price amountTnd={54} />
        <Price amountTnd={56} unit="night" from={false} />
        <LocaleSwitcher />
        <CurrencySwitcher />
      </div>

      <InteractiveDemos idPrefix={`sg-${locale}`} />

      <div className="grid gap-8 sm:grid-cols-2">
        <ListingCard listing={listing} />
        <ListingCardSkeleton />
      </div>
    </div>
  );
}

export default async function StyleGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const [listing] = await getPopularListings();
  if (!listing) return null;

  return (
    <main id="main" className="page-x max-w-page mx-auto pb-24" dir="ltr" lang="en">
      <header className="flex flex-wrap items-end justify-between gap-6 py-12">
        <div>
          <Logo label="Shazaar" />
          <h1 className="mt-6 text-4xl font-light">Style guide</h1>
          <p className="text-ink-muted mt-2">
            Internal reference, noindex. Tokens from <code>tokens.json</code>, every component in LTR (FR) and RTL (AR).
          </p>
        </div>
      </header>

      <Section title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(colors).map(([name, hex]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className="border-line rounded-soft block h-20 border" style={{ backgroundColor: hex }} />
              <span className="text-sm font-semibold">{name}</span>
              <code className="text-ink-muted text-xs">{hex}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contrast (WCAG 2.2 AA)">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Contrast table">
          <table className="w-full min-w-[40rem] text-start text-sm">
            <thead>
              <tr className="text-ink-muted border-line border-b text-start">
                <th className="py-2 text-start font-semibold">Sample</th>
                <th className="text-start font-semibold">Pair</th>
                <th className="text-start font-semibold">Use</th>
                <th className="text-start font-semibold">Ratio</th>
                <th className="text-start font-semibold">Min</th>
                <th className="text-start font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {[...CONTRAST_PAIRS.map((p) => ({ ...p, forbidden: false })), ...FORBIDDEN_PAIRS.map((p) => ({ ...p, forbidden: true }))].map((p, i) => {
                const ratio = contrastRatio(colors[p.fg]!, colors[p.bg]!);
                const pass = ratio >= AA_MIN[p.use];
                return (
                  <tr key={i} className="border-line border-b">
                    <td className="py-2">
                      <span
                        className={`rounded-sharp inline-block px-3 py-1 ${p.use === "text" ? "text-sm font-semibold" : "font-display text-3xl"}`}
                        style={{ color: colors[p.fg], backgroundColor: colors[p.bg] }}
                        aria-hidden={p.forbidden || undefined}
                      >
                        Aa
                      </span>
                    </td>
                    <td>{p.fg} / {p.bg}</td>
                    <td>{p.note}</td>
                    <td className="tabular">{ratio.toFixed(2)}:1</td>
                    <td className="tabular">{AA_MIN[p.use]}:1 ({p.use})</td>
                    <td className={p.forbidden ? "text-ink-muted" : pass ? "text-success font-semibold" : "text-error font-semibold"}>
                      {p.forbidden ? "Forbidden pairing" : pass ? "Pass" : "Fail"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Type">
        <div className="flex flex-col gap-4">
          {(["5xl", "4xl", "3xl", "2xl", "xl"] as const).map((s) => (
            <p key={s} className={`font-display ${TEXT[s]} font-light`}>
              <span className="text-ink-muted me-4 font-sans text-xs">{s}</span>Réservez l&apos;extraordinaire.
            </p>
          ))}
          {(["lg", "base", "sm", "xs"] as const).map((s) => (
            <p key={s} className={TEXT[s]}>
              <span className="text-ink-muted me-4 text-xs">{s}</span>Manrope: piscines, villas et rooftops à l&apos;heure, 54 DT.
            </p>
          ))}
          <p lang="ar" dir="rtl" className="font-display text-4xl">احجز الاستثنائي.</p>
          <p lang="ar" dir="rtl" className="text-base">مسابح وفيلات وحدائق وأسطح وقاعات خاصة في تونس، للحجز بالساعة.</p>
        </div>
      </Section>

      <Section title="Radius and shadow">
        <div className="flex flex-wrap gap-6">
          {Object.entries(tokens.radius).map(([name, value]) => (
            <div key={name} className="bg-surface border-line flex size-28 items-end border p-3 text-xs" style={{ borderRadius: value }}>
              {name} {value}
            </div>
          ))}
          {Object.keys(tokens.shadow).map((name) => (
            <div key={name} className={`bg-surface rounded-card flex size-28 items-end p-3 text-xs ${name === "raise" ? "shadow-raise" : "shadow-float"}`}>
              shadow-{name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icons (Lucide 1.5px; directional ones mirror in RTL)">
        <div className="flex flex-wrap items-center gap-6">
          {[Search, MapPin, Users, Heart, ShieldCheck, BadgeCheck].map((I, i) => (
            <Icon key={i} icon={I} size={24} />
          ))}
          <span className="flex gap-2"><Icon icon={ArrowRight} size={24} directional /><Icon icon={ChevronRight} size={24} directional /></span>
          <span dir="rtl" className="flex gap-2"><Icon icon={ArrowRight} size={24} directional /><Icon icon={ChevronRight} size={24} directional /></span>
        </div>
      </Section>

      <Section title="Skeleton and reveal">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-[60vh] grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} index={i}>
              <div className="bg-sunk rounded-card h-32" />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Components: LTR (FR) and RTL (AR)">
        <div className="grid gap-16 xl:grid-cols-2">
          <div dir="ltr" lang="fr">
            <NextIntlClientProvider locale="fr" messages={fr}>
              <Specimens locale="fr" listing={listing} />
            </NextIntlClientProvider>
          </div>
          <div dir="rtl" lang="ar">
            <NextIntlClientProvider locale="ar" messages={ar}>
              <Specimens locale="ar" listing={listing} />
            </NextIntlClientProvider>
          </div>
        </div>
      </Section>
    </main>
  );
}
