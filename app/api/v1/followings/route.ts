import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { usersService } from "@/features/users/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetFollowingsQuerySchema } from "@/features/users/schema";

// GET /api/v1/followings
// Query: following=bool&follower=bool&take=int
// Return Follow records for the current user with optional includes
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetFollowingsQuerySchema, searchParams);

    const follows = await usersService.getFollowRecords(user.id, {
      include: { following: !!parsed.following, follower: !!parsed.follower },
      take: parsed.take ?? 30,
      offset: parsed.offset ?? 0,
    });

    // minimal base + requested relations
    return NextResponse.json(
      follows.map((f: any) => ({
        id: f.id,
        createdAt: f.createdAt,
        following: parsed.following ? f.following ?? null : undefined,
        follower: parsed.follower ? f.follower ?? null : undefined,
      })),
      { status: 200 }
    );
  });
}
