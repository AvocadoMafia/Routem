import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { GetRoutesType, postRouteType, PatchRouteType, DeleteRouteType } from "@/features/routes/schema";
import { buildCreateRouteData, buildUpdateRouteData, buildRoutesWhere } from "@/features/routes/utils";

export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<RouteWithRelations[]> => {
    const where = buildRoutesWhere(query, user?.id);
    const result = await routesRepository.findMany(where, query.limit);
    return result;
  },

  postRoute: async (parsed_body: postRouteType, user_id: string) => {
    const data = buildCreateRouteData(parsed_body, user_id);
    const result = await routesRepository.create(data);
    return result;
  },

  patchRoute: async (parsed_body: PatchRouteType, user_id: string) => {
    const data = buildUpdateRouteData(parsed_body);
    const result = await routesRepository.update(parsed_body.id, user_id, data);
    return result;
  },

  //deleteManyではincludeでrelationデータを取得することができないので、この関数でのみ戻り値にrelationデータが含まれない。
  //基本的には問題ないが、もし必要なら事前に取得したのち削除、というフローをとる必要がある。
  deleteRoute: async (parsed_body: DeleteRouteType, user_id: string) => {
    const deleted = await routesRepository.deleteMany({
      id: parsed_body.id,
      authorId: user_id,
    });

    if (deleted.count === 0) {
      throw new Error("Notfound or Unauthorized");
    }

    return deleted;
  },
};
