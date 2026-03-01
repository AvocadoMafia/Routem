import {getPrisma} from "@/lib/config/server";

export const commentsRepository = {
    getMyComments: async (userId: string, take?: number, without?: string[]) => {
        const prisma = getPrisma();
        const orderBy = [
            {likes: {_count: "desc"}} as const,
            {createdAt: "desc"} as const,
        ];

        return prisma.comment.findMany({
            take,
            where: {
                userId,
                id: without ? {notIn: without} : undefined,
            },
            orderBy,
        });
    },

    getComments: async (take?: number, without?: string[]) => {
        const prisma = getPrisma();
        const orderBy = [
            {likes: {_count: "desc"}} as const,
            {createdAt: "desc"} as const,
        ];

        return prisma.comment.findMany({
            take,
            where: {
                id: without ? {notIn: without} : undefined,
            },
            orderBy,
        });
    },

    createComment: async (userId: string, routeId: string, text: string) => {
        const prisma = getPrisma();
        return prisma.comment.create({
            data: {
                userId,
                routeId,
                text,
            },
        });
    },

    deleteComment: async (id: string) => {
        const prisma = getPrisma();
        return prisma.comment.delete({
            where: {id},
        });
    },

    findById: async (id: string) => {
        const prisma = getPrisma();
        return prisma.comment.findUnique({
            where: {id},
        });
    },
};
