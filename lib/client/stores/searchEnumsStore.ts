import { create } from "zustand";

type SearchEnumsResponse = {
  routeFor: string[];
  currencyCode: string[];
  locale: string[];
  language: string[];
};

type SearchEnumsState = {
  routeFor: string[];
  currencyCode: string[];
  locale: string[];
  language: string[];
  isLoading: boolean;
  initialized: boolean;
  fetchEnums: () => Promise<void>;
};

export const searchEnumsStore = create<SearchEnumsState>((set, get) => ({
  routeFor: [],
  currencyCode: [],
  locale: [],
  language: [],
  isLoading: false,
  initialized: false,
  fetchEnums: async () => {
    const { initialized, isLoading } = get();
    if (initialized || isLoading) return;

    set({ isLoading: true });
    try {
      const res = await fetch("/api/v1/meta/enums", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch enums");
      const data = (await res.json()) as SearchEnumsResponse;
      set({
        routeFor: data.routeFor ?? [],
        currencyCode: data.currencyCode ?? [],
        locale: data.locale ?? [],
        language: data.language ?? [],
        initialized: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
