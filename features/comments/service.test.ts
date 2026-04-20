import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * commentsService の最小 integration-style ユニットテスト。
 *
 * scaffolding は features/__tests__/helpers.ts の pattern をそのまま採用している。
 * 他の features/**\/service.test.ts でも同じ構造 (hoisted mock + vi.mock + 型付き builder) で
 * 書けるよう、意図的にシンプル&冗長に記述している。
 *
 * === 目的 ===
 * - 真の Prisma / Supabase に接続せず、 vi.fn() の spy で DB 呼び出しを差し替える
 * - service 層のビジネスロジック (cursor 計算、権限チェック、throw message の正確性) を検証
 * - 将来のテスト拡張時に 「このファイルを真似してね」 のテンプレートになる
 */

// ---------------------------------------------------------------------------
// vi.hoisted: `vi.mock` のファクトリより先に評価される。
// ここで prisma / supabase mock の「実体」を束ねて保持する。
// hoisted 内で helpers.ts の関数は使えない (同期 import できないため) ので、
// 必要最小限の model だけインラインで組み立てる。
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  const buildModel = () => ({
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
  });
  const prisma = {
    comment: buildModel(),
    route: buildModel(),
    user: buildModel(),
    like: buildModel(),
    image: buildModel(),
    follow: buildModel(),
    view: buildModel(),
    invite: buildModel(),
    routeCollaborator: buildModel(),
    $transaction: vi.fn(),
  };
  // $transaction: コールバックを同じ mock object で呼び戻すことで、 service 側の
  // `tx.comment.findUnique(...)` が `prisma.comment.findUnique` と同じ spy を指すようにする。
  prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") return (arg as (tx: typeof prisma) => unknown)(prisma);
    return arg;
  });

  return { prisma };
});

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => mocks.prisma,
  // commentsService が将来 Redis / Meilisearch を触ったら追記する
}));

// ---------------------------------------------------------------------------
// mock を貼ってから service を import する (import 順序重要)
// ---------------------------------------------------------------------------
import { commentsService } from "./service";

beforeEach(() => {
  // 各 model の vi.fn をリセット。 $transaction の実装は次の afterEach/beforeEach で再注入。
  const prismaAny = mocks.prisma as Record<string, unknown>;
  for (const key of Object.keys(prismaAny)) {
    if (key === "$transaction") continue;
    const model = prismaAny[key] as Record<string, ReturnType<typeof vi.fn>>;
    for (const method of Object.keys(model)) {
      model[method].mockReset();
    }
  }
  mocks.prisma.$transaction.mockReset();
  mocks.prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") return (arg as (tx: typeof mocks.prisma) => unknown)(mocks.prisma);
    return arg;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// テストケース
// ---------------------------------------------------------------------------

describe("commentsService.getCommentsByRouteId", () => {
  it("正常系: routeId で絞り込んで items と nextCursor を返す", async () => {
    // 15 件 (take=15) ちょうど返して nextCursor が立つケース
    const fakeComments = Array.from({ length: 15 }, (_, i) => ({
      id: `c${i}`,
      text: `comment ${i}`,
      routeId: "route-1",
      userId: "u1",
      createdAt: new Date(`2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`),
      user: { id: "u1", name: "Alice", icon: null },
      likes: [],
    }));
    mocks.prisma.comment.findMany.mockResolvedValue(fakeComments);

    const res = await commentsService.getCommentsByRouteId("route-1", 15);

    expect(res.items).toHaveLength(15);
    expect(res.items[0].id).toBe("c0");
    // nextCursor は base64(createdAt|id) 形式で空文字ではないことだけ担保 (encodeCursor の実装詳細には依存させない)
    expect(res.nextCursor).toBeTruthy();
    expect(typeof res.nextCursor).toBe("string");

    // repository が `where: { routeId, ...cursorWhere }` / `take=15` / include: user+likes で呼ばれていること
    expect(mocks.prisma.comment.findMany).toHaveBeenCalledTimes(1);
    const callArg = mocks.prisma.comment.findMany.mock.calls[0][0];
    expect(callArg.where.routeId).toBe("route-1");
    expect(callArg.take).toBe(15);
    expect(callArg.include).toMatchObject({
      user: { select: { id: true, name: true, icon: true } },
      likes: true,
    });
  });

  it("空結果: 存在しない routeId → items=[], nextCursor=null", async () => {
    mocks.prisma.comment.findMany.mockResolvedValue([]);

    const res = await commentsService.getCommentsByRouteId("non-existent-route", 15);

    expect(res.items).toEqual([]);
    expect(res.nextCursor).toBeNull();
    expect(mocks.prisma.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it("件数が take 未満の時は nextCursor=null (ページ終端判定)", async () => {
    // take=15 だが 3 件しか返らないケース → これ以降のページは無い
    const fakeComments = Array.from({ length: 3 }, (_, i) => ({
      id: `c${i}`,
      text: `x`,
      routeId: "r",
      userId: "u",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      user: { id: "u", name: "A", icon: null },
      likes: [],
    }));
    mocks.prisma.comment.findMany.mockResolvedValue(fakeComments);

    const res = await commentsService.getCommentsByRouteId("r", 15);

    expect(res.items).toHaveLength(3);
    expect(res.nextCursor).toBeNull();
  });
});

describe("commentsService.deleteComment", () => {
  it("存在しない comment → 'Not Found' を投げる (handleError で 404 に変換される)", async () => {
    mocks.prisma.comment.findUnique.mockResolvedValue(null);

    await expect(
      commentsService.deleteComment("user-1", "non-existent-comment-id"),
    ).rejects.toThrowError("Not Found");

    // trail: tx.comment.findUnique は呼ばれるが delete は呼ばれない
    expect(mocks.prisma.comment.findUnique).toHaveBeenCalledWith({
      where: { id: "non-existent-comment-id" },
    });
    expect(mocks.prisma.comment.delete).not.toHaveBeenCalled();
  });

  it("他人の comment → 'Unauthorized' を投げる (handleError で 401 に変換される)", async () => {
    mocks.prisma.comment.findUnique.mockResolvedValue({
      id: "c1",
      text: "someone else's",
      userId: "other-user",
      routeId: "r1",
      createdAt: new Date(),
    });

    await expect(
      commentsService.deleteComment("my-user", "c1"),
    ).rejects.toThrowError("Unauthorized");

    expect(mocks.prisma.comment.delete).not.toHaveBeenCalled();
  });

  it("自分の comment → 削除が実行される", async () => {
    mocks.prisma.comment.findUnique.mockResolvedValue({
      id: "c1",
      text: "mine",
      userId: "me",
      routeId: "r1",
      createdAt: new Date(),
    });
    mocks.prisma.comment.delete.mockResolvedValue({
      id: "c1",
      text: "mine",
      userId: "me",
      routeId: "r1",
      createdAt: new Date(),
    });

    const result = await commentsService.deleteComment("me", "c1");

    expect(result.id).toBe("c1");
    expect(mocks.prisma.comment.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
    // $transaction が 1 回呼ばれる (service が transactional 削除を明示しているため)
    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});
