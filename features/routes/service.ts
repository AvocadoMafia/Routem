import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { GetRoutesType, postRouteType, PatchRouteType, DeleteRouteType } from "@/features/routes/schema";
import { buildCreateRouteData, buildUpdateRouteData, buildRoutesWhere } from "@/features/routes/utils";
import { getMeilisearch } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { parse } from "path";


/**
 * @brief 処理層のルート
 * @abstract prisma用のinputを作って→repository層に投げる→meilisearchに収納
 */
export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<RouteWithRelations[]> => {
    let ids:string[] | undefined = undefined;
    if(query.q){
    const meilisearch = getMeilisearch();
    const index = await meilisearch.getIndex("routes");
    const search = await index.search(query.q);
    ids = search.hits.map((hit)=>hit.id);
    if (ids.length === 0) {
    return []; 
    }}
    const where = buildRoutesWhere(query, user?.id, ids);
    // TODO:ログインユーザーのみサーチ履歴を保存。id, query, authorid.clueeの参考に。schemaも書き換えて両方に保存。
    const result = await routesRepository.findMany(where, query.limit);
    if (ids) {
    const sortedResult = ids
      .map((id) => result.find((route) => route.id === id))
      .filter((route) => route !== undefined); // DBから消えていた場合のundefinedを除外
    
    return sortedResult;
    }
    return result;
  },

  postRoute: async (parsed_body: postRouteType, user_id: string) => {
    const data = buildCreateRouteData(parsed_body, user_id);
    const result = await routesRepository.create(data);

    const en_texts :string[] = await translateJa2En([result.title, result.description, ...result.routeNodes.map((node)=>node.spot.name)])

    const meilisearch = getMeilisearch();
    const index = meilisearch.index("routes");
    index.updateSearchableAttributes(["title", "description", "searchText", "categoryName"]);
    index.updateFilterableAttributes(["authorId", "categoryId", "visibility"]);
    index.updateSortableAttributes(["createdAt"]);
    const documents = [{
      id: result.id,

      title: result.title,
      description: result.description,

      authorId: result.authorId,
      categoryId: result.categoryId,
      visibility: result.visibility,

      createdAt: result.createdAt.getTime(),
      updatedAt: result.updatedAt.getTime(),

      categoryName: result.category.name,

      routenodes:result.routeNodes.map((node)=>node.spot.name),

      searchText: [ 
        result.title,
        result.description,
        result.category.name,
        ...result.routeNodes.map(n => n.spot.name),
        ...en_texts,
      ].join(" ")
    }];
    await index.addDocuments(documents);
    return result;
  },

  patchRoute: async (parsed_body: PatchRouteType, user_id: string) => {
    const data = buildUpdateRouteData(parsed_body);
    const result = await routesRepository.update(parsed_body.id, user_id, data);

    const en_texts :string[] = await translateJa2En([result.title, result.description, ...result.routeNodes.map((node)=>node.spot.name)])
    const meilisearch = getMeilisearch();
    const index = meilisearch.index("routes");
    const documents = [{
      id: parsed_body.id,

      title: parsed_body.title,
      description: parsed_body.description,

      authorId: result.authorId,
      categoryId: parsed_body.categoryId,
      visibility: parsed_body.visibility,

      createdAt: result.createdAt.getTime(),
      updatedAt: result.updatedAt.getTime(),

      categoryName: result.category.name,

      routenodes:result.routeNodes.map((node)=>node.spot.name),

      searchText: [ 
        result.title,
        result.description,
        result.category.name,
        ...result.routeNodes.map(n => n.spot.name),
        ...en_texts,
      ].join(" ")
    }];
    index.updateDocuments(documents);
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

    const meilisearch = getMeilisearch();
    const index = meilisearch.index("routes");
    await index.deleteDocument(parsed_body.id);

    return deleted;
  },
};
