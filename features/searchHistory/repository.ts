import { getPrisma } from "@/lib/config/server";

export const searchHistoryRepository = {
  /**
   * 検索履歴を保存（既存なら更新）
   */
  upsert: async (userId: string, query: string) => {
    try {
      const prisma = getPrisma();
      return prisma.searchHistory.upsert({
        where: {
          userId_query: { userId, query },
        },
        create: {
          userId,
          query,
        },
        update: {
          createdAt: new Date(),
        },
      });
    } catch (e) {
      throw e;
    }
  },

  /**
   * クエリの接頭辞で検索履歴を取得（サジェスト用）
   */
  findByPrefix: async (query: string, limit: number = 5) => {
    try {
      const prisma = getPrisma();
      return prisma.searchHistory.findMany({
        where: {
          query: {
            contains: query,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });
    } catch (e) {
      throw e;
    }
  },
};
