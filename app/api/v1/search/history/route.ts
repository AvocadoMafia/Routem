import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { searchHistoryService } from "@/features/searchHistory/service";

export async function POST(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const q = (body?.q || "").toString();
    if (!q.trim()) {
      return NextResponse.json({ message: "q is required" }, { status: 400 });
    }

    const result = await searchHistoryService.save(user?.id || null, q);
    return NextResponse.json({ id: result.id }, { status: 201 });
  });
}
