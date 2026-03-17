import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { z } from "zod";
import { usersService } from "@/features/users/service";

const FollowToggleSchema = z.object({
  followingId: z.string().uuid(),
});

// POST /api/v1/follows
// Toggle follow a user (author). Requires authenticated user.
export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const parsed = FollowToggleSchema.parse(body);

    const result = await usersService.toggleFollow(parsed.followingId, user.id);

    return NextResponse.json({
      followed: result.followed,
      follower_count: result.followerCount
    }, { status: 200 });
  });
}
