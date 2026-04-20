import { describe, expect, it } from "vitest";
import {
  computeOptimisticLikeState,
  reduceLikeApiResponse,
  isAuthError,
  getIsLikedByMe,
} from "./useLike";

/**
 * useLike hook に同梱された pure function のユニットテスト。
 * React を描画する必要がある部分 (useLike 本体) は DOM 環境が無いと回しづらいので、
 * ここでは純関数 (hook から切り出したロジック) の挙動だけを担保する。
 */

describe("computeOptimisticLikeState", () => {
  it("isLiked=false → true に反転し count を +1 する", () => {
    expect(computeOptimisticLikeState({ isLiked: false, likeCount: 3 })).toEqual({
      isLiked: true,
      likeCount: 4,
    });
  });

  it("isLiked=true → false に反転し count を -1 する", () => {
    expect(computeOptimisticLikeState({ isLiked: true, likeCount: 3 })).toEqual({
      isLiked: false,
      likeCount: 2,
    });
  });

  it("count=0 のまま liked→unliked にしても負数にならず 0 でクランプ", () => {
    // 本来ありえないがサーバーとの瞬間ズレで起こりうる不整合の保険
    expect(computeOptimisticLikeState({ isLiked: true, likeCount: 0 })).toEqual({
      isLiked: false,
      likeCount: 0,
    });
  });

  it("大きな count でも正しく反転する", () => {
    expect(computeOptimisticLikeState({ isLiked: false, likeCount: 1_000_000 })).toEqual({
      isLiked: true,
      likeCount: 1_000_001,
    });
  });
});

describe("reduceLikeApiResponse", () => {
  it("正常な boolean と number をそのまま採用する", () => {
    expect(reduceLikeApiResponse({ liked: true, like_count: 5 })).toEqual({
      isLiked: true,
      likeCount: 5,
    });
  });

  it("like_count が負数ならば 0 にクランプする (count の整合性保証)", () => {
    expect(reduceLikeApiResponse({ liked: false, like_count: -1 })).toEqual({
      isLiked: false,
      likeCount: 0,
    });
  });

  it("like_count が NaN なら 0 にフォールバックする", () => {
    expect(reduceLikeApiResponse({ liked: true, like_count: Number.NaN })).toEqual({
      isLiked: true,
      likeCount: 0,
    });
  });

  it("like_count が Infinity なら 0 にフォールバックする (Number.isFinite=false)", () => {
    expect(reduceLikeApiResponse({ liked: false, like_count: Number.POSITIVE_INFINITY })).toEqual({
      isLiked: false,
      likeCount: 0,
    });
  });

  it("liked が truthy な string でも boolean 化される", () => {
    // 型的には boolean を期待するが、!! で安全に丸める挙動の担保
    const res = reduceLikeApiResponse({ liked: "yes" as any, like_count: 2 });
    expect(res.isLiked).toBe(true);
    expect(res.likeCount).toBe(2);
  });
});

describe("isAuthError", () => {
  it("status===401 なら true", () => {
    expect(isAuthError({ status: 401, message: "whatever" })).toBe(true);
  });

  it("code==='UNAUTHORIZED' なら true (handleError.ts 正規化後のコード)", () => {
    expect(isAuthError({ code: "UNAUTHORIZED", message: "Unauthorized" })).toBe(true);
  });

  it("code の大文字小文字混在でも拾う", () => {
    expect(isAuthError({ code: "Unauthorized" })).toBe(true);
  });

  it("message==='Unauthorized' でも true (後方互換)", () => {
    expect(isAuthError({ message: "Unauthorized" })).toBe(true);
  });

  it("message の前後空白・大文字小文字混在も拾う", () => {
    expect(isAuthError({ message: "  UNAUTHORIZED  " })).toBe(true);
  });

  it("通常の 500 エラー (INTERNAL_SERVER_ERROR) は false", () => {
    expect(isAuthError({ code: "INTERNAL_SERVER_ERROR", message: "boom", status: 500 })).toBe(false);
  });

  it("403 Forbidden は false (認証ではなく認可のため別扱い)", () => {
    expect(isAuthError({ status: 403, code: "FORBIDDEN", message: "Forbidden" })).toBe(false);
  });

  it("null / undefined / primitive は false", () => {
    expect(isAuthError(null)).toBe(false);
    expect(isAuthError(undefined)).toBe(false);
    expect(isAuthError("Unauthorized")).toBe(false);
    expect(isAuthError(0)).toBe(false);
  });

  it("message に 'Unauthorized' を部分一致で含んでも、それだけでは false", () => {
    // 過剰マッチを避ける: "Something with unauthorized users" みたいな文言に反応しない
    expect(isAuthError({ message: "Something unauthorized went wrong" })).toBe(false);
  });
});

describe("getIsLikedByMe", () => {
  it("自分の userId が likes に含まれていれば true", () => {
    expect(
      getIsLikedByMe([{ userId: "u1" }, { userId: "u2" }], "u1"),
    ).toBe(true);
  });

  it("含まれていなければ false", () => {
    expect(getIsLikedByMe([{ userId: "u2" }], "u1")).toBe(false);
  });

  it("userId が空文字なら未ログイン扱いで false", () => {
    expect(getIsLikedByMe([{ userId: "u1" }], "")).toBe(false);
  });

  it("likes が null/undefined/空配列 なら false", () => {
    expect(getIsLikedByMe(null, "u1")).toBe(false);
    expect(getIsLikedByMe(undefined, "u1")).toBe(false);
    expect(getIsLikedByMe([], "u1")).toBe(false);
  });

  it("userId が null でも例外にならず false", () => {
    expect(getIsLikedByMe([{ userId: "u1" }], null)).toBe(false);
  });
});
