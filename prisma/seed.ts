import 'dotenv/config';
import {
    PrismaClient,
    Prisma,
    ImageStatus,
    ImageType,
    LikeViewTarget,
    SpotSource,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { MeiliSearch } from "meilisearch";
import { createClient } from "@supabase/supabase-js";

import {
    allImages,
    allRoutes,
    allUsers,
    comments,
    commentLikes,
    follows,
    routeLikes,
    spots,
    tags,
    toUuid,
} from "./seedData";
import type { SeedRoute, SeedUser } from "./seedData";

// ---------------------------------------------------------------------------
// 初期化
// ---------------------------------------------------------------------------

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not defined.");
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const meilisearch = new MeiliSearch({
    host: process.env.MEILISEARCH_URL || "http://127.0.0.1:7700",
    apiKey: process.env.MEILISEARCH_APIKEY || "my_master_key",
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Meilisearch 用 include / 翻訳ヘルパ（旧 seed.ts から踏襲）
// ---------------------------------------------------------------------------

const ROUTE_INCLUDE = {
    author: { select: { id: true, name: true, icon: true } },
    thumbnail: true,
    routeDates: {
        include: {
            routeNodes: {
                include: { spot: true, transitSteps: true, images: true },
            },
        },
    },
    likes: true,
    views: true,
    collaborators: true,
    budget: true,
    tags: true,
} as const;

type RouteWithRelations = Prisma.RouteGetPayload<{ include: typeof ROUTE_INCLUDE }>;

async function translateJa2En(jaTexts: string[]): Promise<string[]> {
    if (!jaTexts || jaTexts.length === 0) return [];
    const url = process.env.LIBRETRANSLATE_URL;
    if (!url) return jaTexts;
    try {
        const translateUrl = url.endsWith('/') ? `${url}translate` : `${url}/translate`;
        const res = await fetch(translateUrl, {
            method: "POST",
            body: JSON.stringify({ q: jaTexts, source: "ja", target: "en" }),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return jaTexts;
        const data: any = await res.json();
        return data.translatedText || jaTexts;
    } catch {
        return jaTexts;
    }
}

// 既存メールが auth に登録済みなら既存 ID を返し、なければ作成して返す。
async function ensureAuthUser(email: string, password: string, name: string): Promise<string> {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existing = existingUsers?.users.find((u) => u.email === email);
    if (existing) return existing.id;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
    });
    if (error) throw new Error(`Failed to create auth user ${email}: ${error.message}`);
    return data.user.id;
}

// 軽量ハッシュ：View の決定論的ユーザー選択用。crypto を 100k 回呼ばないため自前で実装。
function hashString(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
    }
    return h >>> 0;
}

// ---------------------------------------------------------------------------
// メイン
// ---------------------------------------------------------------------------

async function main() {
    console.log('🌱 シード開始');

    // -----------------------------------------------------------------------
    // 0. 旧シード（dummy 5 ユーザー＋ 40 ルート）を掃除
    //    新シードへ移行した後の再実行でも安全に走らせるための互換処理。
    // -----------------------------------------------------------------------
    const OLD_USER_IDS = [
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000005',
    ];
    await prisma.route.deleteMany({ where: { authorId: { in: OLD_USER_IDS } } });
    await prisma.user.deleteMany({ where: { id: { in: OLD_USER_IDS } } });

    // -----------------------------------------------------------------------
    // 1. Tag (25)
    // -----------------------------------------------------------------------
    console.log(`🏷️  タグ ${tags.length} 件を投入中...`);
    const tagKeyToName = new Map<string, string>();
    for (const tag of tags) {
        tagKeyToName.set(tag.key, tag.name);
        await prisma.tag.upsert({
            where: { name: tag.name },
            create: { name: tag.name },
            update: {},
        });
    }

    // -----------------------------------------------------------------------
    // 2. Spot (約 129)
    // -----------------------------------------------------------------------
    console.log(`📍 スポット ${spots.length} 件を投入中...`);
    const spotKeyToId = new Map<string, string>();
    for (const spot of spots) {
        const id = toUuid('spot', spot.key);
        spotKeyToId.set(spot.key, id);
        const data = {
            id,
            name: spot.name,
            latitude: spot.latitude,
            longitude: spot.longitude,
            source: SpotSource.USER,
            sourceId: null,
        };
        await prisma.spot.upsert({
            where: { id },
            create: data,
            update: { name: data.name, latitude: data.latitude, longitude: data.longitude },
        });
    }

    // -----------------------------------------------------------------------
    // 3. User: Supabase Auth 作成 → Prisma User upsert
    //    icon/background は後段でリレーションを張るので、ここでは付与しない。
    // -----------------------------------------------------------------------
    console.log(`👤 ユーザー ${allUsers.length} 件を Auth + Prisma に投入中...`);
    const userKeyToId = new Map<string, string>();
    for (const user of allUsers) {
        const authId = await ensureAuthUser(user.email, user.password, user.name);
        userKeyToId.set(user.key, authId);
        await prisma.user.upsert({
            where: { id: authId },
            create: {
                id: authId,
                name: user.name,
                age: user.age,
                bio: user.bio,
                locale: user.locale,
                language: user.language,
            },
            update: {
                name: user.name,
                age: user.age,
                bio: user.bio,
                locale: user.locale,
                language: user.language,
            },
        });
    }

    // -----------------------------------------------------------------------
    // 4. Route + RouteDate + RouteNode + TransitStep + Budget (約 250)
    //    画像は後段で routeNodeId / routeThumbId を直接 set して紐付ける。
    // -----------------------------------------------------------------------
    console.log(`🗺️  ルート ${allRoutes.length} 件を投入中...`);
    let routeIdx = 0;
    for (const route of allRoutes) {
        routeIdx++;
        await upsertRouteWithRelations(route, userKeyToId, spotKeyToId, tagKeyToName);
        if (routeIdx % 25 === 0) {
            console.log(`  ... ${routeIdx}/${allRoutes.length}`);
        }
    }

    // -----------------------------------------------------------------------
    // 5. Image (per-usage 行を一括 createMany)
    //    Image の userIconId / userBackgroundId / routeThumbId は @unique で、
    //    routeNodeId は Image 側 1 列のため、共有プール key をそのまま id にすると
    //    関連付けが上書きされる。本シードでは「使われた箇所ごとに 1 行」生成して
    //    プールの url を再利用する形で 1:N の論理的共有を実現する。
    // -----------------------------------------------------------------------
    console.log('🖼️  画像レコード生成中...');
    const imageKeyToUrl = new Map<string, string>();
    const imageKeyToType = new Map<string, ImageType>();
    for (const img of allImages) {
        imageKeyToUrl.set(img.key, img.url);
        imageKeyToType.set(img.key, img.type);
    }
    const imageRows = buildAllImageRows({
        userKeyToId,
        imageKeyToUrl,
        imageKeyToType,
    });
    const imageCreated = await batchCreateMany(
        (chunk) => prisma.image.createMany({ data: chunk, skipDuplicates: true }),
        imageRows,
        500,
    );
    console.log(`  → Image ${imageCreated} 件 (per-usage 行)`);

    // -----------------------------------------------------------------------
    // 6. Follow (約 226)
    // -----------------------------------------------------------------------
    console.log(`👥 フォロー ${follows.length} 件を投入中...`);
    const followRows: Prisma.FollowCreateManyInput[] = [];
    for (const f of follows) {
        const followerId = userKeyToId.get(f.followerKey);
        const followingId = userKeyToId.get(f.followingKey);
        if (!followerId || !followingId) continue;
        followRows.push({
            id: toUuid('follow', `${f.followerKey}>${f.followingKey}`),
            followerId,
            followingId,
        });
    }
    await batchCreateMany(
        (chunk) => prisma.follow.createMany({ data: chunk, skipDuplicates: true }),
        followRows,
        500,
    );

    // -----------------------------------------------------------------------
    // 7. Like (target = ROUTE) (約 2,375)
    // -----------------------------------------------------------------------
    console.log(`❤️  ルートいいね ${routeLikes.length} 件を投入中...`);
    const routeLikeRows: Prisma.LikeCreateManyInput[] = [];
    for (const like of routeLikes) {
        if (!('routeKey' in like) || !like.routeKey) continue;
        const userId = userKeyToId.get(like.userKey);
        if (!userId) continue;
        routeLikeRows.push({
            id: toUuid('likeRoute', `${like.userKey}@${like.routeKey}`),
            userId,
            routeId: toUuid('route', like.routeKey),
            target: LikeViewTarget.ROUTE,
        });
    }
    await batchCreateMany(
        (chunk) => prisma.like.createMany({ data: chunk, skipDuplicates: true }),
        routeLikeRows,
        1000,
    );

    // -----------------------------------------------------------------------
    // 8. Comment (約 438)
    // -----------------------------------------------------------------------
    console.log(`💬 コメント ${comments.length} 件を投入中...`);
    const commentRows: Prisma.CommentCreateManyInput[] = [];
    for (const c of comments) {
        const userId = userKeyToId.get(c.authorKey);
        if (!userId) continue;
        commentRows.push({
            id: toUuid('comment', c.key),
            text: c.text,
            createdAt: new Date(c.createdAt),
            userId,
            routeId: toUuid('route', c.routeKey),
        });
    }
    await batchCreateMany(
        (chunk) => prisma.comment.createMany({ data: chunk, skipDuplicates: true }),
        commentRows,
        500,
    );

    // -----------------------------------------------------------------------
    // 9. Like (target = COMMENT) (約 127)
    // -----------------------------------------------------------------------
    console.log(`💖 コメントいいね ${commentLikes.length} 件を投入中...`);
    const commentLikeRows: Prisma.LikeCreateManyInput[] = [];
    for (const like of commentLikes) {
        if (!('commentKey' in like) || !like.commentKey) continue;
        const userId = userKeyToId.get(like.userKey);
        if (!userId) continue;
        commentLikeRows.push({
            id: toUuid('likeComment', `${like.userKey}@${like.commentKey}`),
            userId,
            commentId: toUuid('comment', like.commentKey),
            target: LikeViewTarget.COMMENT,
        });
    }
    await batchCreateMany(
        (chunk) => prisma.like.createMany({ data: chunk, skipDuplicates: true }),
        commentLikeRows,
        1000,
    );

    // -----------------------------------------------------------------------
    // 10. View (各ルート最大 1,000 件、半数を匿名)
    // -----------------------------------------------------------------------
    console.log('👀 閲覧履歴を投入中...');
    const allUserIds = Array.from(userKeyToId.values());
    const totalViews = await insertViews(allRoutes, allUserIds);
    console.log(`  → 合計 ${totalViews} 件の View を投入`);

    // -----------------------------------------------------------------------
    // 11. Meilisearch 同期
    // -----------------------------------------------------------------------
    console.log('🔍 Meilisearch にルートを同期中...');
    await syncAllRoutesToMeilisearch();

    console.log('✅ シード完了');
    console.log(`  Tag: ${tags.length}, Spot: ${spots.length}, User: ${allUsers.length}, ` +
        `Route: ${allRoutes.length}, Follow: ${followRows.length}, ` +
        `RouteLike: ${routeLikeRows.length}, Comment: ${commentRows.length}, ` +
        `CommentLike: ${commentLikeRows.length}, View: ${totalViews}, Image: ${imageCreated}`);
}

// ---------------------------------------------------------------------------
// Route の入れ子 upsert
// ---------------------------------------------------------------------------

async function upsertRouteWithRelations(
    route: SeedRoute,
    userKeyToId: Map<string, string>,
    spotKeyToId: Map<string, string>,
    tagKeyToName: Map<string, string>,
): Promise<void> {
    const routeId = toUuid('route', route.key);
    const authorId = userKeyToId.get(route.authorKey);
    if (!authorId) throw new Error(`Unknown authorKey: ${route.authorKey} (route ${route.key})`);

    const tagConnect = route.tagKeys
        .map((k) => tagKeyToName.get(k))
        .filter((n): n is string => Boolean(n))
        .map((name) => ({ name }));

    // Route 本体の create / update データ
    const routeData = {
        id: routeId,
        title: route.title,
        description: route.description,
        date: new Date(route.date),
        createdAt: new Date(route.createdAt),
        language: route.language,
        authorId,
        visibility: route.visibility,
        routeFor: route.routeFor,
        collaboratorPolicy: route.collaboratorPolicy,
    } satisfies Prisma.RouteUncheckedCreateInput;

    await prisma.route.upsert({
        where: { id: routeId },
        create: {
            ...routeData,
            tags: tagConnect.length > 0 ? { connect: tagConnect } : undefined,
        },
        update: {
            title: routeData.title,
            description: routeData.description,
            date: routeData.date,
            createdAt: routeData.createdAt,
            language: routeData.language,
            visibility: routeData.visibility,
            routeFor: routeData.routeFor,
            collaboratorPolicy: routeData.collaboratorPolicy,
            tags: { set: tagConnect },
        },
    });

    // Budget
    if (route.budget) {
        await prisma.budget.upsert({
            where: { routeId },
            create: {
                routeId,
                amount: route.budget.amount,
                localCurrencyCode: route.budget.currency,
            },
            update: {
                amount: route.budget.amount,
                localCurrencyCode: route.budget.currency,
            },
        });
    } else {
        // 予算 null のルートは Budget レコードを残さない（再実行で消す）
        await prisma.budget.deleteMany({ where: { routeId } });
    }

    // RouteDate / RouteNode / TransitStep
    for (const rd of route.routeDates) {
        const routeDateId = toUuid('routeDate', `${route.key}:${rd.day}`);
        await prisma.routeDate.upsert({
            where: { id: routeDateId },
            create: { id: routeDateId, day: rd.day, routeId },
            update: { day: rd.day },
        });

        for (const node of rd.nodes) {
            const nodeId = toUuid('routeNode', `${route.key}:${rd.day}:${node.order}`);
            const spotId = spotKeyToId.get(node.spotKey);
            if (!spotId) {
                throw new Error(
                    `Unknown spotKey: ${node.spotKey} (route ${route.key} day ${rd.day} order ${node.order})`,
                );
            }
            await prisma.routeNode.upsert({
                where: { id: nodeId },
                create: {
                    id: nodeId,
                    order: node.order,
                    details: node.details,
                    routeDateId,
                    spotId,
                },
                update: {
                    order: node.order,
                    details: node.details,
                    spotId,
                },
            });

            for (const step of node.transitSteps) {
                const stepId = toUuid(
                    'transitStep',
                    `${route.key}:${rd.day}:${node.order}:${step.order}`,
                );
                await prisma.transitStep.upsert({
                    where: { id: stepId },
                    create: {
                        id: stepId,
                        mode: step.mode,
                        duration: step.duration,
                        distance: step.distance,
                        memo: step.memo,
                        order: step.order,
                        routeNodeId: nodeId,
                    },
                    update: {
                        mode: step.mode,
                        duration: step.duration,
                        distance: step.distance,
                        memo: step.memo,
                        order: step.order,
                    },
                });
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Image 行構築
// ---------------------------------------------------------------------------

function buildAllImageRows(args: {
    userKeyToId: Map<string, string>;
    imageKeyToUrl: Map<string, string>;
    imageKeyToType: Map<string, ImageType>;
}): Prisma.ImageCreateManyInput[] {
    const { userKeyToId, imageKeyToUrl, imageKeyToType } = args;
    const rows: Prisma.ImageCreateManyInput[] = [];

    const lookup = (poolKey: string): { url: string; type: ImageType } => {
        const url = imageKeyToUrl.get(poolKey);
        const type = imageKeyToType.get(poolKey);
        if (!url || !type) throw new Error(`Unknown image pool key: ${poolKey}`);
        return { url, type };
    };

    // ユーザーアイコン / 背景
    for (const user of allUsers) {
        const userId = userKeyToId.get(user.key);
        if (!userId) continue;
        if (user.iconKey) {
            const { url } = lookup(user.iconKey);
            rows.push({
                id: toUuid('image', `icon:${user.key}`),
                url,
                type: ImageType.USER_ICON,
                status: ImageStatus.EXTERNAL,
                userIconId: userId,
            });
        }
        if (user.backgroundKey) {
            const { url } = lookup(user.backgroundKey);
            rows.push({
                id: toUuid('image', `bg:${user.key}`),
                url,
                type: ImageType.USER_BG,
                status: ImageStatus.EXTERNAL,
                userBackgroundId: userId,
            });
        }
    }

    // ルートサムネ + ノード画像
    for (const route of allRoutes) {
        const routeId = toUuid('route', route.key);
        if (route.thumbnailKey) {
            const { url } = lookup(route.thumbnailKey);
            rows.push({
                id: toUuid('image', `thumb:${route.key}`),
                url,
                type: ImageType.ROUTE_THUMBNAIL,
                status: ImageStatus.EXTERNAL,
                routeThumbId: routeId,
            });
        }

        for (const rd of route.routeDates) {
            for (const node of rd.nodes) {
                const nodeId = toUuid('routeNode', `${route.key}:${rd.day}:${node.order}`);
                for (const imgKey of node.imageKeys) {
                    const { url } = lookup(imgKey);
                    rows.push({
                        id: toUuid(
                            'image',
                            `node:${route.key}:${rd.day}:${node.order}:${imgKey}`,
                        ),
                        url,
                        type: ImageType.NODE_IMAGE,
                        status: ImageStatus.EXTERNAL,
                        routeNodeId: nodeId,
                    });
                }
            }
        }
    }

    return rows;
}

// ---------------------------------------------------------------------------
// View 投入：各ルート targetViews を 1000 に丸めて batch insert
// ---------------------------------------------------------------------------

const VIEW_CAP_PER_ROUTE = 1000;
const VIEW_BATCH_SIZE = 1000;

async function insertViews(routes: SeedRoute[], allUserIds: string[]): Promise<number> {
    let total = 0;
    let batch: Prisma.ViewCreateManyInput[] = [];

    const flush = async () => {
        if (batch.length === 0) return;
        await prisma.view.createMany({ data: batch, skipDuplicates: true });
        total += batch.length;
        batch = [];
    };

    for (const route of routes) {
        const cap = Math.min(route.targetViews ?? 0, VIEW_CAP_PER_ROUTE);
        if (cap === 0) continue;
        const routeId = toUuid('route', route.key);

        for (let i = 0; i < cap; i++) {
            const seedKey = `${route.key}#${i}`;
            // 仕様書 §8.3: 半数を匿名 (userId = null) にする
            const anonymous = i % 2 === 0;
            let userId: string | null = null;
            if (!anonymous && allUserIds.length > 0) {
                const idx = hashString(seedKey) % allUserIds.length;
                userId = allUserIds[idx];
            }
            batch.push({
                id: toUuid('view', seedKey),
                routeId,
                userId,
                target: LikeViewTarget.ROUTE,
            });
            if (batch.length >= VIEW_BATCH_SIZE) {
                await flush();
            }
        }
    }
    await flush();
    return total;
}

// ---------------------------------------------------------------------------
// 汎用 batch createMany
// ---------------------------------------------------------------------------

async function batchCreateMany<T>(
    fn: (chunk: T[]) => Promise<{ count: number }>,
    rows: T[],
    chunkSize: number,
): Promise<number> {
    let inserted = 0;
    for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const res = await fn(chunk);
        inserted += res.count;
    }
    return inserted;
}

// ---------------------------------------------------------------------------
// Meilisearch 一括同期（routes + tags インデックス）
// ---------------------------------------------------------------------------

async function syncAllRoutesToMeilisearch() {
    const exchangeRates = await prisma.exchangeRates.findMany();
    const routes = await prisma.route.findMany({ include: ROUTE_INCLUDE });

    const tagDocSet = new Map<string, { id: string; name: string }>();
    const documents: Record<string, unknown>[] = [];

    for (const route of routes as RouteWithRelations[]) {
        const allNodes = route.routeDates.flatMap((rd) => rd.routeNodes);
        const enTexts = (await translateJa2En([
            route.title,
            route.description,
            ...allNodes.map((n) => n.spot?.name ?? ''),
            ...route.tags.map((t) => t.name),
        ])).filter(Boolean);

        const rateToUsd = exchangeRates.find(
            (r) => r.currencyCode === route.budget?.localCurrencyCode,
        )?.rateToUsd;
        const budgetInUsd =
            route.budget?.amount && rateToUsd ? route.budget.amount * rateToUsd : undefined;

        documents.push({
            id: route.id,
            title: route.title,
            description: route.description,
            authorId: route.authorId,
            visibility: route.visibility,
            createdAt: route.createdAt?.getTime(),
            updatedAt: route.updatedAt?.getTime(),
            spotNames: allNodes.map((n) => n.spot?.name).filter(Boolean),
            tags: route.tags.map((t) => t.name),
            month: route.date ? [route.date.getMonth() + 1] : undefined,
            days: route.routeDates.length > 0 ? route.routeDates.length : undefined,
            routeFor: route.routeFor,
            language: route.language,
            budgetInLocalCurrency: route.budget?.amount,
            localCurrencyCode: route.budget?.localCurrencyCode,
            budgetInUsd,
            _geo: {
                lat: allNodes[0]?.spot?.latitude ?? undefined,
                lng: allNodes[0]?.spot?.longitude ?? undefined,
            },
            searchText: [
                route.title,
                route.description,
                ...allNodes.map((n) => n.spot?.name).filter(Boolean),
                ...route.tags.map((t) => t.name),
                ...enTexts,
            ].join(" "),
        });

        for (const t of route.tags) {
            tagDocSet.set(t.name, { id: t.name, name: t.name });
        }
    }

    try {
        await meilisearch.index("routes").updateDocuments(documents, { primaryKey: "id" });
        if (tagDocSet.size > 0) {
            await meilisearch.index("tags").addDocuments(Array.from(tagDocSet.values()), {
                primaryKey: "id",
            });
        }
    } catch (err) {
        console.warn(`  Meilisearch sync skipped: ${(err as Error).message}`);
    }
}

// ---------------------------------------------------------------------------
// 実行
// ---------------------------------------------------------------------------

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });

// SeedUser 型は将来的な拡張で参照する可能性があるため再エクスポート（型のみ）
export type { SeedUser };
