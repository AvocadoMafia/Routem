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
import { getMeilisearch, getPrisma, getRedisClient } from "@/lib/config/server";
import { getNextCursor, sliceByScoreCursor } from "@/lib/server/cursor";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { Prisma, RouteCollaboratorPolicy, RouteVisibility } from "@prisma/client";
import crypto from "crypto";
import { exchangeRatesRepository } from "../exchangeRates/repository";

export const routesService = {
  getRoutes: async (
    query: GetRoutesType,
  ): Promise<{ items: RouteWithRelations[]; nextCursor: string | null }> => {
    try {
      let routeIds: string[] = [];
      let nextCursor: string | null = null;

      if (query.type) {
        const redis = getRedisClient();
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
          const cachedData = await redis.get(redisKey);
          if (cachedData) {
            const items = JSON.parse(cachedData) as { id: string; score: number }[];
            const sliced = sliceByScoreCursor(items, query.cursor, query.limit);
            routeIds = sliced.items.map((item) => item.id);
            nextCursor = sliced.nextCursor;
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
        throw new Error("User not found");
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
        throw new Error("Notfound or Unauthorized");
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

      if (!invite) throw new Error("Invalid token");
      if (invite.revokedAt) throw new Error("Token revoked");
      if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error("Token expired");
      if (invite.route.collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
        throw new Error("Collaboration is disabled for this route");
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
