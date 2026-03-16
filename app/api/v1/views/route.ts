import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { z } from "zod";
import { getPrisma } from "@/lib/config/server";
import { LikeViewTarget } from "@prisma/client";

const ViewSchema = z.object({
  routeId: z.string().uuid(),
  ts: z.number().optional(),
});

// POST /api/v1/views
// Record a view for a route by the current user. Requires authentication.
export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const parsed = ViewSchema.parse(body);

    const prisma = getPrisma();

    await prisma.view.create({
      data: {
        target: LikeViewTarget.ROUTE,
        routeId: parsed.routeId,
        userId: user.id,
        // createdAt uses default now(); ts could be used if provided, but we trust server time
      },
    });

    const view_count = await prisma.view.count({ where: { routeId: parsed.routeId } });

    return NextResponse.json({ ok: true, view_count }, { status: 200 });
  });
}
