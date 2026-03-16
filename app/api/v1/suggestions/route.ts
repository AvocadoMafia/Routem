import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { searchHistoryService } from "@/features/searchHistory/service";

export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").toString();
    const limit = Number(url.searchParams.get("limit") || 5);

    const suggestions = await searchHistoryService.suggest(q, limit);
    return NextResponse.json({ suggestions }, { status: 200 });
  });
}
