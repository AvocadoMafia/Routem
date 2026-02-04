import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/config/server";
import { Prisma, TransportMode } from "@prisma/client";

// GET /api/v1/routems
// 最近作成されたルートを簡易的に一覧返却します（UI用のダミー値を含む）
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrisma();
    const url = new URL(req.url);
    const takeParam = url.searchParams.get('take');
    const take = Math.min(Math.max(parseInt(takeParam || '12', 10) || 12, 1), 50);

    const routes = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: { id: true, createdAt: true },
    });

    // UIが必要とする最小の形にマッピング（不足分はプレースホルダー）
    const mapped = routes.map((r, idx) => ({
      id: r.id,
      title: `Route ${idx + 1}`,
      user: {
        id: `u-${idx + 1}`,
        name: 'Anonymous',
        likesThisWeek: 0,
        viewsThisWeek: 0,
        bio: undefined,
        location: undefined,
        profileImage: '/mockImages/userIcon_1.jpg',
        profileBackgroundImage: '/mockImages/Tokyo.jpg',
      },
      likesThisWeek: 0,
      viewsThisWeek: 0,
      category: 'General',
      thumbnailImageSrc: '/mockImages/Kyoto.jpg',
    }));

    return NextResponse.json({ routes: mapped }, { status: 200 });
  } catch (e: any) {
    console.error('/api/v1/routems GET error', e);
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/v1/routems
// ルート作成用のAPI。articles/new から送られてくる簡易的な配列（items）を
// Prismaの Route / Spot / RouteNode / RouteSegment / SegmentStep に保存します。
// 注意: 現状のUIの Waypoint には緯度経度がないため、暫定で (0,0) を保存します。
// 将来、Waypoint に lat/lng を追加したら、その値を優先して保存してください。
export async function POST(req: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await req.json();

    // 期待する最小のリクエスト形式
    // {
    //   meta?: { title?: string, category?: string, thumbnailImageSrc?: string },
    //   items: Array<{
    //     id: string,
    //     type: 'waypoint' | 'transportation',
    //     name?: string,
    //     memo?: string,
    //     order?: number,
    //     method?: 'walk' | 'train' | 'bus' | 'car' | 'other',
    //     lat?: number, // 将来拡張（現UI未対応）
    //     lng?: number  // 将来拡張（現UI未対応）
    //   }>
    // }

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid body: items[] is required" }, { status: 400 });
    }

    const items: any[] = body.items;

    // 入力を軽く検証
    const waypointItems = items.filter((i) => i.type === "waypoint");
    if (waypointItems.length < 1) {
      return NextResponse.json({ error: "At least one waypoint is required" }, { status: 400 });
    }

    // トランザクションでまとめて作成
    const result = await prisma.$transaction(async (tx) => {
      // 1) Route を作成（最小構成）
      const route = await tx.route.create({ data: {} });

      // 2) Spot と RouteNode を順序付きで作成
      //    - Spot.id はフロントの waypoint.id をそのまま流用（暫定）
      //    - 緯度経度は現状未入力のため lat/lng がなければ (0,0) で保存
      //    - source は 'user' としておく
      const waypointOrderPairs: { waypointId: string; nodeId: string }[] = [];

      for (let order = 0; order < waypointItems.length; order++) {
        const w = waypointItems[order];
        const spotId = String(w.id);
        const name = w.name ?? `Waypoint ${order + 1}`;
        const lat = typeof w.lat === "number" ? w.lat : 0;
        const lng = typeof w.lng === "number" ? w.lng : 0;

        // Spot は存在しない場合のみ作成（同一IDが既にあるケースを許容）
        // 注意: Spot.id はPKのため、衝突時は upsert で上書きしない運用にしています。
        await tx.spot.upsert({
          where: { id: spotId },
          update: {},
          create: {
            id: spotId,
            name,
            latitude: lat,
            longitude: lng,
            source: "user",
          },
        });

        const node = await tx.routeNode.create({
          data: {
            order,
            routeId: route.id,
            spotId: spotId,
          },
        });

        waypointOrderPairs.push({ waypointId: w.id, nodeId: node.id });
      }

      // 3) RouteSegment（連続する waypoint 同士を結ぶ）と SegmentStep を作成
      const segmentsCreated: string[] = [];

      for (let i = 0; i < waypointOrderPairs.length - 1; i++) {
        const from = waypointOrderPairs[i];
        const to = waypointOrderPairs[i + 1];

        const segment = await tx.routeSegment.create({
          data: {
            fromNodeId: from.nodeId,
            toNodeId: to.nodeId,
            routeId: route.id,
          },
        });
        segmentsCreated.push(segment.id);

        // transportation を items 配列から近傍で探し、1つだけ SegmentStep に反映（任意）
        // items は [waypoint, transportation, waypoint, ...] の前提が多いはず
        // from の waypointId と to の waypointId の間にある transportation を拾う
        const fromIndexInItems = items.findIndex((it) => it.id === from.waypointId);
        const toIndexInItems = items.findIndex((it) => it.id === to.waypointId);
        const between = items.slice(
          Math.min(fromIndexInItems, toIndexInItems) + 1,
          Math.max(fromIndexInItems, toIndexInItems)
        );
        const firstTrans = between.find((it) => it.type === "transportation");

        if (firstTrans && firstTrans.method) {
          // method を Prisma enum TransportMode にマッピング
          const mode = mapMethodToTransportMode(firstTrans.method);
          await tx.segmentStep.create({
            data: {
              segmentId: segment.id,
              order: 0,
              mode,
              // duration/distance は未入力のため null
            },
          });
        }
      }

      // 4) レスポンス用に最小のGeoJSONを組み立て（任意）
      const features: any[] = [];
      for (const w of waypointItems) {
        const lat = typeof w.lat === "number" ? w.lat : 0;
        const lng = typeof w.lng === "number" ? w.lng : 0;
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: { featureType: "waypoint", id: w.id, name: w.name ?? "" },
        });
      }
      // 線分は簡易的に consecutive waypoints の座標をつなぐ（(0,0) になる可能性あり）
      for (let i = 0; i < waypointItems.length - 1; i++) {
        const a = waypointItems[i];
        const b = waypointItems[i + 1];
        const aLat = typeof a.lat === "number" ? a.lat : 0;
        const aLng = typeof a.lng === "number" ? a.lng : 0;
        const bLat = typeof b.lat === "number" ? b.lat : 0;
        const bLng = typeof b.lng === "number" ? b.lng : 0;
        features.push({
          type: "Feature",
          geometry: { type: "LineString", coordinates: [ [aLng, aLat], [bLng, bLat] ] },
          properties: { featureType: "transportation" },
        });
      }

      const geojson = { type: "FeatureCollection", features };

      return { routeId: route.id, geojson };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error("/api/v1/routems POST error", e);
    return NextResponse.json({ error: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}

function mapMethodToTransportMode(method: string): TransportMode {
  switch (method) {
    case "walk":
      return TransportMode.WALK;
    case "train":
      return TransportMode.TRAIN;
    case "bus":
      return TransportMode.BUS;
    case "car":
      return TransportMode.CAR;
    case "bike":
      return TransportMode.BIKE;
    default:
      return TransportMode.WALK;
  }
}