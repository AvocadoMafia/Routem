import { viewsRepository } from "./repository";
import { routesRepository } from "@/features/routes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";

export const viewsService = {
  recordView: async (routeId: string, userId: string | null) => {
    try {
      await viewsRepository.createView({
        target: LikeViewTarget.ROUTE,
        route: { connect: { id: routeId } },
        userId: userId,
      });

      const viewCount = await viewsRepository.countViews(routeId);
      return viewCount;
    } catch (e) {
      throw e;
    }
  },

  /**
   * 閲覧履歴のあるルートを取得
   * セキュリティ: PUBLIC または 自分が作成したルートのみ返す
   */
  getViewedRoutes: async (userId: string) => {
    try {
      const where: Prisma.RouteWhereInput = {
        views: {
          some: { userId }
        },
        OR: [
          { visibility: 'PUBLIC' },
          { authorId: userId },
        ],
      };
      return await routesRepository.findMany(where);
    } catch (e) {
      throw e;
    }
  },
};
