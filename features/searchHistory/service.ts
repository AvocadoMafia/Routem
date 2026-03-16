import { getMeilisearch, getPrisma } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";

export const searchHistoryService = {
  save: async (userId: string | null, q: string) => {
    const prisma = getPrisma();
    if (!q || !q.trim()) return { id: null };

    const query = q.trim();
    let [queryEn] = await translateJa2En([query]);
    if (!queryEn || queryEn === query) {
      // allow same string; keep as is
      queryEn = query;
    }

    // Ensure table exists (idempotent)
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "SearchHistory" (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  "createdAt" timestamp with time zone DEFAULT now(),\n  query text NOT NULL,\n  "queryEn" text,\n  "userId" uuid\n)'
    );

    // Insert row
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string; createdAt: Date }>>(
      'INSERT INTO "SearchHistory" (query, "queryEn", "userId") VALUES ($1, $2, $3) RETURNING id, "createdAt"',
      query,
      queryEn,
      userId
    );

    const id = rows?.[0]?.id;

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
          createdAt: rows?.[0]?.createdAt?.getTime?.() || Date.now(),
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
      const rows = await prisma.$queryRawUnsafe<Array<{ query: string; queryEn: string | null }>>(
        'SELECT query, "queryEn" FROM "SearchHistory" WHERE query ILIKE $1 OR "queryEn" ILIKE $1 ORDER BY "createdAt" DESC LIMIT $2',
        `%${query}%`,
        limit
      );
      const list = rows.flatMap((r) => [r.query, r.queryEn || ""]).filter(Boolean) as string[];
      return Array.from(new Set(list)).slice(0, limit);
    } catch (e) {
      console.error("db suggest error", e);
      return [];
    }
  },
};
