import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { viewsService } from "@/features/views/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetViewsQuerySchema } from "@/features/views/schema";

// GET /api/v1/me/views
// Return view records for current user (including route data)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetViewsQuerySchema, searchParams);

    const items = await viewsService.getViews(user.id, {
      include: { route: true },
      take: parsed.take ?? 12,
      offset: parsed.offset ?? 0,
    });

    return NextResponse.json(items, { status: 200 });
  });
}
