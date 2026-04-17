import { z } from "zod";

export const GetImagesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(15),
  cursor: z.string().optional(),
});
export type GetImagesType = z.infer<typeof GetImagesSchema>;
