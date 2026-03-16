import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { validateParams } from "@/lib/server/validateParams";
import { CreateLikeSchema } from "@/features/likes/schema";
import { likesService } from "@/features/likes/service";
import { getPrisma } from "@/lib/config/server";
import { LikeViewTarget } from "@prisma/client";

// POST /api/v1/likes
// Toggle like for route or comment. Requires authenticated user.
export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const parsed = await validateParams(CreateLikeSchema, body);

    await likesService.toggleLike(user.id, parsed.target, parsed.routeId, parsed.commentId);

    // Determine current liked state and like count after toggle
    const prisma = getPrisma();
    let liked = false;
    let like_count = 0;

    if (parsed.target === LikeViewTarget.ROUTE && parsed.routeId) {
      const existing = await prisma.like.findUnique({
        where: { userId_routeId: { userId: user.id, routeId: parsed.routeId } }
      });
      liked = !!existing;
      like_count = await prisma.like.count({ where: { routeId: parsed.routeId } });
    } else if (parsed.target === LikeViewTarget.COMMENT && parsed.commentId) {
      const existing = await prisma.like.findUnique({
        where: { userId_commentId: { userId: user.id, commentId: parsed.commentId } }
      });
      liked = !!existing;
      like_count = await prisma.like.count({ where: { commentId: parsed.commentId } });
    }

    return NextResponse.json({ liked, like_count }, { status: 200 });
  });
}
