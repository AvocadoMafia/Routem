import {getPrisma} from "@/lib/db/prisma";
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

    /**
     * ルートのいいね状態を切り替え、最新のカウントを返す（トランザクション内での実行を想定）
     */
    toggleRouteLike: async (tx: Prisma.TransactionClient, userId: string, routeId: string) => {
        const existing = await tx.like.findUnique({
            where: { userId_routeId: { userId, routeId } },
        });

        if (existing) {
            await tx.like.delete({
                where: { userId_routeId: { userId, routeId } },
            });
        } else {
            await tx.like.create({
                data: { userId, target: LikeViewTarget.ROUTE, routeId },
            });
        }

        const likeCount = await tx.like.count({ where: { routeId } });
        return { liked: !existing, likeCount };
    },

    /**
     * コメントのいいね状態を切り替え、最新のカウントを返す（トランザクション内での実行を想定）
     */
    toggleCommentLike: async (tx: Prisma.TransactionClient, userId: string, commentId: string) => {
        const existing = await tx.like.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });

        if (existing) {
            await tx.like.delete({
                where: { userId_commentId: { userId, commentId } },
            });
        } else {
            await tx.like.create({
                data: { userId, target: LikeViewTarget.COMMENT, commentId },
            });
        }

        const likeCount = await tx.like.count({ where: { commentId } });
        return { liked: !existing, likeCount };
    },
};
