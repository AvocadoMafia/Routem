import 'dotenv/config';
import { PrismaClient, RouteVisibility, RouteFor, TransitMode, SpotSource, CurrencyCode, Locale, Language } from "@prisma/client";
import { getPrisma, getMeilisearch } from "@/lib/config/server";
import { translateJa2En } from "@/lib/translation/translateJa2En";
import { ROUTE_INCLUDE, RouteWithRelations } from "@/features/routes/repository";
import { exchangeRatesRepository } from "@/features/exchangeRates/repository";
import { RoutesDocumentsType } from "@/features/routes/schema";

const prisma = getPrisma();

async function main() {
    // Seed users
    const users =  [
        {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'lychee',
            bio: 'Travel enthusiast from Kyoto.',
            locale: Locale.JA,
            language: Language.JA,
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'avocado',
            bio: 'Nature lover and hiker.',
            locale: Locale.EN,
            language: Language.EN,
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            name: 'mango',
            bio: 'Foodie exploring the world.',
            locale: Locale.KO,
            language: Language.KO,
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            name: 'papaya',
            bio: 'Culture seeker.',
            locale: Locale.ZH,
            language: Language.ZH,
        },
        {
            id: '00000000-0000-0000-0000-000000000005',
            name: 'plum',
            bio: 'Adventure awaits!',
            locale: Locale.JA,
            language: Language.EN,
        },
    ]

    for(const user of users) {
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

    const exchangeRates = await exchangeRatesRepository.findMany();
    const rateToUsd = exchangeRates.find(
        (r) => r.currencyCode === route.budget?.localCurrencyCode,
    )?.rateToUsd;
    const budgetInUsd =
        route.budget?.amount && rateToUsd ? route.budget.amount * rateToUsd : undefined;

    const meilisearch = getMeilisearch();
    const routesIndex = meilisearch.index("routes");

    const documents: RoutesDocumentsType = [
        {
            id: route.id,
            title: route.title,
            description: route.description,
            authorId: route.authorId,
            visibility: route.visibility,
            createdAt: route.createdAt?.getTime(),
            updatedAt: route.updatedAt?.getTime(),
            spotNames: allNodes.map((n) => n.spot.name).filter(Boolean),
            tags: route.tags.map((t) => t.name),
            month: route.date ? [route.date.getMonth() + 1] : undefined,
            days: route.routeDates.length > 0 ? route.routeDates.length : undefined,
            routeFor: route.routeFor,
            language: route.language,
            budgetInLocalCurrency: route.budget?.amount,
            localCurrencyCode: route.budget?.localCurrencyCode,
            budgetInUsd,
            _geo: {
                lat: allNodes[0]?.spot.latitude ?? undefined,
                lng: allNodes[0]?.spot.longitude ?? undefined,
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
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
