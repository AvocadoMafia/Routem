import { getMeilisearch } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { searchHistoryRepository } from "./repository";

export const searchHistoryService = {
  save: async (userId: string | null, q: string) => {
    try {
      if (!q || !q.trim() || !userId) return { id: null };

      const query = q.trim();

      // DB に保存（repositoryに分離）
      const result = await searchHistoryRepository.upsert(userId, query);

      const id = result.id;

      // Meilisearch 用に翻訳（Meilisearchでは英語での検索もサポートしたいため残す）
      let [queryEn] = await translateJa2En([query]);
      if (!queryEn || queryEn === query) {
        queryEn = query;
      }

      // Index to Meilisearch
      try {
        const meili = getMeilisearch();
        const index = meili.index("search_queries");
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
    } catch (e) {
      throw e;
    }
  },

  suggest: async (q: string, limit: number = 5): Promise<string[]> => {
    try {
      const query = (q || "").trim();
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

      // Fallback to DB explore
      try {
        const rows = await searchHistoryRepository.findByPrefix(query, limit);
        const list = rows.map((r) => r.query).filter(Boolean) as string[];
        return Array.from(new Set(list)).slice(0, limit);
      } catch (e) {
        console.error("db suggest error", e);
        return [];
      }
    } catch (e) {
      throw e;
    }
  },
};
