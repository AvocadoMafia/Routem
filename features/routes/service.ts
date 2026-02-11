import { get } from "http";
import { Search } from "lucide-react";

export const routesService = {
    getRoutesbyParams: async (search_params: any) => {
        const where: any = {
            visibility: "PUBLIC", // 基本的に公開されているものだけ
            limit: 20, // デフォルト20件
        };

        if (search_params.q) {
            where.OR = [
                { title: { contains: search_params.q, mode: "insensitive" } },
                { description: { contains: search_params.q, mode: "insensitive" } },
            ];
        }
        if (search_params.category) {
            where.category = search_params.category;
        }

        switch (search_params.visibility) {
            case "public":
                where.visibility = "PUBLIC";
                break;
            case "private":
                where.visibility = "PRIVATE";
                break;
        }
    }
}