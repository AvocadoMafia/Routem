import { GetRoutesType, PatchRouteType, postRouteType } from "@/features/routes/schema";
import {
  CurrencyCode,
  ImageStatus,
  ImageType,
  Prisma,
  RouteCollaboratorPolicy,
  RouteFor,
  RouteVisibility,
  TransitMode,
} from "@prisma/client";

/**
 * routes 検索用の Prisma.RouteWhereInput を組み立てる
 * @param query
 * @param user_id 閲覧者のユーザーID
 */
export function buildRoutesWhere(
  query: GetRoutesType,
  user_id?: string,
  search_ids?: string[],
): Prisma.RouteWhereInput {
  const isOwner = !!(user_id && query.authorId && user_id === query.authorId);

  const where: Prisma.RouteWhereInput = {};

  // searchIds
  if (search_ids) {
    where.id = { in: search_ids };
  }

  // authorId
  if (query.authorId) {
    where.authorId = query.authorId;
  }

  // createdAfter (schema.tsでDateに変換済み)
  if (query.createdAfter instanceof Date) {
    where.createdAt = { gte: query.createdAfter };
  }

  //   5W1H who
  if (query.who) {
    where.routeFor = query.who;
  }

  // visibility
  // 1. 自分が投稿者の場合: 指定があればそれに従う。指定がなければ全件。
  // 2. 他人の場合: PUBLICのみ表示。
  if (!isOwner) {
    where.visibility = RouteVisibility.PUBLIC;
  } else if (query.visibility) {
    where.visibility = query.visibility as RouteVisibility;
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
 * items 配列から Prisma.RouteNodeCreateWithoutRouteInput[] を組み立てる
 */
export function buildRouteNodesFromItems(
  items: postRouteType["items"] | PatchRouteType["items"],
): Prisma.RouteNodeCreateWithoutRouteInput[] {
  if (!items) return [];

  const current_nodes: Prisma.RouteNodeCreateWithoutRouteInput[] = [];
  let current_node: Prisma.RouteNodeCreateWithoutRouteInput | null = null;

  for (const item of items) {
    if (item.type === "waypoint") {
      current_node = {
        order: current_nodes.length,
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
      current_nodes.push(current_node);
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
  return current_nodes;
}

/**
 * postRoute 用の Prisma.RouteCreateInput を組み立てる
 */
export function buildCreateRouteData(
  body: postRouteType,
  authorId: string,
): Prisma.RouteCreateInput {
  const routeNodes = buildRouteNodesFromItems(body.items);

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
    routeNodes: {
      create: routeNodes,
    },
    collaboratorPolicy: (body.collaboratorPolicy as RouteCollaboratorPolicy) ?? undefined,
    routeFor: body.routeFor as RouteFor,
    month: body.month === 0 ? null : body.month,
    budget: {
      create: {
        currency: body.budget.currency as CurrencyCode,
        amount: body.budget.amount,
        baseAmount: body.budget.amount, // TODO: 為替レート変換
        baseCurrency: "JPY",
        note: body.budget.note,
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
  const routeNodes = body.items ? buildRouteNodesFromItems(body.items) : undefined;

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
    ...(routeNodes && {
      routeNodes: {
        deleteMany: {},
        create: routeNodes,
      },
    }),
    collaboratorPolicy: (body.collaboratorPolicy as RouteCollaboratorPolicy) ?? undefined,
    routeFor: (body.routeFor as RouteFor) ?? undefined,
    month: body.month === 0 ? null : (body.month ?? undefined),
    budget: body.budget
      ? {
          update: {
            currency: body.budget.currency as CurrencyCode,
            amount: body.budget.amount,
            baseAmount: body.budget.amount, // TODO: 為替レート変換
            baseCurrency: "JPY",
            note: body.budget.note,
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
