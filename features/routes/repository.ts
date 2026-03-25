import { getPrisma } from "@/lib/config/server";
import { Prisma } from "@prisma/client";

export const ROUTE_INCLUDE = {
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
} as const;

export type RouteWithRelations = Prisma.RouteGetPayload<{
  include: typeof ROUTE_INCLUDE;
}>;

export const routesRepository = {
  findMany: async (where: Prisma.RouteWhereInput, limit?: number, offset?: number, orderBy?: Prisma.RouteOrderByWithRelationInput): Promise<RouteWithRelations[]> => {
    try {
      return (await getPrisma().route.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: orderBy ?? {
          createdAt: "desc",
        },
        include: ROUTE_INCLUDE,
      })) as RouteWithRelations[];
    } catch (e) {
      throw e;
    }
  },

  create: async (data: Prisma.RouteCreateInput): Promise<RouteWithRelations> => {
    try {
      return (await getPrisma().route.create({
        data,
        include: ROUTE_INCLUDE,
      })) as RouteWithRelations;
    } catch (e) {
      throw e;
    }
  },

  update: async (id: string, authorId: string, data: Prisma.RouteUpdateInput): Promise<RouteWithRelations> => {
    try {
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
    } catch (e) {
      throw e;
    }
  },

  deleteMany: async (where: Prisma.RouteWhereInput) => {
    try {
      return getPrisma().route.deleteMany({
        where,
      });
    } catch (e) {
      throw e;
    }
  },

  findRoutes: async (args: Prisma.RouteFindManyArgs): Promise<RouteWithRelations[]> => {
    try {
      return (await getPrisma().route.findMany({
        ...args,
        include: ROUTE_INCLUDE,
      })) as RouteWithRelations[];
    } catch (e) {
      throw e;
    }
  },

  findUnique: async (id: string): Promise<RouteWithRelations | null> => {
    try {
      return (await getPrisma().route.findUnique({
        where: { id },
        include: ROUTE_INCLUDE,
      })) as RouteWithRelations | null;
    } catch (e) {
      throw e;
    }
  },

  createInvite: async (data: Prisma.RouteInviteCreateInput) => {
    try {
      return await getPrisma().routeInvite.create({
        data,
      });
    } catch (e) {
      throw e;
    }
  },

  findInviteByTokenHash: async (tokenHash: string) => {
    try {
      return await getPrisma().routeInvite.findUnique({
        where: { tokenHash },
        include: { route: true },
      });
    } catch (e) {
      throw e;
    }
  },

  updateInvite: async (id: string, data: Prisma.RouteInviteUpdateInput) => {
    try {
      return await getPrisma().routeInvite.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw e;
    }
  },

  upsertCollaborator: async (routeId: string, userId: string) => {
    try {
      return await getPrisma().routeCollaborator.upsert({
        where: {
          routeId_userId: {
            routeId,
            userId,
          },
        },
        create: {
          routeId,
          userId,
        },
        update: {},
      });
    } catch (e) {
      throw e;
    }
  },

};