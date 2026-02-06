import { getPrisma } from "./config/server";

/**
 * 認証が未実装の間、仮のユーザーを取得するためのモックユーティリティ
 */
export async function getMockUser() {
  const prisma = getPrisma();
  
  // 常に同じIDを持つモックユーザーを返す、または作成する
  const MOCK_USER_ID = "mock-user-id-123";
  
  let user = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        name: "Mock Explorer",
        bio: "This is a mock user for development purposes.",
      }
    });
  }
  
  return user;
}
