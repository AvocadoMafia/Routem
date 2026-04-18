import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { SpotSource, TransitMode } from "@prisma/client";
import {
  computeBackoffMs,
  isRetryableStatus,
  toErrorScheme,
  isErrorScheme,
  fetchWithRetry,
  toSpotSource,
  toTransitMode,
} from "./helpers";

// -----------------------------------------------------------------------------
// computeBackoffMs — retry のタイミング決定ロジック
// -----------------------------------------------------------------------------
describe("computeBackoffMs", () => {
  beforeEach(() => {
    // jitter の乱数を固定して決定論的にテスト
    vi.spyOn(Math, "random").mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Retry-After が整数秒なら ms にして返す (最低 BASE_BACKOFF_MS=300 を保証)", () => {
    expect(computeBackoffMs(0, "1")).toBe(1000);
    expect(computeBackoffMs(0, "2")).toBe(2000);
  });

  it("Retry-After が 0 秒でも BASE_BACKOFF_MS=300 以上にクランプされる", () => {
    // 即時リトライで雪崩を起こさないための下限
    expect(computeBackoffMs(0, "0")).toBe(300);
  });

  it("Retry-After が上限超でも MAX_BACKOFF_MS=4000 にクランプされる", () => {
    expect(computeBackoffMs(0, "60")).toBe(4000);
  });

  it("Retry-After が不正値なら指数バックオフへフォールバック", () => {
    // Retry-After が HTTP-date 等の非数値の場合
    expect(computeBackoffMs(0, "Tue, 01 Jan 2030 00:00:00 GMT")).toBe(300);
  });

  it("Retry-After が null のとき attempt ごとに指数で増える", () => {
    // attempt=0 → 300 * 2^0 = 300
    expect(computeBackoffMs(0, null)).toBe(300);
    // attempt=1 → 300 * 2^1 = 600
    expect(computeBackoffMs(1, null)).toBe(600);
    // attempt=2 → 300 * 2^2 = 1200
    expect(computeBackoffMs(2, null)).toBe(1200);
    // attempt=3 → 300 * 2^3 = 2400
    expect(computeBackoffMs(3, null)).toBe(2400);
  });

  it("大きな attempt でも MAX_BACKOFF_MS=4000 を超えない", () => {
    // 300 * 2^10 = 307200 だが 4000 に収まる
    expect(computeBackoffMs(10, null)).toBe(4000);
  });
});

// -----------------------------------------------------------------------------
// isRetryableStatus — どの HTTP ステータス×メソッドをリトライ対象にするか
// -----------------------------------------------------------------------------
describe("isRetryableStatus", () => {
  it("429 は全メソッドでリトライ (rate limit の回復待ち)", () => {
    expect(isRetryableStatus(429, "GET")).toEqual({ retry: true, maxAttempts: 3 });
    expect(isRetryableStatus(429, "POST")).toEqual({ retry: true, maxAttempts: 3 });
    expect(isRetryableStatus(429, "DELETE")).toEqual({ retry: true, maxAttempts: 3 });
  });

  it("5xx は GET のみリトライ。POST/PATCH/DELETE は二重作成を避けるため禁止", () => {
    expect(isRetryableStatus(500, "GET")).toEqual({ retry: true, maxAttempts: 1 });
    expect(isRetryableStatus(502, "GET")).toEqual({ retry: true, maxAttempts: 1 });
    expect(isRetryableStatus(503, "GET")).toEqual({ retry: true, maxAttempts: 1 });

    expect(isRetryableStatus(500, "POST")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(500, "PATCH")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(500, "PUT")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(500, "DELETE")).toEqual({ retry: false, maxAttempts: 0 });
  });

  it("4xx (429 以外) はリトライしない。バグなので回復見込みが無い", () => {
    expect(isRetryableStatus(400, "GET")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(401, "GET")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(403, "GET")).toEqual({ retry: false, maxAttempts: 0 });
    expect(isRetryableStatus(404, "GET")).toEqual({ retry: false, maxAttempts: 0 });
  });
});

