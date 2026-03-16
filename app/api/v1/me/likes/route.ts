import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { getPrisma } from "@/lib/config/server";

// GET /api/v1/me/likes
// Return routes liked by current user (lightweight fields)
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const prisma = getPrisma();

    const likes = await prisma.like.findMany({
      where: { userId: user.id, routeId: { not: null } },
      orderBy: { createdAt: "desc" },
      include: {
        route: {
          select: {
            id: true,
            title: true,
            thumbnail: { select: { url: true } },
            author: { select: { id: true, name: true, icon: { select: { url: true } } } },
            category: { select: { id: true, name: true } },
            createdAt: true,
          }
        }
      }
    });

    const routes = likes
      .map(l => l.route)
      .filter((r): r is NonNullable<typeof r> => !!r);

    return NextResponse.json(routes, { status: 200 });
  });
}
