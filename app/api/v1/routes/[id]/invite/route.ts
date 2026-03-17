import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesService } from "@/features/routes/service";
import { createClient } from "@/lib/auth/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await handleRequest(async () => {
    const { id } = await params;
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const token = await routesService.generateInvite(id, user.id);
    
    return NextResponse.json({ token }, { status: 201 });
  });
}
