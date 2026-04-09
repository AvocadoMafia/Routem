import { z } from "zod";

export const GetRoutesMeSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type GetRoutesMeType = z.infer<typeof GetRoutesMeSchema>;
