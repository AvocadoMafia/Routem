/**
 * クライアント側で使用する型定義
 * lib/types/からre-exportし、後方互換性を維持
 */

// ドメイン型
export type {
  Route,
  RouteWithRelations,
  User,
  Comment,
  Waypoint,
  Transportation,
  RouteItem,
} from '@/lib/types/domain'

// エラー型
export type { ErrorScheme } from '@/lib/types/error'
