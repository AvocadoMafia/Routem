// Budget の locale 対応フォーマッタと、locale 文字列の正規化。
// 旧 lib/client/helpers.ts から抜き出し。

import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

export function dbLocaleToAppLocale(value?: string | null): Locale {
    if (!value) return defaultLocale;
    const normalized = value.trim().toLowerCase();
    return isValidLocale(normalized) ? normalized : defaultLocale;
}

const localeCurrencyMap: Record<Locale, string> = {
    ja: "JPY",
    en: "USD",
    ko: "KRW",
    zh: "CNY",
};

function isSupportedCurrencyCode(currency: string): boolean {
    return /^[A-Z]{3}$/.test(currency);
}

function convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>,
): number | null {
    if (fromCurrency === toCurrency) return amount;
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    if (!fromRate || !toRate) return null;
    const amountInUsd = amount * fromRate;
    return amountInUsd / toRate;
}

export function formatBudgetByLocale(params: {
    amount: number;
    localCurrencyCode: string;
    locale: Locale;
    rates: Record<string, number>;
}): string {
    const { amount, localCurrencyCode, locale, rates } = params;
    const targetCurrency = localeCurrencyMap[locale];
    const converted = convertAmount(amount, localCurrencyCode, targetCurrency, rates);

    if (converted !== null && isSupportedCurrencyCode(targetCurrency)) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: targetCurrency,
            maximumFractionDigits: 0,
        }).format(converted);
    }

    return `${amount.toLocaleString()} ${localCurrencyCode}`;
}
