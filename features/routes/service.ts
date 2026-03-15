import { Route } from "@/lib/client/types";
import { postRouteType } from "@/features/routes/schema";
import {
  ImageStatus,
  ImageType,
  Prisma,
  RouteVisibility,
  RouteCollaboratorPolicy,
} from "@prisma/client";
import { routesRepository } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { GetRoutesType } from "@/features/routes/schema";
import { FindRoutes } from "@/features/routes/repository";
import { PatchRouteType } from "@/features/routes/schema";
import { DeleteRouteType } from "@/features/routes/schema";
import crypto from "crypto";

export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<FindRoutes> => {
    // 共同編集者の場合は、PRIVATEでも閲覧可能にする必要がある。
    // authorIdが指定されている場合、そのユーザーが自分であれば全件、そうでなければPUBLIC+自分がcollaboratorのPRIVATE。
    // authorIdが指定されていない場合、PUBLICのみ。
    // 要件では「PRIVATEは作成者本人、または collaborator のみ閲覧可能」

    let visibility_condition: Prisma.RouteWhereInput = {};

    if (!query.authorId) {
      // authorId が指定されていない（メインページなど）場合は、PUBLICのみ
      visibility_condition = { visibility: RouteVisibility.PUBLIC };
    } else {
      // authorId が指定されている場合（ユーザープロフィールなど）
      if (user?.id === query.authorId) {
        // 本人の場合は、指定があればそれに従い、なければ全件（visibility_conditionは空のままで全件取得）
        if (query.visibility) {
          visibility_condition = { visibility: query.visibility };
        }
      } else {
        // 他人の場合は、指定された visibility があればそれを尊重しつつ、PRIVATE なら collaborator チェックを入れる
        const requestedVisibility = query.visibility;

        if (requestedVisibility === RouteVisibility.PUBLIC) {
          visibility_condition = { visibility: RouteVisibility.PUBLIC };
        } else if (requestedVisibility === RouteVisibility.PRIVATE) {
          visibility_condition = {
            AND: [
              { visibility: RouteVisibility.PRIVATE },
              { collaborators: { some: { userId: user?.id ?? "" } } }
            ]
          };
        } else {
          // visibility 指定がない場合は、PUBLIC または 自分が collaborator の PRIVATE
          visibility_condition = {
            OR: [
              { visibility: RouteVisibility.PUBLIC },
              {
                AND: [
                  { visibility: RouteVisibility.PRIVATE },
                  { collaborators: { some: { userId: user?.id ?? "" } } }
                ]
              }
            ]
          };
        }
      }
    }

    const where: Prisma.RouteWhereInput = {
      authorId: query.authorId,
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.createdAfter && { createdAt: { gte: query.createdAfter } }),
      ...visibility_condition,
    };

    const result = await routesRepository.findRoutes({
      where,
      take: query.limit,
      orderBy: {
        createdAt: "desc",
      },
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
        routeNodes: {
          include: {
            spot: true,
            transitSteps: true,
            images: true,
          },
        },
      },
    });
    return result;
  },

  postRoute: async (body: postRouteType, user_id: string) => {
    const current_nodes: Prisma.RouteNodeCreateWithoutRouteInput[] = [];
    let current_node: Prisma.RouteNodeCreateWithoutRouteInput | null = null;
    if (body.items) {
      for (const item of body.items) {
        if (item.type === "waypoint") {
          current_node = {
            order: current_nodes.length,
            details: item.memo,
            spot: (() => {
              //source,sourceIdが存在する時
              if (item.source && item.sourceId) {
                return {
                  connectOrCreate: {
                    where: { source_sourceId: { source: item.source, sourceId: item.sourceId } },
                    create: {
                      name: item.name,
                      latitude: item.lat,
                      longitude: item.lng,
                      source: item.source,
                      sourceId: item.sourceId,
                    },
                  },
                };
              } else if (!!item.id) {
                return {
                  connectOrCreate: {
                    where: { id: item.id },
                    create: {
                      name: item.name,
                      latitude: item.lat,
                      longitude: item.lng,
                    },
                  },
                };
              } else {
                return {
                  create: {
                    name: item.name,
                    latitude: item.lat,
                    longitude: item.lng,
                  },
                };
              }
            })(),
            transitSteps: { create: [] },
            images: {
              create: Array.isArray(item.images)
                ? item.images.map((url) => ({
                    url,
                    type: ImageType.NODE_IMAGE,
                    status: ImageStatus.ADOPTED,
                  }))
                : [],
            },
          };

          current_nodes.push(current_node);
        } else if(item.type === "transportation") {
          if (current_node && current_node?.transitSteps?.create) {
            (current_node?.transitSteps.create as any[]).push({
              order: (current_node?.transitSteps.create as any[]).length,
              mode: item.method,
              memo: item.memo,
              distance: item.distance,
              duration: item.duration,
            });
          }
        }
      }
    }

    

    return await routesRepository.createRoute({
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        visibility: body.visibility as RouteVisibility ?? undefined,
        collaboratorPolicy: body.collaboratorPolicy as RouteCollaboratorPolicy ?? undefined,
        author: {connect:{id:user_id}},
        category:{
          connect:{
            id:body.categoryId,
          }
        },

        thumbnail: {
          create: {
            url: body.thumbnailImageSrc,
            type: ImageType.ROUTE_THUMBNAIL,
            status:ImageStatus.ADOPTED
          },
        },

        ...(body.items && {
          routeNodes: {
            create: current_nodes,
          },
        }),
      

      },
      include:{
        thumbnail:true,
        category:true,
        routeNodes:true,
      }
    });
  },
  
  patchRoute: async (parsed_body: PatchRouteType) => {
    const current_nodes: Prisma.RouteNodeCreateWithoutRouteInput[] = [];
    let current_node: Prisma.RouteNodeCreateWithoutRouteInput | null = null;
    if (parsed_body.items) {
      for (const item of parsed_body.items) {
        if (item.type === "waypoint") {
          current_node = {
            order: current_nodes.length,
            details: item.memo,
            spot: (() => {
              // source, sourceIdが存在する時
              if (item.source && item.sourceId) {
                return {
                  connectOrCreate: {
                    where: { source_sourceId: { source: item.source, sourceId: item.sourceId } },
                    create: {
                      name: item.name,
                      latitude: item.lat,
                      longitude: item.lng,
                      source: item.source,
                      sourceId: item.sourceId,
                    },
                  },
                };
              } else if (!!item.id) {
                return {
                  connectOrCreate: {
                    where: { id: item.id },
                    create: {
                      name: item.name,
                      latitude: item.lat,
                      longitude: item.lng,
                    },
                  },
                };
              } else {
                return {
                  create: {
                    name: item.name,
                    latitude: item.lat,
                    longitude: item.lng,
                  },
                };
              }
            })(),
            transitSteps: { create: [] },
            images: {
              create: Array.isArray(item.images)
                ? item.images.map((url) => ({
                    url,
                    type: ImageType.NODE_IMAGE,
                    status: ImageStatus.ADOPTED,
                  }))
                : [],
            },
          };

          current_nodes.push(current_node);
        } else if(item.type === "transportation") {
          if (current_node && current_node?.transitSteps?.create) {
            (current_node?.transitSteps.create as any[]).push({
              order: (current_node?.transitSteps.create as any[]).length,
              mode: item.method,
              memo: item.memo,
              distance: item.distance,
              duration: item.duration,
            });
          }
        }
      }

      
    }

    return await routesRepository.updateRoute({
      where: { id: parsed_body.id },
      data: {
        // TODO:truthy判定をzodで防ぐ
        // TODO:updateの際に、クライアントが一部を空欄にして上書きしたいときに、空欄をnullとして扱うかどうかの仕様を決める必要がある。現状は、空欄にしたい項目はクライアント側でnullを送る必要がある。
        title: parsed_body.title ?? undefined,
        description: parsed_body.description ?? undefined,
        categoryId: parsed_body.categoryId ?? undefined,
        visibility: parsed_body.visibility as RouteVisibility ?? undefined,
        collaboratorPolicy: parsed_body.collaboratorPolicy as RouteCollaboratorPolicy ?? undefined,
        
        thumbnail: {
          update: {
            url: parsed_body.thumbnailImageSrc ?? undefined,
          },
        },

        ...(parsed_body.items && {
          routeNodes: {
            deleteMany: {},
            create: current_nodes,
          },
        }),
      },
    });
  },

  deleteRoute :async(parsed_body:DeleteRouteType, user_id:string) =>{
    const deleted = await routesRepository.deleteRoute({
      where:{id:parsed_body.id,
             authorId:user_id
            }
    });

    if(deleted.count === 0){
      throw new Error("Notfound or Unauthorized");
    }

    return deleted;
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

// 循環参照を避けるために最後にインポート
import { getPrisma } from "@/lib/config/server";
