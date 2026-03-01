import z from "zod";

export const GetCommentsSchema = z.object({
    take: z.number().optional(),
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

export type GetRoutesType = z.infer<typeof GetCommentsSchema>;
export type CreateCommentType = z.infer<typeof CreateCommentSchema>;
export type DeleteCommentType = z.infer<typeof DeleteCommentSchema>;