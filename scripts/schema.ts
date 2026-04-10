import { z } from "zod";

const CurrencyCode = z.enum([
  "JPY",
  "USD",
  "EUR",
  "GBP",
  "KRW",
  "TWD",
  "CNY",
  "THB",
  "VND",
  "SGD",
  "MYR",
  "PHP",
  "AUD",
  "CAD",
  "OTHER",
]);

const RateToUsd = z.number().min(0, "Rate to USD must be non-negative");

export const ExchangeRateSchema = z.record(CurrencyCode, RateToUsd);

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;

export const ExchangeRatesFindManySchema = z.array(
  z.object({
    currencyCode: CurrencyCode,
    rateToUsd: RateToUsd,
    updatedAt: z.date(),
  }),
);

export type ExchangeRatesFindMany = z.infer<typeof ExchangeRatesFindManySchema>;
