/**
 * features/ 配下の service / repository を node 環境でユニットテストするための共通 scaffolding。
 *
 * - 真の DB 接続 (Prisma) / Supabase を使わない
 * - vitest の hoisted mock で `getPrisma()` / `createClient()` を差し替える
 * - 各 model / auth method を `vi.fn()` として公開し、 test 個別に
 *   `mockResolvedValue` / `mockRejectedValue` を設定する
 *
 * === 使い方 ===
 *
 * ```ts
 * import { vi, describe, it, expect, beforeEach } from "vitest";
 * import { buildPrismaMock, buildSupabaseServerMock, buildAuthResult } from "@/features/__tests__/helpers";
 *
 * // vi.hoisted は vi.mock より前に実行されるため、ここでインスタンスを確定させる
 * const mocks = vi.hoisted(() => {
 *   // hoisted の中では通常の import が使えないため require 相当 (ESM では interopRequireDefault 経由) で
 *   // builder を取り出す。シンプルには vi.hoisted 内で直接オブジェクトを書くか、
 *   // import() を使う方法もあるが hoisted は同期 factory なのでここでは静的構築する。
 *   return {
 *     prisma: {
 *       comment: {
 *         findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(),
 *         update: vi.fn(), delete: vi.fn(), count: vi.fn(), upsert: vi.fn(), findFirst: vi.fn(),
 *       },
 *       // ...他 model も同様
 *     },
 *     supabase: { auth: { getUser: vi.fn(), getClaims: vi.fn(), signOut: vi.fn() } },
 *   };
 * });
 *
 * vi.mock("@/lib/config/server", () => ({ getPrisma: () => mocks.prisma }));
 * vi.mock("@/lib/auth/supabase/server", () => ({ createClient: async () => mocks.supabase }));
 *
 * import { commentsService } from "@/features/comments/service";
 *
 * beforeEach(() => {
 *   vi.clearAllMocks();
 * });
 *
 * it("...", async () => {
 *   mocks.prisma.comment.findMany.mockResolvedValue([...]);
 *   const res = await commentsService.getCommentsByRouteId("r1", 10);
 *   expect(res.items).toHaveLength(...);
 * });
 * ```
 *
 * helpers.ts 自体は `vi.hoisted` の内側では使えない (hoisted factory が同期で import を解決できないため) が、
 * テスト側の beforeEach や expectation 組み立てで型と builder を使えるので十分有用。
 */

import { vi } from "vitest";

/**
 * Prisma の 1 model に対応するメソッド束。 vi.fn() が束になっているので
 * `.mockResolvedValue()` で戻り値を任意に差し替えられる。
 */
export type PrismaModelMock = {
  findMany: ReturnType<typeof vi.fn>;
  findUnique: ReturnType<typeof vi.fn>;
  findFirst: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  deleteMany: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
};

/**
 * features/ 配下の repository/service が参照する model を網羅した PrismaClient mock の型。
 * 必要に応じて model を追加してよい。
 */
export type PrismaClientMock = {
  comment: PrismaModelMock;
  route: PrismaModelMock;
  user: PrismaModelMock;
  like: PrismaModelMock;
  image: PrismaModelMock;
  follow: PrismaModelMock;
  view: PrismaModelMock;
  invite: PrismaModelMock;
  routeCollaborator: PrismaModelMock;
  routeDate: PrismaModelMock;
  routeNode: PrismaModelMock;
  /**
   * `$transaction(async (tx) => ...)` の tx に同じ mock オブジェクトを渡す実装。
   * これで `tx.comment.findUnique(...)` が `mock.comment.findUnique(...)` と同一の spy に紐づく。
   */
  $transaction: ReturnType<typeof vi.fn>;
};

function buildModelMock(): PrismaModelMock {
  return {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
  };
}

/**
 * PrismaClientMock を構築する。 vi.hoisted の外 (例えば beforeEach) から呼ぶ用途なので、
 * hoisted の制約は受けない。
 *
 * `$transaction` はデフォルトで渡された callback を mock 自身と共に呼び出す
 * (service/repository 側が `tx.comment.findUnique(...)` のように tx 経由でアクセスするため)。
 * 必要に応じて個別 test で `mock.$transaction.mockImplementation(...)` で上書きしてよい。
 */
export function buildPrismaMock(): PrismaClientMock {
  const mock: PrismaClientMock = {
    comment: buildModelMock(),
    route: buildModelMock(),
    user: buildModelMock(),
    like: buildModelMock(),
    image: buildModelMock(),
    follow: buildModelMock(),
    view: buildModelMock(),
    invite: buildModelMock(),
    routeCollaborator: buildModelMock(),
    routeDate: buildModelMock(),
    routeNode: buildModelMock(),
    $transaction: vi.fn(),
  };
  mock.$transaction.mockImplementation(async (arg: unknown) => {
    if (typeof arg === "function") {
      return (arg as (tx: PrismaClientMock) => unknown)(mock);
    }
    return arg;
  });
  return mock;
}

/**
 * Supabase auth.getUser() のレスポンス形状を作るヘルパー。
 *
 * ```ts
 * buildAuthResult({ userId: "u1" })  // 認証済み
 * buildAuthResult()                  // 未ログイン (user=null, error=null)
 * buildAuthResult({ error: new Error("boom") })  // auth エラー
 * ```
 */
export function buildAuthResult(opts?: {
  userId?: string;
  error?: Error;
  extraUserFields?: Record<string, unknown>;
}) {
  if (opts?.error) {
    return { data: { user: null }, error: opts.error };
  }
  if (opts?.userId) {
    return {
      data: {
        user: {
          id: opts.userId,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          ...(opts.extraUserFields ?? {}),
        },
      },
      error: null,
    };
  }
  return { data: { user: null }, error: null };
}

/**
 * `createClient()` (lib/auth/supabase/server) が返す supabase client の最小 mock。
 * route handler 側で使う `supabase.auth.getUser()` / `getClaims()` を vi.fn() で張る。
 */
export function buildSupabaseServerMock() {
  return {
    auth: {
      getUser: vi.fn(),
      getClaims: vi.fn(),
      signOut: vi.fn(),
    },
  };
}

export type SupabaseServerMock = ReturnType<typeof buildSupabaseServerMock>;
