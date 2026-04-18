import { describe, expect, it } from "vitest";
import { pickShareStrategy } from "./useShare";

/**
 * useShare の戦略選択 pure function のテスト。
 * 実際の navigator.share / clipboard / execCommand 呼び出しは DOM/ブラウザが必要で
 * Node 環境では再現できないため、「環境フラグの組み合わせ → 選ぶ戦略」のみ担保する。
 *
 * 優先度 (仕様):
 *   webShare > clipboard > execCommand > prompt
 * ただし webShare / clipboard は Secure Context のとき限定。
 */

const baseEnv = {
  hasWindow: true,
  isSecureContext: true,
  hasNavigatorShare: false,
  hasClipboard: false,
  hasExecCommand: false,
};

describe("pickShareStrategy", () => {
  it("SSR / window 無し → 'unavailable'", () => {
    expect(
      pickShareStrategy({ ...baseEnv, hasWindow: false, isSecureContext: true, hasNavigatorShare: true }),
    ).toBe("unavailable");
  });

  it("Secure Context + navigator.share 有り → 'webShare'", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: true,
        hasNavigatorShare: true,
        hasClipboard: true,
        hasExecCommand: true,
      }),
    ).toBe("webShare");
  });

  it("Secure Context + share 無し + clipboard 有り → 'clipboard'", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: true,
        hasNavigatorShare: false,
        hasClipboard: true,
        hasExecCommand: true,
      }),
    ).toBe("clipboard");
  });

  it("非 Secure Context で share / clipboard は選ばない (HTTP 本番想定)", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: false,
        hasNavigatorShare: true,
        hasClipboard: true,
        hasExecCommand: true,
      }),
    ).toBe("execCommand");
  });

  it("非 Secure + share/clipboard 不在 + execCommand 有り → 'execCommand'", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: false,
        hasExecCommand: true,
      }),
    ).toBe("execCommand");
  });

  it("全部使えない → 'prompt' に退避", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: false,
        hasNavigatorShare: false,
        hasClipboard: false,
        hasExecCommand: false,
      }),
    ).toBe("prompt");
  });

  it("Secure Context でも clipboard がロード前で未定義 → execCommand にフォールバック", () => {
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: true,
        hasNavigatorShare: false,
        hasClipboard: false,
        hasExecCommand: true,
      }),
    ).toBe("execCommand");
  });

  it("isSecureContext=undefined (古いブラウザ保険) は非Secure扱い", () => {
    // 実装上 Boolean() しているので false と同等
    expect(
      pickShareStrategy({
        ...baseEnv,
        isSecureContext: undefined as unknown as boolean,
        hasNavigatorShare: true,
        hasClipboard: true,
        hasExecCommand: true,
      }),
    ).toBe("execCommand");
  });
});
