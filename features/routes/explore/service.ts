import { exchangeRatesRepository } from "@/features/exchangeRates/repository";
import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { getMeilisearch } from "@/lib/config/server";
import { Prisma, RouteVisibility } from "@prisma/client";
import { GetRoutesExploreType } from "./schema";

export const routesExploreService = {
  getRoutesExplore: async (
    query: GetRoutesExploreType,
  ): Promise<{ items: RouteWithRelations[]; nextOffset: number | null }> => {
    try {
      const meilisearch = getMeilisearch();
      const index = await meilisearch.getIndex("routes");
      const filterConditions: string[] = [];

      filterConditions.push(`visibility = "${RouteVisibility.PUBLIC}"`);

      if (query.currencyCode) {
        const exchangeRates = await exchangeRatesRepository.findMany();
        const rateToUsd = exchangeRates.find(
          (r) => r.currencyCode === query.currencyCode,
        )?.rateToUsd;

        const minBudgetInUsd =
          query.minAmount && rateToUsd ? query.minAmount * rateToUsd : undefined;
        const maxBudgetInUsd =
          query.maxAmount && rateToUsd ? query.maxAmount * rateToUsd : undefined;

        if (minBudgetInUsd !== undefined) {
          filterConditions.push(`budgetInUsd >= ${minBudgetInUsd}`);
        }
        if (maxBudgetInUsd !== undefined) {
          filterConditions.push(`budgetInUsd <= ${maxBudgetInUsd}`);
        }
      }

      if (query.who) {
        filterConditions.push(`routeFor = "${query.who}"`);
      }

      if (query.when) {
        filterConditions.push(`month IN [${query.when.join(",")}]`);
      }

      if (query.days) {
        filterConditions.push(`days = ${query.days}`);
      }
      const filter = filterConditions.length > 0 ? filterConditions.join(" AND ") : undefined;
      const sort =
        query.lat !== undefined && query.lng !== undefined
          ? [`_geoPoint(${query.lat},${query.lng}):asc`]
          : undefined;

      const offset = query.offset;
      const search = await index.search(query.q, {
        ...(sort && { sort }),
        filter,
        limit: query.limit,
        offset,
      });

      const ids = search.hits.map((hit) => hit.id);
      const nextOffset = search.hits.length === query.limit ? offset + query.limit : null;

      if (ids.length === 0) {
        return {
          items: [],
          nextOffset,
        };
      }

      const where: Prisma.RouteWhereInput = {
        id: { in: ids },
      };

      const result = await routesRepository.findMany({ where });
      const routeMap = new Map(result.map((route) => [route.id, route]));
      const sortedResult = ids
        .map((id) => routeMap.get(id))
        .filter((route): route is RouteWithRelations => route !== undefined);

      return {
        items: sortedResult,
        nextOffset,
      };
    } catch (e) {
      throw e;
    }
  },
};
