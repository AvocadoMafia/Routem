import 'dotenv/config';
import { PrismaClient, RouteVisibility, RouteFor, SpotSource, CurrencyCode, Locale, Language, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { MeiliSearch } from "meilisearch";
import { createClient } from "@supabase/supabase-js";

// --- lib/features に依存しないための定義の再録 ---

const ROUTE_INCLUDE = {
    author: {
        select: {
            id: true,
            name: true,
            icon: true,
        },
    },
    thumbnail: true,
    routeDates: {
        include: {
            routeNodes: {
                include: {
                    spot: true,
                    transitSteps: true,
                    images: true,
                },
            },
        },
    },
    likes: true,
    views: true,
    collaborators: true,
    budget: true,
    tags: true,
} as const;

type RouteWithRelations = Prisma.RouteGetPayload<{
    include: typeof ROUTE_INCLUDE;
}>;

async function translateJa2En(ja_texts: string[]): Promise<string[]> {
    if (!ja_texts || ja_texts.length === 0) return [];
    try {
        const url = process.env.LIBRETRANSLATE_URL!;
        if (!url) return ja_texts;
        const translateUrl = url.endsWith('/') ? `${url}translate` : `${url}/translate`;
        const res = await fetch(translateUrl, {
            method: "POST",
            body: JSON.stringify({
                q: ja_texts,
                source: "ja",
                target: "en",
            }),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return ja_texts;
        const data: any = await res.json();
        return data.translatedText || ja_texts;
    } catch (error) {
        return ja_texts;
    }
}

// --- 初期化 ---

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

// --- メイン処理 ---
// 既に同じメールのユーザーが存在する場合は既存のIDを返す
async function ensureAuthUser(email: string, password: string, name: string): Promise<string> {
    // まず既存ユーザーを検索
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users.find((u) => u.email === email);
    if (existing) {
        console.log(`  Auth user already exists: ${email} (${existing.id})`);
        return existing.id;
    }

    // 新規作成
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // メール確認済みにする
        user_metadata: { name },
    });

    if (error) throw new Error(`Failed to create auth user ${email}: ${error.message}`);
    console.log(`  Created auth user: ${email} (${data.user.id})`);
    return data.user.id;
}

async function main() {
    // 古いシードデータを削除（外部キー制約の順序に注意）
    console.log('Cleaning up old seed data...');
    const OLD_USER_IDS = [
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000005',
    ];
    // 古いユーザーが作成したルートを削除（Cascade で関連データも消える）
    await prisma.route.deleteMany({ where: { authorId: { in: OLD_USER_IDS } } });
    // 古いユーザーを削除
    await prisma.user.deleteMany({ where: { id: { in: OLD_USER_IDS } } });
    console.log('Old seed data cleaned up.');

    // Seed users
    // Supabase auth.users → Prisma public.users の順に作成
    // auth側で発行されたUUIDをそのまま使うことで整合性を保つ
    const seedUsers = [
        { name: 'lychee',  email: 'lychee@example.com',  password: 'password123', bio: 'Travel enthusiast from Kyoto.', locale: Locale.JA, language: Language.JA },
        { name: 'avocado', email: 'avocado@example.com', password: 'password123', bio: 'Nature lover and hiker.',       locale: Locale.EN, language: Language.EN },
        { name: 'mango',   email: 'mango@example.com',   password: 'password123', bio: 'Foodie exploring the world.',   locale: Locale.KO, language: Language.KO },
        { name: 'papaya',  email: 'papaya@example.com',  password: 'password123', bio: 'Culture seeker.',               locale: Locale.ZH, language: Language.ZH },
        { name: 'plum',    email: 'plum@example.com',    password: 'password123', bio: 'Adventure awaits!',             locale: Locale.JA, language: Language.EN },
    ];

    console.log('Creating auth users in Supabase...');
    const users: { id: string; name: string; bio: string; locale: Locale; language: Language }[] = [];
    for (const seed of seedUsers) {
        const authId = await ensureAuthUser(seed.email, seed.password, seed.name);
        users.push({ id: authId, name: seed.name, bio: seed.bio, locale: seed.locale, language: seed.language });
    }

    console.log('Syncing users to Prisma...');
    for (const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: { name: user.name, bio: user.bio, locale: user.locale, language: user.language },
            create: {
                id: user.id,
                name: user.name,
                bio: user.bio,
                locale: user.locale,
                language: user.language,
            }
        })
    }

    // Seed tags (base set)
    const tagNames = [
        'History', 'Nature', 'Culture', 'Food', 'Activity', 'General', 'Walk', 'Temple'
    ];

    const tags = [] as { id: string; name: string }[];
    for (const name of tagNames) {
        const tag = await prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        tags.push(tag);
    }

    // Seed Spots
    const spotsData = [
        { id: 'a1111111-1111-1111-1111-111111111111', name: 'Kiyomizu-dera', latitude: 34.9949, longitude: 135.7850, source: SpotSource.USER },
        { id: 'a2222222-2222-2222-2222-222222222222', name: 'Nara Park', latitude: 34.6851, longitude: 135.8430, source: SpotSource.USER },
        { id: 'a3333333-3333-3333-3333-333333333333', name: 'Dotonbori', latitude: 34.6687, longitude: 135.5013, source: SpotSource.USER },
        { id: 'a4444444-4444-4444-4444-444444444444', name: 'Shinjuku Gyoen', latitude: 35.6852, longitude: 139.7101, source: SpotSource.USER },
        { id: 'a5555554-5555-5555-5555-555555555555', name: 'Ohori Park', latitude: 33.5859, longitude: 130.3764, source: SpotSource.USER },
        { id: 'a6666666-6666-6666-6666-666666666666', name: 'Lake Toya', latitude: 42.6039, longitude: 140.8504, source: SpotSource.USER },
    ];

    for (const s of spotsData) {
        await prisma.spot.upsert({
            where: { id: s.id },
            update: { name: s.name, latitude: s.latitude, longitude: s.longitude },
            create: s,
        });
    }

    // Seed 40 dummy routes
    for (let i = 1; i <= 40; i++) {
        const routeId = `11111111-1111-4111-a111-${i.toString().padStart(12, '0')}`;
        const authorId = users[(i % users.length)].id;
        const tag = tagNames[i % tagNames.length];
        const extraTag = `Theme-${(i % 6) + 1}`;
        const routeTags = [tag, extraTag];
        const spot = spotsData[i % spotsData.length];

        const route = await prisma.route.upsert({
            where: { id: routeId },
            update: {
                title: `Dummy Route ${i}`,
                description: `This is dummy route number ${i} for pagination testing.`,
                authorId: authorId,
                visibility: RouteVisibility.PUBLIC,
                date: new Date(2024, i % 12, 1),
                routeFor: Object.values(RouteFor)[i % Object.values(RouteFor).length] as RouteFor,
                language: users[(i % users.length)].language,
                tags: {
                    set: [],
                    connectOrCreate: routeTags.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
                routeDates: {
                    deleteMany: {},
                    create: [{
                        day: 1,
                        routeNodes: {
                            create: [{
                                order: 1,
                                details: `Start point for route ${i}`,
                                spotId: spot.id,
                            }]
                        }
                    }]
                }
            },
            create: {
                id: routeId,
                title: `Dummy Route ${i}`,
                description: `This is dummy route number ${i} for pagination testing.`,
                authorId: authorId,
                visibility: RouteVisibility.PUBLIC,
                date: new Date(2024, i % 12, 1),
                routeFor: Object.values(RouteFor)[i % Object.values(RouteFor).length] as RouteFor,
                language: users[(i % users.length)].language,
                tags: {
                    connectOrCreate: routeTags.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
                budget: {
                    create: {
                        amount: 1000 * i,
                        localCurrencyCode: CurrencyCode.JPY,
                    }
                },
                routeDates: {
                    create: [{
                        day: 1,
                        routeNodes: {
                            create: [{
                                order: 1,
                                details: `Start point for route ${i}`,
                                spotId: spot.id,
                            }]
                        }
                    }]
                }
            },
            include: ROUTE_INCLUDE
        });

        // Sync to Meilisearch
        try {
            await syncToMeilisearch(route as RouteWithRelations);
            console.log(`[${i}/40] Synced route "${route.title}" to Meilisearch`);
        } catch (error) {
            console.error(`Failed to sync route ${routeId} to Meilisearch:`, error);
        }
    }
}

// Sync route to Meilisearch index (same as in routesService.ts)
async function syncToMeilisearch(route: RouteWithRelations) {
    const allNodes = route.routeDates.flatMap((rd) => rd.routeNodes);

    const enTexts = (
        await translateJa2En([
            route.title,
            route.description,
            ...allNodes.map((n) => n.spot?.name),
            ...route.tags.map((t) => t.name),
        ])
    ).filter(Boolean);

    const exchangeRates = await prisma.exchangeRates.findMany();
    const rateToUsd = exchangeRates.find(
        (r) => r.currencyCode === route.budget?.localCurrencyCode,
    )?.rateToUsd;
    const budgetInUsd =
        route.budget?.amount && rateToUsd ? route.budget.amount * rateToUsd : undefined;

    const routesIndex = meilisearch.index("routes");

    const documents = [
        {
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
        },
    ];

    await routesIndex.updateDocuments(documents, { primaryKey: "id" });

    // タグをMeilisearchのtagsインデックスに追加
    const tagsIndex = meilisearch.index("tags");
    const tagDocuments = route.tags.map((t) => ({
        id: t.name,
        name: t.name,
    }));
    await tagsIndex.addDocuments(tagDocuments, { primaryKey: "id" });
}

//実行処理
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
