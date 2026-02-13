import { getPrisma } from "@/lib/config/server";
import { postRouteSchema } from "@/features/routes/schema";
import { RouteNode } from "@/lib/server/types";
import { cuid, number } from "zod";
import { Prisma } from "@prisma/client";


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

  postRoute: async (body: postRouteSchema) => {
    type NodeInput = Prisma.RouteNodeCreateWithoutRouteInput;


    const nestedNodes: NodeInput[] = [];

    let current_node: NodeInput | null = null;

    for (const item of body.items) {
      if (item.type === 'waypoint') {
        current_node = {
          order: nestedNodes.length,
          details: item.memo,
          spot: { connect: { id: item.id } },
          transitSteps: { create: [] },
        };
        nestedNodes.push(current_node);
      } else if (item.type === 'transportation') {
        if (current_node) {
          current_node.transitSteps.push({
            id: cuid(),
            order: current_node.transitSteps.length,
            mode: item.method,
            duration: item.duration ?? null,
            distance: item.distance ?? null,
            memo: item.memo ?? null,
          });
        }
      }
    }
  },
};
