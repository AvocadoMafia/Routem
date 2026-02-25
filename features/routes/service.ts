import { getPrisma } from "@/lib/config/server";
import { postRouteType } from "@/features/routes/schema";
import { RouteNode } from "@/lib/server/types";
import { cuid, number } from "zod";
import {
  ImageStatus,
  ImageType,
  Prisma,
  RouteVisibility,
} from "@prisma/client";
import { routesRepository } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { mapMethodToTransitMode } from "@/features/routes/utils";
import { GetRoutesType } from "@/features/routes/schema";
import { FindRoutes } from "@/features/routes/repository";
import { PatchRouteType } from "@/features/routes/schema";
import { th } from "zod/v4/locales";
import { parse } from "path";

export const routesService = {
  getRoutes: async (
    user: User | null,
    query: GetRoutesType,
  ): Promise<FindRoutes> => {
    const isOwner = user?.id === query.authorId;

    // Prismaのネストの中にundefinedを入れるとエラーになるため、visibilityの条件を分岐させて、防いでいる。
    let visibility_condition: Prisma.RouteWhereInput = {};
    if (!isOwner) {
      visibility_condition = { visibility: RouteVisibility.PUBLIC };
    } else if (query.visibility) {
      visibility_condition = { visibility: query.visibility };
    }

    const where: Prisma.RouteWhereInput = {
      authorId: query.authorId,
      ...(query.categoryId && { categoryId: query.categoryId }),
      // ここも同様に、createdAfterがない場合はundefinedが入るとエラーになるため、条件分岐させている。
      ...(query.createdAfter && { createdAt: { gte: query.createdAfter } }),
      ...visibility_condition,
    };

    return routesRepository.findRoutes({
      where,
      take: query.limit,
      orderBy: {
        createdAt: "asc",
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
  },

  postRoute: async (body: postRouteType, user: User) => {
    const {
      items,
      title,
      description,
      category,
      visibility,
      thumbnailImageSrc,
    } = body;

    // 1) waypointのみを抽出
    const waypointItems = items.filter((item) => item.type === "waypoint");

    // 2) 各Waypointに対応するデータを加工
    const nodesData = waypointItems.map((w, order) => {
      const spotId = w.mapboxId ?? String(w.id);
      const name = w.name ?? `Waypoint ${order + 1}`;
      const lat = typeof w.lat === "number" ? w.lat : 0;
      const lng = typeof w.lng === "number" ? w.lng : 0;
      const details = w.memo ?? "";

      // 該当するwaypointの後のTransportationアイテムを取得
      const waypointIndexInItems = items.findIndex((it: any) => it.id === w.id);
      let transitStepsData: any[] = [];

      // 経由地のindexが最後ではないとき
      if (waypointIndexInItems !== -1 && order < waypointItems.length - 1) {
        const nextWaypoint = waypointItems[order + 1];
        const nextWaypointIndexInItems = items.findIndex(
          (it: any) => it.id === nextWaypoint.id,
        );

        const between = items.slice(
          waypointIndexInItems + 1,
          nextWaypointIndexInItems,
        );
        const transItems = between.filter(
          (it: any) => it.type === "transportation",
        );

        transitStepsData = transItems
          .filter((trans: any) => trans.method)
          .map((trans: any, idx: number) => ({
            mode: mapMethodToTransitMode(trans.method),
            memo: trans.memo ?? "",
            order: idx,
            duration: trans.duration,
            distance: trans.distance,
          }));
      }

      return {
        order,
        details,
        spot: {
          id: spotId,
          name,
          latitude: lat,
          longitude: lng,
          source: w.mapboxId ? "mapbox" : "user",
        },
        transitSteps: transitStepsData,
        images: Array.isArray(w.images)
          ? w.images.map((url) => ({
              url,
              type: ImageType.NODE_IMAGE,
              status: ImageStatus.ADOPTED,
              uploaderId: user.id,
            }))
          : [],
      };
    });

    // 3) サムネイル画像の準備
    const thumbnailData = thumbnailImageSrc
      ? {
          url: thumbnailImageSrc,
          type: ImageType.ROUTE_THUMBNAIL,
          status: ImageStatus.ADOPTED,
          uploaderId: user.id,
        }
      : null;

    // repository層のcreateRouteを呼び出す
    return await routesRepository.createRoute({
      title,
      description,
      category,
      visibility: visibility.toUpperCase() as RouteVisibility,
      userId: user.id,
      nodes: nodesData,
      thumbnail: thumbnailData,
    });
  },
  patchRoute: async (parsed_body: PatchRouteType) => {
    const current_nodes: Prisma.RouteNodeCreateWithoutRouteInput[] = [];

    if (parsed_body.items) {
      for (const item of parsed_body.items) {
        if (item.type === "waypoint") {
          let current_node: Prisma.RouteNodeCreateWithoutRouteInput = {
            order: current_nodes.length,
            details: item.memo,
            spot: {
              // TODO: 既存のスポットを更新する場合は、spotIdを元にupdateする必要がある。現状は、常に新規作成しているため、スポットが重複してしまう可能性がある。
              create: {
                name: item.name,
                latitude: item.lat?? null,
                longitude: item.lng?? null,
                source: item.source ?? null,
                sourceId: item.sourceId ?? null,
              },
            },
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
        }
      }
    }

    return await routesRepository.updateRoute({
      where: { id: parsed_body.id },
      data: {
        // TODO:truthy判定をzodで防ぐ
        // TODO:updateの際に、クライアントが一部を空欄にして上書きしたいときに、空欄をnullとして扱うかどうかの仕様を決める必要がある。現状は、空欄にしたい項目はクライアント側でnullを送る必要がある。
        ...(parsed_body.title && { title: parsed_body.title }),
        ...(parsed_body.description && {
          description: parsed_body.description,
        }),
        ...(parsed_body.categoryId && { categoryId: parsed_body.categoryId }),
        ...(parsed_body.visibility && {
          visibility: parsed_body.visibility as RouteVisibility,
        }),
        ...(parsed_body.thumbnailImageSrc && {
          thumbnail: {
            update: {
              url: parsed_body.thumbnailImageSrc,
            },
          },
        }),
      },
    });
  },
};
