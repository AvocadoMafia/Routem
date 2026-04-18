import { z } from "zod";
import { MAX_LIMIT, DEFAULT_LIMIT } from "@/lib/server/constants";
import {Language, Locale} from "@prisma/client";

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
  type: z.enum(["trending"]).optional(),
});
export type GetUsersType = z.infer<typeof GetUsersSchema>;

/**
 * GET、POSTのresponse
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  bio: z.string().optional(),
  locale: z.nativeEnum(Locale).optional(),
  language: z.nativeEnum(Language).optional(),
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
  locale: true,
  language: true,
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

// Follows GET query: type? userId? take? cursor?
export const GetFollowsQuerySchema = z.object({
  type: z.enum(["following", "follower"]).default("following"),
  userId: z.string().uuid().optional(), // 省略時は自分
  take: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .transform((n: any) => (typeof n === "string" ? Number(n) : n))
    .transform((n) => Math.max(1, Math.min(MAX_LIMIT, n)))
    .default(30)
    .optional(),
  cursor: z.string().optional(),
});
export type GetFollowsQuery = z.infer<typeof GetFollowsQuerySchema>;

