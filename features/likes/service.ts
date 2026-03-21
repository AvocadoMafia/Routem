import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget } from "@prisma/client";
import { ROUTE_INCLUDE } from "@/features/routes/repository";
import { getPrisma } from "@/lib/config/server";

export const likesService = {
    /**
     * いいねの切り替え（トランザクション使用）
     * TOCTOU脆弱性防止のため、チェックと更新を単一トランザクションで実行
     */
    toggleLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        return getPrisma().$transaction(async (tx) => {
            if (target === LikeViewTarget.ROUTE && routeId) {
                const existing = await tx.like.findUnique({
                    where: { userId_routeId: { userId, routeId } },
                });
                if (existing) {
                    await tx.like.delete({
                        where: { userId_routeId: { userId, routeId } },
                    });
                } else {
                    await tx.like.create({
                        data: { userId, target, routeId },
                    });
                }
                const likeCount = await tx.like.count({ where: { routeId } });
                return { liked: !existing, likeCount };
            } else if (target === LikeViewTarget.COMMENT && commentId) {
                const existing = await tx.like.findUnique({
                    where: { userId_commentId: { userId, commentId } },
                });
                if (existing) {
                    await tx.like.delete({
                        where: { userId_commentId: { userId, commentId } },
                    });
                } else {
                    await tx.like.create({
                        data: { userId, target, commentId },
                    });
                }
                const likeCount = await tx.like.count({ where: { commentId } });
                return { liked: !existing, likeCount };
            }
            throw new Error("Invalid target or missing ID");
        });
    },

    getLikedRoutes: async (userId: string) => {
        try {
            const likes = await likesRepository.findMany({
                where: { userId, routeId: { not: null } },
                orderBy: { createdAt: "desc" },
                include: {
                    route: {
                        include: ROUTE_INCLUDE,
                    },
                },
            });

            return likes
                .map((l) => l.route)
                .filter((r): r is RouteWithRelations => !!r);
        } catch (e) {
            throw e;
        }
    },
};
