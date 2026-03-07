import { categoriesRepository } from "./repository"

export const categoriesService = {
    getCategories:async ()=>{
        return categoriesRepository.findCategories();
    }
}