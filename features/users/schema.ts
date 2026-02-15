import { z } from "zod";

// 
/**
 * APIで使うUserの共通スキーマ
 */
export type User = z.infer<typeof UserSchema>;

/**
 * GET、POSTのresponse
 */
export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
});

/**
 * GETのバリデーション
 */
export const UserIdSchema = UserSchema.pick({ id: true });

/**
 * POSTのバリデーション
 */
export const CreateUserSchema = UserSchema.omit({ id: true });