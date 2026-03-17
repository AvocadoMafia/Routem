import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget } from "@prisma/client";
import { ROUTE_INCLUDE } from "@/features/routes/repository";

export const likesService = {
    toggleLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        try {
        if (target === LikeViewTarget.ROUTE && routeId) {
          const existing = await likesRepository.findByUserAndRoute(userId, routeId);
          if (existing) {
            await likesRepository.deleteByUserAndRoute(userId, routeId);
          } else {
            await likesRepository.createLike(userId, target, routeId, undefined);
          }
          const liked = !existing;
          const likeCount = await likesRepository.countLikesByRoute(routeId);
          return { liked, likeCount };
        } else if (target === LikeViewTarget.COMMENT && commentId) {
          const existing = await likesRepository.findByUserAndComment(userId, commentId);
          if (existing) {
            await likesRepository.deleteByUserAndComment(userId, commentId);
          } else {
            await likesRepository.createLike(userId, target, undefined, commentId);
          }
          const liked = !existing;
          const likeCount = await likesRepository.countLikesByComment(commentId);
          return { liked, likeCount };
        }
            throw new Error("Invalid target or missing ID");
        } catch (e) {
            throw e;
        }
    },

    getLikedRoutes: async (userId: string) => {
        try {
            const likes = await likesRepository.findMany({
                where: { userId, routeId: { not: null } },
                orderBy: { createdAt: "desc" },
                include: {
                    route: {
                        include: ROUTE_INCLUDE,
                    },
                },
            });

            return likes
                .map((l) => l.route)
                .filter((r): r is NonNullable<typeof r> => !!r);
        } catch (e) {
            throw e;
        }
    },
};
