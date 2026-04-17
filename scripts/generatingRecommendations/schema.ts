import { z } from "zod";

export const RecommendGrobalSchema = z.array(
  z.object({
    id: z.string(),
    score: z.number(),
  }),
);

export type RecommendGlobalType = z.infer<typeof RecommendGrobalSchema>;
