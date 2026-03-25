import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { likesService } from "@/features/likes/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetLikesQuerySchema } from "@/features/likes/schema";

// GET /api/v1/me/likes
// Return like records for current user (including route data)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetLikesQuerySchema, searchParams);

    const items = await likesService.getLikes(user.id, {
      include: { route: true },
      take: parsed.take ?? 12,
      offset: parsed.offset ?? 0,
    });

    return NextResponse.json(items, { status: 200 });
  });
}
