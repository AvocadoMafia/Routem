import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { likesService } from "@/features/likes/service";

// GET /api/v1/me/likes
// Return routes liked by current user (lightweight fields)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const routes = await likesService.getLikedRoutes(user.id);

    return NextResponse.json(routes, { status: 200 });
  });
}
