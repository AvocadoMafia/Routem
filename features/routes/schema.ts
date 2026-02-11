import { z } from "zod";

export const getRoutesSchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number),
    visibility: z.enum(["public", "private"]).optional(),
    authorId: z.string().optional(),
});