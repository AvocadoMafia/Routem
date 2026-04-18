import { getPrisma, getRedisClientOrNull } from "@/lib/config/server";
import { ExchangeRates, Prisma } from "@prisma/client";

export const exchangeRatesRepository = {
  /**
   * 為替レート一覧を取得。Redis にキャッシュがあればそれを返し、無ければ DB から取って
   * TTL 1h で書き戻す。Redis 不達時はエラーにせず DB 直アクセスに graceful fallback する
   * (trending 等のコンテンツが Redis 障害でページごと落ちる事態を防ぐため)。
   */
  findMany: async (where?: Prisma.ExchangeRatesFindManyArgs): Promise<ExchangeRates[]> => {
    const cacheKey = `exchangeRates:${JSON.stringify(where)}`;
    const redis = await getRedisClientOrNull();

    // キャッシュ試行
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached) as ExchangeRates[];
      } catch (e) {
        // 読み取り失敗はログだけ残して DB フォールバックへ
        console.error(`[exchangeRates.findMany] redis.get(${cacheKey}) failed:`, e);
      }
    }

    const data = await getPrisma().exchangeRates.findMany(where);

    // 書き戻しもベストエフォート (失敗してもレスポンス本体は成立させる)
    if (redis) {
      redis
        .set(cacheKey, JSON.stringify(data), { EX: 3600 })
        .catch((e) =>
          console.error(`[exchangeRates.findMany] redis.set(${cacheKey}) failed:`, e),
        );
    }

    return data;
  },
};
