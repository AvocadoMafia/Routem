import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { z } from "zod";
import { getPrisma } from "@/lib/config/server";

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

    if (parsed.followingId === user.id) {
      return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });
    }

    const prisma = getPrisma();

    // Check existing follow
    const existing = await prisma.follow.findUnique({
      where: {
        followingId_followerId: { followingId: parsed.followingId, followerId: user.id },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: { followingId_followerId: { followingId: parsed.followingId, followerId: user.id } },
      });
    } else {
      await prisma.follow.create({
        data: { followingId: parsed.followingId, followerId: user.id },
      });
    }

    const followed = !existing;

    const follower_count = await prisma.follow.count({ where: { followingId: parsed.followingId } });

    return NextResponse.json({ followed, follower_count }, { status: 200 });
  });
}
