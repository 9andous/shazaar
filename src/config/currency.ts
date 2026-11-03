/**
 * Display-only conversions. Payment is always in TND, on site.
 * Updated manually each month. A currency whose rate is null is hidden from
 * the switcher until a rate is entered.
 */
export const CURRENCY_CODES = ["TND", "EUR", "USD"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface RateEntry {
  /** How many TND one unit of the currency is worth. */
  tndPerUnit: number | null;
  asOf: string | null;
  source: string | null;
}

export const RATES: Record<Exclude<CurrencyCode, "TND">, RateEntry> = {
  EUR: {
    tndPerUnit: 3.38,
    asOf: "2026-07-31",
    source: "valutafx.com historical EUR/TND (to be replaced by the BCT rate)",
  },
  USD: {
    tndPerUnit: null,
    asOf: null,
    source: null,
  },
};

export const DECIMALS: Record<CurrencyCode, number> = { TND: 0, EUR: 2, USD: 2 };
