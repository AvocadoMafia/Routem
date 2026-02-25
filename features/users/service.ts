import { usersRepository } from "./repository"

// ビジネスロジック層
// バリデーション→ロジック→throw error or return data
// DBの整合性チェックなどを担当
export const usersService = {
  getUserById: async (id: string) => {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
    },

  //ユーザー情報の更新処理
  updateUser: async (id: string, data: any) => {
    const user = await usersRepository.updateUser(id, data);
    if(!user) {
      throw new Error("Update failed");
    }
    return user;
  }

}

