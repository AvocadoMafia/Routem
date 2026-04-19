import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LikeViewTarget } from "@prisma/client";

/**
 * likesService のユニットテスト。
 *
 * features/comments/service.test.ts の scaffolding パターンをそのまま踏襲。
 * vi.hoisted で prisma を差し替え、 `@/lib/config/server` の getPrisma を mock する。
 *
 * カバー範囲:
 *   - toggleLike (ROUTE / COMMENT) の分岐
 *   - toggleLike が $transaction 内で実行されること
 *   - 不正な target/id 組み合わせで ValidationError を投げること (commit 69fa73e で正規化)
 *   - getLikes が cursor + include フラグ組合せで正しく呼び出されること
 */

// ---------------------------------------------------------------------------
// vi.hoisted: vi.mock より先に評価。 prisma mock の実体を束ねる。
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
    like: buildModel(),
    comment: buildModel(),
    route: buildModel(),
    user: buildModel(),
    $transaction: vi.fn(),
  };
  prisma.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") {
      return (arg as (tx: typeof prisma) => unknown)(prisma);
    }
    return arg;
  });
  return { prisma };
});

vi.mock("@/lib/config/server", () => ({
  getPrisma: () => mocks.prisma,
}));

// ---------------------------------------------------------------------------
// mock 設置後に service を import
// ---------------------------------------------------------------------------
import { likesService } from "./service";
import { ValidationError } from "@/lib/api/server";

