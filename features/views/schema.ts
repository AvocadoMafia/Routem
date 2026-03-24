import z from "zod";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";

// helper: boolean query ("true"|"false"|boolean) -> boolean
const BoolParam = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((v) => v === true || v === "true");

// GET /api/v1/views query schema
// route? user? take?
export const GetViewsQuerySchema = z.object({
  route: BoolParam.optional(),
  user: BoolParam.optional(),
  take: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .transform((n: any) => (typeof n === "string" ? Number(n) : n))
    .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
    .default(DEFAULT_LIMIT)
    .optional(),
});
export type GetViewsQuery = z.infer<typeof GetViewsQuerySchema>;
