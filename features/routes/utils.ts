import { GetRoutesType, PatchRouteType, postRouteType } from "@/features/routes/schema";
import { buildCursorWhere } from "@/lib/server/cursor";
import {
  CurrencyCode,
  ImageStatus,
  ImageType,
  Language,
  Prisma,
  RouteCollaboratorPolicy,
  RouteVisibility,
  TransitMode,
} from "@prisma/client";

/**
 * routes 検索用の Prisma.RouteWhereInput を組み立てる
 * @param query
 * @param user_id 閲覧者のユーザーID
 */
export function buildRoutesWhere(query: GetRoutesType): Prisma.RouteWhereInput {
  const where: Prisma.RouteWhereInput = {};

  // GET/routesでは公開routeのみ取得できるようにする。
  where.visibility = RouteVisibility.PUBLIC;

  // authorId
  if (query.authorId) {
    where.authorId = query.authorId;
  }

  // tag (by name)
  if (query.tag) {
    where.tags = { some: { name: query.tag } };
  }

  // cursor
  const cursorWhere = buildCursorWhere(query.cursor);
  if (cursorWhere) {
    Object.assign(where, cursorWhere);
  }

  return where;
}

/**
 * 文字列からTransitModeへのキャスト関数
 * @param method
 */
export function mapMethodToTransitMode(method: string): TransitMode {
  switch (method.toUpperCase()) {
    case "WALK":
      return TransitMode.WALK;
    case "TRAIN":
      return TransitMode.TRAIN;
    case "BUS":
      return TransitMode.BUS;
    case "CAR":
      return TransitMode.CAR;
    case "BIKE":
      return TransitMode.BIKE;
    case "FLIGHT":
      return TransitMode.FLIGHT;
    case "SHIP":
      return TransitMode.SHIP;
    case "OTHER":
      return TransitMode.OTHER;
    default:
      return TransitMode.WALK;
  }
}

/**
 * items 配列から Prisma.RouteDateCreateWithoutRouteInput[] を組み立てる
 */
export function buildRouteDatesFromItems(
  items: postRouteType["items"] | PatchRouteType["items"],
): Prisma.RouteDateCreateWithoutRouteInput[] {
  if (!items) return [];

  return items.map((dayItems, dayIndex) => {
    const routeNodes: Prisma.RouteNodeCreateWithoutRouteDateInput[] = [];
    let current_node: Prisma.RouteNodeCreateWithoutRouteDateInput | null = null;

    for (const item of dayItems) {
      if (item.type === "waypoint") {
        current_node = {
          order: routeNodes.length,
          details: item.memo,
          spot: (() => {
            // source, sourceIdが存在する時
            if (item.source && item.sourceId) {
              return {
                connectOrCreate: {
                  where: { source_sourceId: { source: item.source, sourceId: item.sourceId } },
                  create: {
                    name: item.name,
                    latitude: item.lat,
                    longitude: item.lng,
                    source: item.source,
                    sourceId: item.sourceId,
                  },
                },
              };
            } else if (item.id) {
              return {
                connectOrCreate: {
                  where: { id: item.id },
                  create: {
                    name: item.name,
                    latitude: item.lat,
                    longitude: item.lng,
                  },
                },
              };
            } else {
              return {
                create: {
                  name: item.name,
                  latitude: item.lat,
                  longitude: item.lng,
                },
              };
            }
          })(),
          transitSteps: { create: [] },
          images: {
            create: Array.isArray(item.images)
              ? item.images.map((url) => ({
                  url,
                  type: ImageType.NODE_IMAGE,
                  status: ImageStatus.ADOPTED,
                }))
              : [],
          },
        };
        routeNodes.push(current_node);
      } else if (item.type === "transportation") {
        if (current_node && current_node.transitSteps?.create) {
          (current_node.transitSteps.create as Prisma.TransitStepCreateWithoutRouteNodeInput[]).push({
            order: (current_node.transitSteps.create as any[]).length,
            mode: mapMethodToTransitMode(item.method),
            memo: item.memo,
            distance: item.distance,
            duration: item.duration,
          });
        }
      }
    }

    return {
      day: dayIndex + 1,
      routeNodes: {
        create: routeNodes,
      },
    };
  });
}

/**
 * postRoute 用の Prisma.RouteCreateInput を組み立てる
 */
export function buildCreateRouteData(
  body: postRouteType,
  authorId: string,
  language: Language,
): Prisma.RouteCreateInput {
  const routeDates = buildRouteDatesFromItems(body.items);

  return {
    title: body.title,
    description: body.description,
    visibility: body.visibility as RouteVisibility,
    author: { connect: { id: authorId } },
    thumbnail: {
      create: {
        url: body.thumbnailImageSrc,
        type: ImageType.ROUTE_THUMBNAIL,
        status: ImageStatus.ADOPTED,
      },
    },
    routeDates: {
      create: routeDates,
    },
    collaboratorPolicy: (body.collaboratorPolicy as RouteCollaboratorPolicy) ?? undefined,
    routeFor: body.who,
    date: new Date(body.date),
    language,
    budget: {
      create: {
        localCurrencyCode: body.budget.currencyCode as CurrencyCode,
        amount: body.budget.amount,
      },
    },
    tags: {
      connectOrCreate: body.tags.map((tag) => ({
        where: { name: tag },
        create: { name: tag },
      })),
    },
  };
}

/**
 * patchRoute 用の Prisma.RouteUpdateInput を組み立てる
 */
export function buildUpdateRouteData(body: PatchRouteType): Prisma.RouteUpdateInput {
  const routeDates = body.items ? buildRouteDatesFromItems(body.items) : undefined;

  return {
    title: body.title ?? undefined,
    description: body.description ?? undefined,
    visibility: (body.visibility as RouteVisibility) ?? undefined,
    thumbnail: body.thumbnailImageSrc
      ? {
          update: {
            url: body.thumbnailImageSrc,
          },
        }
      : undefined,
    ...(routeDates && {
      routeDates: {
        deleteMany: {},
        create: routeDates,
      },
    }),
    collaboratorPolicy: (body.collaboratorPolicy as RouteCollaboratorPolicy) ?? undefined,
    routeFor: body.who,
    date: body.date ? new Date(body.date) : undefined,
    budget: body.budget
      ? {
          update: {
            localCurrencyCode: body.budget.currencyCode as CurrencyCode,
            amount: body.budget.amount,
          },
        }
      : undefined,
    tags: body.tags
      ? {
          set: [], // 一旦リセット
          connectOrCreate: body.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        }
      : undefined,
  };
}
