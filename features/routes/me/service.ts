import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { GetRoutesMeType } from "./schema";

export const routesMeService = {
  getRoutesMe: async (
    query: GetRoutesMeType,
  ): Promise<{ items: RouteWithRelations[]; nextCursor: string | null }> => {
    const items = await routesRepository.findMany({
      where: {
        OR: [{ authorId: query.userId }, { collaborators: { some: { userId: query.userId } } }],
      },
      limit: query.limit,
      cursor: query.cursor,
    });

    const nextCursor = items.length === query.limit ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
    };
  },
};
