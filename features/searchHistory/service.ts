import { getMeilisearch, getPrisma } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";

export const searchHistoryService = {
  save: async (userId: string | null, q: string) => {
    const prisma = getPrisma();
    if (!q || !q.trim() || !userId) return { id: null };

    const query = q.trim();
    let [queryEn] = await translateJa2En([query]);
    if (!queryEn || queryEn === query) {
      // allow same string; keep as is
      queryEn = query;
    }

    // Insert row
    // ログイン済みユーザーのみ保存するため、userIdは必ず存在する
    const result = await prisma.searchHistory.upsert({
      where: { userId_query: { query, userId } },
      create: {
        query,
        userId,
      },
      update: {
        createdAt: new Date(),
      },
    });

    const id = result.id;

    // Index to Meilisearch
    try {
      const meili = getMeilisearch();
      const index = meili.index("search_queries");
      await index.updateSearchableAttributes(["query", "queryEn"]);
      await index.addDocuments([
        {
          id,
          query,
          queryEn,
          createdAt: result.createdAt.getTime(),
        },
      ]);
    } catch (e) {
      console.error("meilisearch index error", e);
    }

    return { id };
  },

  suggest: async (q: string, limit: number = 5): Promise<string[]> => {
    const query = (q || '').trim();
    if (!query) return [];

    // Try Meilisearch first
    try {
      const meili = getMeilisearch();
      const index = meili.index("search_queries");
      const res = await index.search(query, { limit });
      const items: string[] = [];
      for (const hit of res.hits as any[]) {
        if (hit.query) items.push(hit.query as string);
        else if (hit.queryEn) items.push(hit.queryEn as string);
      }
      if (items.length > 0) return Array.from(new Set(items)).slice(0, limit);
    } catch (e) {
      console.warn("meilisearch suggest fallback", e);
    }

    // Fallback to DB LIKE search
    try {
      const prisma = getPrisma();
      const rows = await prisma.searchHistory.findMany({
        where: {
          query: { contains: query, mode: "insensitive" },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });
      const list = rows.map((r) => r.query).filter(Boolean) as string[];
      return Array.from(new Set(list)).slice(0, limit);
    } catch (e) {
      console.error("db suggest error", e);
      return [];
    }
  },
};