// -----------------------------------------------------------------------------
// toErrorScheme / isErrorScheme — エラーオブジェクト正規化
// useInfiniteScroll の error state がこのシェイプを期待している
// -----------------------------------------------------------------------------
describe("toErrorScheme", () => {
  it("ErrorScheme 形のオブジェクトはそのまま通す", () => {
    const input = { message: "foo", code: "FOO_ERR" };
    expect(toErrorScheme(input)).toBe(input);
  });

  it("Error インスタンスは message + name=code に正規化する", () => {
    const err = new TypeError("network down");
    expect(toErrorScheme(err)).toEqual({ message: "network down", code: "TypeError" });
  });

  it("プリミティブや未知値はデフォルト UNKNOWN_ERROR に潰す", () => {
    expect(toErrorScheme("str")).toEqual({ message: "不明なエラー", code: "UNKNOWN_ERROR" });
    expect(toErrorScheme(null)).toEqual({ message: "不明なエラー", code: "UNKNOWN_ERROR" });
    expect(toErrorScheme(undefined)).toEqual({ message: "不明なエラー", code: "UNKNOWN_ERROR" });
    expect(toErrorScheme(42)).toEqual({ message: "不明なエラー", code: "UNKNOWN_ERROR" });
  });
});

describe("isErrorScheme", () => {
  it("message と code を持つオブジェクトは true", () => {
    expect(isErrorScheme({ message: "x", code: "Y" })).toBe(true);
  });
  it("片方でも欠けていれば false", () => {
    expect(isErrorScheme({ message: "x" })).toBe(false);
    expect(isErrorScheme({ code: "Y" })).toBe(false);
    expect(isErrorScheme(null)).toBe(false);
    expect(isErrorScheme("str")).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// fetchWithRetry — retry 実動作テスト
// global.fetch をモックして、リトライ回数・429/5xx の扱い・POST 非リトライを検証
// -----------------------------------------------------------------------------
describe("fetchWithRetry", () => {
  // sleep は呼ばれるだけでスキップ (タイマー待ちでテスト遅延を避ける)
  const noopSleep = async () => {};

  // 乱数固定 (computeBackoffMs の jitter 影響を排除)
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function mockFetch(responses: Array<Response | (() => Promise<Response>)>) {
    let call = 0;
    const fn = vi.fn(async () => {
      const r = responses[call++];
      if (!r) throw new Error("unexpected extra fetch call");
      return typeof r === "function" ? await r() : r;
    });
    vi.stubGlobal("fetch", fn);
    return fn;
  }

  const jsonOk = (obj: unknown) =>
    new Response(JSON.stringify(obj), { status: 200, headers: { "Content-Type": "application/json" } });
  const statusRes = (status: number, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify({ message: `err ${status}`, code: "SERVER_ERR" }), {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    });

  it("初回 200 で即返却。fetch は1回だけ呼ばれる", async () => {
    const fetchFn = mockFetch([jsonOk({ hello: "world" })]);
    const result = await fetchWithRetry<{ hello: string }>(
      "/api/test",
      "GET",
      { method: "GET" },
      { sleepFn: noopSleep },
    );
    expect(result).toEqual({ hello: "world" });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("429 が返った GET は最大3回までリトライし、最終的に成功すれば値を返す", async () => {
    const fetchFn = mockFetch([
      statusRes(429),
      statusRes(429),
      jsonOk({ ok: true }),
    ]);
    const result = await fetchWithRetry<{ ok: boolean }>(
      "/api/test",
      "GET",
      { method: "GET" },
      { sleepFn: noopSleep },
    );
    expect(result).toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it("429 が上限 (1+3=4回) 連発したら諦めて ErrorScheme を throw", async () => {
    const fetchFn = mockFetch([
      statusRes(429),
      statusRes(429),
      statusRes(429),
      statusRes(429),
    ]);
    await expect(
      fetchWithRetry("/api/test", "GET", { method: "GET" }, { sleepFn: noopSleep }),
    ).rejects.toMatchObject({ code: "SERVER_ERR", status: 429 });
    expect(fetchFn).toHaveBeenCalledTimes(4);
  });

  it("5xx の GET は1回だけリトライし、2回目が成功すれば値を返す", async () => {
    const fetchFn = mockFetch([statusRes(500), jsonOk({ n: 1 })]);
    const result = await fetchWithRetry<{ n: number }>(
      "/api/test",
      "GET",
      { method: "GET" },
      { sleepFn: noopSleep },
    );
    expect(result).toEqual({ n: 1 });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("5xx の POST は 1 回で諦める (二重作成を避けるため非リトライ)", async () => {
    const fetchFn = mockFetch([statusRes(503)]);
    await expect(
      fetchWithRetry("/api/test", "POST", { method: "POST", body: "{}" }, { sleepFn: noopSleep }),
    ).rejects.toMatchObject({ status: 503 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("429 の POST はリトライされる (冪等ではないが rate limit は時間経過で解消)", async () => {
    const fetchFn = mockFetch([statusRes(429), jsonOk({ created: true })]);
    const result = await fetchWithRetry<{ created: boolean }>(
      "/api/test",
      "POST",
      { method: "POST", body: "{}" },
      { sleepFn: noopSleep },
    );
    expect(result).toEqual({ created: true });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("Retry-After ヘッダを sleep 時間に反映する (秒→ms に変換)", async () => {
    const sleepSpy = vi.fn(async () => {});
    const fetchFn = mockFetch([statusRes(429, { "Retry-After": "2" }), jsonOk({})]);
    await fetchWithRetry("/api/test", "GET", { method: "GET" }, { sleepFn: sleepSpy });
    expect(fetchFn).toHaveBeenCalledTimes(2);
    // 2秒 = 2000ms (MAX_BACKOFF_MS=4000 以下なのでそのまま)
    expect(sleepSpy).toHaveBeenCalledWith(2000);
  });

  it("400 (クライアントエラー) は即時失敗。リトライしない", async () => {
    const fetchFn = mockFetch([statusRes(400)]);
    await expect(
      fetchWithRetry("/api/test", "GET", { method: "GET" }, { sleepFn: noopSleep }),
    ).rejects.toMatchObject({ status: 400 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("ネットワーク断 (fetch throws) の GET は1回リトライ、ダメならネットワークエラーに整形", async () => {
    let count = 0;
    vi.stubGlobal("fetch", vi.fn(async () => {
      count++;
      throw new TypeError("fetch failed");
    }));
    await expect(
      fetchWithRetry("/api/test", "GET", { method: "GET" }, { sleepFn: noopSleep }),
    ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    expect(count).toBe(2); // 1回目 + 1回リトライ
  });

  it("204 相当 (body 空) は null を返す", async () => {
    mockFetch([new Response("", { status: 200 })]);
    const result = await fetchWithRetry(
      "/api/test",
      "DELETE",
      { method: "DELETE" },
      { sleepFn: noopSleep },
    );
    expect(result).toBeNull();
  });
});

// -----------------------------------------------------------------------------
// toSpotSource — 外部由来の不定な文字列を SpotSource enum に安全に正規化
//
// Waypoint.source は DB (RouteNode.spot.source) 由来で `string | null` として
// 渡ってくるため、UI/ストア層で enum 値へ絞る必要がある。
// Prisma enum が将来拡張された場合も Object.values(SpotSource) を使うことで
// 自動追従する（テストも it.each(Object.values(SpotSource)) で追従）。
// -----------------------------------------------------------------------------
describe("toSpotSource", () => {
  it.each(Object.values(SpotSource))("全Prisma値 %s はそのまま返す", (v) => {
    expect(toSpotSource(v)).toBe(v);
  });

  it.each([
    ["INVALID", "存在しないenum値"],
    ["user", "小文字は不正扱い (enum値は常に大文字)"],
    ["", "空文字"],
    [null, "null"],
    [undefined, "undefined"],
  ])("不正値 %s (%s) は SpotSource.USER にフォールバック", (v) => {
    expect(toSpotSource(v as string | null | undefined)).toBe(SpotSource.USER);
  });
});

// -----------------------------------------------------------------------------
// toTransitMode — 外部由来の不定な文字列を TransitMode enum に安全に正規化
//
// Transportation.method は DB (TransitStep.mode) 由来で string として
// 渡ってくるため、UI/ストア層で enum 値へ絞る必要がある。
// WALK/TRAIN/BUS/CAR/BIKE/FLIGHT/SHIP/OTHER の8値すべてを網羅することで
// enum拡張時のデグレを検知する。
// -----------------------------------------------------------------------------
describe("toTransitMode", () => {
  it.each(Object.values(TransitMode))("全Prisma値 %s はそのまま返す", (v) => {
    expect(toTransitMode(v)).toBe(v);
  });

  it.each([
    ["INVALID", "存在しないenum値"],
    ["walk", "小文字は不正扱い (enum値は常に大文字)"],
    ["", "空文字"],
    [null, "null"],
    [undefined, "undefined"],
  ])("不正値 %s (%s) は TransitMode.OTHER にフォールバック", (v) => {
    expect(toTransitMode(v as string | null | undefined)).toBe(TransitMode.OTHER);
  });
});
