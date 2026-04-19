import { getPrisma } from "@/lib/config/server";
import { ImageType, ImageStatus, Prisma } from "@prisma/client";
import { buildCursorWhere } from "@/lib/db/cursor";

export const PHOTO_IMAGE_INCLUDE = {
  routeNode: {
    include: {
      routeDate: {
        include: {
          route: {
            include: {
              author: {
                select: { id: true, name: true, icon: true },
              },
            },
          },
        },
      },
      spot: true,
    },
  },
} as const;

export type PhotoImageWithRelations = Prisma.ImageGetPayload<{
  include: typeof PHOTO_IMAGE_INCLUDE;
}>;

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

  findManyAdoptedNodeImages: async (params: {
    limit: number;
    cursor?: string;
  }): Promise<PhotoImageWithRelations[]> => {
    try {
      const cursorWhere = buildCursorWhere(params.cursor);
      const where: Prisma.ImageWhereInput = {
        type: ImageType.NODE_IMAGE,
        status: ImageStatus.ADOPTED,
        routeNodeId: { not: null },
        ...(cursorWhere || {}),
      };

      return (await getPrisma().image.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: params.limit,
        include: PHOTO_IMAGE_INCLUDE,
      })) as PhotoImageWithRelations[];
    } catch (e) {
      throw e;
    }
  },
};
