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

    getOtherComments: async (userId: string, take?: number, without?: string[]) => {
        const prisma = getPrisma();
        const orderBy = [
            {likes: {_count: "desc"}} as const,
            {createdAt: "desc"} as const,
        ];

        return prisma.comment.findMany({
            take,
            where: {
                userId: {not: userId},
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
};
