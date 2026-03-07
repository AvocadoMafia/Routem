import {Category} from "@/lib/client/types";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {create} from "zustand";

type StoreConfig = {
    categories: Category[]
    fetchCategories: () => Promise<void>
}

export const categoryStore = create<StoreConfig>((set) => ({
    categories: [],
    fetchCategories: async () => {
        const categories = await getDataFromServerWithJson<Category[]>('/api/v1/categories')
        console.log(categories)
        if(!!categories && categories.length > 0){
            set(() => ({ categories }))
        }
    },
}));