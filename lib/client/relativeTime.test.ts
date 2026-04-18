import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relativeTime";

/**
 * formatRelativeTime の挙動担保。 "now" を注入する仕様にしているので時刻固定でテスト可能。
 */

const NOW = new Date("2024-06-15T12:00:00Z");

describe("formatRelativeTime", () => {
  it("30秒前は 'just now' 系 (locale ごとに)", () => {
    const past = new Date(NOW.getTime() - 30 * 1000);
    expect(formatRelativeTime(past, { locale: "ja", now: NOW })).toBe("たった今");
    expect(formatRelativeTime(past, { locale: "en", now: NOW })).toBe("just now");
  });

  it("5分前は 'minute(s) ago' 相当の文字列を返す (locale en)", () => {
    const past = new Date(NOW.getTime() - 5 * 60 * 1000);
    const result = formatRelativeTime(past, { locale: "en", now: NOW });
    // Intl.RelativeTimeFormat の出力に依存するので contain で緩く判定
    expect(result.toLowerCase()).toContain("minute");
  });

  it("2時間前 locale ja は時間単位で返る", () => {
    const past = new Date(NOW.getTime() - 2 * 60 * 60 * 1000);
    const result = formatRelativeTime(past, { locale: "ja", now: NOW });
    // 日本語だと "2時間前" のような形
    expect(result).toMatch(/時間/);
  });

  it("3日前は 'day(s) ago' 相当", () => {
    const past = new Date(NOW.getTime() - 3 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(past, { locale: "en", now: NOW });
    expect(result.toLowerCase()).toMatch(/day/);
  });

  it("7日以上前は絶対日付にフォールバック (相対表記が不自然になるため)", () => {
    const past = new Date(NOW.getTime() - 30 * 24 * 60 * 60 * 1000); // 30日前
    const result = formatRelativeTime(past, { locale: "en", now: NOW });
    // 相対ではなく DateTimeFormat が走るので "day", "hour" といった相対ユニットを含まない
    expect(result.toLowerCase()).not.toMatch(/ago|in /);
    // 2024 の文字が入るはず (絶対日付)
    expect(result).toContain("2024");
  });

  it("不正な入力 (NaN 日付) は空文字を返す (UI 壊し防止)", () => {
    expect(formatRelativeTime("not-a-date", { now: NOW })).toBe("");
    expect(formatRelativeTime(Number.NaN as any, { now: NOW })).toBe("");
  });

  it("未知の locale は内部フォールバック (英語) で正常動作する", () => {
    const past = new Date(NOW.getTime() - 30 * 1000);
    // サポート外の locale でも落ちない
    expect(() => formatRelativeTime(past, { locale: "xx", now: NOW })).not.toThrow();
  });

  it("未来の時刻は 'in ...' 相当に倒れる (AMP 保険)", () => {
    const future = new Date(NOW.getTime() + 2 * 60 * 1000); // +2min
    const result = formatRelativeTime(future, { locale: "en", now: NOW });
    // "in 2 minutes" 相当
    expect(result.toLowerCase()).toMatch(/(in |^)2.*minute/);
  });
});
