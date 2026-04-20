import { z } from "zod";
import { CurrencyCode } from "@prisma/client";

const CurrencyCodeSchema = z.nativeEnum(CurrencyCode);

const RateToUsd = z.number().min(0, "Rate to USD must be non-negative");

export const ExchangeRateSchema = z.record(CurrencyCodeSchema, RateToUsd);

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;

export const ExchangeRatesFindManySchema = z.array(
  z.object({
    currencyCode: CurrencyCodeSchema,
    rateToUsd: RateToUsd,
    updatedAt: z.date(),
  }),
);

export type ExchangeRatesFindMany = z.infer<typeof ExchangeRatesFindManySchema>;
