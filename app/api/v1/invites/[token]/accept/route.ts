import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { routesService } from "@/features/routes/service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const resolvedParams = await params;
    const routeId = await routesService.acceptInvite(resolvedParams.token, user.id);

    return NextResponse.json({ routeId }, { status: 200 });
  });
}
