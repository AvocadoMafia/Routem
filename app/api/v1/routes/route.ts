import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/config/server";
import { Prisma, TransitMode, ImageType, ImageStatus, RouteVisibility } from "@prisma/client";
import { getMockUser } from "@/lib/mockAuth";
import { z } from "zod";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetRoutesSchema } from "@/features/routes/schema";
import { Transportation, Waypoint } from "@/lib/client/types";
import { createClient } from "@/lib/auth/supabase/server";
import { PostRouteSchema } from "@/features/routes/schema";

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

  return NextResponse.json({ routes }, { status: 200 });
}

// POST /api/v1/routems
// ルート作成用のAPI。
// TODO:近藤。この処理をservice.tsに移せ。あとバリデーションが散在しているから最初にbodyのバリデーション処理を設けたほうがいいかも
export async function POST(req: NextRequest) {
  try {
    // auth処理
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Unauthorized");
    }

    //リクエストbodyの取得
    const body = await req.json();
    if (!body || !Array.isArray(body.items)) {
      throw new Error("Invalid body: items[] is required");
    }

    //バリデーション処理
    const parsed = await validateParams(PostRouteSchema, body);

    // service層へ移行
    const result = await routesService.postRoute(parsed);

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
