import { z } from "zod";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";

//
/**
 * APIで使うUserの共通スキーマ
 */
export type User = z.infer<typeof UserSchema>;

export const GetUsersSchema = z.object({
  limit: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .transform((n: any) => (typeof n === "string" ? Number(n) : n))
    .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
    .default(DEFAULT_LIMIT)
    .optional(),
});
export type GetUsersType = z.infer<typeof GetUsersSchema>;

/**
 * GET、POSTのresponse
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  bio: z.string().optional(),
  icon: z.string().optional(),
  background: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * GETのバリデーション
 */
export const UserIdSchema = UserSchema.pick({ id: true });

/**
 * POSTのバリデーション
 */
export const CreateUserSchema = UserSchema.omit({ id: true });

/**
 * PATCHのバリデーション
 */
export const UpdateUserSchema = UserSchema.pick({
  name: true,
  bio: true,
})
  .extend({
    icon: z.string().optional(), // imageId を受け取る
    background: z.string().optional(), // imageId を受け取る
  })
  .partial()
  .strict();

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

// helper: boolean query parser
const BoolParam = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((v) => v === true || v === "true");

// Followings GET query: following? follower? take? cursor?
export const GetFollowingsQuerySchema = z.object({
  following: BoolParam.optional(),
  follower: BoolParam.optional(),
  take: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .transform((n: any) => (typeof n === "string" ? Number(n) : n))
    .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
    .default(30)
    .optional(),
  cursor: z.string().optional(),
});
export type GetFollowingsQuery = z.infer<typeof GetFollowingsQuerySchema>;

