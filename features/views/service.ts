import { viewsRepository } from "./repository";
import { routesRepository, ROUTE_INCLUDE } from "@/features/routes/repository";
import { LikeViewTarget, Prisma } from "@prisma/client";
import { USER_SELECT } from "@/features/users/repository";
import { DEFAULT_LIMIT } from "@/lib/server/constants";
import { buildUpdatedAtCursorWhere, encodeUpdatedAtCursor } from "@/lib/server/cursor";

export const viewsService = {
  recordView: async (routeId: string, userId: string | null) => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const existingView = await viewsRepository.findFirst({
        where: {
          routeId,
          userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (existingView) {
        // Just touch the record - @updatedAt will auto-update
        await viewsRepository.updateView(existingView.id, {});
      } else {
        await viewsRepository.createView({
          target: LikeViewTarget.ROUTE,
          route: { connect: { id: routeId } },
          userId: userId,
        });
      }

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

  // 新API: Viewレコード（自分）をincludeフラグ・カーソルで取得
  getViews: async (
    userId: string,
    opts: { include?: { route?: boolean; user?: boolean }; take?: number; cursor?: string }
  ) => {
    const take = opts.take ?? DEFAULT_LIMIT;

    const include: Prisma.ViewInclude = {};
    if (opts.include?.route) {
      (include as any).route = { include: ROUTE_INCLUDE };
    }
    if (opts.include?.user) {
      (include as any).user = { select: USER_SELECT } as any;
    }

    // カーソル条件を構築（updatedAtベース）
    const cursorWhere = buildUpdatedAtCursorWhere(opts.cursor);
    const where: Prisma.ViewWhereInput = {
      userId,
      ...cursorWhere,
    };

    const args: Prisma.ViewFindManyArgs = {
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take,
      include: Object.keys(include).length ? include : undefined,
    };

    const views = await viewsRepository.findMany(args);

    // nextCursorを計算
    let nextCursor: string | null = null;
    if (views.length === take && views.length > 0) {
      const last = views[views.length - 1] as any;
      nextCursor = encodeUpdatedAtCursor({ updatedAt: last.updatedAt, id: last.id });
    }

    const items = views.map((v: any) => ({
      id: v.id,
      target: v.target,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      route: opts.include?.route ? v.route ?? null : undefined,
      user: opts.include?.user ? v.user ?? null : undefined,
    }));

    return { items, nextCursor };
  },
};
