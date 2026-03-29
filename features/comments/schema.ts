import z from "zod";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";

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