import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetRoutesSchema } from "@/features/routes/schema";
import { createClient } from "@/lib/auth/supabase/server";
import { PostRouteSchema } from "@/features/routes/schema";
import { PatchRouteSchema } from "@/features/routes/schema";



// /api/v1/routes
// validationとauthenticationつまり処理に入る前段階の層

// 最近作成されたルートを一覧返却します
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    const safe_user = error ? null : user;
    const search_params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed_params = await validateParams(GetRoutesSchema, search_params);
    const data = await routesService.getRoutes(safe_user, parsed_params);
    return NextResponse.json(data, {status: 200});
  });
}


// POST /api/v1/routems
// ルート作成用のAPI。

export async function POST(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Unauthorized");
    }
    const body = await req.json();
    const parsed_body = await validateParams(PostRouteSchema, body);
    const result = await routesService.postRoute(parsed_body, user.id);
    return NextResponse.json(result, { status: 201 });
  });
}



export async function PATCH(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const {data:{user}, error} = await supabase.auth.getUser();
    if(!user || error){
        throw new Error("unauthorized")
    }
    const body = await req.json();
    const parsed_body = await validateParams(PatchRouteSchema, body);

    // 編集権限のチェック
    const hasPermission = await routesService.checkUpdatePermission(parsed_body.id, user.id);
    if (!hasPermission) {
      return NextResponse.json({ message: "Unauthorized or Forbidden" }, { status: 403 });
    }

    const result = await routesService.patchRoute(parsed_body, user.id);
    return NextResponse.json(result, { status: 200 });
  });
}
