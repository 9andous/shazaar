import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  // "/" is always French, "/en" and "/ar" are prefixed. No Accept-Language redirect:
  // every URL maps to exactly one language (clean hreflang, no surprise redirects).
  localePrefix: "as-needed",
  localeDetection: false,
});

export const RTL_LOCALES: readonly Locale[] = ["ar"];

export function dirFor(locale: string): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";
}
