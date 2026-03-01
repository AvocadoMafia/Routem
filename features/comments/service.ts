import {commentsRepository} from "@/features/comments/repository";

export const commentsService = {
    getComments: async (userId?: string, take?: number, onlyMine?: boolean, without?: string[]) => {
        // onlyMine が true なのに userId が無い場合は「自分のコメントのみ」が成立しないので空配列を返す
        if (onlyMine && !userId) return [];

        // userId が無いなら通常取得（ランキング順）
        if (!userId) {
            return commentsRepository.getComments(take, without);
        }

        // onlyMine の場合は自分のものだけ（ランキング順）
        if (onlyMine) {
            return commentsRepository.getMyComments(userId, take, without);
        }

        // ここから「自分のコメントを必ず先頭に含める」ロジック
        // 1) 先に自分のコメントを取る（take があればその上限まで）
        const myComments = await commentsRepository.getMyComments(userId, take, without);

        // myComments の ID リストを作成（without と合わせる）
        const myCommentIds = myComments.map(c => c.id);
        const allWithout = [...(without ?? []), ...myCommentIds];

        // take が未指定なら「自分 + その他全部」を返す（重複排除）
        if (take == null) {
            const others = await commentsRepository.getComments(undefined, allWithout);
            return [...myComments, ...others];
        }

        // 自分のコメントだけで上限に達したらそれで終わり（常に自分が先頭）
        const remaining = take - myComments.length;
        if (remaining <= 0) return myComments.slice(0, take);

        // 2) 残り枠を、ランキング順で「自分以外」から埋める
        const otherComments = await commentsRepository.getComments(remaining, allWithout);

        return [...myComments, ...otherComments];
    },

    createComment: async (userId: string, routeId: string, text: string) => {
        return commentsRepository.createComment(userId, routeId, text);
    },

    deleteComment: async (userId: string, commentId: string) => {
        const comment = await commentsRepository.findById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }

        if (comment.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return commentsRepository.deleteComment(commentId);
    },
};
