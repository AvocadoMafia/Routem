import "dotenv/config";
import { CurrencyCode } from "@prisma/client";
import { getPrisma } from "@/lib/config/server";

const seedRates = {
  JPY: 0.0067,
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  KRW: 0.00074,
  TWD: 0.031,
  CNY: 0.14,
  THB: 0.028,
  VND: 0.000039,
  SGD: 0.74,
  MYR: 0.22,
  PHP: 0.018,
  AUD: 0.66,
  CAD: 0.74,
  OTHER: 1,
} satisfies Record<CurrencyCode, number>;

async function main() {
  const now = new Date();

  await prisma.$transaction(
    Object.entries(seedRates).map(([currencyCode, rateToUsd]) =>
      prisma.exchangeRates.upsert({
        where: { currencyCode: currencyCode as CurrencyCode },
        create: { currencyCode: currencyCode as CurrencyCode, rateToUsd, updatedAt: now },
        update: { rateToUsd, updatedAt: now },
      }),
    ),
  );

  console.info(`Seeded ${Object.keys(seedRates).length} exchange rates.`);
}

const prisma = getPrisma();

main()
  .catch((error) => {
    console.error("Failed to seed exchange rates:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
