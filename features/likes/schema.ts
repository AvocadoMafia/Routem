import z from "zod";
import { LikeViewTarget } from "@prisma/client";

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

export type CreateLikeType = z.infer<typeof CreateLikeSchema>;
export type DeleteLikeType = z.infer<typeof DeleteLikeSchema>;
