import { getPrisma } from "@/lib/config/server";
import { ImageType, ImageStatus } from "@prisma/client";

export const imagesRepository = {
  createDraftImage: async (url: string, key: string, type: ImageType, uploaderId: string | null) => {
    try {
      return await getPrisma().image.create({
        data: {
          url,
          key,
          status: ImageStatus.DRAFT,
          type,
          uploaderId,
        },
      });
    } catch (e) {
      throw e;
    }
  },
};
