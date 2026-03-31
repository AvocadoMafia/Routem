import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { z } from "zod";
import { usersService } from "@/features/users/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetFollowsQuerySchema } from "@/features/users/schema";

const FollowToggleSchema = z.object({
  followingId: z.string().uuid(),
});

// GET /api/v1/follows
// Query: type=following|follower&userId=uuid&take=int&cursor=string
// Return Follow records (with target user info)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetFollowsQuerySchema, searchParams);

    const targetUserId = parsed.userId ?? user.id;

    const result = await usersService.getFollowRecords(targetUserId, {
      type: parsed.type as "following" | "follower",
      // 自分が見る場合は、相手の情報を常に含める
      // followingならfollowingを、followerならfollowerを含める
      include: {
        following: parsed.type === "following",
        follower: parsed.type === "follower",
      },
      take: parsed.take ?? 30,
      cursor: parsed.cursor,
    });

    return NextResponse.json({
      items: result.items.map((f: any) => ({
        id: f.id,
        createdAt: f.createdAt,
        // typeに応じて適切な方を返却する（クライアント側で扱いやすくするため）
        // 自分がフォローしている人なら target=following
        // 自分をフォローしている人なら target=follower
        target: parsed.type === "following" ? f.following : f.follower,
      })),
      nextCursor: result.nextCursor,
    }, { status: 200 });
  });
}

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
