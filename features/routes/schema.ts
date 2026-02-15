import { z } from "zod";
import { WaypointSchema, TransportationSchema } from "../database_schema";
import { create } from "domain";

export type postRouteSchema = z.infer<typeof PostRouteSchema>;

export const GetRoutesSchema = z.object({
    authorId: z.string().uuid().optional(),
    category: z.string().optional(),
    createdAfter: z.string().datetime().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});
export type GetRoutesSchema = z.infer<typeof GetRoutesSchema>;

export const PostRouteSchema = z.object({
    category: z.string().min(1, "Category is required"),
    description: z.string(),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).min(1, "At least one route item is required"),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL"),
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