beforeEach(() => {
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
    if (typeof arg === "function") {
      return (arg as (tx: typeof mocks.prisma) => unknown)(mocks.prisma);
    }
    return arg;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// toggleLike
// ---------------------------------------------------------------------------

describe("likesService.toggleLike", () => {
  it("target=ROUTE で未いいねなら create + count 1 を返す", async () => {
    // findUnique → null (未いいね) → create → count=1
    mocks.prisma.like.findUnique.mockResolvedValue(null);
    mocks.prisma.like.create.mockResolvedValue({
      id: "l1",
      userId: "u1",
      routeId: "r1",
      target: "ROUTE",
      createdAt: new Date(),
    });
    mocks.prisma.like.count.mockResolvedValue(1);

    const res = await likesService.toggleLike("u1", LikeViewTarget.ROUTE, "r1");

    expect(res).toEqual({ liked: true, likeCount: 1 });
    expect(mocks.prisma.like.findUnique).toHaveBeenCalledWith({
      where: { userId_routeId: { userId: "u1", routeId: "r1" } },
    });
    expect(mocks.prisma.like.create).toHaveBeenCalledTimes(1);
    expect(mocks.prisma.like.delete).not.toHaveBeenCalled();
    // transactional であることを担保 (TOCTOU 防止設計)
    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it("target=ROUTE で既にいいね済みなら delete + count-1 を返す", async () => {
    mocks.prisma.like.findUnique.mockResolvedValue({
      id: "l1",
      userId: "u1",
      routeId: "r1",
      target: "ROUTE",
      createdAt: new Date(),
    });
    mocks.prisma.like.delete.mockResolvedValue({});
    mocks.prisma.like.count.mockResolvedValue(4); // 他に 4 人残った想定

    const res = await likesService.toggleLike("u1", LikeViewTarget.ROUTE, "r1");

    expect(res).toEqual({ liked: false, likeCount: 4 });
    expect(mocks.prisma.like.delete).toHaveBeenCalledWith({
      where: { userId_routeId: { userId: "u1", routeId: "r1" } },
    });
    expect(mocks.prisma.like.create).not.toHaveBeenCalled();
  });

  it("target=COMMENT で未いいねなら comment 用の create/count を呼ぶ", async () => {
    mocks.prisma.like.findUnique.mockResolvedValue(null);
    mocks.prisma.like.create.mockResolvedValue({});
    mocks.prisma.like.count.mockResolvedValue(1);

    const res = await likesService.toggleLike("u1", LikeViewTarget.COMMENT, undefined, "c1");

    expect(res).toEqual({ liked: true, likeCount: 1 });
    // unique key が userId_commentId になっていること
    expect(mocks.prisma.like.findUnique).toHaveBeenCalledWith({
      where: { userId_commentId: { userId: "u1", commentId: "c1" } },
    });
    // count も commentId で絞っていること
    expect(mocks.prisma.like.count).toHaveBeenCalledWith({ where: { commentId: "c1" } });
  });

  it("target=ROUTE なのに routeId 未指定 → ValidationError を投げる (commit 69fa73e で正規化)", async () => {
    await expect(
      likesService.toggleLike("u1", LikeViewTarget.ROUTE, undefined),
    ).rejects.toBeInstanceOf(ValidationError);

    // findUnique すら呼ばれない (早期バリデーション)
    expect(mocks.prisma.like.findUnique).not.toHaveBeenCalled();
  });

  it("target=COMMENT なのに commentId 未指定 → ValidationError", async () => {
    const promise = likesService.toggleLike("u1", LikeViewTarget.COMMENT, undefined, undefined);
    await expect(promise).rejects.toBeInstanceOf(ValidationError);
    await expect(promise).rejects.toThrowError("Invalid target or missing ID");
  });

  it("ValidationError は handleError 側で 400 に変換されるよう code/status を備えている", async () => {
    try {
      await likesService.toggleLike("u1", LikeViewTarget.ROUTE, undefined);
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).code).toBe("VALIDATION_ERROR");
      expect((err as ValidationError).status).toBe(400);
    }
  });
});

// ---------------------------------------------------------------------------
// getLikes
// ---------------------------------------------------------------------------

describe("likesService.getLikes", () => {
  it("空結果 → items=[] / nextCursor=null", async () => {
    mocks.prisma.like.findMany.mockResolvedValue([]);

    const res = await likesService.getLikes("u1", { take: 15 });

    expect(res.items).toEqual([]);
    expect(res.nextCursor).toBeNull();
    expect(mocks.prisma.like.findMany).toHaveBeenCalledTimes(1);
  });

  it("件数が take 未満なら nextCursor=null (ページ終端)", async () => {
    mocks.prisma.like.findMany.mockResolvedValue([
      {
        id: "l1",
        target: "ROUTE",
        routeId: "r1",
        createdAt: new Date("2024-01-01T00:00:00Z"),
      },
    ]);

    const res = await likesService.getLikes("u1", { take: 15 });

    expect(res.items).toHaveLength(1);
    expect(res.nextCursor).toBeNull();
  });

  it("件数が take と同数なら nextCursor を encode して返す", async () => {
    const fakeLikes = Array.from({ length: 3 }, (_, i) => ({
      id: `l${i}`,
      target: "ROUTE",
      routeId: `r${i}`,
      createdAt: new Date(`2024-01-0${i + 1}T00:00:00Z`),
    }));
    mocks.prisma.like.findMany.mockResolvedValue(fakeLikes);

    const res = await likesService.getLikes("u1", { take: 3 });

    expect(res.items).toHaveLength(3);
    expect(res.nextCursor).toBeTruthy();
    expect(typeof res.nextCursor).toBe("string");
  });

  it("include.route=true のとき COMMENT 対象 like は route=null に正規化される", async () => {
    // 1 件目 ROUTE (route あり) / 2 件目 COMMENT (route は本来 null のはず)
    mocks.prisma.like.findMany.mockResolvedValue([
      {
        id: "l1",
        target: "ROUTE",
        routeId: "r1",
        createdAt: new Date("2024-01-02T00:00:00Z"),
        route: { id: "r1", title: "A Route" },
      },
      {
        id: "l2",
        target: "COMMENT",
        commentId: "c1",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        // サーバーが誤ってルート情報を付与してしまった想定 (防御的に null 化する layer の担保)
        route: { id: "r-leaked", title: "leaked" },
      },
    ]);

    const res = await likesService.getLikes("u1", {
      include: { route: true },
      take: 2,
    });

    expect(res.items).toHaveLength(2);
    expect(res.items[0].target).toBe("ROUTE");
    expect(res.items[0].route).toEqual({ id: "r1", title: "A Route" });
    // COMMENT 対象の route は必ず null (情報漏れ防止)
    expect(res.items[1].target).toBe("COMMENT");
    expect(res.items[1].route).toBeNull();
  });
});
