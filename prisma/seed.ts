import 'dotenv/config';
import { PrismaClient, RouteVisibility, RouteFor, TransitMode, SpotSource, CurrencyCode } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

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

    // Seed routes
    const routes = [
        {
            id: '11111111-1111-1111-1111-111111111111',
            title: 'Kyoto Temples Walk',
            description: 'A relaxing walk through famous temples in Kyoto.',
            authorId: '00000000-0000-0000-0000-000000000001',
            tags: ['History', 'Walk', 'Temple'],
            month: 4,
            routeFor: RouteFor.EVERYONE,
            budget: { amount: 3000, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a1111111-1111-1111-1111-111111111111', details: 'Start at the main hall.' }
            ]
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            title: 'Nara Deer Park Stroll',
            description: 'Visit Nara Park and enjoy the friendly deer.',
            authorId: '00000000-0000-0000-0000-000000000002',
            tags: ['Nature', 'Walk'],
            month: 5,
            routeFor: RouteFor.FAMILY,
            budget: { amount: 2000, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a2222222-2222-2222-2222-222222222222', details: 'Feed the deer.' }
            ]
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            title: 'Osaka Street Food Tour',
            description: 'Sample takoyaki and okonomiyaki around Dotonbori.',
            authorId: '00000000-0000-0000-0000-000000000003',
            tags: ['Food'],
            month: 10,
            routeFor: RouteFor.COUPLE,
            budget: { amount: 5000, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a3333333-3333-3333-3333-333333333333', details: 'Try takoyaki here.' }
            ]
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            title: 'Tokyo Skyscraper Views',
            description: 'Modern architecture and high-rise views in Shinjuku.',
            authorId: '00000000-0000-0000-0000-000000000004',
            tags: ['Culture', 'General'],
            month: 12,
            routeFor: RouteFor.FRIENDS,
            budget: { amount: 4000, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a4444444-4444-4444-4444-444444444444', details: 'A peaceful garden in the city.' }
            ]
        },
        {
            id: '55555555-5555-5555-5555-555555555555',
            title: 'Fukuoka Waterfront Stroll',
            description: 'Relax by the pond at Ohori Park.',
            authorId: '00000000-0000-0000-0000-000000000005',
            tags: ['Nature', 'Walk'],
            month: 6,
            routeFor: RouteFor.SOLO,
            budget: { amount: 1500, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a5555554-5555-5555-5555-555555555555', details: 'A beautiful park with a large pond.' }
            ]
        },
        {
            id: '66666666-6666-6666-6666-666666666666',
            title: 'Hokkaido Lake Tour',
            description: 'Stunning scenery at Lake Toya.',
            authorId: '00000000-0000-0000-0000-000000000001',
            tags: ['Nature'],
            month: 8,
            routeFor: RouteFor.EVERYONE,
            budget: { amount: 10000, currency: CurrencyCode.JPY },
            nodes: [
                { order: 1, spotId: 'a6666666-6666-6666-6666-666666666666', details: 'Volcanic lake with an island.' }
            ]
        },
    ];

    for (const r of routes) {
        await prisma.route.upsert({
            where: { id: r.id },
            update: {
                title: r.title,
                description: r.description,
                authorId: r.authorId,
                visibility: RouteVisibility.PUBLIC,
                month: r.month,
                routeFor: r.routeFor,
                tags: {
                    set: r.tags.map(tagName => ({ name: tagName }))
                },
            },
            create: {
                id: r.id,
                title: r.title,
                description: r.description,
                authorId: r.authorId,
                visibility: RouteVisibility.PUBLIC,
                month: r.month,
                routeFor: r.routeFor,
                tags: {
                    connect: r.tags.map(tagName => ({ name: tagName }))
                },
                budget: {
                    create: {
                        amount: r.budget.amount,
                        currency: r.budget.currency,
                        baseAmount: r.budget.amount,
                        baseCurrency: CurrencyCode.JPY,
                    }
                },
                routeNodes: {
                    create: r.nodes.map(node => ({
                        order: node.order,
                        details: node.details,
                        spotId: node.spotId,
                    }))
                }
            },
        });
    }
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
