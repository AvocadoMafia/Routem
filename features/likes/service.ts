import { likesRepository } from "@/features/likes/repository";
import { LikeViewTarget } from "@prisma/client";

export const likesService = {
    toggleLike: async (userId: string, target: LikeViewTarget, routeId?: string, commentId?: string) => {
        if (target === LikeViewTarget.ROUTE && routeId) {
            const existing = await likesRepository.findByUserAndRoute(userId, routeId);
            if (existing) {
                const deleted = await likesRepository.deleteByUserAndRoute(userId, routeId);
                return {　like: deleted };
            }
            const created = await likesRepository.createLike(userId, target, routeId, undefined);
            return {　like: created };
        } else if (target === LikeViewTarget.COMMENT && commentId) {
            const existing = await likesRepository.findByUserAndComment(userId, commentId);
            if (existing) {
                const deleted = await likesRepository.deleteByUserAndComment(userId, commentId);
                return {　like: deleted };
            }
            const created = await likesRepository.createLike(userId, target, undefined, commentId);
            return { like: created };
        }
        throw new Error("Invalid target or missing ID");
    },
};
