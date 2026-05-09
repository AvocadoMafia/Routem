// Routem シードデータ共通の中間型と ID 変換ヘルパ。
// 各 prisma/seedData/*.ts ファイルからこのモジュールをインポートして使う。
// 実装方針は docs/seed-spec.md 第12章「ファイル別生成要件」を参照。

import { createHash } from 'node:crypto';
import {
  CurrencyCode,
  ImageType,
  Language,
  Locale,
  RouteCollaboratorPolicy,
  RouteFor,
  RouteVisibility,
  TransitMode,
} from '@prisma/client';


// ---------------------------------------------------------------------------
// 決定論的 UUID 変換
//
// シードデータは「人間可読な key」(例: 'r-042', 's-013', 'c-007') を識別子
// として持つ。DB 保存時にはこの key から決定論的に UUID v4 形式の文字列を
// 生成して `@db.Uuid` カラムへ入れる。
//
// 同じ (prefix, key) からは常に同じ UUID が出るため、再シード（upsert）でも
// 整合性が保たれる。Postgres の uuid 型はバージョンビットを検証しないので、
// 本実装は SHA-1 ハッシュからバージョン4・バリアント8の体裁を整えただけの
// 疑似 v4 を返す（v5 with namespace と等価な決定論性を持つ）。
//
// ⚠️ 重要な制約:
// - User の id は Supabase Auth が払い出す UUID をそのまま使うため、
//   toUuid() で生成してはいけない（Auth 側 UUID と不一致になり FK 違反）。
// - SeedUser には id フィールドを持たせず、key のみで識別する。
// - prisma/seed.ts 側で User 作成後に Map<userKey, supabaseAuthUserId>
//   を構築し、以降のすべての関連レコード (Route.authorId / Follow /
//   Like / Comment / View) はこの Map 経由で UUID を解決する。
// - toUuid() は User 以外のエンティティ (Spot / Image / Route /
//   RouteDate / RouteNode / TransitStep / Comment / Follow / Like /
//   View) でのみ使用する。
// - prefix の文字列は docs/seed-spec.md §13「prefix 命名規則」表で
//   固定されている。同一エンティティで異なる prefix を渡すと別 UUID
//   になり FK 違反を起こすので、必ず表通りに使うこと。
// ---------------------------------------------------------------------------

const NAMESPACE = 'routem-seed-v1';

export function toUuid(prefix: string, key: string): string {
  const hash = createHash('sha1').update(`${NAMESPACE}:${prefix}:${key}`).digest('hex');
  const variantNibble = ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    variantNibble + hash.substring(17, 20),
    hash.substring(20, 32),
  ].join('-');
}

// ---------------------------------------------------------------------------
// シード中間型
//
// それぞれ「シードファイルが宣言する形」と「DB に投入する直前の形」の中間。
// Prisma の `*CreateInput` をそのまま使うとリレーション解決が前提になって
// 取り回しが悪いため、key ベース参照を保つ中間型をこちらに定義する。
// 実 upsert は prisma/seed.ts 側で key → UUID 変換しつつ Prisma の create
// 形式に組み立て直す。
// ---------------------------------------------------------------------------

export type SeedTag = {
  key: string;          // 例: 'tag-001'
  name: string;         // 例: '歴史'（@unique なので最終的な識別子はこちら）
};

export type SeedSpot = {
  key: string;          // 例: 's-001'
  name: string;
  latitude: number;
  longitude: number;
  area: string;         // 都道府県（例: '東京', '京都'）。DB 列ではなく内部メタ。
  // 全件 source: USER, sourceId: null で投入する想定（仕様書 §6 参照）
};

export type SeedImage = {
  key: string;          // 例: 'img-icon-001', 'img-thumb-007'
  url: string;          // Unsplash の完全 URL
  type: ImageType;      // USER_ICON / USER_BG / ROUTE_THUMBNAIL / NODE_IMAGE
  // 全件 status: EXTERNAL, key: null（OCI/MinIO に実体なし）で投入する
};

export type SeedUser = {
  key: string;          // 例: 'u-001', 'mob-005'
  name: string;
  email: string;
  password: string;     // Supabase Auth に渡すパスワード
  /**
   * 自己紹介。Prisma 側は String? で nullable。
   * 本シードでは原則「空文字 ''」運用（u-011 quiet_user 等）だが、
   * 将来的に null も許容できるよう型は string | null にしておく。
   */
  bio: string | null;
  age: number | null;
  locale: Locale;       // 本シードでは全員 Locale.JA
  language: Language;   // 同上 Language.JA
  iconKey: string | null;       // images.ts 内の SeedImage.key を指す
  backgroundKey: string | null; // 同上
};

export type SeedTransitStep = {
  mode: TransitMode;
  duration: number | null;  // 分
  distance: number | null;  // km
  memo: string | null;
  order: number;
};

export type SeedRouteNode = {
  order: number;
  spotKey: string;            // spots.ts 内の SeedSpot.key を指す
  details: string | null;
  imageKeys: string[];        // images.ts 内の SeedImage.key（NODE_IMAGE）配列
  transitSteps: SeedTransitStep[]; // この地点から次の地点までの移動ステップ
};

export type SeedRouteDate = {
  day: number;                // 1日目, 2日目, ...
  nodes: SeedRouteNode[];
};

export type SeedRoute = {
  key: string;                // 例: 'r-001'
  authorKey: string;          // users.ts 内の SeedUser.key を指す
  /** 100 字以内（Prisma 側 @db.VarChar(100) 制約） */
  title: string;
  description: string;
  date: string;               // ISO8601 文字列（旅行日）
  createdAt: string;          // ISO8601 文字列（投稿日）。仕様書 §7.6 参照
  routeFor: RouteFor;
  visibility: RouteVisibility;
  /**
   * 共同編集者ポリシー。仕様書 §3.5 で「全ルート DISABLED 統一」と
   * 定められているため、シードでは常に RouteCollaboratorPolicy.DISABLED
   * を入れる。Prisma 側にも @default(DISABLED) があるが、明示する。
   */
  collaboratorPolicy: RouteCollaboratorPolicy;
  language: Language;         // 本シードでは全件 Language.JA
  tagKeys: string[];          // tags.ts 内の SeedTag.key 配列
  budget: { amount: number; currency: CurrencyCode } | null; // null = 予算なし
  thumbnailKey: string | null;
  routeDates: SeedRouteDate[];
  targetLikes: number;        // socialGraph.ts でのいいね生成目標
  targetViews: number;        // 同 View 生成目標
};

export type SeedFollow = {
  followerKey: string;        // フォローする側
  followingKey: string;       // フォローされる側
};

export type SeedComment = {
  key: string;                // 例: 'c-001'
  routeKey: string;
  authorKey: string;
  text: string;
  createdAt: string;          // ISO8601
  targetLikes: number;        // このコメントへのいいね目標
};

/**
 * いいねは Route または Comment のいずれかを対象に取る（排他）。
 * Prisma 側の Like モデルは routeId? と commentId? のうち一方だけが
 * 設定される設計のため、型レベルでも discriminated union で表現する。
 */
export type SeedLike =
  | { userKey: string; routeKey: string;   commentKey?: never }
  | { userKey: string; commentKey: string; routeKey?: never   };

export type SeedView = {
  routeKey: string;
  count: number;              // 生成する View レコード数
  loggedInRatio: number;      // 0.0〜1.0、ログイン済み userId 付与の割合
};
