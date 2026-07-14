"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BASE_CURRENCY, isCurrency, type Currency } from "@/lib/currency";

const STORAGE_KEY = "lsr.currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/**
 * Holds the visitor's chosen display currency and shares it with every price
 * surface on the page. Starts on AED so server and first client render match
 * (no hydration mismatch); the saved choice is restored from localStorage right
 * after mount, then persisted on every change.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(BASE_CURRENCY);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCurrency(saved)) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // private mode / storage disabled — selection still works for the session
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

/** Read the active currency. Falls back to AED if used outside the provider. */
export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext) ?? { currency: BASE_CURRENCY, setCurrency: () => {} };
}
