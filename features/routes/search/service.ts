import { exchangeRatesRepository } from "@/features/exchangeRates/repository";
import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { getMeilisearch } from "@/lib/config/server";
import { Prisma } from "@prisma/client";
import { GetRoutesSearchType } from "./schema";

export const routesSearchService = {
  /**
   * @abstract 5W1Hや予算などの条件でルートを検索するサービス
   * @note ルート検索はMeilisearchを使って行う。検索条件に合致するルートのIDをMeilisearchから取得し、そのIDをもとにPrismaでDBからルートの詳細情報を取得して返す。
   */
  getRoutesSearch: async (query: GetRoutesSearchType): Promise<RouteWithRelations[]> => {
    try {
      // TODO: cursor basedにする
      let ids: string[] | undefined = undefined;

      const meilisearch = getMeilisearch();
      const index = await meilisearch.getIndex("routes");
      const filter_conditions = [];

      // 文字列比較のためPUBLICもダブルクォーテーションで囲む必要がある
      filter_conditions.push(`visibility = "PUBLIC"`); // 検索は常に公開ルートのみにする

      // Budget用のドル換算フィルタ
      // findManyはあえて全件取得にしてcacheしている
      // currencyCodeがある場合は、minAmounとmaxAmountの両方が存在する前提で計算する
      if (query.currencyCode) {
        const exchange_rates = await exchangeRatesRepository.findMany();
        const rate_to_usd = exchange_rates.find((r) => {
          return r.currencyCode === query.currencyCode;
        })?.rateToUsd;

        const min_budget_in_usd =
          query.minAmount && rate_to_usd ? query.minAmount * rate_to_usd : undefined;
        const max_budget_in_usd =
          query.maxAmount && rate_to_usd ? query.maxAmount * rate_to_usd : undefined;

        if (min_budget_in_usd !== undefined) {
          filter_conditions.push(`budgetInUsd >= ${min_budget_in_usd}`);
        }
        if (max_budget_in_usd !== undefined) {
          filter_conditions.push(`budgetInUsd <= ${max_budget_in_usd}`);
        }
      }

      if (query.who) {
        filter_conditions.push(`routeFor = "${query.who}"`);
      }

      // monthはmeilisearchのみnumberで保存している。dateからmonthにして保存している。
      if (query.when) {
        filter_conditions.push(`month IN [${query.when.join(",")}]`);
      }

      const filter = filter_conditions.length > 0 ? filter_conditions.join(" AND ") : undefined;

      // Where検索用の緯度経度近い順ソート
      const sort =
        query.lat != undefined && query.lng != undefined
          ? [`_geoPoint(${query.lat},${query.lng}):asc`]
          : undefined;

      const search = await index.search(query.q, {
        ...(sort && { sort }),
        filter: filter,
        limit: query.limit,
      });
      ids = search.hits.map((hit) => hit.id);
      if (ids.length === 0) {
        return [];
      }

      const where: Prisma.RouteWhereInput = {
        id: { in: ids },
      };

      const result = await routesRepository.findMany(where);

      const routeMap = new Map(result.map((route) => [route.id, route]));
      const sortedResult = ids
        .map((id) => routeMap.get(id))
        .filter((route): route is RouteWithRelations => route !== undefined); // DBから消えていた場合のundefinedを除外

      return sortedResult;
    } catch (e) {
      throw e;
    }
  },
};
