// Routem シードデータの統合 export モジュール。
//
// docs/seed-spec.md §12.2 で要請されている re-export ファイル。
// `prisma/seed.ts` からは本ファイルだけを import すれば、
// 各種シードデータ（type / tag / spot / image / user / route /
// socialGraph）に到達できる。
//
// 個別の型・データはそれぞれの専用ファイルから直接 import しても良い。

// 型・ヘルパ
export type {
  SeedTag,
  SeedSpot,
  SeedImage,
  SeedUser,
  SeedTransitStep,
  SeedRouteNode,
  SeedRouteDate,
  SeedRoute,
  SeedFollow,
  SeedComment,
  SeedLike,
  SeedView,
} from './types';
export { toUuid } from './types';

// マスタデータ
export { tags } from './tags';
export { spots } from './spots';
export {
  userIconImages,
  userBackgroundImages,
  routeThumbnailImages,
  spotNodeImages,
  allImages,
} from './images';
export { coreUsers, edgeCaseUsers, mobUsers, allUsers } from './users';

// ルートデータ
export {
  curatedRoutesFirstHalf,
  curatedRoutesSecondHalf,
  curatedRoutes,
} from './routes/curated';
export {
  semiRoutesFirstHalf,
  semiRoutesSecondHalf,
  semiRoutes,
} from './routes/semi';
export { generatedRoutes } from './routes/generated';

// ソーシャルグラフ
export { follows, routeLikes, comments, commentLikes } from './socialGraph';

// 全ルート統合（curated 50 + semi 100 + generated 100 = 250 本）
import type { SeedRoute } from './types';
import { curatedRoutes } from './routes/curated';
import { semiRoutes } from './routes/semi';
import { generatedRoutes } from './routes/generated';

export const allRoutes: SeedRoute[] = [
  ...curatedRoutes,
  ...semiRoutes,
  ...generatedRoutes,
];
