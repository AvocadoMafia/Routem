import z from "zod";
import { LikeViewTarget } from "@prisma/client";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";

export const CreateLikeSchema = z.object({
    target: z.nativeEnum(LikeViewTarget),
    routeId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
}).refine(data => {
    if (data.target === LikeViewTarget.ROUTE) {
        return !!data.routeId && !data.commentId;
    } else if (data.target === LikeViewTarget.COMMENT) {
        return !!data.commentId && !data.routeId;
    }
    return false;
}, {
    message: "routeId or commentId must be provided based on target",
    path: ["routeId", "commentId"]
});

export const DeleteLikeSchema = z.object({
    id: z.string().uuid(),
});

// helper: boolean query ("true"|"false"|boolean) -> boolean
const BoolParam = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((v) => v === true || v === "true");

export const GetLikesQuerySchema = z.object({
  route: BoolParam.optional(),
  user: BoolParam.optional(),
  comment: BoolParam.optional(),
  take: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .transform((n: any) => (typeof n === "string" ? Number(n) : n))
    .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
    .default(DEFAULT_LIMIT)
    .optional(),
});
export type GetLikesQuery = z.infer<typeof GetLikesQuerySchema>;

export type CreateLikeType = z.infer<typeof CreateLikeSchema>;
export type DeleteLikeType = z.infer<typeof DeleteLikeSchema>;
