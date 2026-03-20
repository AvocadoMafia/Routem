import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { getMeilisearch } from "@/lib/config/server";

export async function GET(req: NextRequest) {
    return handleRequest(async () => {
        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").toString();
        const limit = Number(url.searchParams.get("limit") || 10);

        const meilisearch = getMeilisearch();
        const index = meilisearch.index("tags");
        
        const result = await index.search(q, {
            limit: limit,
        });

        const suggestions = result.hits.map((hit: any) => hit.name);
        return NextResponse.json(suggestions, { status: 200 });
    });
}
