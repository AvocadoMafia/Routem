import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { viewsService } from "@/features/views/service";

// GET /api/v1/me/views
// Return routes viewed by current user (lightweight fields)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const routes = await viewsService.getViewedRoutes(user.id);

    return NextResponse.json(routes, { status: 200 });
  });
}
