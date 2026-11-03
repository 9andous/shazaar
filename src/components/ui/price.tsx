"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/components/currency/currency-provider";
import { RATES } from "@/config/currency";
import { formatPrice } from "@/lib/domain/currency";
import type { PriceUnit } from "@/lib/domain/types";
import { cn } from "@/lib/cn";

/**
 * « à partir de 54 DT / heure ». Converted currencies get "≈" and a title
 * reminding that payment is in TND on site.
 */
export function Price({
  amountTnd,
  unit = "hour",
  from = true,
  className,
}: {
  amountTnd: number;
  unit?: PriceUnit;
  from?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { currency } = useCurrency();
  const price = formatPrice(amountTnd, currency, locale);
  const strong = (chunks: React.ReactNode) => <span className="text-ink font-semibold tabular">{chunks}</span>;
  const rate = price.currency !== "TND" ? RATES[price.currency] : null;

  return (
    <span
      className={cn("text-ink-muted text-sm", className)}
      title={
        price.isApproximate
          ? `${t("currency.paymentNote")}. ${t("currency.approxNote", { date: rate?.asOf ?? "" })}`
          : undefined
      }
    >
      {from ? t.rich("price.from", { price: price.text, b: strong }) : strong(price.text)}{" "}
      <span>{t(`price.unit.${unit}`)}</span>
    </span>
  );
}
