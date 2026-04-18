import "dotenv/config";
import { PrismaClient, CurrencyCode } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

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
  const dbType = process.env.DB_TYPE || "local";
  const connectionString =
    dbType === "vercel"
      ? process.env.VERCEL_DATABASE_URL
      : process.env.LOCAL_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      `Database connection string for type '${dbType}' is not defined.`
    );
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const now = new Date();

  try {
    await prisma.$transaction(
      Object.entries(seedRates).map(([currencyCode, rateToUsd]) =>
        prisma.exchangeRates.upsert({
          where: { currencyCode: currencyCode as CurrencyCode },
          create: {
            currencyCode: currencyCode as CurrencyCode,
            rateToUsd,
            updatedAt: now,
          },
          update: { rateToUsd, updatedAt: now },
        })
      )
    );

    console.info(`Seeded ${Object.keys(seedRates).length} exchange rates.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed exchange rates:", error);
  process.exitCode = 1;
});
