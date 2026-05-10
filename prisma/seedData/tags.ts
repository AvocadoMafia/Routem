// Routem シードデータ: タグ 25 個。
// 仕様書 docs/seed-spec.md §5「タグ設計」と完全一致。
//
// Tag.name は Prisma 上 @unique なので、最終的な識別はタグ名で行われる。
// key (tag-001 等) はシード内部の参照用。
// カテゴリ分類は内部メモのみで DB には保存しない（Tag モデルに category なし）。

import type { SeedTag } from './types';

export const tags: SeedTag[] = [
  // テーマ系
  { key: 'tag-001', name: '歴史' },
  { key: 'tag-002', name: '自然' },
  { key: 'tag-003', name: 'グルメ' },
  { key: 'tag-004', name: 'カフェ' },
  { key: 'tag-005', name: '寺社仏閣' },
  { key: 'tag-006', name: 'アート' },
  { key: 'tag-007', name: 'ショッピング' },
  { key: 'tag-008', name: '温泉' },
  { key: 'tag-009', name: '夜景' },
  { key: 'tag-010', name: '絶景' },

  // 同行者系
  { key: 'tag-011', name: 'ソロ旅' },
  { key: 'tag-012', name: 'カップル' },
  { key: 'tag-013', name: '家族旅行' },
  { key: 'tag-014', name: '子連れ' },
  { key: 'tag-015', name: '女子旅' },

  // シーズン系
  { key: 'tag-016', name: '夏休み' },
  { key: 'tag-017', name: '紅葉' },
  { key: 'tag-018', name: '桜' },
  { key: 'tag-019', name: '花火' },

  // アクティビティ系
  { key: 'tag-020', name: 'ハイキング' },
  { key: 'tag-021', name: 'サイクリング' },
  { key: 'tag-022', name: '写真映え' },

  // エリア性質系
  { key: 'tag-023', name: '離島' },
  { key: 'tag-024', name: '秘境' },

  // スタイル系
  { key: 'tag-025', name: '弾丸旅行' },
];
