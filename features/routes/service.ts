import { getPrisma } from "@/lib/config/server";
import { postRouteSchema } from "@/features/routes/schema";
import { RouteNode } from "@/lib/server/types";
import { cuid, number } from "zod";
import { ImageStatus, ImageType, Prisma, RouteVisibility } from "@prisma/client";
import { routesRepository } from "@/features/routes/repository";
import { User } from "@supabase/supabase-js";
import { mapMethodToTransitMode } from "@/features/routes/utils";
import { GetRoutesSchema } from "@/features/routes/schema";
import { FindRoutes } from "@/features/routes/repository";



export const routesService = {
    getRoutes: async (user: User | null, query: GetRoutesSchema): Promise<FindRoutes> => {
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
            // ここも同様に、createdAfterがない場合はundefinedが入るとエラーになるため、条件分岐させている。
            ...(query.createdAfter && { createdAt: { gte: query.createdAfter } }),
            ...visibility_condition,
        };

        return routesRepository.findRoutes(
            {
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
                            profileImage: true,
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
            }
        );
    },

    getRoutesByParams: async (params: any) => {
        const prisma = getPrisma();
        const { q, category, visibility, authorId, limit = 20 } = params;

        const where: any = {};

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        if (category) {
            where.category = {
                name: category,
            };
        }

        if (visibility) {
            where.visibility = visibility.toUpperCase();
        }

        if (authorId) {
            where.authorId = authorId;
        }


        return prisma.route.findMany({
            where,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                thumbnail: true,
            },
        });
    },

    postRoute: async (body: postRouteSchema, user: User) => {
        const { items, title, description, category, visibility, thumbnailImageSrc } = body;

        // 1) waypointのみを抽出
        const waypointItems = items.filter((item) => item.type === 'waypoint');

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
                const nextWaypointIndexInItems = items.findIndex((it: any) => it.id === nextWaypoint.id);

                const between = items.slice(waypointIndexInItems + 1, nextWaypointIndexInItems);
                const transItems = between.filter((it: any) => it.type === "transportation");

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
                images: Array.isArray(w.images) ? w.images.map(url => ({
                    url,
                    type: ImageType.NODE_IMAGE,
                    status: ImageStatus.ADOPTED,
                    uploaderId: user.id,
                })) : [],
            };
        });

        // 3) サムネイル画像の準備
        const thumbnailData = thumbnailImageSrc ? {
            url: thumbnailImageSrc,
            type: ImageType.ROUTE_THUMBNAIL,
            status: ImageStatus.ADOPTED,
            uploaderId: user.id,
        } : null;

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
};
