import { getPrisma } from "@/lib/config/server";

export const iMagesRecommendationRepository = {
  findMany: async (ids: string[]) => {
    const prisma = getPrisma();
    return await prisma.route.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        routeDates: {
          select: {
            routeNodes: {
              select: {
                images: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },
};
