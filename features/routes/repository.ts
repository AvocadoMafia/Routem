import { getPrisma } from "@/lib/config/server";

export const routesRepository = {
    findByQuery: async (query: any) => {
        // DBからクエリでルートを取得する処理（仮実装）
        return { id: "123", name: "Sample Route" };
    },

    createRoute: async (data: any) => {
        // DB接続
        const prisma = getPrisma();

        const result = await prisma.$transaction(async (tx) => {
            // 1) Route を作成
            //トランザクションの最初ではRouteNode抜きのRouteを作成する。
            const route = await tx.route.create({
                data: {
                    title,
                    description,
                    category: {
                        connectOrCreate: {
                            where: { name: category },
                            create: { name: category },
                        },
                    },
                    visibility: visibility.toUpperCase() as RouteVisibility,
                    author: {
                        connect: { id: user.id },
                    },
                },
            });

            // サムネイル画像があれば作成
            if (thumbnailImageSrc) {
                await tx.image.create({
                    data: {
                        url: thumbnailImageSrc,
                        type: ImageType.ROUTE_THUMBNAIL,
                        status: ImageStatus.ADOPTED,
                        uploader: {
                            connect: { id: user.id },
                        },
                        routeThumb: {
                            connect: { id: route.id },
                        },
                    },
                });
            }

            // 2) RouteNode とその TransitSteps を順序付きで作成
            // waypointItemsの各要素、つまり各経由地について以下の処理を実行する。
            for (let order = 0; order < waypointItems.length; order++) {
                const w = waypointItems[order];
                const spotId = w.mapboxId ?? String(w.id);
                const name = w.name ?? `Waypoint ${order + 1}`;
                const lat = typeof w.lat === "number" ? w.lat : 0;
                const lng = typeof w.lng === "number" ? w.lng : 0;
                const details = w.memo ?? "";

                //spotを更新、ない場合は作成
                await tx.spot.upsert({
                    where: { id: spotId },
                    update: { name, latitude: lat, longitude: lng },
                    create: {
                        id: spotId,
                        name,
                        latitude: lat,
                        longitude: lng,
                        source: w.mapboxId ? "mapbox" : "user",
                    },
                });

                // 該当するwaypointの後のTransportationアイテムを取得
                const waypointIndexInItems = items.findIndex((it: any) => it.id === w.id);
                let transitStepsData: any[] = [];

                //経由地のindexが0以下、もしくは最後ではないとき
                if (waypointIndexInItems !== -1 && order < waypointItems.length - 1) {
                    //処理中の経由地要素Aの次の経由地要素Bを取得し、itemsでのindexを取得する。
                    const nextWaypoint = waypointItems[order + 1];
                    const nextWaypointIndexInItems = items.findIndex((it: any) => it.id === nextWaypoint.id);

                    //経由地Aと経由地Bの間にあるべきTransportationを取得。念のためさらにfilterをかけてtransItemsに格納
                    const between = items.slice(waypointIndexInItems + 1, nextWaypointIndexInItems);
                    const transItems = between.filter((it: any) => it.type === "transportation");

                    //さらにmethodが存在するもので絞り込みをかける。フィルター後のものに、さらにmemoのバリデーション、modeのTransitModeへのキャストを行う。
                    transitStepsData = transItems
                        .filter((trans: any) => trans.method)
                        .map((trans: any, idx: number) => ({
                            mode: mapMethodToTransitMode(trans.method),
                            memo: trans.memo ?? "",
                            order: idx,
                        }));
                }

                //事前に作成したrouteのidを用いて処理中の要素についてのrouteNodeを作成する。
                const node = await tx.routeNode.create({
                    data: {
                        order,
                        route: {
                            connect: { id: route.id },
                        },
                        spot: {
                            connect: { id: spotId },
                        },
                        details: details,
                        transitSteps: {
                            create: transitStepsData,
                        },
                    },
                });

                // waypoint の画像があれば作成
                if (Array.isArray(w.images)) {
                    for (const imageUrl of w.images) {
                        await tx.image.create({
                            data: {
                                url: imageUrl,
                                type: ImageType.NODE_IMAGE,
                                status: ImageStatus.ADOPTED,
                                uploader: {
                                    connect: { id: user.id },
                                },
                                routeNode: {
                                    connect: { id: node.id },
                                },
                            },
                        });
                    }
                }
            }

            //このトランザクションは最終的にrouteIdを返す。別にこれはなくてもいい。下のresultにこの返却値が代入される
            return { routeId: route.id };
        });
    }
}