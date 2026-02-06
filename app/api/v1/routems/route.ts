import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/config/server";
import { Prisma, TransportMode, ImageType, ImageStatus, RouteVisibility } from "@prisma/client";
import { getMockUser } from "@/lib/mockAuth";

// GET /api/v1/routems
// 最近作成されたルートを一覧返却します
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrisma();
    const url = new URL(req.url);
    const takeParam = url.searchParams.get('take');
    const take = Math.min(Math.max(parseInt(takeParam || '12', 10) || 12, 1), 50);

    const routes = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        author: {
          include: {
            profileImage: true
          }
        },
        thumbnail: true,
        likes: true,
        views: true
      }
    });

    // UIが必要とする形にマッピング
    const mapped = routes.map((r) => ({
      id: r.id,
      title: r.title,
      bio: r.bio,
      category: r.category,
      visibility: r.visibility,
      createdAt: r.createdAt.toISOString(),
      author: {
        id: r.author.id,
        name: r.author.name,
        likesThisWeek: 0,
        viewsThisWeek: 0,
        bio: r.author.bio,
        profileImage: r.author.profileImage?.url,
      },
      likesThisWeek: r.likes.length,
      viewsThisWeek: r.views.length,
      thumbnail: r.thumbnail,
    }));

    return NextResponse.json({ routes: mapped }, { status: 200 });
  } catch (e: any) {
    console.error('/api/v1/routems GET error', e);
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/v1/routems
// ルート作成用のAPI。
export async function POST(req: NextRequest) {
  try {
    const prisma = getPrisma();
    const user = await getMockUser(); // 認証モック
    const body = await req.json();

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid body: items[] is required" }, { status: 400 });
    }

    const { title = "Untitled Route", bio = "", category = "General", visibility = "private", thumbnailImageSrc, items } = body;

    const waypointItems = (items as any[]).filter((i) => i.type === "waypoint");
    if (waypointItems.length < 1) {
      return NextResponse.json({ error: "At least one waypoint is required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1) Route を作成
      const route = await tx.route.create({
        data: {
          title,
          bio,
          category,
          visibility: visibility === "public" ? RouteVisibility.public : RouteVisibility.private,
          authorId: user.id,
        },
      });

      // サムネイル画像があれば作成
      if (thumbnailImageSrc) {
        await tx.image.create({
          data: {
            url: thumbnailImageSrc,
            type: ImageType.ROUTE_THUMBNAIL,
            status: ImageStatus.ADOPTED,
            uploaderId: user.id,
            routeThumbId: route.id
          }
        });
      }

      // 2) Spot と RouteNode を順序付きで作成
      const waypointOrderPairs: { waypointId: string; nodeId: string }[] = [];

      for (let order = 0; order < waypointItems.length; order++) {
        const w = waypointItems[order];
        const spotId = String(w.id);
        const name = w.name ?? `Waypoint ${order + 1}`;
        const lat = typeof w.lat === "number" ? w.lat : 0;
        const lng = typeof w.lng === "number" ? w.lng : 0;
        const details = w.memo ?? "";

        await tx.spot.upsert({
          where: { id: spotId },
          update: { name, latitude: lat, longitude: lng },
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
            details: details,
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
                uploaderId: user.id,
                routeNodeId: node.id
              }
            });
          }
        }

        waypointOrderPairs.push({ waypointId: w.id, nodeId: node.id });
      }

      // 3) RouteSegment と SegmentStep を作成
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

        const fromIndexInItems = items.findIndex((it: any) => it.id === from.waypointId);
        const toIndexInItems = items.findIndex((it: any) => it.id === to.waypointId);
        const between = items.slice(
          Math.min(fromIndexInItems, toIndexInItems) + 1,
          Math.max(fromIndexInItems, toIndexInItems)
        );
        const firstTrans = between.find((it: any) => it.type === "transportation");

        if (firstTrans && firstTrans.method) {
          const mode = mapMethodToTransportMode(firstTrans.method);
          await tx.segmentStep.create({
            data: {
              segmentId: segment.id,
              order: 0,
              mode,
              details: firstTrans.memo ?? "",
            },
          });
        }
      }

      return { routeId: route.id };
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
