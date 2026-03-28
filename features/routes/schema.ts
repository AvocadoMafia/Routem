import { z } from "zod";
import { TransportationSchema, WaypointSchema } from "../database_schema";

export const GetRoutesSchema = z
  .object({
    authorId: z.string().uuid().optional(),
    createdAfter: z
      .string()
      .datetime()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    limit: z.coerce.number().max(100).default(20),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
    q: z.string().default(""),
    lat: z.coerce.number().optional(),
    lon: z.coerce.number().optional(),
    who: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]).optional(),
  })
  .refine(
    (data) => {
      return (
        (data.lat != undefined && data.lon != undefined) ||
        (data.lat == undefined && data.lon == undefined)
      );
    },
    {
      message: "lat, lonはセットで必要です",
      path: ["lat"],
    },
  );
export type GetRoutesType = z.infer<typeof GetRoutesSchema>;

export const PostRouteSchema = z.object({
  description: z.string(),
  items: z
    .array(z.union([WaypointSchema, TransportationSchema]))
    .min(1, "At least one route item is required"),
  thumbnailImageSrc: z
    .string()
    .startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL"),
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
  routeFor: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]),
  month: z.number().int().min(0).max(12),
  budget: z.object({
    currency: z.enum([
      "JPY",
      "USD",
      "EUR",
      "GBP",
      "KRW",
      "TWD",
      "CNY",
      "THB",
      "VND",
      "SGD",
      "MYR",
      "PHP",
      "AUD",
      "CAD",
      "OTHER",
    ]),
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
  thumbnailImageSrc: z
    .string()
    .startsWith(process.env.MINIO_ENDPOINT || "", "Thumbnail image must be a valid URL")
    .optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
  routeFor: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]).optional(),
  month: z.number().int().min(0).max(12).optional(),
  budget: z
    .object({
      currency: z.enum([
        "JPY",
        "USD",
        "EUR",
        "GBP",
        "KRW",
        "TWD",
        "CNY",
        "THB",
        "VND",
        "SGD",
        "MYR",
        "PHP",
        "AUD",
        "CAD",
        "OTHER",
      ]),
      amount: z.number().min(0),
      note: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).min(1).optional(),
});
export type PatchRouteType = z.infer<typeof PatchRouteSchema>;

export const DeleteRouteSchema = z.object({
  id: z.string().uuid("Invalid route ID"),
});

export type DeleteRouteType = z.infer<typeof DeleteRouteSchema>;
