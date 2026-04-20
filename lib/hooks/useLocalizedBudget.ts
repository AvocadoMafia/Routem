"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { type Locale, defaultLocale, locales } from "@/i18n/config";
import { exchangeRatesStore } from "@/lib/stores/exchangeRatesStore";
import { dbLocaleToAppLocale, formatBudgetByLocale } from "@/lib/utils/budget";
import { userStore } from "@/lib/stores/userStore";

export function useLocalizedBudget(
  amount?: number | null,
  localCurrencyCode?: string | null,
  fallback = "---",
) {
  const currentLocale = useLocale();
  const userLocale = userStore((state) => state.user.locale);
  const rates = exchangeRatesStore((state) => state.rates);

  return useMemo(() => {
    if (amount == null || !localCurrencyCode) return fallback;
    const localeForCurrency = userLocale
      ? dbLocaleToAppLocale(userLocale)
      : currentLocale;
    const normalizedLocale = locales.includes(localeForCurrency as Locale)
      ? (localeForCurrency as Locale)
      : defaultLocale;
    return formatBudgetByLocale({
      amount,
      localCurrencyCode,
      locale: normalizedLocale,
      rates,
    });
  }, [amount, localCurrencyCode, userLocale, currentLocale, rates, fallback]);
}
