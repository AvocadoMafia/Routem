import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import {
  DeleteRouteType,
  GetRoutesType,
  PatchRouteType,
  postRouteType,
  RoutesDocumentsType,
} from "@/features/routes/schema";
import {
  buildCreateRouteData,
  buildRoutesWhere,
  buildUpdateRouteData,
} from "@/features/routes/utils";
import { getMeilisearch, getPrisma, getRedisClientOrNull } from "@/lib/config/server";
import { getNextCursor, sliceByScoreCursor } from "@/lib/server/cursor";
import { ValidationError } from "@/lib/server/validateParams";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { Prisma, RouteCollaboratorPolicy, RouteVisibility } from "@prisma/client";
import crypto from "crypto";
import { exchangeRatesRepository } from "../exchangeRates/repository";

export const routesService = {
  getRoutes: async (
    query: GetRoutesType,
  ): Promise<{ items: RouteWithRelations[]; nextCursor: string | null; totalCount?: number }> => {
    try {
      let routeIds: string[] = [];
      let nextCursor: string | null = null;

      // tagクエリの場合は専用処理（総数も返す）
      if (query.tag) {
        const where = buildRoutesWhere(query);
        const [result, totalCount] = await Promise.all([
          routesRepository.findMany({ where, limit: query.limit }),
          routesRepository.count({
            visibility: RouteVisibility.PUBLIC,
            tags: { some: { name: query.tag } },
          }),
        ]);
        nextCursor = getNextCursor(result, query.limit);
        return { items: result, nextCursor, totalCount };
      }

      if (query.type) {
        let redisKey = "";
        switch (query.type) {
          case "recommend":
            redisKey = "recommend:global";
            break;
          case "trending":
            redisKey = "routes:trending";
            break;
          case "user_recommend":
            if (query.targetId) {
              redisKey = `recommend:user:${query.targetId}`;
            }
            break;
          case "related":
            if (query.targetId) {
              redisKey = `recommend:related:${query.targetId}`;
            }
            break;
          case "followings":
            if (query.targetId) {
              redisKey = `recommend:followings:${query.targetId}`;
            }
            break;
        }

        if (redisKey) {
          // Redis が不達 / 未接続でもページ全体を壊さず、キャッシュ無し扱いで
          // DB 直クエリに graceful fallback する。これが本番で「trending 等の
          // コンポーネントだけ 500 で空になる」問題への耐性になる。
          const redis = await getRedisClientOrNull();
          if (redis) {
            try {
              const cachedData = await redis.get(redisKey);
              if (cachedData) {
                const items = JSON.parse(cachedData) as { id: string; score: number }[];
                const sliced = sliceByScoreCursor(items, query.cursor, query.limit);
                routeIds = sliced.items.map((item) => item.id);
                nextCursor = sliced.nextCursor;
              }
            } catch (redisErr) {
              // 取得失敗はエラーにせずキャッシュ無しパスへフォールバック
              console.error(`[routes.getRoutes] redis.get(${redisKey}) failed:`, redisErr);
            }
          }
        }
      }

      if (routeIds.length > 0) {
        const where: Prisma.RouteWhereInput = {
          id: { in: routeIds },
          visibility: RouteVisibility.PUBLIC,
        };
        const result = await routesRepository.findMany({ where });

        const routeMap = new Map(result.map((route) => [route.id, route]));
        const sortedResult = routeIds
          .map((id) => routeMap.get(id))
          .filter((route): route is RouteWithRelations => route !== undefined);

        return { items: sortedResult, nextCursor };
      }

      const where = buildRoutesWhere(query);
      const result = await routesRepository.findMany({ where, limit: query.limit });
      nextCursor = getNextCursor(result, query.limit);

      return { items: result, nextCursor };
    } catch (e) {
      throw e;
    }
  },

  postRoute: async (parsedBody: postRouteType, userId: string) => {
    try {
      const author = await getPrisma().user.findUnique({
        where: { id: userId },
        select: { language: true },
      });
      if (!author) {
        throw new Error("Not Found");
      }
      const data = buildCreateRouteData(parsedBody, userId, author.language);
      const result = await routesRepository.create(data);
      await syncToMeilisearch(result);
      return result;
    } catch (e) {
      throw e;
    }
  },

  patchRoute: async (parsedBody: PatchRouteType, userId: string) => {
    try {
      const data = buildUpdateRouteData(parsedBody);
      const result = await routesRepository.update(parsedBody.id, userId, data);
      await syncToMeilisearch(result);
      return result;
    } catch (e) {
      throw e;
    }
  },

  deleteRoute: async (parsedBody: DeleteRouteType, userId: string) => {
    try {
      const deleted = await routesRepository.deleteMany({
        id: parsedBody.id,
        authorId: userId,
      });

      if (deleted.count === 0) {
        // route が見つからない or 認証されていない両方のケース。route handler 側で
        // 認証は先に検証されるので、ここに到達したら実質「存在しない」扱いで 404 を返す。
        throw new Error("Not Found");
      }

      const meilisearch = getMeilisearch();
      const index = meilisearch.index("routes");
      await index.deleteDocument(parsedBody.id);

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

      const isAuthor = route.authorId === userId;
      const isCollaborator = route.collaborators.some((c) => c.userId === userId);

      if (route.visibility === RouteVisibility.PRIVATE && !isAuthor && !isCollaborator) {
        // PRIVATE route へのアクセスは「存在すら明かさない」ポリシー (CWE-209 情報露出防止)。
        // authorId / collaborator でない他人に対しては 404 NOT_FOUND で均一にレスポンスする。
        // これにより攻撃者は private route の uuid を brute-force で列挙できない。
        throw new Error("Not Found");
      }

      return route;
    } catch (e) {
      throw e;
    }
  },

  generateInvite: async (routeId: string, userId: string) => {
    try {
      const route = await routesRepository.findUnique(routeId);

      if (!route) throw new Error("Not Found");
      // generateInvite は owner のみ許可。非 owner には route の存在も明かさず 404 固定。
      // (他人の private route に対する invite 試行で 401/403 を返すと uuid が列挙可能になるため)
      if (route.authorId !== userId) throw new Error("Not Found");
      if (route.collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
        // コラボ機能が ON/OFF の policy に弾かれた → 403 FORBIDDEN
        throw new Error("Forbidden");
      }

      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await routesRepository.createInvite({
        route: { connect: { id: routeId } },
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

      // 招待トークン関連はクライアント入力由来の不正なので 400 VALIDATION_ERROR で返す
      if (!invite) throw new ValidationError("Invalid token");
      if (invite.revokedAt) throw new ValidationError("Token revoked");
      if (invite.expiresAt && invite.expiresAt < new Date()) throw new ValidationError("Token expired");
      if (invite.route.collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
        // policy 側で弾くケース → 403 FORBIDDEN
        throw new Error("Forbidden");
      }

      if (invite.route.authorId === userId) {
        return invite.routeId;
      }

      await routesRepository.upsertCollaborator(invite.routeId, userId);

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

      const isCollaborator = route.collaborators.some((c) => c.userId === userId);
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
  const allNodes = route.routeDates.flatMap((rd) => rd.routeNodes);

  const enTexts = (
    await translateJa2En([
      route.title,
      route.description,
      ...allNodes.map((n) => n.spot?.name),
      ...route.tags.map((t) => t.name),
    ])
  ).filter(Boolean);

  const exchangeRates = await exchangeRatesRepository.findMany();
  const rateToUsd = exchangeRates.find(
    (r) => r.currencyCode === route.budget?.localCurrencyCode,
  )?.rateToUsd;
  const budgetInUsd =
    route.budget?.amount && rateToUsd ? route.budget.amount * rateToUsd : undefined;

  const meilisearch = getMeilisearch();
  const routesIndex = meilisearch.index("routes");

  const documents: RoutesDocumentsType = [
    {
      id: route.id,
      title: route.title,
      description: route.description,
      authorId: route.authorId,
      visibility: route.visibility,
      createdAt: route.createdAt?.getTime(),
      updatedAt: route.updatedAt?.getTime(),
      spotNames: allNodes.map((n) => n.spot.name).filter(Boolean),
      tags: route.tags.map((t) => t.name),
      month: route.date ? [route.date.getMonth() + 1] : undefined,
      days: route.routeDates.length > 0 ? route.routeDates.length : undefined,
      routeFor: route.routeFor,
      language: route.language,
      budgetInLocalCurrency: route.budget?.amount,
      localCurrencyCode: route.budget?.localCurrencyCode,
      budgetInUsd,
      _geo: {
        lat: allNodes[0]?.spot.latitude ?? undefined,
        lng: allNodes[0]?.spot.longitude ?? undefined,
      },
      searchText: [
        route.title,
        route.description,
        ...allNodes.map((n) => n.spot?.name).filter(Boolean),
        ...route.tags.map((t) => t.name),
        ...enTexts,
      ].join(" "),
    },
  ];

  await routesIndex.updateDocuments(documents, { primaryKey: "id" });

  const tagsIndex = meilisearch.index("tags");
  const tagDocuments = route.tags.map((t) => ({
    id: t.name,
    name: t.name,
  }));
  await tagsIndex.addDocuments(tagDocuments, { primaryKey: "id" });
}
