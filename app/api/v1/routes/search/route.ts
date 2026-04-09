import { GetRoutesSearchSchema } from "@/features/routes/search/schema";
import { routesSearchService } from "@/features/routes/search/service";
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
    const search_params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed_params = await validateParams(GetRoutesSearchSchema, search_params);
    const data = await routesSearchService.getRoutesSearch(parsed_params);
    return NextResponse.json(data, { status: 200 });
  });
}
