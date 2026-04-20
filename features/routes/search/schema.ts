// Search Routes Schema - limit-offset pagination
import {z} from "zod";
import { RouteFor } from "@prisma/client";

export const SearchRoutesSchema = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
    orderBy: z.enum(["relevant", "latest", "likes"]).default("relevant").optional(),
    routeFor: z.nativeEnum(RouteFor).optional(),
    month: z.string().optional(),
});
export type SearchRoutesType = z.infer<typeof SearchRoutesSchema>;
