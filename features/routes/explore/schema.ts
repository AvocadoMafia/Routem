import { z } from "zod";

export const GetRoutesExploreSchema = z
  .object({
    limit: z.coerce.number().min(1).max(100).default(20),
    q: z.string().default(""),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    who: z.enum(["EVERYONE", "FAMILY", "FRIENDS", "COUPLE", "SOLO"]).optional(),
    when: z
      .preprocess((value) => {
        if (value === undefined || value === null || value === "") return undefined;
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        }
        return value;
      }, z.array(z.coerce.number().int().min(1).max(12)).min(1).max(12))
      .optional(),
    currencyCode: z
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
    minAmount: z.coerce.number().min(0).optional(),
    maxAmount: z.coerce.number().min(0).optional(),
    offset: z.coerce.number().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (
      (data.lat != undefined && data.lng == undefined) ||
      (data.lat == undefined && data.lng != undefined)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["lat"],
        message: "lat, lngはセットで必要です",
      });
    }

    if (
      data.minAmount !== undefined &&
      data.maxAmount !== undefined &&
      data.minAmount > data.maxAmount
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["minAmount"],
        message: "minAmountはmaxAmount以下である必要があります",
      });
    }

    const budget_fields = [data.currencyCode, data.minAmount, data.maxAmount];
    const has_some = budget_fields.some((v) => v !== undefined);
    const has_all = budget_fields.every((v) => v !== undefined);

    if (has_some && !has_all) {
      ctx.addIssue({
        code: "custom",
        path: ["data.currencyCode"],
        message: "currencyCode, minAmount, maxAmountは全てセットで必要です",
      });
    }

    if (data.when) {
      const unique = new Set(data.when);
      if (unique.size !== data.when.length) {
        ctx.addIssue({
          path: ["when"],
          message: "whenに重複がある",
          code: "custom",
        });
      }
    }
  });

export type GetRoutesExploreType = z.infer<typeof GetRoutesExploreSchema>;
