import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/api/server";
import { routesService } from "@/features/routes/service";
import { createClient } from "@/lib/auth/supabase-server";
import { validateParams } from "@/lib/api/server";
import { RouteIdParamSchema } from "@/features/routes/schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await handleRequest(async () => {
    const { id } = await params;
    // UUID バリデーション: 不正な id で Prisma まで落ちる前に 400 VALIDATION_ERROR で止める
    const validated = await validateParams(RouteIdParamSchema, { id });

    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const token = await routesService.generateInvite(validated.id, user.id);

    return NextResponse.json({ token }, { status: 201 });
  });
}
