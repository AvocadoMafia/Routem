import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { usersService } from "@/features/users/service";

// GET /api/v1/me/followings
// Return users that the current user is following (lightweight fields)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    // optional limit param
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 50) : undefined;

    const followings = await usersService.getFollowings(user.id, limit);

    return NextResponse.json(followings, { status: 200 });
  });
}
