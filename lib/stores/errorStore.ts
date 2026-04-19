import {ErrorScheme} from "@/lib/types/error";
import {create} from "zustand";

type ErrorWithId = ErrorScheme & { id: string }

type StoreConfig = {
    error: ErrorWithId[]
    appendError: (error: ErrorScheme) => void
    deleteError: (id: string) => void
}

export const errorStore = create<StoreConfig>((set) => ({
    error: [], 
    appendError: (error) => set({error: [...errorStore.getState().error, { ...error, id: crypto.randomUUID() }]}),
    deleteError: (id) => set({error: errorStore.getState().error.filter((e) => e.id !== id)}),
}))