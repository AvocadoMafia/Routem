import { getPrisma } from "@/lib/config/server"

export const categoriesRepository = {
    findCategories: async () => {
        try {
            return getPrisma().category.findMany();
        } catch (e) {
            throw e;
        }
    }
}