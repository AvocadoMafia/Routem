import { RecommendGlobalType } from "@/scripts/generatingRecommendations/schema";
import { createClient } from "redis";
import { iMagesRecommendationRepository } from "./repository";
import { ImageRecommendationResponseType } from "./schema";

export const imagesRecommendationService = {
  get: async (): Promise<ImageRecommendationResponseType[]> => {
    const redis = await createClient();
    const recommendGlobal = await redis.get("recommend:global");

    if (!recommendGlobal) return [];
    const recommendGlobalParsed: RecommendGlobalType = JSON.parse(recommendGlobal);
    const recommendedIds = recommendGlobalParsed.map((i) => i.id);

    const data = await iMagesRecommendationRepository.findMany(recommendedIds);

    const resData: ImageRecommendationResponseType[] = data.map((item) => ({
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

    return resData;
  },
};
