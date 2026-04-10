import { GetRoutesExploreSchema } from "@/features/routes/explore/schema";
import { routesExploreService } from "@/features/routes/explore/service";
import { createClient } from "@/lib/auth/supabase/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { validateParams } from "@/lib/server/validateParams";
import { NextRequest, NextResponse } from "next/server";

// 最近作成されたルートを一覧返却します
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error("auth error");
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
