import {commentsRepository} from "@/features/comments/repository";
import { getPrisma } from "@/lib/db/prisma";
import { encodeCursor } from "@/lib/db/cursor";
import { DEFAULT_LIMIT } from "@/lib/utils/pagination";

export const commentsService = {
    getComments: async (userId?: string, take?: number, onlyMine?: boolean, without?: string[]) => {
        try {
            if (onlyMine && userId) {
                return commentsRepository.getMyComments(userId, take, without);
            }
            return commentsRepository.getComments(take, without);
        } catch (e) {
            throw e;
        }
    },

    getCommentsByRouteId: async (routeId: string, take?: number, cursor?: string) => {
        try {
            const limit = take ?? DEFAULT_LIMIT;
            const comments = await commentsRepository.getCommentsByRouteId(routeId, limit, cursor);

            // nextCursorを計算
            let nextCursor: string | null = null;
            if (comments.length === limit && comments.length > 0) {
                const last = comments[comments.length - 1];
                nextCursor = encodeCursor({ createdAt: last.createdAt, id: last.id });
            }

            return { items: comments, nextCursor };
        } catch (e) {
            throw e;
        }
    },

    createComment: async (userId: string, routeId: string, text: string) => {
        try {
            return commentsRepository.createComment(userId, routeId, text);
        } catch (e) {
            throw e;
        }
    },

    /**
     * コメント削除（トランザクション使用）
     * TOCTOU脆弱性防止のため、権限チェックと削除を単一トランザクションで実行
     */
    deleteComment: async (userId: string, commentId: string) => {
        return getPrisma().$transaction(async (tx) => {
            const comment = await tx.comment.findUnique({
                where: { id: commentId },
            });

            if (!comment) {
                // handleError.ts の matchAuthError が "Not Found" を 404 NOT_FOUND にマップする
                throw new Error("Not Found");
            }

            if (comment.userId !== userId) {
                throw new Error("Unauthorized");
            }

            return tx.comment.delete({
                where: { id: commentId },
            });
        });
    },
};
