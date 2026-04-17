import { z } from "zod";

export const ImageRecommendationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
  }),
  imageUrls: z.array(z.string()),
});

export type ImageRecommendationResponseType = z.infer<typeof ImageRecommendationResponseSchema>;
