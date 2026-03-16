import { getPrisma } from "@/lib/config/server";

export const searchHistoryRepository = {
  create: async (userId: string | null, query: string, queryEn: string | null) => {
    const prisma = getPrisma();
    // Ensure table exists (raw SQL for minimal migration impact)
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "SearchHistory" (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  "createdAt" timestamp with time zone DEFAULT now(),\n  query text NOT NULL,\n  "queryEn" text,\n  "userId" uuid\n)'
    );
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      'INSERT INTO "SearchHistory" (query, "queryEn", "userId") VALUES ($1, $2, $3) RETURNING id',
      query,
      queryEn,
      userId
    );
    return { id: rows?.[0]?.id } as const;
  },

  latestByPrefix: async (q: string, limit: number = 5) => {
    const prisma = getPrisma();
    return prisma.$queryRawUnsafe<Array<{ query: string; queryEn: string | null }>>(
      'SELECT query, "queryEn" FROM "SearchHistory" WHERE query ILIKE $1 OR "queryEn" ILIKE $1 ORDER BY "createdAt" DESC LIMIT $2',
      `%${q}%`,
      limit
    );
  },
};
