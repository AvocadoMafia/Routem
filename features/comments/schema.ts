import z from "zod";
import { Prisma } from "@prisma/client";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/utils/pagination";

export const GetCommentsSchema = z.object({
    routeId: z.string().uuid().optional(),
    take: z
        .union([z.string().regex(/^\d+$/), z.number()])
        .transform((n: any) => (typeof n === "string" ? Number(n) : n))
        .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
        .default(DEFAULT_LIMIT)
        .optional(),
    cursor: z.string().optional(),
    onlyMine: z.boolean().optional(),
    without: z.array(z.string()).optional(),
});

export const CreateCommentSchema = z.object({
    routeId: z.string().uuid(),
    text: z.string().min(1).max(1000),
});

export const DeleteCommentSchema = z.object({
    id: z.string().uuid(),
});

export type GetCommentsType = z.infer<typeof GetCommentsSchema>;
export type CreateCommentType = z.infer<typeof CreateCommentSchema>;
export type DeleteCommentType = z.infer<typeof DeleteCommentSchema>;

// -----------------------------------------------------------------------------
// Comment payload types
//
// features/comments/repository.ts の getCommentsByRouteId と createComment は
// Prisma の include / default 指定が違うため、返却型が 2 通り存在する:
//   - GET  /api/v1/comments → CommentWithIncludes (user + likes 付き)
//   - POST /api/v1/comments → PostCommentResponse  (user/likes はあることもないことも)
//
// クライアント側の useComments hook で `as any` を使わずに型安全に扱えるよう、
// ここに payload 型を集約する (Prisma の型生成を利用した single source of truth)。
// -----------------------------------------------------------------------------

/** コメントに埋め込むユーザーの select (id / name / icon のみ公開) */
export const COMMENT_USER_SELECT = {
  id: true,
  name: true,
  icon: true,
} as const satisfies Prisma.UserSelect;

/** コメントに埋め込まれるユーザー情報 */
export type CommentUserPayload = Prisma.UserGetPayload<{
  select: typeof COMMENT_USER_SELECT;
}>;

/** コメントに紐づく like 要素の最小形。 like button の hasLiked 判定に userId だけ使う */
export type LikeSummary = Prisma.LikeGetPayload<Prisma.LikeDefaultArgs>;

/**
 * GET /api/v1/comments?routeId=... のレスポンス item 型。
 * repository の `include: { user, likes: true }` と整合する。
 */
export type CommentWithIncludes = Prisma.CommentGetPayload<{
  include: {
    user: { select: typeof COMMENT_USER_SELECT };
    likes: true;
  };
}>;

/**
 * POST /api/v1/comments のレスポンス型。
 *
 * サーバーの createComment は bare Prisma.Comment を返すので user/likes は入らない。
 * 将来サーバー側で include を追加する可能性を見越し、 optional で持っておく
 * (クライアントはあれば使い、無ければ optimistic dummy の値で埋める)。
 */
export type PostCommentResponse = Prisma.CommentGetPayload<Prisma.CommentDefaultArgs> & {
  user?: CommentUserPayload;
  likes?: LikeSummary[];
};
