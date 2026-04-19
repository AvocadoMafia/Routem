import { GetRoutesExploreSchema } from "@/features/routes/explore/schema";
import { routesExploreService } from "@/features/routes/explore/service";
import { createClient } from "@/lib/auth/supabase-server";
import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";
import { NextRequest, NextResponse } from "next/server";

// 最近作成されたルートを一覧返却します
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    // supabase.auth.getUser() のエラー → セッション検証失敗として Unauthorized (401) 扱い。
    // handleError.ts の matchAuthError が message="Unauthorized" を 401 にマップする。
    if (error) throw new Error("Unauthorized");
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
