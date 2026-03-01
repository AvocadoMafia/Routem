import z from "zod";

export const GetCommentsSchema = z.object({
    take: z.number().optional(),
    onlyMine: z.boolean().optional(),
    without: z.array(z.string()).optional(),
});

export type GetRoutesType = z.infer<typeof GetCommentsSchema>;