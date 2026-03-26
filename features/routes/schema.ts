import { z } from "zod";
import { WaypointSchema, TransportationSchema } from "../database_schema";

import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";

export const GetRoutesSchema = z.object({
    authorId: z.string().uuid().optional(),
    createdAfter: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    limit: z
        .union([z.string().regex(/^\d+$/), z.number()])
        .transform((n: any) => (typeof n === "string" ? Number(n) : n))
        .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
        .default(DEFAULT_LIMIT)
        .optional(),
    cursor: z.string().optional(),
    type: z.enum(["recommend", "user_recommend", "related", "trending", "user_posts"]).optional(),
    targetId: z.string().uuid().optional(),
    orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
});
export type GetRoutesType = z.infer<typeof GetRoutesSchema>;

// Search Routes Schema - limit-offset pagination
export const SearchRoutesSchema = z.object({
    q: z.string().optional(),
    limit: z
        .union([z.string().regex(/^\d+$/), z.number()])
        .transform((n: any) => (typeof n === "string" ? Number(n) : n))
        .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
        .default(DEFAULT_LIMIT)
        .optional(),
    offset: z
        .union([z.string().regex(/^\d+$/), z.number()])
        .transform((n: any) => (typeof n === "string" ? Number(n) : n))
        .transform((n) => Math.max(0, n))
        .default(0)
        .optional(),
    orderBy: z.enum(["relevant", "latest", "likes"]).default("relevant").optional(),
    routeFor: z.string().optional(),
    month: z.string().optional(),
});
export type SearchRoutesType = z.infer<typeof SearchRoutesSchema>;

export const PostRouteSchema = z.object({
    description: z.string(),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).min(1, "At least one route item is required"),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL"),
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
    routeFor: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]),
    month: z.number().int().min(0).max(12),
    budget: z.object({
        currency: z.enum(["JPY", "USD", "EUR", "GBP", "KRW", "TWD", "CNY", "THB", "VND", "SGD", "MYR", "PHP", "AUD", "CAD", "OTHER"]),
        amount: z.number().min(0),
        note: z.string().optional(),
    }),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
});
export type postRouteType = z.infer<typeof PostRouteSchema>;

export const PatchRouteSchema = z.object({
    id: z.string().uuid("Invalid route ID"),
    description: z.string().optional(),
    items: z.array(z.union([WaypointSchema, TransportationSchema])).optional(),
    thumbnailImageSrc: z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL").optional(),
    title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters").optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
    routeFor: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]).optional(),
    month: z.number().int().min(0).max(12).optional(),
    budget: z.object({
        currency: z.enum(["JPY", "USD", "EUR", "GBP", "KRW", "TWD", "CNY", "THB", "VND", "SGD", "MYR", "PHP", "AUD", "CAD", "OTHER"]),
        amount: z.number().min(0),
        note: z.string().optional(),
    }).optional(),
    tags: z.array(z.string()).min(1).optional(),
})
export type PatchRouteType = z.infer<typeof PatchRouteSchema>;

export const DeleteRouteSchema = z.object({
    id:z.string().uuid("Invalid route ID"),
})

export type DeleteRouteType = z.infer<typeof DeleteRouteSchema>;