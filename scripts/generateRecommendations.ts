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
        include: {
            likes: true,
            views: true,
            tags: true,
        },
    });

    const users = await prisma.user.findMany({
        include: {
            likes: true,
            followings: true,
        }
    });

    // 1. Global Recommendations (recommend:global)
    const globalScored = routes.map((a: any) => {
        const recentBoost =
            Date.now() - a.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                ? 100
                : 0;

        return {
            id: a.id,
            score: a.likes.length * 3 + a.views.length + recentBoost,
        };
    });
    globalScored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.id.localeCompare(a.id);
    });
    await redis.set("recommend:global", JSON.stringify(globalScored));

    // 2. User Recommendations (recommend:user:${userId})
    for (const user of users) {
        const userInterestedTagNames = new Set<string>();
        // ユーザーが「いいね」または「閲覧」した記事のタグを集める
        const likedRoutes = routes.filter(r => user.likes.some(l => l.routeId === r.id));
        const viewedRoutes = routes.filter(r => r.views.some(v => v.userId === user.id));
        
        likedRoutes.forEach(r => r.tags.forEach(t => userInterestedTagNames.add(t.name)));
        viewedRoutes.forEach(r => r.tags.forEach(t => userInterestedTagNames.add(t.name)));

        const userScored = routes
            .filter(r => r.authorId !== user.id) // 自分の記事は除外
            .map(r => {
                let score = 0;
                // タグが一致していたら加点
                r.tags.forEach(t => {
                    if (userInterestedTagNames.has(t.name)) score += 10;
                });
                // フォローしている人の記事なら加点
                if (user.followings.some(f => f.followingId === r.authorId)) {
                    score += 50;
                }
                // 基本スコア（いいね数など）も加味
                const baseScore = r.likes.length * 2 + r.views.length;
                
                // 最近の投稿へのブースト (Globalと同様)
                const recentBoost =
                    Date.now() - r.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                        ? 20
                        : 0;

                return { id: r.id, score: score + baseScore + recentBoost };
            })
            // スコアが0でも、新着記事などは含めるようにフィルタを緩めるか、
            // あるいは最低限グローバルなおすすめを混ぜる
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.id.localeCompare(a.id);
            })
            .slice(0, 100); // 上位100件を保持

        if (userScored.length > 0) {
            await redis.set(`recommend:user:${user.id}`, JSON.stringify(userScored));
        }
    }

    // 3. Followings Recommendations (recommend:followings:${userId})
    for (const user of users) {
        const followingIds = user.followings.map(f => f.followingId);
        const followingsScored = routes
            .filter(r => followingIds.includes(r.authorId))
            .map(r => {
                // 基本スコア（いいね数など）
                const baseScore = r.likes.length * 2 + r.views.length;
                
                // 最近の投稿へのブースト
                const recentBoost =
                    Date.now() - r.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                        ? 50
                        : 0;

                return { id: r.id, score: baseScore + recentBoost };
            })
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.id.localeCompare(a.id);
            });

        if (followingsScored.length > 0) {
            await redis.set(`recommend:followings:${user.id}`, JSON.stringify(followingsScored));
        } else {
            // フォローしている人がいない、または投稿がない場合はキーを削除（以前あった場合のため）
            await redis.del(`recommend:followings:${user.id}`);
        }
    }

    // 4. Related Routes (recommend:related:${routeId})
    for (const route of routes) {
        const currentTagNames = route.tags.map(t => t.name);
        const relatedScored = routes
            .filter(r => r.id !== route.id)
            .map(r => {
                let commonTags = 0;
                r.tags.forEach(t => {
                    if (currentTagNames.includes(t.name)) commonTags++;
                });
                
                // 関連度（共通タグ）を最優先にしつつ、基本スコアもわずかに加味して
                // 全くタグが被らなくても何かしら出るようにする
                const baseScore = r.likes.length * 0.1 + r.views.length * 0.01;
                
                return { id: r.id, score: commonTags * 100 + baseScore };
            })
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.id.localeCompare(a.id);
            })
            .slice(0, 50); // 上位50件

        if (relatedScored.length > 0) {
            await redis.set(`recommend:related:${route.id}`, JSON.stringify(relatedScored));
        }
    }

    console.log(`Generated recommendations for ${routes.length} routes and ${users.length} users.`);

    // 接続を閉じる
    await redis.quit();
    await prisma.$disconnect();
    await pool.end();
}

main().catch((err) => {
    console.error("Fatal Error:", err);
    process.exit(1);
});