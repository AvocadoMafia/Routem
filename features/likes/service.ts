import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";
import { ROUTE_INCLUDE, RouteWithRelations } from "@/features/routes/repository";
import { getPrisma } from "@/lib/config/server";
import { USER_SELECT } from "@/features/users/repository";

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

    // BFF互換: ルート一覧のみ（従来用途）
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
                .map((l) => (l as any).route)
                .filter((r): r is RouteWithRelations => !!r);
        } catch (e) {
            throw e;
        }
    },

    // 新API: Likeレコードをincludeフラグ・takeで制御して取得
    getLikes: async (
        userId: string,
        opts: { include?: { route?: boolean; user?: boolean; comment?: boolean }; take?: number }
    ) => {
        const take = opts.take ?? 30;

        const include: Prisma.LikeInclude = {};
        if (opts.include?.route) {
            // routeはROUTE_INCLUDEで詳細を取得
            (include as any).route = { include: ROUTE_INCLUDE };
        }
        if (opts.include?.user) {
            (include as any).user = { select: USER_SELECT } as any;
        }
        if (opts.include?.comment) {
            (include as any).comment = {
                select: {
                    id: true,
                    body: true,
                    user: { select: USER_SELECT },
                },
            } as any;
        }

        const args: Prisma.LikeFindManyArgs = {
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
            include: Object.keys(include).length > 0 ? include : undefined,
        };

        const likes = await likesRepository.findMany(args);

        // route=true指定でも、target=COMMENT の場合は route を null に正規化
        return likes.map((l) => {
            const base: any = {
                id: l.id,
                target: l.target,
                createdAt: l.createdAt,
            };
            if (opts.include?.route) {
                base.route = l.target === "COMMENT" ? null : (l as any).route ?? null;
            }
            if (opts.include?.user) {
                base.user = (l as any).user;
            }
            if (opts.include?.comment) {
                base.comment = (l as any).comment;
            }
            return base;
        });
    },
};
