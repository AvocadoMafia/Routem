import { GetRoutesExploreSchema } from "@/features/routes/explore/schema";
import { routesExploreService } from "@/features/routes/explore/service";
import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";
import { NextRequest, NextResponse } from "next/server";

// 最近作成されたルートを一覧返却します
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const rawParams = Object.fromEntries(searchParams);
    const whenValues = searchParams.getAll("when");
    const parsed_params = await validateParams(GetRoutesExploreSchema, {
      ...rawParams,
      when: whenValues.length > 1 ? whenValues : searchParams.get("when") ?? undefined,
    });
    const data = await routesExploreService.getRoutesExplore(parsed_params);
    return NextResponse.json(data, { status: 200 });
  });
}
