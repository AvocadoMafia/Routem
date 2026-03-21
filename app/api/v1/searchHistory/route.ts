import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { searchHistoryService } from "@/features/searchHistory/service";
import {createClient} from "@/lib/auth/supabase/server";
import { clampLimit } from "@/lib/server/constants";

//ここだけsuggestionを文字列で返している。
export async function GET(req: NextRequest) {
    return handleRequest(async () => {
        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").toString();
        const rawLimit = Number(url.searchParams.get("limit") || 5);
        const limit = clampLimit(rawLimit, 5);

        const suggestions = await searchHistoryService.suggest(q, limit);
        return NextResponse.json(suggestions, { status: 200 });
    });
}


export async function POST(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        const body = await req.json();
        const q = (body?.q || "").toString();

        const result = await searchHistoryService.save(user?.id || null, q);
        return NextResponse.json({ id: result.id }, { status: 201 });
    });
}
