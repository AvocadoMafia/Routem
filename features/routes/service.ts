import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { GetRoutesType, postRouteType, PatchRouteType, DeleteRouteType } from "@/features/routes/schema";
import { buildCreateRouteData, buildUpdateRouteData, buildRoutesWhere } from "@/features/routes/utils";
import { getMeilisearch, getRedisClient } from "@/lib/config/server";
import { DEFAULT_LIMIT } from "@/lib/server/constants";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import crypto from "crypto";
import { RouteVisibility, RouteCollaboratorPolicy, Prisma } from "@prisma/client";

export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<RouteWithRelations[]> => {
    try {
      let ids: string[] | undefined = undefined;
      
      // クエリ指定が limit 以外にない、または明示的におすすめが指定された場合
      const isDefaultRecommend = Object.keys(query).filter(k => k !== 'limit' && query[k as keyof GetRoutesType] !== undefined).length === 0;
      
      if (isDefaultRecommend || query.type === "recommend" || query.type === "user_recommend" || query.type === "related" || query.type === "trending") {
        const redis = getRedisClient();
        let redisKey = "recommend:global";

        if (query.type === "user_recommend" && user) {
          redisKey = `recommend:user:${user.id}`;
        } else if (query.type === "related" && query.targetId) {
          redisKey = `recommend:related:${query.targetId}`;
        } else if (query.type === "trending") {
          redisKey = "recommend:trending";
        }

        const cachedData = await redis.get(redisKey);
        if (cachedData) {
          const scored = JSON.parse(cachedData) as { id: string, score: number }[];
          const start = query.offset ?? 0;
          const limit = query.limit ?? DEFAULT_LIMIT;
          ids = scored.slice(start, start + limit).map(s => s.id);
          
          if (ids.length === 0) return [];
        }
      }

      if (query.q) {
        const meilisearch = getMeilisearch();
        const index = await meilisearch.getIndex("routes");
        const search = await index.search(query.q);
        ids = search.hits.map((hit) => hit.id);
        if (ids.length === 0) {
          return [];
        }
      }
      const where = buildRoutesWhere(query, user?.id, ids);

      let orderBy: Prisma.RouteOrderByWithRelationInput | undefined = undefined;
      if (query.orderBy === "updatedAt") {
        orderBy = { updatedAt: "desc" };
      } else if (query.orderBy === "createdAt") {
        orderBy = { createdAt: "desc" };
      }

      const result = await routesRepository.findMany(where, query.limit, query.offset, orderBy);
      if (ids) {
        const sortedResult = ids
          .map((id) => result.find((route) => route.id === id))
          .filter((route) => route !== undefined); // DBから消えていた場合のundefinedを除外

        return sortedResult;
      }
      return result;
    } catch (e) {
      throw e;
    }
  },

  postRoute: async (parsed_body: postRouteType, user_id: string) => {
    try {
      const data = buildCreateRouteData(parsed_body, user_id);
      const result = await routesRepository.create(data);

      await syncToMeilisearch(result);

      return result
    }catch(e){
      throw e;
    }
  },

  patchRoute: async (parsed_body: PatchRouteType, user_id: string) => {
    try {
      const data = buildUpdateRouteData(parsed_body);
      const result = await routesRepository.update(parsed_body.id, user_id, data);

      await syncToMeilisearch(result);

      return result;
    } catch (e) {
      throw e;
    }
  },

  //deleteManyではincludeでrelationデータを取得することができないので、この関数でのみ戻り値にrelationデータが含まれない。
  //基本的には問題ないが、もし必要なら事前に取得したのち削除、というフローをとる必要がある。
  deleteRoute: async (parsed_body: DeleteRouteType, user_id: string) => {
    try {
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
    } catch (e) {
      throw e;
    }
  },

  getRouteDetail: async (id: string, userId: string | null): Promise<RouteWithRelations | null> => {
    try {
      const route = await routesRepository.findUnique(id);

      if (!route) {
        return null;
      }

      // 認可チェック
      const isAuthor = route.authorId === userId;
      const isCollaborator = route.collaborators.some(c => c.userId === userId);

      if (route.visibility === RouteVisibility.PRIVATE && !isAuthor && !isCollaborator) {
        throw new Error("Unauthorized");
      }

      return route;
    } catch (e) {
      throw e;
    }
  },

  generateInvite: async (routeId: string, userId: string) => {
    try {
      const route = await routesRepository.findUnique(routeId);

      if (!route) throw new Error("Route not found");
      if (route.authorId !== userId) throw new Error("Unauthorized");
      if (route.collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
        throw new Error("Collaboration is disabled for this route");
      }

      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await routesRepository.createInvite({
        route: { connect: { id: routeId } },
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日間有効
      });

      return token;
    } catch (e) {
      throw e;
    }
  },

  acceptInvite: async (token: string, userId: string) => {
    try {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const invite = await routesRepository.findInviteByTokenHash(tokenHash);

      if (!invite) throw new Error("Invalid token");
      if (invite.revokedAt) throw new Error("Token revoked");
      if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error("Token expired");
      if (invite.route.collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
        throw new Error("Collaboration is disabled for this route");
      }

      // すでに作成者本人の場合は何もしない（または成功扱い）
      if (invite.route.authorId === userId) {
        return invite.routeId;
      }

      // collaboratorに追加 (upsert的に扱う)
      await routesRepository.upsertCollaborator(invite.routeId, userId);

      // 使用回数をインクリメント
      await routesRepository.updateInvite(invite.id, {
        usedCount: { increment: 1 },
      });

      return invite.routeId;
    } catch (e) {
      throw e;
    }
  },

  checkUpdatePermission: async (routeId: string, userId: string) => {
    try {
      const route = await routesRepository.findUnique(routeId);

      if (!route) return false;
      if (route.authorId === userId) return true;

      const isCollaborator = route.collaborators.some(c => c.userId === userId);
      if (isCollaborator && route.collaboratorPolicy === RouteCollaboratorPolicy.CAN_EDIT) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  },

};

async function syncToMeilisearch(route: RouteWithRelations) {
    const en_texts = (await translateJa2En([
        route.title,
        route.description,
        ...route.routeNodes.map(n => n.spot?.name),
        ...route.tags.map(t => t.name)
    ])).filter(Boolean);

    const meilisearch = getMeilisearch();
    const routesIndex = meilisearch.index("routes");

    const documents = [{
        id: route.id,
        title: route.title,
        description: route.description,
        authorId: route.authorId,
        visibility: route.visibility,
        createdAt: route.createdAt?.getTime(),
        updatedAt: route.updatedAt?.getTime(),
        routeNodes: route.routeNodes.map(n => n.spot?.name).filter(Boolean),
        tags: route.tags.map(t => t.name),
        month: route.month,
        routeFor: route.routeFor,
        budget: route.budget ? Number(route.budget.amount) : undefined,
        searchText: [
            route.title,
            route.description,
            ...route.routeNodes.map(n => n.spot?.name).filter(Boolean),
            ...route.tags.map(t => t.name),
            ...en_texts,
        ].join(" ")
    }];

    await routesIndex.updateDocuments(documents, { primaryKey: "id" });

    // タグをMeilisearchのtagsインデックスに追加
    const tagsIndex = meilisearch.index("tags");
    const tagDocuments = route.tags.map(t => ({
        id: t.name,
        name: t.name
    }));
    await tagsIndex.addDocuments(tagDocuments, { primaryKey: "id" });
}
