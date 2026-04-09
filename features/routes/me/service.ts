import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { GetRoutesMeType } from "./schema";

export const routesMeservice = {
  getRoutesMe: async (
    query: GetRoutesMeType,
  ): Promise<{ data: RouteWithRelations[]; nextCursor: string | null }> => {
    const data = await routesRepository.findMany(
      {
        authorId: query.userId,
      },
      query.limit,
      query.cursor,
    );

    // limitの最低を1にしているため、data.length == 0の時はnullになる。
    const nextCursor = data.length === query.limit ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor: nextCursor,
    };
  },
};
