import { getPrisma } from "@/lib/config/server";

export const routesService = {
  getRoutes: async () => {
    const prisma = getPrisma();
    return await prisma.route.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        thumbnail: true,
        routeNodes: {
          orderBy: {
            order: "asc",
          },
          include: {
            spot: true,
            transitSteps: true,
            images: true,
          },
        },
      },
    });
  },
  getRoutesByParams: async (params: any) => {
    const prisma = getPrisma();
    const { q, category, visibility, authorId, limit = 20 } = params;

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        name: category,
      };
    }

    if (visibility) {
      where.visibility = visibility.toUpperCase();
    }

    if (authorId) {
      where.authorId = authorId;
    }

    return await prisma.route.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        thumbnail: true,
      },
    });
  },
};
