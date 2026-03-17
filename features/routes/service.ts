import { routesRepository, RouteWithRelations } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { GetRoutesType, postRouteType, PatchRouteType, DeleteRouteType } from "@/features/routes/schema";
import { buildCreateRouteData, buildUpdateRouteData, buildRoutesWhere } from "@/features/routes/utils";
import { getMeilisearch } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { searchHistoryService } from "@/features/searchHistory/service";
import { parse } from "path";
import { FindRoutes } from "@/features/routes/repository";
import crypto from "crypto";
import {ImageStatus, ImageType} from "@prisma/client";

export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<RouteWithRelations[]> => {
    try {
      let ids: string[] | undefined = undefined;
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

      const result = await routesRepository.findMany(where, query.limit);
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

      const en_texts = (await translateJa2En([
        result.title,
        result.description,
        ...result.routeNodes.map(n => n.spot?.name)
      ])).filter(Boolean);

      const meilisearch = getMeilisearch();
      const index = meilisearch.index("routes");

      const documents = [{
        id: result.id,

        title: result.title,
        description: result.description,

        authorId: result.authorId,
        categoryId: result.categoryId,
        visibility: result.visibility,

        createdAt: result.createdAt?.getTime(),
        updatedAt: result.updatedAt?.getTime(),

        categoryName: result.category.name,

        routeNodes: result.routeNodes
            .map(n => n.spot?.name)
            .filter(Boolean),

        searchText: [
          result.title,
          result.description,
          result.category.name,
          ...result.routeNodes.map(n => n.spot?.name).filter(Boolean),
          ...en_texts,
        ].join(" ")
      }];


      return result
    }catch(e){
      throw e;
    }
  },

  patchRoute: async (parsed_body: PatchRouteType, user_id: string) => {
    try {
      const data = buildUpdateRouteData(parsed_body);
      const result = await routesRepository.update(parsed_body.id, user_id, data);

      const en_texts: string[] = await translateJa2En([result.title, result.description, ...result.routeNodes.map((node) => node.spot.name)])
      const meilisearch = getMeilisearch();
      const index = meilisearch.index("routes");
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

        routenodes: result.routeNodes.map((node) => node.spot.name),

        searchText: [
          result.title,
          result.description,
          result.category.name,
          ...result.routeNodes.map(n => n.spot.name),
          ...en_texts,
        ].join(" ")
      }];
      await index.updateDocuments(documents, { primaryKey: "id" });
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

  getRouteDetail: async (id: string, userId: string | null): Promise<Route | null> => {
    const route = await routesRepository.findRoutes({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        thumbnail: true,
        likes: true,
        views: true,
        routeNodes: {
          include: {
            spot: true,
            transitSteps: true,
            images: true,
          },
        },
        collaborators: true,
      },
    }) as Route[];

    if (route.length === 0) {
      return null;
    }

    const targetRoute = route[0];

    // 認可チェック
    const isAuthor = targetRoute.authorId === userId;
    const isCollaborator = targetRoute.collaborators.some(c => c.userId === userId);

    if (targetRoute.visibility === RouteVisibility.PRIVATE && !isAuthor && !isCollaborator) {
      throw new Error("Unauthorized");
    }

    return targetRoute;
  },

  generateInvite: async (routeId: string, userId: string) => {
    const route = await routesRepository.findRoutes({
      where: { id: routeId },
    });

    if (route.length === 0) throw new Error("Route not found");
    if (route[0].authorId !== userId) throw new Error("Unauthorized");
    if (route[0].collaboratorPolicy === RouteCollaboratorPolicy.DISABLED) {
      throw new Error("Collaboration is disabled for this route");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await getPrisma().routeInvite.create({
      data: {
        routeId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日間有効
      },
    });

    return token;
  },

  acceptInvite: async (token: string, userId: string) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const invite = await getPrisma().routeInvite.findUnique({
      where: { tokenHash },
      include: { route: true },
    });

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
    await getPrisma().routeCollaborator.upsert({
      where: {
        routeId_userId: {
          routeId: invite.routeId,
          userId: userId,
        },
      },
      create: {
        routeId: invite.routeId,
        userId: userId,
      },
      update: {}, // すでに存在すれば何もしない
    });

    // 使用回数をインクリメント
    await getPrisma().routeInvite.update({
      where: { id: invite.id },
      data: { usedCount: { increment: 1 } },
    });

    return invite.routeId;
  },

  checkUpdatePermission: async (routeId: string, userId: string) => {
    const route = await getPrisma().route.findUnique({
      where: { id: routeId },
      include: { collaborators: true },
    });

    if (!route) return false;
    if (route.authorId === userId) return true;

    const isCollaborator = route.collaborators.some(c => c.userId === userId);
    if (isCollaborator && route.collaboratorPolicy === RouteCollaboratorPolicy.CAN_EDIT) {
      return true;
    }

    return false;
  },
};
