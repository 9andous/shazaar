"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/components/currency/currency-provider";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { availableCurrencies, type CurrencyCode } from "@/lib/domain/currency";
import { cn } from "@/lib/cn";

/** Plain links to the same page in each language: crawlable, no JS needed. */
export function LocaleSwitcher({ className, tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className={cn("flex items-center gap-1", className)}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "rounded-sharp px-2 py-1 text-xs font-semibold tracking-wide uppercase transition-colors",
            tone === "ink" ? "text-ink-muted hover:text-ink" : "text-on-ink/75 hover:text-on-ink",
            l === locale && (tone === "ink" ? "text-ink underline decoration-gold underline-offset-4" : "text-on-ink underline decoration-gold underline-offset-4"),
          )}
          title={t(l)}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}

/** Display currency. Hidden options: currencies without a configured rate. */
export function CurrencySwitcher({ className, tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useCurrency();
  const options = availableCurrencies();

  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className={cn(
          "rounded-sharp cursor-pointer appearance-none bg-transparent px-2 py-1 text-xs font-semibold tracking-wide",
          tone === "ink" ? "text-ink" : "text-on-ink [&>option]:text-ink",
        )}
      >
        {options.map((c) => (
          <option key={c} value={c} title={t(c)}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
