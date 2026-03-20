import { GetUsersType } from "./schema";
import { usersRepository } from "./repository"

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

  toggleFollow: async (followingId: string, followerId: string) => {
    try {
      if (followingId === followerId) {
        throw new Error("Cannot follow yourself");
      }

      const existing = await usersRepository.findFollow(followingId, followerId);

      if (existing) {
        await usersRepository.deleteFollow(followingId, followerId);
      } else {
        await usersRepository.createFollow(followingId, followerId);
      }

      const followed = !existing;
      const followerCount = await usersRepository.countFollowers(followingId);

      return { followed, followerCount };
    } catch (e) {
      throw e;
    }
  },
}

