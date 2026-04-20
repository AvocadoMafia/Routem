import { create } from "zustand";

type ExchangeRateRecord = {
  currencyCode: string;
  rateToUsd: number;
  updatedAt: string;
};

type ExchangeRatesState = {
  rates: Record<string, number>;
  fetchExchangeRates: () => Promise<void>;
};

let inFlightFetch: Promise<void> | null = null;

export const exchangeRatesStore = create<ExchangeRatesState>((set, get) => ({
  rates: {},
  fetchExchangeRates: async () => {
    if (Object.keys(get().rates).length > 0) return;
    if (inFlightFetch) return inFlightFetch;

    inFlightFetch = (async () => {
      try {
        const res = await fetch("/api/v1/exchange-rates", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        const data = (await res.json()) as ExchangeRateRecord[];
        const rates = Object.fromEntries(
          (data ?? []).map((item) => [item.currencyCode, item.rateToUsd]),
        );

        set({ rates });
      } finally {
        inFlightFetch = null;
      }
    })();

    try {
      await inFlightFetch;
    } catch {
      // Keep previous rates on failure.
    }
  },
}));
