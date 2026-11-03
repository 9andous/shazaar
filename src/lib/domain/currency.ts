import { CURRENCY_CODES, DECIMALS, RATES, type CurrencyCode } from "@/config/currency";

export type { CurrencyCode };

export function availableCurrencies(): CurrencyCode[] {
  return CURRENCY_CODES.filter((c) => c === "TND" || RATES[c].tndPerUnit !== null);
}

export function convertFromTnd(amountTnd: number, currency: CurrencyCode): number | null {
  if (currency === "TND") return amountTnd;
  const rate = RATES[currency].tndPerUnit;
  return rate ? amountTnd / rate : null;
}

/** Intl locale per UI locale. Arabic keeps Western digits (0-9). */
const INTL_LOCALE: Record<string, string> = {
  fr: "fr-TN",
  en: "en-GB",
  ar: "ar-TN-u-nu-latn",
};

export interface FormattedPrice {
  /** Full string, e.g. "54 DT", "≈ 15,98 €". */
  text: string;
  isApproximate: boolean;
  currency: CurrencyCode;
}

export function formatPrice(
  amountTnd: number,
  currency: CurrencyCode,
  locale: string,
): FormattedPrice {
  const intlLocale = INTL_LOCALE[locale] ?? "fr-TN";
  const converted = convertFromTnd(amountTnd, currency);

  if (currency === "TND" || converted === null) {
    const n = new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 0 }).format(amountTnd);
    const symbol = locale === "ar" ? "د.ت" : "DT";
    return { text: `${n} ${symbol}`, isApproximate: false, currency: "TND" };
  }

  const n = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: DECIMALS[currency],
    maximumFractionDigits: DECIMALS[currency],
  }).format(converted);
  return { text: `≈ ${n}`, isApproximate: true, currency };
}
