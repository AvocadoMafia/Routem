import {getPrisma} from "@/lib/db/prisma";
import {UpdateUserType, GetUsersType} from "@/features/users/schema";
import { ImageStatus, Prisma } from "@prisma/client";
import { buildCursorWhere } from "@/lib/db/cursor";
import { ValidationError } from "@/lib/api/server";
          

export const USER_SELECT = {
    id: true,
    name: true,
    bio: true,
    icon: true,
    background: true,
    locale: true,
    _count: {
        select: {
            routes: true,
            followers: true,
            followings: true,
        },
    },
} as const;

export const USER_WITH_COUNT_SELECT = {
    id: true,
    name: true,
    bio: true,
    icon: true,
    background: true,
    locale: true,
    _count: {
        select: {
            routes: true,
            followers: true,
            followings: true,
        },
    },
} as const;


export const usersRepository = {
  findMany: async (params: GetUsersType) => {
    try {
      return await getPrisma().user.findMany({
        take: params.limit,
        select: USER_SELECT,
      });
    } catch (e) {
      throw e;
    }
  },

  /**
   * フォロワー数 desc でランキング。同数の場合は投稿数(routes) desc → id でタイブレーク。
   */
  findTrending: async (limit: number) => {
    try {
      return await getPrisma().user.findMany({
        take: limit,
        orderBy: [
          { followers: { _count: "desc" } },
          { routes: { _count: "desc" } },
          { id: "asc" },
        ],
        select: USER_WITH_COUNT_SELECT,
      });
    } catch (e) {
      throw e;
    }
  },

  findById: async (id: string, requesterId?: string) => {
    try {
        const user = await getPrisma().user.findUnique({
            where: { id: id },
            include: {
                icon: true,
                background: true,
                _count: {
                    select: {
                        routes: true,
                        followers: true,
                        followings: true,
                    }
                }
            }
        });

      return user;
    } catch (e) {
      throw e;
    }
  },

  deleteUser: async (id: string) => {
    try {
      return await getPrisma().user.delete({
        where: { id: id },
      });
    } catch (e) {
      throw e;
    }
  },

  updateUser: async (id: string, data: UpdateUserType) => {
    try {
      return getPrisma().$transaction(async (tx) => {
        // 現在のユーザー情報を取得して、古い画像を確認する
        const currentUser = await tx.user.findUnique({
          where: { id },
          include: { icon: true, background: true }
        });

        if (!currentUser) throw new Error("Not Found");

        // アイコンの更新がある場合
        if (data.icon) {
          // data.icon は imageId として扱う
          const newIcon = await tx.image.findUnique({ where: { id: data.icon } });
          // クライアントが投げた imageId が存在しない = bad request として 400 に寄せる
          if (!newIcon) throw new ValidationError("New icon image not found");

          // 古いアイコンがある場合、UNUSEDにする
          if (currentUser.icon && currentUser.icon.id !== data.icon) {
            await tx.image.update({
              where: { id: currentUser.icon.id },
              data: {
                status: ImageStatus.UNUSED,
                userIconId: null
              }
            });
          }

          // 新しいアイコンを ADOPTED にし、ユーザーに関連付ける
          await tx.image.update({
            where: { id: data.icon },
            data: {
              status: ImageStatus.ADOPTED,
              userIconId: id
            }
          });
        }

        // 背景の更新がある場合
        if (data.background) {
          const newBg = await tx.image.findUnique({ where: { id: data.background } });
          // アイコンと同じ理由で 400 VALIDATION_ERROR
          if (!newBg) throw new ValidationError("New background image not found");

          if (currentUser.background && currentUser.background.id !== data.background) {
            await tx.image.update({
              where: { id: currentUser.background.id },
              data: {
                status: ImageStatus.UNUSED,
                userBackgroundId: null
              }
            });
          }

          await tx.image.update({
            where: { id: data.background },
            data: {
              status: ImageStatus.ADOPTED,
              userBackgroundId: id
            }
          });
        }

        // ユーザー基本情報の更新
        const user = await tx.user.update({
          where: { id: id },
          data: {
            name: data.name,
            bio: data.bio,
            locale: data.locale,
            language: data.language,
          },
          include: {
            icon: true,
            background: true,
          }
        });

        return user;
      });
    } catch (e) {
      throw e;
    }
  },

  findFollow: async (followingId: string, followerId: string) => {
    try {
      return await getPrisma().follow.findUnique({
        where: {
          followingId_followerId: { followingId, followerId },
        },
      });
    } catch (e) {
      throw e;
    }
  },

  createFollow: async (followingId: string, followerId: string) => {
    try {
      return await getPrisma().follow.create({
        data: { followingId, followerId },
      });
    } catch (e) {
      throw e;
    }
  },

  deleteFollow: async (followingId: string, followerId: string) => {
    try {
      return await getPrisma().follow.delete({
        where: {
          followingId_followerId: { followingId, followerId },
        },
      });
    } catch (e) {
      throw e;
    }
  },

  countFollowers: async (followingId: string) => {
    try {
      return await getPrisma().follow.count({
        where: { followingId },
      });
    } catch (e) {
      throw e;
    }
  },

  // 指定ユーザーがフォローしているユーザー一覧を取得（BFF: ユーザーのみ）
  findFollowings: async (userId: string, limit?: number) => {
    try {
      const follows = await getPrisma().follow.findMany({
        where: { followerId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          following: {
            select: USER_SELECT,
          },
        },
      });
      return follows.map((f) => f.following);
    } catch (e) {
      throw e;
    }
  },

  // 指定ユーザーのFollowレコード一覧を取得（フォローそのもの + followingユーザーを含む）
  findFollowingRecords: async (userId: string, limit?: number) => {
    try {
      return await getPrisma().follow.findMany({
        where: { followerId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          following: {
            select: USER_SELECT,
          },
        },
      });
    } catch (e) {
      throw e;
    }
  },

  // 動的include対応のFollowレコード取得（カーソルベース）
  findFollowRecords: async (
    userId: string,
    opts: { type: "following" | "follower"; include?: { following?: boolean; follower?: boolean }; take?: number; cursor?: string }
  ) => {
    try {
      const include: any = {};
      if (opts.include?.following) include.following = { select: USER_SELECT };
      if (opts.include?.follower) include.follower = { select: USER_SELECT };

      // カーソル条件を構築
      const cursorWhere = buildCursorWhere(opts.cursor);
      
      // typeに応じて followerId か followingId を指定
      const where: any = {
        ...(opts.type === "following" ? { followerId: userId } : { followingId: userId }),
        ...cursorWhere,
      };

      return await getPrisma().follow.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: opts.take ?? 30,
        include: Object.keys(include).length ? include : undefined,
      });
    } catch (e) {
      throw e;
    }
  },
};
