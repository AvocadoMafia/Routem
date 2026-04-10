import { getPrisma, getRedisClient } from "@/lib/config/server";
import { ExchangeRates, Prisma } from "@prisma/client";

export const exchangeRatesRepository = {
  findMany: async (where?: Prisma.ExchangeRatesFindManyArgs): Promise<ExchangeRates[]> => {
    try {
      const redis = getRedisClient();
      const cache_key = `exchangeRates:${JSON.stringify(where)}`;
      const cached_data = await redis.get(cache_key);

      if (!cached_data) {
        const data = await getPrisma().exchangeRates.findMany(where);
        await redis.set(cache_key, JSON.stringify(data), { EX: 3600 }); // キャッシュの有効期限は1時間
        return data;
      }

      return JSON.parse(cached_data);
    } catch (e) {
      throw e;
    }
  },
};
