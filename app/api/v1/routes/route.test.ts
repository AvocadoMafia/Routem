import { expect, test, vi } from "vitest";

vi.mock("@/lib/auth/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "user_123",
            email: "test@example.com",
            // 必要なユーザー情報があればここに追加
          },
        },
        error: null, // エラーなし
      }),
    },
  }),
}));

test("GETテスト", async () => {
  const res = await fetch("http://localhost:3000/api/v1/routes");
  const data = await res.json();
  console.log(data);
  expect(res.status).toBe(200);
});
// TODO: service層mockして層毎にtestした方がいいな。ここはRoute層のtestをすべし
