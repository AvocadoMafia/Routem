import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { validateParams } from "@/lib/server/validateParams";
import { CreateLikeSchema } from "@/features/likes/schema";
import { likesService } from "@/features/likes/service";

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
