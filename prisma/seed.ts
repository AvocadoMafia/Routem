import 'dotenv/config';
import { PrismaClient, RouteVisibility, RouteFor, TransitMode, SpotSource, CurrencyCode } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getMeilisearch } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";

const dbType = process.env.DB_TYPE || 'local';
const connectionString = dbType === 'vercel'
  ? process.env.VERCEL_DATABASE_URL
  : process.env.LOCAL_DATABASE_URL;

if (!connectionString) {
  throw new Error(`Database connection string for type '${dbType}' is not defined.`);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
    // Seed users
    const users =  [
        {id: '00000000-0000-0000-0000-000000000001', name: 'lychee', bio: 'Travel enthusiast from Kyoto.'},
        {id: '00000000-0000-0000-0000-000000000002', name: 'avocado', bio: 'Nature lover and hiker.'},
        {id: '00000000-0000-0000-0000-000000000003', name: 'mango', bio: 'Foodie exploring the world.'},
        {id: '00000000-0000-0000-0000-000000000004', name: 'papaya', bio: 'Culture seeker.'},
        {id: '00000000-0000-0000-0000-000000000005', name: 'plum', bio: 'Adventure awaits!'},
    ]

    for(const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: { name: user.name, bio: user.bio },
            create: {
                id: user.id,
                name: user.name,
                bio: user.bio,
            }
        })
    }

    // Seed tags (replacing categories)
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
        const spot = spotsData[i % spotsData.length];

        const route = await prisma.route.upsert({
            where: { id: routeId },
            update: {
                title: `Dummy Route ${i}`,
                description: `This is dummy route number ${i} for pagination testing.`,
                authorId: authorId,
                visibility: RouteVisibility.PUBLIC,
                month: (i % 12) + 1,
                routeFor: Object.values(RouteFor)[i % Object.values(RouteFor).length] as RouteFor,
                tags: {
                    set: [{ name: tag }]
                },
            },
            create: {
                id: routeId,
                title: `Dummy Route ${i}`,
                description: `This is dummy route number ${i} for pagination testing.`,
                authorId: authorId,
                visibility: RouteVisibility.PUBLIC,
                month: (i % 12) + 1,
                routeFor: Object.values(RouteFor)[i % Object.values(RouteFor).length] as RouteFor,
                tags: {
                    connect: [{ name: tag }]
                },
                budget: {
                    create: {
                        amount: 1000 * i,
                        currency: CurrencyCode.JPY,
                        baseAmount: 1000 * i,
                        baseCurrency: CurrencyCode.JPY,
                    }
                },
                routeNodes: {
                    create: [{
                        order: 1,
                        details: `Start point for route ${i}`,
                        spotId: spot.id,
                    }]
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                    },
                },
                thumbnail: true,
                routeNodes: {
                    include: {
                        spot: true,
                        transitSteps: true,
                        images: true,
                    },
                },
                likes: true,
                views: true,
                collaborators: true,
                budget: true,
                tags: true,
            }
        });

        // Sync to Meilisearch
        try {
            await syncToMeilisearch(route);
            console.log(`[${i}/40] Synced route "${route.title}" to Meilisearch`);
        } catch (error) {
            console.error(`Failed to sync route ${routeId} to Meilisearch:`, error);
        }
    }
}

// Sync route to Meilisearch index (same as in routesService.ts)
async function syncToMeilisearch(route: any) {
    const en_texts = (await translateJa2En([
        route.title,
        route.description,
        ...route.routeNodes.map((n: any) => n.spot?.name).filter(Boolean),
        ...route.tags.map((t: any) => t.name)
    ])).filter(Boolean);

    const meilisearch = getMeilisearch();
    const routesIndex = meilisearch.index("routes");

    const documents = [{
        id: route.id,
        title: route.title,
        description: route.description,
        authorId: route.authorId,
        visibility: route.visibility,
        createdAt: route.createdAt?.getTime(),
        updatedAt: route.updatedAt?.getTime(),
        routeNodes: route.routeNodes.map((n: any) => n.spot?.name).filter(Boolean),
        tags: route.tags.map((t: any) => t.name),
        month: route.month,
        routeFor: route.routeFor,
        budget: route.budget ? Number(route.budget.amount) : undefined,
        searchText: [
            route.title,
            route.description,
            ...route.routeNodes.map((n: any) => n.spot?.name).filter(Boolean),
            ...route.tags.map((t: any) => t.name),
            ...en_texts,
        ].join(" ")
    }];

    await routesIndex.updateDocuments(documents, { primaryKey: "id" });

    // タグをMeilisearchのtagsインデックスに追加
    const tagsIndex = meilisearch.index("tags");
    const tagDocuments = route.tags.map((t: any) => ({
        id: t.name,
        name: t.name
    }));
    await tagsIndex.addDocuments(tagDocuments, { primaryKey: "id" });
}

//実行処理
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
