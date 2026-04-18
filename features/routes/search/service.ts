
import {SearchRoutesType} from "@/features/routes/search/schema";
import {getMeilisearch} from "@/lib/config/server";
import {routesRepository, RouteWithRelations} from "@/features/routes/repository";
import { Prisma, RouteVisibility } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export const routesSearchService = {
    // Search Routes - limit-offset pagination
    searchRoutes: async (
        user: User | null,
        query: SearchRoutesType,
    ): Promise<{ items: RouteWithRelations[]; total: number }> => {
        try {
            const limit = query.limit;
            const offset = query.offset;

            let ids: string[] = [];
            let total = 0;

            if (query.q || query.month) {
                const meilisearch = getMeilisearch();
                const index = await meilisearch.getIndex("routes");

                // Filter by routeFor
                const filter_conditions = [];
                filter_conditions.push(`visibility = "${RouteVisibility.PUBLIC}"`);
                if (query.routeFor) {
                    filter_conditions.push(`routeFor = "${query.routeFor}"`);
                }
                if (query.month) {
                    filter_conditions.push(`month = ${Number(query.month)}`);
                }
                const filter = filter_conditions.length > 0 ? filter_conditions.join(" AND ") : undefined;

                const search = await index.search(query.q || "", {
                    limit,
                    offset,
                    filter,
                });

                ids = search.hits.map((hit) => hit.id);
                total = search.estimatedTotalHits || 0;

                if (ids.length === 0) {
                    return { items: [], total };
                }

                // Set where clause with search ids
                const where: Prisma.RouteWhereInput = {
                    id: { in: ids },
                };

                // Fetch routes in meilisearch result order
                const result = await routesRepository.findMany({ where, limit: ids.length });

                // Sort by meilisearch order
                const sortedResult = ids
                    .map((id) => result.find((route) => route.id === id))
                    .filter((route): route is RouteWithRelations => route !== undefined);

                return { items: sortedResult, total };
            } else {
                // No query and no month, return based on database
                const where: Prisma.RouteWhereInput = {
                    visibility: RouteVisibility.PUBLIC,
                };

                // Filter by routeFor
                if (query.routeFor) {
                    where.routeFor = query.routeFor;
                }

                // Fetch routes with limit and offset
                let orderBy: Prisma.RouteOrderByWithRelationInput = { createdAt: "desc" };
                if (query.orderBy === "latest") {
                    orderBy = { createdAt: "desc" };
                } else if (query.orderBy === "likes") {
                    // For likes ordering, fetch with default order then sort in memory
                    orderBy = { createdAt: "desc" };
                } else if (query.orderBy === "relevant") {
                    orderBy = { createdAt: "desc" }; // fallback for DB path
                }

                // Get total count
                total = await routesRepository.count(where);

                // Fetch routes
                const result = await routesRepository.findMany({ where, limit, offset, orderBy });

                // Sort by likes count if requested
                if (query.orderBy === "likes") {
                    result.sort((a, b) => b.likes.length - a.likes.length);
                }

                return { items: result, total };
            }
        } catch (e) {
            throw e;
        }
    },
}