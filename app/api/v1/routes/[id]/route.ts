import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { createClient } from "@/lib/auth/supabase/server";
import { validateParams } from "@/lib/server/validateParams";
import { RouteIdParamSchema } from "@/features/routes/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await handleRequest(async () => {
    const { id } = await params;
    // UUID バリデーションを先に走らせる: 不正な id (例: "not-a-uuid") で
    // Prisma findUnique まで落ちて 500 を返していたのを 400 VALIDATION_ERROR に昇格
    const validated = await validateParams(RouteIdParamSchema, { id });

    const supabase = await createClient(req);
    const { data: { user } } = await supabase.auth.getUser();

    const route = await routesService.getRouteDetail(validated.id, user?.id ?? null);

    // 従来は `{ error: "Route not found" }` という独自 body 形式を返していたが、
    // 他の API と揃えて `{ code, message }` の ErrorScheme 形式に統一する。
    // "Not Found" を throw することで handleError.ts が 404 NOT_FOUND + 統一 body に変換する。
    if (!route) {
      throw new Error("Not Found");
    }

    return NextResponse.json(route);
  });
}
