import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/api/server";
import { getMeilisearch } from "@/lib/services/meilisearch";
import { getPrisma } from "@/lib/db/prisma";
import { clampLimit } from "@/lib/utils/pagination";
import { RouteVisibility } from "@prisma/client";

export async function GET(req: NextRequest) {
    return handleRequest(async () => {
        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").toString();
        const type = url.searchParams.get("type");
        const rawLimit = Number(url.searchParams.get("limit") || 15);
        const limit = clampLimit(rawLimit, 15);

        // trending: 公開ルートが紐付いているタグを投稿数(desc)で返却
        if (type === "trending") {
            const tags = await getPrisma().tag.findMany({
                where: {
                    routes: { some: { visibility: RouteVisibility.PUBLIC } },
                },
                select: {
                    name: true,
                    _count: {
                        select: {
                            routes: { where: { visibility: RouteVisibility.PUBLIC } },
                        },
                    },
                },
                take: limit,
            });

            const items = tags
                .map((t) => ({ name: t.name, postCount: t._count.routes }))
                .sort((a, b) => {
                    if (b.postCount !== a.postCount) return b.postCount - a.postCount;
                    return a.name.localeCompare(b.name);
                })
                .slice(0, limit);

            return NextResponse.json(items, { status: 200 });
        }

        // 既存: Meilisearchによる候補サジェスト
        const meilisearch = getMeilisearch();
        const index = meilisearch.index("tags");

        const result = await index.search(q, {
            limit: limit,
        });

        const suggestions = result.hits.map((hit: any) => hit.name);
        return NextResponse.json(suggestions, { status: 200 });
    });
}
