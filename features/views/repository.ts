import { getPrisma } from "@/lib/config/server";
import { Prisma } from "@prisma/client";

export const viewsRepository = {
  createView: async (data: Prisma.ViewCreateInput) => {
    try {
      return await getPrisma().view.create({
        data,
      });
    } catch (e) {
      throw e;
    }
  },

  countViews: async (routeId: string) => {
    try {
      return await getPrisma().view.count({
        where: { routeId },
      });
    } catch (e) {
      throw e;
    }
  },
};
