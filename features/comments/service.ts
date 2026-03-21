import {commentsRepository} from "@/features/comments/repository";
import { getPrisma } from "@/lib/config/server";

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

    getCommentsByRouteId: async (routeId: string) => {
        try {
            return commentsRepository.getCommentsByRouteId(routeId);
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
                throw new Error("Comment not found");
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
