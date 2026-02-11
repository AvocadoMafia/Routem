import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/config/server";
import { Prisma, TransitMode, ImageType, ImageStatus, RouteVisibility } from "@prisma/client";
import { getMockUser } from "@/lib/mockAuth";
import { z } from "zod";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { validateParams } from "@/lib/server/validateParams";
import { getRoutesSchema } from "@/features/routes/schema";
import {Transportation, Waypoint} from "@/lib/client/types";


// GET /api/v1/routems
// 最近作成されたルートを一覧返却します
// export async function GET(req: NextRequest) {
//   return handleRequest(async () => {
//     const search_params = Object.fromEntries(new URL(req.url).searchParams);
//     const parsed_params = await validateParams(getRoutesSchema, search_params);
//     const data = await routesService.getRoutesByParams(parsed_params);
//     return NextResponse.json(data);
//   });
// }

export async function GET(req: NextRequest) {
  const routes = await getPrisma().route.findMany({
    take: 12,
    include: {
      routeNodes: {
        include: {
          spot: true,
        },
      },
      author: true,
      category: true,
      likes: true,
      views: true,
      thumbnail: true,
    }
  })

  return NextResponse.json({routes}, {status: 200});
}

// POST /api/v1/routems
// ルート作成用のAPI。
// to近藤。この処理をservice.tsに移せ。あとバリデーションが散在しているから最初にbodyのバリデーション処理を設けたほうがいいかも
export async function POST(req: NextRequest) {
  try {
    const prisma = getPrisma();
    //認証認可を組み込む場合はここにAuthからとってきたuserを埋め込む
    const user = await getMockUser(); // 認証モック
    //以下はクライアントからのリクエスト内容
    // body: JSON.stringify({
    //   title,
    //   description,
    //   category,
    //   visibility,
    //   thumbnailImageSrc,
    //   items: normalizedItems
    // })
    //itemsは(Waypoint | Transportation)[]で表され、Waypoint型もしくはTransportation型の配列
    const body = await req.json();

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid body: items[] is required" }, { status: 400 });
    }

    //バリデーション処理
    const { title = "Untitled Route", description = "", category = "General", visibility = "PUBLIC", thumbnailImageSrc, items } = body;

    //itemについて、waypointのみを抽出し配列を作成。
    //ここで、クライアント側の方を参照しているのでなるべくならこれも変えたい
    const waypointItems: Waypoint[] = (items as (Waypoint | Transportation)[]).filter((i) => i.type === "waypoint");

    if (waypointItems.length < 2) {
      return NextResponse.json({ error: "At least two waypoints are required" }, { status: 400 });
    }

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
            .map((trans: any) => ({
              mode: mapMethodToTransitMode(trans.method),
              memo: trans.memo ?? "",
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

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error("/api/v1/routems POST error", e);
    return NextResponse.json({ error: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}

//stringからTransitModeへのキャスト関数
function mapMethodToTransitMode(method: string): TransitMode {
  switch (method) {
    case "walk":
      return TransitMode.WALK;
    case "train":
      return TransitMode.TRAIN;
    case "bus":
      return TransitMode.BUS;
    case "car":
      return TransitMode.CAR;
    case "bike":
      return TransitMode.BIKE;
    case "flight":
      return TransitMode.FLIGHT;
    case "ship":
      return TransitMode.SHIP;
    case "other":
      return TransitMode.OTHER;
    default:
      return TransitMode.WALK;
  }
}
