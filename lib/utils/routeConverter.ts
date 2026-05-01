import { Route, RouteItem } from "@/lib/types/domain";
import { SpotSource } from "@prisma/client";
import { toSpotSource, toTransitMode } from "@/lib/utils/enum";

export type RouteNodeData = {
    id: string;
    order: number;
    details: string | null;
    spot: { name: string; latitude: number | null; longitude: number | null; source: string | null; sourceId: string | null };
    images: { url: string }[];
    transitSteps: { id: string; mode: string; memo: string | null; distance: number | null; duration: number | null; order: number }[];
};

/**
 * サーバーから取得したRouteオブジェクトやlocalStorageに保存されたRouteオブジェクトから、
 * エディタで利用する items (RouteItem[][]) に変換する
 */
export function convertRouteToEditorItems(route: Route, reassignId: boolean = false): RouteItem[][] {
    if (route.routeDates && Array.isArray(route.routeDates) && route.routeDates.length > 0) {
        const sortedRouteDates = [...route.routeDates].sort((a, b) => (a.day || 0) - (b.day || 0));
        return sortedRouteDates.map((date) => {
            const dayItems: RouteItem[] = [];
            if (date.routeNodes) {
                const sortedNodes = [...(date.routeNodes as RouteNodeData[])].sort((a, b) => a.order - b.order);
                sortedNodes.forEach((node) => {
                    dayItems.push({
                        type: 'waypoint',
                        id: reassignId ? Math.random().toString(36).substr(2, 9) : node.id,
                        name: node.spot.name,
                        lat: node.spot.latitude || 0,
                        lng: node.spot.longitude || 0,
                        memo: node.details || '',
                        images: node.images?.map((img) => img.url) || [],
                        source: toSpotSource(node.spot.source),
                        sourceId: node.spot.sourceId || undefined,
                        order: node.order
                    });

                    if (node.transitSteps) {
                        const sortedSteps = [...node.transitSteps].sort((a, b) => a.order - b.order);
                        sortedSteps.forEach((step) => {
                            dayItems.push({
                                type: 'transportation',
                                id: reassignId ? Math.random().toString(36).substr(2, 9) : step.id,
                                method: toTransitMode(step.mode),
                                memo: step.memo || '',
                                distance: step.distance || undefined,
                                duration: step.duration || undefined,
                                order: step.order
                            });
                        });
                    }
                });
            }
            return dayItems;
        });
    } else if ((route as any).routeNodes) {
        // 後方互換性（旧スキーマ用）
        const dayItems: RouteItem[] = [];
        const routeNodes = (route as any).routeNodes as RouteNodeData[];
        const sortedNodes = [...routeNodes].sort((a, b) => a.order - b.order);

        sortedNodes.forEach((node) => {
            dayItems.push({
                type: 'waypoint',
                id: node.id,
                name: node.spot.name,
                lat: node.spot.latitude || 0,
                lng: node.spot.longitude || 0,
                memo: node.details || '',
                images: node.images?.map((img) => img.url) || [],
                source: toSpotSource(node.spot.source),
                sourceId: node.spot.sourceId || undefined,
                order: node.order
            });

            if (node.transitSteps) {
                const sortedSteps = [...node.transitSteps].sort((a, b) => a.order - b.order);
                sortedSteps.forEach((step) => {
                    dayItems.push({
                        type: 'transportation',
                        id: step.id,
                        method: toTransitMode(step.mode),
                        memo: step.memo || '',
                        distance: step.distance || undefined,
                        duration: step.duration || undefined,
                        order: step.order
                    });
                });
            }
        });
        return [dayItems];
    }

    return [];
}
