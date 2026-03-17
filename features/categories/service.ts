import { categoriesRepository } from "./repository"

export const categoriesService = {
    getCategories: async () => {
        try {
            return categoriesRepository.findCategories();
        } catch (e) {
            throw e;
        }
    }
}