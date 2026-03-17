import {getPrisma} from "@/lib/config/server";
import {LikeViewTarget, Prisma} from "@prisma/client";
import { ROUTE_INCLUDE } from "@/features/routes/repository";

export const likesRepository = {
    findMany: async (args: Prisma.LikeFindManyArgs) => {
        try {
            return await getPrisma().like.findMany(args);
        } catch (e) {
            throw e;
        }
    },
    createLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        try {
            return getPrisma().like.create({
                data: {
                    userId,
                    target,
                    routeId,
                    commentId,
                },
            });
        } catch (e) {
            throw e;
        }
    },

    deleteLike: async (id: string) => {
        try {
            return getPrisma().like.delete({
                where: { id },
            });
        } catch (e) {
            throw e;
        }
    },

    findById: async (id: string) => {
        try {
            return getPrisma().like.findUnique({
                where: { id },
            });
        } catch (e) {
            throw e;
        }
    },

    findByUserAndRoute: async (userId: string, routeId: string) => {
        try {
            return getPrisma().like.findUnique({
                where: {
                    userId_routeId: {
                        userId,
                        routeId,
                    },
                },
            });
        } catch (e) {
            throw e;
        }
    },

    findByUserAndComment: async (userId: string, commentId: string) => {
        try {
            return getPrisma().like.findUnique({
                where: {
                    userId_commentId: {
                        userId,
                        commentId,
                    },
                },
            });
        } catch (e) {
            throw e;
        }
    },
    deleteByUserAndRoute: async (userId: string, routeId: string) => {
        try {
            return getPrisma().like.delete({
                where: {
                    userId_routeId: {
                        userId,
                        routeId,
                    },
                },
            });
        } catch (e) {
            throw e;
        }
    },

    deleteByUserAndComment: async (userId: string, commentId: string) => {
        try {
            return getPrisma().like.delete({
                where: {
                    userId_commentId: {
                        userId,
                        commentId,
                    },
                },
            });
        } catch (e) {
            throw e;
        }
    },
  countLikesByRoute: async (routeId: string) => {
    try {
      return await getPrisma().like.count({ where: { routeId } });
    } catch (e) {
      throw e;
    }
  },
  countLikesByComment: async (commentId: string) => {
    try {
      return await getPrisma().like.count({ where: { commentId } });
    } catch (e) {
      throw e;
    }
  },
};
