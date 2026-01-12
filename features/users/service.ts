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
  
}