import { viewsRepository } from "./repository";
import { routesRepository, ROUTE_INCLUDE } from "@/features/routes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";
import { USER_SELECT } from "@/features/users/repository";

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
   * 閲覧履歴のあるルートを取得（従来BFF）
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

  // 新API: Viewレコード（自分）をincludeフラグ・takeで取得
  getViews: async (
    userId: string,
    opts: { include?: { route?: boolean; user?: boolean }; take?: number }
  ) => {
    const take = opts.take ?? 30;

    const include: Prisma.ViewInclude = {};
    if (opts.include?.route) {
      (include as any).route = { include: ROUTE_INCLUDE };
    }
    if (opts.include?.user) {
      (include as any).user = { select: USER_SELECT } as any;
    }

    const args: Prisma.ViewFindManyArgs = {
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      include: Object.keys(include).length ? include : undefined,
    };

    const views = await viewsRepository.findMany(args);
    return views.map((v: any) => ({
      id: v.id,
      target: v.target,
      createdAt: v.createdAt,
      route: opts.include?.route ? v.route ?? null : undefined,
      user: opts.include?.user ? v.user ?? null : undefined,
    }));
  },
};
