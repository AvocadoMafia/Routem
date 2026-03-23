import { GetUsersType } from "./schema";
import { usersRepository } from "./repository"
import { getPrisma } from "@/lib/config/server";

// ビジネスロジック層
// バリデーション→ロジック→throw error or return data
// DBの整合性チェックなどを担当
export const usersService = {
  getUsers: async (params: GetUsersType) => {
    try {
      return await usersRepository.findMany(params);
    } catch (e) {
      throw e;
    }
  },

  getUserById: async (id: string, requesterId?: string) => {
    try {
      const user = await usersRepository.findById(id, requesterId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      throw e;
    }
  },

  //ユーザー情報の更新処理
  updateUser: async (id: string, data: any) => {
    try {
      const user = await usersRepository.updateUser(id, data);
      if (!user) {
        throw new Error("Update failed");
      }
      return user;
    } catch (e) {
      throw e;
    }
  },

  /**
   * フォローの切り替え（トランザクション使用）
   * TOCTOU脆弱性防止のため、チェックと更新を単一トランザクションで実行
   */
  toggleFollow: async (followingId: string, followerId: string) => {
    if (followingId === followerId) {
      throw new Error("Cannot follow yourself");
    }

    return getPrisma().$transaction(async (tx) => {
      const existing = await tx.follow.findUnique({
        where: { followingId_followerId: { followingId, followerId } },
      });

      if (existing) {
        await tx.follow.delete({
          where: { followingId_followerId: { followingId, followerId } },
        });
      } else {
        await tx.follow.create({
          data: { followingId, followerId },
        });
      }

      const followerCount = await tx.follow.count({ where: { followingId } });
      return { followed: !existing, followerCount };
    });
  },

  // 指定ユーザーがフォローしているユーザー一覧
  getFollowings: async (userId: string, limit?: number) => {
    try {
      return await usersRepository.findFollowings(userId, limit);
    } catch (e) {
      throw e;
    }
  },
}

