import { GetRoutesMeSchema } from "@/features/routes/me/schema";
import { routesMeService } from "@/features/routes/me/service";
import { createClient } from "@/lib/auth/supabase-server";
import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    // supabase からのエラー → セッションが正しく検証できない状態なので Unauthorized (401) 扱い。
    // handleError.ts の matchAuthError が message="Unauthorized" を 401 UNAUTHORIZED に変換する。
    if (error) throw new Error("Unauthorized");
    const user_id = user?.id;
    // user オブジェクトが取得できない (supabase が認証したがこの id に紐づく user がいない)。
    // matchAuthError が "Not Found" を 404 NOT_FOUND にマップする。
    if (!user_id) throw new Error("Not Found");
    const parsed_params = await validateParams(GetRoutesMeSchema, { userId: user_id });
    const data = await routesMeService.getRoutesMe(parsed_params);
    return NextResponse.json(data, { status: 200 });
  });
}
