import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { createClient } from "@/lib/auth/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await handleRequest(async () => {
    const { id } = await params;
    const supabase = await createClient(req);
    const { data: { user } } = await supabase.auth.getUser();

    const route = await routesService.getRouteDetail(id, user?.id ?? null);

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json(route);
  });
}
