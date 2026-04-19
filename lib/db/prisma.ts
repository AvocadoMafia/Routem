// Prisma クライアントのシングルトン getter。
// 旧 lib/config/server.ts から分離。HMR / multi-import で複数インスタンスが
// 生成されるのを防ぐため global にキャッシュする（Next.js dev で典型的な
// "too many connections" を回避）。

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient;
}

export function getPrisma() {
    if (globalThis.prisma) return globalThis.prisma;

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(`Database connection string is not defined.`);
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalThis.prisma = new PrismaClient({ adapter });

    return globalThis.prisma;
}
