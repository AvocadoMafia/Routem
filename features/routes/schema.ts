import { z } from "zod";
import { TransportationSchema, WaypointSchema } from "../database_schema";

// TODO:型の重複部分をnon-optionalにして共通化するべき
export const GetRoutesSchema = z.object({
  authorId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  type: z
    .enum(["recommend", "user_recommend", "related", "trending", "user_posts", "followings"])
    .optional(),
  targetId: z.string().uuid().optional(),
  tag: z.string().min(1).optional(),
});
export type GetRoutesType = z.infer<typeof GetRoutesSchema>;

export const PostRouteSchema = z.object({
  description: z.string(),
  items: z
    .array(z.array(z.union([WaypointSchema, TransportationSchema])))
    .min(1, "At least one day is required"),
  thumbnailImageSrc: z
    .string()
    .url("Thumbnail image must be a valid URL"),
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
  who: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]),
  date: z.string().datetime(),
  budget: z.object({
    currencyCode: z.enum([
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
  }),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});
export type postRouteType = z.infer<typeof PostRouteSchema>;

export const PatchRouteSchema = z.object({
  id: z.string().uuid("Invalid route ID"),
  description: z.string().optional(),
  items: z.array(z.array(z.union([WaypointSchema, TransportationSchema]))).optional(),
  thumbnailImageSrc: z
    .string()
    .url("Thumbnail image must be a valid URL")
    .optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  collaboratorPolicy: z.enum(["DISABLED", "VIEW_ONLY", "CAN_EDIT"]).optional(),
  who: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]).optional(),
  date: z.string().datetime().optional(),
  budget: z
    .object({
      currencyCode: z.enum([
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
    })
    .optional(),
  tags: z.array(z.string()).min(1).optional(),
});
export type PatchRouteType = z.infer<typeof PatchRouteSchema>;

export const DeleteRouteSchema = z.object({
  id: z.string().uuid("Invalid route ID"),
});

export type DeleteRouteType = z.infer<typeof DeleteRouteSchema>;

const RoutesDocumentsSchema = z.array(
  z.object({
    // id以外全部undefined許容してる。これはsyncToMeiliをPostとPatchで共用しているから
    id: PatchRouteSchema.shape.id,
    title: PatchRouteSchema.shape.title,
    description: PatchRouteSchema.shape.description,
    authorId: z.string().uuid().optional(),
    visibility: PatchRouteSchema.shape.visibility,
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    spotNames: z.array(z.string()).optional(),
    tags: PatchRouteSchema.shape.tags,
    month: z.array(z.number().int().min(1).max(12)).optional(),
    days: z.number().int().min(0).optional(),
    routeFor: PatchRouteSchema.shape.who,
    language: z.enum(["JA", "EN", "KO", "ZH"]).optional(),

    budgetInLocalCurrency: z.number().min(0).optional(),
    localCurrencyCode: z
      .enum([
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
      ])
      .optional(),
    budgetInUsd: z.number().min(0).optional(),
    _geo: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }),
    searchText: z.string().optional(),
  }),
);

export type RoutesDocumentsType = z.infer<typeof RoutesDocumentsSchema>;
