import { z } from "zod";
import dotenv from "dotenv";

export const WaypointSchema = z.object({
    id: z.string(),
    type: z.literal('waypoint'),
    name: z.string(),
    images: z.array(z.string().startsWith(process.env.MINIO_ENDPOINT || "", "Image must be a valid URL")).max(3).optional(),
    memo: z.string(),
    order: z.number(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    mapboxId: z.string().optional(),
});

export const TransportationSchema = z.object({
    id: z.string(),
    type: z.literal('transportation'),
    method: z.enum(["walk", "train", "bus", "car", "other"]),
    memo: z.string().optional(),
    order: z.number(),
});