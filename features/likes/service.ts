import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";
import { ROUTE_INCLUDE, RouteWithRelations } from "@/features/routes/repository";
import { getPrisma } from "@/lib/config/server";
import { USER_SELECT } from "@/features/users/repository";
import { DEFAULT_LIMIT } from "@/lib/server/constants";

export const likesService = {
    /**
     * いいねの切り替え（トランザクション使用）
     * TOCTOU脆弱性防止のため、チェックと更新を単一トランザクションで実行
     */
    toggleLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        return getPrisma().$transaction(async (tx) => {
            if (target === LikeViewTarget.ROUTE && routeId) {
                return await likesRepository.toggleRouteLike(tx, userId, routeId);
            } else if (target === LikeViewTarget.COMMENT && commentId) {
                return await likesRepository.toggleCommentLike(tx, userId, commentId);
            }
            throw new Error("Invalid target or missing ID");
        });
    },


    // 新API: Likeレコードをincludeフラグ・takeで制御して取得
    getLikes: async (
        userId: string,
        opts: { include?: { route?: boolean; user?: boolean; comment?: boolean }; take?: number; offset?: number }
    ) => {
        const take = opts.take ?? DEFAULT_LIMIT;
        const skip = opts.offset ?? 0;

        const include: Prisma.LikeInclude = {};
        if (opts.include?.route) {
            // routeはROUTE_INCLUDEで詳細を取得
            (include as any).route = { include: ROUTE_INCLUDE };
        }
        if (opts.include?.user) {
            (include as any).user = {
                select: {
                    ...USER_SELECT,
                    icon: true,
                },
            } as any;
        }
        if (opts.include?.comment) {
            (include as any).comment = {
                select: {
                    id: true,
                    body: true,
                    user: {
                        select: {
                            ...USER_SELECT,
                            icon: true,
                        },
                    },
                },
            } as any;
        }

        const args: Prisma.LikeFindManyArgs = {
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
            skip,
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
