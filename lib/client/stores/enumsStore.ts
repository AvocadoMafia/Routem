import { create } from "zustand";
import { CurrencyCode, Language, Locale, RouteFor } from "@prisma/client";

/**
 * メタAPIから取得する各種 enum 値を保持するストア
 *
 * - 検索系 (routeFor, currencyCode) と ユーザー系 (locale, language) を
 *   同じストアに集約。呼び出しサイトは必要なセレクタのみを参照する。
 * - それぞれの fetch は独立した endpoint を叩くため、内部でも
 *   `search` / `user` の 2 系統の初期化・ローディングフラグを分離して保持する。
 * - user enums はネットワーク失敗時に Prisma 由来のフォールバックを返し、
 *   オフライン / 障害時でも最低限の選択肢が使えるようにする。
 * - 配列の要素型は Prisma enum に絞り込んでおり、消費側で `string` を
 *   そのまま使えない代わりに enum 以外の値が混入するリスクを型レベルで排除する。
 */

type SearchEnumsResponse = {
  routeFor: string[];
  currencyCode: string[];
};

type UserEnumsResponse = {
  locale: string[];
  language: string[];
};

type EnumsState = {
  // search enums
  routeFor: RouteFor[];
  currencyCode: CurrencyCode[];
  searchLoading: boolean;
  searchInitialized: boolean;
  fetchSearchEnums: () => Promise<void>;

  // user enums
  locale: Locale[];
  language: Language[];
  userLoading: boolean;
  userInitialized: boolean;
  fetchUserEnums: () => Promise<void>;
};

const localeFallback: Locale[] = Object.values(Locale);
const languageFallback: Language[] = Object.values(Language);

/**
 * API から返ってきた string[] を、Prisma enum 値集合でフィルタして
 * 安全に Enum[] に絞り込む。不正値が紛れていても静かに弾く。
 */
function filterToEnum<T extends string>(
  values: unknown,
  enumObj: Record<string, T>,
): T[] {
  if (!Array.isArray(values)) return [];
  const allowed = new Set<string>(Object.values(enumObj));
  return values.filter((v): v is T => typeof v === "string" && allowed.has(v));
}

export const enumsStore = create<EnumsState>((set, get) => ({
  // --- search enums ---
  routeFor: [],
  currencyCode: [],
  searchLoading: false,
  searchInitialized: false,
  fetchSearchEnums: async () => {
    const { searchInitialized, searchLoading } = get();
    if (searchInitialized || searchLoading) return;

    set({ searchLoading: true });
    try {
      const res = await fetch("/api/v1/meta/enums", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch search enums");
      const data = (await res.json()) as SearchEnumsResponse;
      set({
        routeFor: filterToEnum(data.routeFor, RouteFor),
        currencyCode: filterToEnum(data.currencyCode, CurrencyCode),
        searchInitialized: true,
        searchLoading: false,
      });
    } catch {
      set({ searchLoading: false });
    }
  },

  // --- user enums ---
  locale: [],
  language: [],
  userLoading: false,
  userInitialized: false,
  fetchUserEnums: async () => {
    const { userInitialized, userLoading } = get();
    if (userInitialized || userLoading) return;

    set({ userLoading: true });
    try {
      const res = await fetch("/api/v1/meta/enums/user", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user enums");
      const data = (await res.json()) as UserEnumsResponse;
      set({
        locale: filterToEnum(data.locale, Locale),
        language: filterToEnum(data.language, Language),
        userInitialized: true,
        userLoading: false,
      });
    } catch {
      // ネットワーク失敗時はフォールバックで埋めて、選択肢が空にならないようにする
      set({
        locale: localeFallback,
        language: languageFallback,
        userInitialized: true,
        userLoading: false,
      });
    }
  },
}));
