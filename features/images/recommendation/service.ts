import { sliceByScoreCursor } from "@/lib/server/cursor";
import { RecommendGlobalType } from "@/scripts/generatingRecommendations/schema";
import { createClient } from "redis";
import { iMagesRecommendationRepository } from "./repository";
import { ImageRecommendationRequestType, ImageRecommendationResponseType } from "./schema";

export const imagesRecommendationService = {
  get: async (query: ImageRecommendationRequestType): Promise<ImageRecommendationResponseType> => {
    const redis = await createClient();
    const recommendGlobal = await redis.get("recommend:global");

    if (!recommendGlobal) throw "リコメンデーションのデータがありません。";
    const recommendGlobalParsed: RecommendGlobalType = JSON.parse(recommendGlobal);

    const sliced = sliceByScoreCursor(recommendGlobalParsed, query.nextCursor, query.limit);
    const recommendedIds = sliced.items.map((item) => item.id);
    const nextCursor = sliced.nextCursor;

    const data = await iMagesRecommendationRepository.findMany(recommendedIds);

    const routeMap = new Map(data.map((route) => [route.id, route]));
    const sortedData = recommendedIds
      .map((id) => routeMap.get(id))
      .filter((item) => item !== undefined);

    const resData = sortedData.map((item) => ({
      id: item.id,
      title: item.title,
      author: {
        id: item.author.id,
        name: item.author.name,
        image: item.author.image,
      },
      imageUrls: item.routeDates.flatMap((routeDate) =>
        routeDate.routeNodes.flatMap((routeNode) => routeNode.images.map((image) => image.url)),
      ),
    }));

    return { data: resData, nextCursor };
  },
};
