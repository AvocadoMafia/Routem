import {getPrisma} from "@/lib/config/server";
import {LikeViewTarget} from "@prisma/client";


export const likesRepository = {
    createLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        return getPrisma().like.create({
            data: {
                userId,
                target,
                routeId,
                commentId,
            },
        });
    },

    deleteLike: async (id: string) => {
        return getPrisma().like.delete({
            where: { id },
        });
    },

    findById: async (id: string) => {
        return getPrisma().like.findUnique({
            where: { id },
        });
    },

    findByUserAndRoute: async (userId: string, routeId: string) => {
        return getPrisma().like.findUnique({
            where: {
                userId_routeId: {
                    userId,
                    routeId,
                },
            },
        });
    },

    findByUserAndComment: async (userId: string, commentId: string) => {
        return getPrisma().like.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    },
    deleteByUserAndRoute: async (userId: string, routeId: string) => {
        return getPrisma().like.delete({
            where: {
                userId_routeId: {
                    userId,
                    routeId,
                },
            },
        });
    },

    deleteByUserAndComment: async (userId: string, commentId: string) => {
        return getPrisma().like.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    },
};
