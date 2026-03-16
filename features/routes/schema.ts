import { z } from "zod";
import { WaypointSchema, TransportationSchema } from "../database_schema";
import { create } from "domain";

export const GetRoutesSchema = z.object({
    // Accept standard RFC4122 UUIDs OR our fixed seeded UUIDs (uuid-like but non-RFC versions)
    authorId: z.union([
        z.string().uuid(),
        z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    ]).optional(),
    categoryId: z.string().uuid().optional(),
    createdAfter: z.string().datetime().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
});
export type GetRoutesType = z.infer<typeof GetRoutesSchema>;

export const PostRouteSchema = z.object({
    categoryId: z.string().uuid(),
    description: z.string(),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).min(1, "At least one route item is required"),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL"),
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
});
export type postRouteType = z.infer<typeof PostRouteSchema>;

export const PatchRouteSchema = z.object({
    id: z.string().uuid("Invalid route ID"),
    categoryId: z.string().uuid().optional(),
    description: z.string().optional(),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).optional(),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL").optional(),
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters").optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
})
export type PatchRouteType = z.infer<typeof PatchRouteSchema>;

export const DeleteRouteSchema = z.object({
    id:z.string().uuid("Invalid route ID"),
})

export type DeleteRouteType = z.infer<typeof DeleteRouteSchema>;