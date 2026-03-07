import { getPrisma } from "@/lib/config/server"

export const categoriesRepository = {
    findCategories:async ()=>{
        return getPrisma().category.findMany();
    }
}