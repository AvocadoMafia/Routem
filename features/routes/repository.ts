import { getPrisma } from "@/lib/config/server";
import { Prisma, RouteVisibility } from "@prisma/client";

export const ROUTE_INCLUDE = {
  category: true,
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
} as const;

export type RouteWithRelations = Prisma.RouteGetPayload<{
  include: typeof ROUTE_INCLUDE;
}>;

export const routesRepository = {
  findMany: async (where: Prisma.RouteWhereInput, limit?: number): Promise<RouteWithRelations[]> => {
    return (await getPrisma().route.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: ROUTE_INCLUDE,
    })) as RouteWithRelations[];
  },

  create: async (data: Prisma.RouteCreateInput): Promise<RouteWithRelations> => {
    return (await getPrisma().route.create({
      data,
      include: ROUTE_INCLUDE,
    })) as RouteWithRelations;
  },

  update: async (id: string, authorId: string, data: Prisma.RouteUpdateInput): Promise<RouteWithRelations> => {
    return getPrisma().$transaction(async (tx) => {
      // 存在確認と所有者チェックを兼ねる
      const existing = await tx.route.findFirst({
        where: { id, authorId },
      });

      if (!existing) {
        throw new Error("Notfound or Unauthorized");
      }

      return (await tx.route.update({
        where: { id },
        data,
        include: ROUTE_INCLUDE,
      })) as RouteWithRelations;
    });
  },

  deleteMany: async (where: Prisma.RouteWhereInput) => {
    return getPrisma().route.deleteMany({
      where,
    });
  },
};