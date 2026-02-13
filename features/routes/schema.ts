import { z } from "zod";
import { WaypointSchema, TransportationSchema } from "../database_schema";

export type postRouteSchema = z.infer<typeof PostRouteSchema>;

export const GetRoutesSchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    authorId: z.string().optional(),
});

export const PostRouteSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
    description: z.string(),
    category: z.string().min(1, "Category is required"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL"),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).min(1, "At least one route item is required"),
});

