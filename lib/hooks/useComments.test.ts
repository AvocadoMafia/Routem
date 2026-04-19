import { describe, expect, it } from "vitest";
import { buildOptimisticComment, mergeComments } from "./useComments";
import type { Comment } from "@/lib/types/domain";

/**
 * useComments 内部の pure function のテスト。
 * React を描画する hook 本体のテストは DOM 環境が無いため割愛し、
 * 楽観 UI / 重複排除の核になるロジックだけここで担保する。
 */

function makeComment(overrides: Partial<Comment>): Comment {
  return {
    id: "c1",
    text: "hello",
    userId: "u1",
    routeId: "r1",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    user: { id: "u1", name: "Alice", icon: null } as any,
    likes: [],
    ...overrides,
  };
}

describe("buildOptimisticComment", () => {
  it("渡した text / routeId / user を反映した dummy を生成する", () => {
    const c = buildOptimisticComment({
      text: "hi",
      routeId: "route-x",
      user: { id: "u42", name: "Bob", icon: null },
    });
    expect(c.text).toBe("hi");
    expect(c.routeId).toBe("route-x");
    expect(c.userId).toBe("u42");
    expect(c.user.name).toBe("Bob");
    expect(c.user.icon).toBeNull();
    expect(c.likes).toEqual([]);
  });

  it("id は 'optimistic-' プレフィックスで始まる (楽観判定に使う)", () => {
    const c = buildOptimisticComment({
      text: "x",
      routeId: "r",
      user: { id: "u1", name: "A" },
    });
    expect(c.id.startsWith("optimistic-")).toBe(true);
  });

  it("user 情報が欠けていてもフォールバック値 (Anonymous 等) で埋める", () => {
    const c = buildOptimisticComment({
      text: "t",
      routeId: "r",
      user: {},
    });
    expect(c.userId).toBe("optimistic");
    expect(c.user.name).toBe("Anonymous");
  });

  it("連続呼び出しで毎回 id がユニーク", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 20; i++) {
      ids.add(
        buildOptimisticComment({
          text: "t",
          routeId: "r",
          user: { id: "u" },
        }).id,
      );
    }
    expect(ids.size).toBe(20);
  });
});

describe("mergeComments", () => {
  it("空の incoming なら existing をそのまま返す (参照保持で余計な re-render 防止)", () => {
    const existing = [makeComment({ id: "a" })];
    const out = mergeComments(existing, []);
    expect(out).toBe(existing);
  });

  it("被りが無ければ末尾に追記する", () => {
    const existing = [makeComment({ id: "a" })];
    const incoming = [makeComment({ id: "b" }), makeComment({ id: "c" })];
    const out = mergeComments(existing, incoming);
    expect(out.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("既に存在する id は除外する (カーソルページング時のダブり吸収)", () => {
    const existing = [makeComment({ id: "a" }), makeComment({ id: "b" })];
    const incoming = [makeComment({ id: "b" }), makeComment({ id: "c" })];
    const out = mergeComments(existing, incoming);
    expect(out.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("全て重複していれば配列は増えない (かつ参照も保持する)", () => {
    const existing = [makeComment({ id: "a" }), makeComment({ id: "b" })];
    const incoming = [makeComment({ id: "a" })];
    const out = mergeComments(existing, incoming);
    expect(out).toBe(existing);
  });
});
