import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { validateParams } from "@/lib/server/validateParams";
import { CreateLikeSchema, GetLikesQuerySchema } from "@/features/likes/schema";
import { likesService } from "@/features/likes/service";

// GET /api/v1/likes
// Query: route=bool&user=bool&comment=bool&take=int&cursor=string
// Returns the current user's like records with optional includes.
// Response: { items: LikeRecord[], nextCursor: string | null }
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const searchParams = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = await validateParams(GetLikesQuerySchema, searchParams);

    // If userId is provided in query, use it (for public profile), otherwise use current user
    const targetUserId = parsed.userId || user.id;

    const result = await likesService.getLikes(targetUserId, {
      include: { route: !!parsed.route, user: !!parsed.user, comment: !!parsed.comment },
      take: parsed.take ?? 30,
      cursor: parsed.cursor,
    });

    return NextResponse.json(result, { status: 200 });
  });
}

// POST /api/v1/likes
// Toggle like for route or comment. Requires authenticated user.
export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const parsed = await validateParams(CreateLikeSchema, body);

    const result = await likesService.toggleLike(user.id, parsed.target, parsed.routeId, parsed.commentId);

    return NextResponse.json({ liked: result.liked, like_count: result.likeCount }, { status: 200 });
  });
}
