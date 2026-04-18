import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";
import { ROUTE_INCLUDE, RouteWithRelations } from "@/features/routes/repository";
import { getPrisma } from "@/lib/config/server";
import { USER_SELECT } from "@/features/users/repository";
import { DEFAULT_LIMIT } from "@/lib/server/constants";
import { buildCursorWhere, encodeCursor } from "@/lib/server/cursor";
import { ValidationError } from "@/lib/server/validateParams";

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
            // route handler 側で zod refine を通り抜けた異常系。400 VALIDATION_ERROR で返す
            throw new ValidationError("Invalid target or missing ID");
        });
    },


    // 新API: Likeレコードをincludeフラグ・カーソルで制御して取得
    getLikes: async (
        userId: string,
        opts: { include?: { route?: boolean; user?: boolean; comment?: boolean }; take?: number; cursor?: string }
    ) => {
        const take = opts.take ?? DEFAULT_LIMIT;

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

        // カーソル条件を構築
        const cursorWhere = buildCursorWhere(opts.cursor);
        const where: Prisma.LikeWhereInput = {
            userId,
            ...cursorWhere,
        };

        const args: Prisma.LikeFindManyArgs = {
            where,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take,
            include: Object.keys(include).length > 0 ? include : undefined,
        };

        const likes = await likesRepository.findMany(args);

        // nextCursorを計算
        let nextCursor: string | null = null;
        if (likes.length === take && likes.length > 0) {
            const last = likes[likes.length - 1];
            nextCursor = encodeCursor({ createdAt: last.createdAt, id: last.id });
        }

        // route=true指定でも、target=COMMENT の場合は route を null に正規化
        const items = likes.map((l) => {
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

        return { items, nextCursor };
    },
};
