import {getPrisma} from "@/lib/config/server";
import { buildCursorWhere } from "@/lib/server/cursor";

export const commentsRepository = {
    getMyComments: async (userId: string, take?: number, without?: string[]) => {
        try {
            const prisma = getPrisma();
            const orderBy = [
                { likes: { _count: "desc" } } as const,
                { createdAt: "desc" } as const,
            ];

            return prisma.comment.findMany({
                take,
                where: {
                    userId,
                    id: without ? { notIn: without } : undefined,
                },
                orderBy,
            });
        } catch (e) {
            throw e;
        }
    },

    getComments: async (take?: number, without?: string[]) => {
        try {
            const prisma = getPrisma();
            const orderBy = [
                { likes: { _count: "desc" } } as const,
                { createdAt: "desc" } as const,
            ];

            return prisma.comment.findMany({
                take,
                where: {
                    id: without ? { notIn: without } : undefined,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                        }
                    }
                },
                orderBy,
            });
        } catch (e) {
            throw e;
        }
    },

    getCommentsByRouteId: async (routeId: string, take?: number, cursor?: string) => {
        try {
            const prisma = getPrisma();

            // カーソル条件を構築
            const cursorWhere = buildCursorWhere(cursor);
            const where: any = {
                routeId,
                ...cursorWhere,
            };

            return prisma.comment.findMany({
                where,
                take,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                        }
                    },
                    likes: true,
                },
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            });
        } catch (e) {
            throw e;
        }
    },

    createComment: async (userId: string, routeId: string, text: string) => {
        try {
            const prisma = getPrisma();
            return prisma.comment.create({
                data: {
                    userId,
                    routeId,
                    text,
                },
            });
        } catch (e) {
            throw e;
        }
    },

    deleteComment: async (id: string) => {
        try {
            const prisma = getPrisma();
            return prisma.comment.delete({
                where: { id },
            });
        } catch (e) {
            throw e;
        }
    },

    findById: async (id: string) => {
        try {
            const prisma = getPrisma();
            return prisma.comment.findUnique({
                where: { id },
            });
        } catch (e) {
            throw e;
        }
    },
};
