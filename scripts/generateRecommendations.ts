import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createClient } from "redis";

async function main() {
    // データベース接続設定 (lib/config/server.ts のロジックを抽出)
    const dbType = process.env.DB_TYPE || "local";
    const connectionString = dbType === "vercel" 
        ? process.env.VERCEL_DATABASE_URL 
        : process.env.LOCAL_DATABASE_URL;

    if (!connectionString) {
        throw new Error(`Database connection string for type '${dbType}' is not defined.`);
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    // Redis設定
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const redis = createClient({
        url: redisUrl,
    });

    redis.on("error", (err) => console.error("Redis Client Error", err));
    await redis.connect();

    // データの取得
    const routes = await prisma.route.findMany({
        where: {
            visibility: "PUBLIC",
        },
        select: {
            id: true,
            likes: true,
            views: true,
            createdAt: true,
        },
    });

    const scored = routes.map((a: any) => {
        const recentBoost =
            Date.now() - a.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                ? 100
                : 0;

        return {
            id: a.id,
            score: a.likes.length * 3 + a.views.length + recentBoost,
        };
    });

    // スコア順にソート
    scored.sort((a, b) => b.score - a.score);

    // Redisへ保存
    await redis.set("recommend:global", JSON.stringify(scored));

    console.log("Generated recommendations:", scored.length);

    // 接続を閉じる
    await redis.quit();
    await prisma.$disconnect();
    await pool.end();
}

main().catch((err) => {
    console.error("Fatal Error:", err);
    process.exit(1);
});