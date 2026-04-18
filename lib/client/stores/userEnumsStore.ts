import { create } from "zustand";
import { LANGUAGE_VALUES, LOCALE_VALUES } from "@/lib/constants/enums";

type UserEnumsResponse = {
  locale: string[];
  language: string[];
};

type UserEnumsState = {
  locale: string[];
  language: string[];
  isLoading: boolean;
  initialized: boolean;
  fetchUserEnums: () => Promise<void>;
};

const localeFallback = [...LOCALE_VALUES];
const languageFallback = [...LANGUAGE_VALUES];

export const userEnumsStore = create<UserEnumsState>((set, get) => ({
  locale: [],
  language: [],
  isLoading: false,
  initialized: false,
  fetchUserEnums: async () => {
    const { initialized, isLoading } = get();
    if (initialized || isLoading) return;

    set({ isLoading: true });
    try {
      const res = await fetch("/api/v1/meta/enums/user", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user enums");
      const data = (await res.json()) as UserEnumsResponse;
      set({
        locale: data.locale ?? localeFallback,
        language: data.language ?? languageFallback,
        initialized: true,
        isLoading: false,
      });
    } catch {
      // Fallback keeps locale/language options available even if API fails in production.
      set({
        locale: localeFallback,
        language: languageFallback,
        initialized: true,
        isLoading: false,
      });
    }
  },
}));
