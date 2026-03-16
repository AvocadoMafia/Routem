import 'dotenv/config';
import { PrismaClient, RouteVisibility } from "@prisma/client";
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
        {id: '00000000-0000-0000-0000-000000000001', name: 'lychee'},
        {id: '00000000-0000-0000-0000-000000000002', name: 'avocado'},
        {id: '00000000-0000-0000-0000-000000000003', name: 'mango'},
        {id: '00000000-0000-0000-0000-000000000004', name: 'papaya'},
        {id: '00000000-0000-0000-0000-000000000005', name: 'plum'},
    ]

    for(const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: { name: user.name },
            create: {
                id: user.id,
                name: user.name,
            }
        })
    }

    // Seed categories
    const categoryNames = [
        'History', 'Nature', 'Culture', 'Food', 'Activity', 'General'
    ];

    const categories = [] as { id: string; name: string }[];
    for (const name of categoryNames) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        categories.push(cat);
    }

    const findCategoryId = (name: string) => categories.find(c => c.name === name)?.id as string;

    // Seed public routes (minimal fields)
    const routes = [
        {
            id: '11111111-1111-1111-1111-111111111111',
            title: 'Kyoto Temples Walk',
            description: 'A relaxing walk through famous temples in Kyoto.',
            categoryId: findCategoryId('History'),
            authorId: '00000000-0000-0000-0000-000000000001',
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            title: 'Nara Deer Park Stroll',
            description: 'Visit Nara Park and enjoy the friendly deer.',
            categoryId: findCategoryId('Nature'),
            authorId: '00000000-0000-0000-0000-000000000002',
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            title: 'Osaka Street Food Tour',
            description: 'Sample takoyaki and okonomiyaki around Dotonbori.',
            categoryId: findCategoryId('Food'),
            authorId: '00000000-0000-0000-0000-000000000003',
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            title: 'Tokyo Museum Highlights',
            description: 'A cultural day visiting top museums in Tokyo.',
            categoryId: findCategoryId('Culture'),
            authorId: '00000000-0000-0000-0000-000000000004',
        },
        {
            id: '55555555-5555-5555-5555-555555555555',
            title: 'Hakone Outdoor Adventure',
            description: 'Hiking and hot springs in Hakone area.',
            categoryId: findCategoryId('Activity'),
            authorId: '00000000-0000-0000-0000-000000000005',
        },
        {
            id: '66666666-6666-6666-6666-666666666666',
            title: 'Scenic Coastal Drive',
            description: 'A calm drive along the scenic coastline.',
            categoryId: findCategoryId('General'),
            authorId: '00000000-0000-0000-0000-000000000001',
        },
    ];

    for (const r of routes) {
        await prisma.route.upsert({
            where: { id: r.id },
            update: { title: r.title, description: r.description, categoryId: r.categoryId, authorId: r.authorId, visibility: RouteVisibility.PUBLIC },
            create: { id: r.id, title: r.title, description: r.description, categoryId: r.categoryId, authorId: r.authorId, visibility: RouteVisibility.PUBLIC },
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
