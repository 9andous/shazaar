"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { availableCurrencies, type CurrencyCode } from "@/lib/domain/currency";

const COOKIE = "shz_currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "TND",
  setCurrency: () => {},
});

/**
 * Pages are static and render TND on the server. A stored preference is
 * applied after hydration (brief TND flash for EUR/USD users only).
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setState] = useState<CurrencyCode>("TND");
  useEffect(() => {
    const stored = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([A-Z]{3})`))?.[1];
    const valid = availableCurrencies().find((c) => c === stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the cookie
    if (valid && valid !== "TND") setState(valid);
  }, []);
  const setCurrency = useCallback((c: CurrencyCode) => {
    setState(c);
    document.cookie = `${COOKIE}=${c}; path=/; max-age=31536000; samesite=lax`;
  }, []);
  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
