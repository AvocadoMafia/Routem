import { z } from "zod";

export const ImageRecommendationRequestSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  nextCursor: z.string().optional(),
});

export type ImageRecommendationRequestType = z.infer<typeof ImageRecommendationRequestSchema>;

export const ImageRecommendationResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      author: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      }),
      imageUrls: z.array(z.string()),
    }),
  ),
  nextCursor: z.string().nullable(),
});

export type ImageRecommendationResponseType = z.infer<typeof ImageRecommendationResponseSchema>;
