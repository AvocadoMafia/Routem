import {commentsRepository} from "@/features/comments/repository";

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

    deleteComment: async (userId: string, commentId: string) => {
        try {
            const comment = await commentsRepository.findById(commentId);
            if (!comment) {
                throw new Error("Comment not found");
            }

            if (comment.userId !== userId) {
                throw new Error("Unauthorized");
            }

            return commentsRepository.deleteComment(commentId);
        } catch (e) {
            throw e;
        }
    },
};
