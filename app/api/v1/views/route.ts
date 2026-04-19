import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/api/server";
import { createClient } from "@/lib/auth/supabase-server";
import { z } from "zod";
import { viewsService } from "@/features/views/service";
import { validateParams } from "@/lib/api/server";
import { GetViewsQuerySchema } from "@/features/views/schema";

const ViewSchema = z.object({
  routeId: z.string().uuid(),
  ts: z.number().optional(),
});

// GET /api/v1/views
// Query: route=bool&user=bool&take=int&cursor=string
// Returns current user's view records with optional includes
// Response: { items: ViewRecord[], nextCursor: string | null }
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetViewsQuerySchema, searchParams);

    const result = await viewsService.getViews(user.id, {
      include: { route: !!parsed.route, user: !!parsed.user },
      take: parsed.take ?? 30,
      cursor: parsed.cursor,
    });

    return NextResponse.json(result, { status: 200 });
  });
}

// POST /api/v1/views
// Record a view for a route by the current user. Requires authentication.
export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const parsed = ViewSchema.parse(body);

    const view_count = await viewsService.recordView(parsed.routeId, user.id);

    return NextResponse.json({ ok: true, view_count }, { status: 200 });
  });
}
