import { z } from "zod";
import { SpotSource, TransitMode } from "@prisma/client";

export const WaypointSchema = z
  .object({
    id: z.string().uuid().optional(),
    type: z.literal("waypoint"),
    name: z.string(),
    images: z
      .array(z.string().url("Image must be a valid URL"))
      .max(3)
      .optional(),
    memo: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    source: z.nativeEnum(SpotSource).optional(),
    sourceId: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        (data.lat != undefined && data.lng != undefined) ||
        (data.lat == undefined && data.lng == undefined)
      );
    },
    {
      message: "lat, lonはセットで必要です",
      path: ["lat"],
    },
  );

export const TransportationSchema = z.object({
  type: z.literal("transportation"),
  method: z.nativeEnum(TransitMode),
  memo: z.string().optional(),
  duration: z.number().min(0, "Duration must be non-negative").optional(),
  distance: z.number().min(0, "Distance must be non-negative").optional(),
});
