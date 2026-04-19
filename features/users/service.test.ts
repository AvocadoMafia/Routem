import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * usersService のユニットテスト。 scaffolding は comments/service.test.ts と同じパターン。
 *
 * このファイルが他ファイルと違う点:
 *   - `getUserById` 等は usersRepository を経由するため、 repository を部分 mock する
 *   - `toggleFollow` は tx.follow.* を直接叩くため、 prisma mock ($transaction 経由) で十分
 *   両方のパターンを 1 ファイルで見せることで、他 service テストのテンプレートとして
 *   使い分けしやすくしている。
 */

// ---------------------------------------------------------------------------
// vi.hoisted: prisma mock + repository mock
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
    follow: buildModel(),
    user: buildModel(),
    $transaction: vi.fn(),
  };
  prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") {
      return (arg as (tx: typeof prisma) => unknown)(prisma);
    }
    return arg;
  });

  // repository 側のメソッドを個別 vi.fn() で差し替える。 service が呼ぶ API のみ列挙。
  const repo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    findTrending: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    findFollowings: vi.fn(),
    findFollowingRecords: vi.fn(),
    findFollowRecords: vi.fn(),
  };

  return { prisma, repo };
});

vi.mock("@/lib/config/server", () => ({
  getPrisma: () => mocks.prisma,
}));

vi.mock("./repository", () => ({
  usersRepository: mocks.repo,
  // USER_SELECT 等の constant を他所から import している箇所があれば、 spread して追加する
  USER_SELECT: { id: true, name: true, bio: true, icon: true },
}));

// ---------------------------------------------------------------------------
// mock 設置後に service を import
// ---------------------------------------------------------------------------
import { usersService } from "./service";
import { ValidationError } from "@/lib/server/validateParams";

beforeEach(() => {
  // prisma model の spy をリセット
  for (const key of ["follow", "user"] as const) {
    const model = mocks.prisma[key] as Record<string, ReturnType<typeof vi.fn>>;
    for (const method of Object.keys(model)) {
      model[method].mockReset();
    }
  }
  mocks.prisma.$transaction.mockReset();
  mocks.prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") {
      return (arg as (tx: typeof mocks.prisma) => unknown)(mocks.prisma);
    }
    return arg;
  });

  // repository 側の spy もリセット
  for (const key of Object.keys(mocks.repo)) {
    (mocks.repo as any)[key].mockReset();
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getUserById
// ---------------------------------------------------------------------------

describe("usersService.getUserById", () => {
  it("存在しない user → 'Not Found' を投げる (commit 69fa73e で正規化)", async () => {
    mocks.repo.findById.mockResolvedValue(null);

    await expect(usersService.getUserById("non-existent", "me")).rejects.toThrowError(
      "Not Found",
    );
    expect(mocks.repo.findById).toHaveBeenCalledWith("non-existent", "me");
  });

  it("存在する user → そのまま返す", async () => {
    const fakeUser = { id: "u1", name: "Alice", bio: "hi", icon: null };
    mocks.repo.findById.mockResolvedValue(fakeUser);

    const res = await usersService.getUserById("u1");

    expect(res).toBe(fakeUser);
    expect(mocks.repo.findById).toHaveBeenCalledWith("u1", undefined);
  });

  it("requesterId 未指定でも動く (public profile 参照ケース)", async () => {
    mocks.repo.findById.mockResolvedValue({ id: "u1", name: "Alice" });

    await usersService.getUserById("u1");

    // findById の第二引数が undefined で渡ることを担保
    expect(mocks.repo.findById.mock.calls[0][1]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// toggleFollow
// ---------------------------------------------------------------------------

describe("usersService.toggleFollow", () => {
  it("自分自身をフォロー → ValidationError を投げる (code=VALIDATION_ERROR, status=400)", async () => {
    try {
      await usersService.toggleFollow("u1", "u1");
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).code).toBe("VALIDATION_ERROR");
      expect((err as ValidationError).status).toBe(400);
      expect((err as ValidationError).message).toBe("Cannot follow yourself");
    }

    // 副作用チェック: トランザクションすら始まらない (早期バリデーション)
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
    expect(mocks.prisma.follow.findUnique).not.toHaveBeenCalled();
  });

  it("未フォロー → create + followerCount を返す", async () => {
    mocks.prisma.follow.findUnique.mockResolvedValue(null);
    mocks.prisma.follow.create.mockResolvedValue({});
    mocks.prisma.follow.count.mockResolvedValue(1);

    const res = await usersService.toggleFollow("target", "follower");

    expect(res).toEqual({ followed: true, followerCount: 1 });
    // unique key が followingId_followerId
    expect(mocks.prisma.follow.findUnique).toHaveBeenCalledWith({
      where: { followingId_followerId: { followingId: "target", followerId: "follower" } },
    });
    expect(mocks.prisma.follow.create).toHaveBeenCalledWith({
      data: { followingId: "target", followerId: "follower" },
    });
    expect(mocks.prisma.follow.delete).not.toHaveBeenCalled();
    // TOCTOU 防止: $transaction ラップが必須
    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it("既にフォロー済み → delete + followerCount-1 を返す", async () => {
    mocks.prisma.follow.findUnique.mockResolvedValue({
      followingId: "target",
      followerId: "follower",
    });
    mocks.prisma.follow.delete.mockResolvedValue({});
    mocks.prisma.follow.count.mockResolvedValue(9); // 他に 9 人残った想定

    const res = await usersService.toggleFollow("target", "follower");

    expect(res).toEqual({ followed: false, followerCount: 9 });
    expect(mocks.prisma.follow.delete).toHaveBeenCalledWith({
      where: { followingId_followerId: { followingId: "target", followerId: "follower" } },
    });
    expect(mocks.prisma.follow.create).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// getFollowRecords (cursor pagination)
// ---------------------------------------------------------------------------

describe("usersService.getFollowRecords", () => {
  it("件数が take 未満なら nextCursor=null (ページ終端)", async () => {
    mocks.repo.findFollowRecords.mockResolvedValue([
      { id: "f1", createdAt: new Date("2024-01-01T00:00:00Z") },
    ]);

    const res = await usersService.getFollowRecords("u1", { type: "following", take: 15 });

    expect(res.items).toHaveLength(1);
    expect(res.nextCursor).toBeNull();
  });

  it("件数が take と同じなら nextCursor を encode する", async () => {
    const records = Array.from({ length: 3 }, (_, i) => ({
      id: `f${i}`,
      createdAt: new Date(`2024-01-0${i + 1}T00:00:00Z`),
    }));
    mocks.repo.findFollowRecords.mockResolvedValue(records);

    const res = await usersService.getFollowRecords("u1", { type: "following", take: 3 });

    expect(res.items).toHaveLength(3);
    expect(res.nextCursor).toBeTruthy();
  });

  it("take 未指定時は repository にデフォルト 30 が渡る", async () => {
    mocks.repo.findFollowRecords.mockResolvedValue([]);

    await usersService.getFollowRecords("u1", { type: "follower" });

    expect(mocks.repo.findFollowRecords).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ take: 30 }),
    );
  });
});
