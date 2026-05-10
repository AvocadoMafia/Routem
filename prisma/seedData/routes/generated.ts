// Routem シードデータ: 量産ルート 100 本（gn-001 〜 gn-100）。
//
// 仕様書 docs/seed-spec.md §7.4 / §7.5 / §7.6 / §11.5 / §13.1 に準拠。
// 「ページング・検索のスケールテスト用」枠で、quality より quantity 優先。
// description は短文定型（80〜150字）、ノード数は各日 1〜3 個（平均 2.0）、
// 著者は mob-001〜mob-010 中心（コアペルソナは仕様 §4.4 の残数のみ消化）。
//
// 著者配分（合計 100）:
//   mob-001: 7 / mob-002: 7 / mob-003: 6 / mob-004: 7 / mob-005: 6
//   mob-006: 7 / mob-007: 6 / mob-008: 6 / mob-009: 6 / mob-010: 6  → 64
//   u-001: 5 / u-002: 5 / u-003: 5 / u-004: 3 / u-005: 4 / u-006: 4
//   u-007: 2 / u-008: 4 / u-009: 4                                   → 36
//
// 日数分布（仕様 §7.5.1 を 100 本に按分、量産は 1〜2 日多め）:
//   1日 33 / 2日 36 / 3日 18 / 4日 9 / 5日以上 4 = 100
//
// バンド（仕様 §7.5.7 / §7.4 量産ルール「いいね 0〜10、無名 or 一般」）:
//   一般 71 本（いいね 1〜10、閲覧 30〜200）
//   無名 29 本（いいね 0、閲覧 0〜30）
//
// imageKeys 空（仕様 §11.5「量産 100 本のうち 30 本ノード写真なし」）:
//   gn-001 〜 gn-030 の 30 本は全ノードで imageKeys: []。
//   残り gn-031〜100 はノード単位で空配列を混ぜつつ、対応スポットでは
//   spotNodeImages の対応キーを参照する。
//
// thumbnailKey null（仕様 §11.5「一般枠ルート 20 本サムネなし」、curated/semi
// は 0 本のため generated に全 20 本割り当て）:
//   gn-001 〜 gn-020 が thumbnailKey: null。残りは img-thumb-051〜080 から
//   テーマに合わせて選択（被り許容）。
//
// 夏休みタグ（tag-016）配分: 約 40 本（date を 7〜8 月に置く）。
//
// createdAt 例外（仕様 §7.6「事前計画として createdAt < date」10%）:
//   gn-009 / gn-024 / gn-038 / gn-047 / gn-061 / gn-073 / gn-082 / gn-088 /
//   gn-094 / gn-099 の 10 本。
//
// 予算（仕様 §3.5 / §7.5.4）:
//   null: gn-007, gn-013, gn-022, gn-035, gn-046, gn-058, gn-066, gn-080, gn-095（9 本）
//   amount=0: gn-085（hayato_solo「無料で楽しめる旅」枠 1 本）
//   それ以外は §I の予算分布に沿った値を入れる。
//
// 1日 1 ノード最小構成（仕様 §7.5.2 のエッジケース 1 本）: gn-001。
//
// 全件 visibility: PUBLIC、collaboratorPolicy: DISABLED、language: JA。

import {
  CurrencyCode,
  Language,
  RouteCollaboratorPolicy,
  RouteFor,
  RouteVisibility,
  TransitMode,
} from '@prisma/client';
import type { SeedRoute } from '../types';

const JA = Language.JA;
const PUBLIC_VIS = RouteVisibility.PUBLIC;
const POLICY = RouteCollaboratorPolicy.DISABLED;
const JPY = CurrencyCode.JPY;

export const generatedRoutes: SeedRoute[] = [
  // ===========================================================================
  // §A. mob-001 mob_user_001（東京近郊で日帰り旅）/ gn-001 〜 gn-007 / 7 本
  // 日数: 1×3 / 2×3 / 3×1   バンド: 無名 4 / 一般 3
  // ===========================================================================

  // ---- gn-001 ★1日1ノード最小構成エッジケース・無名・サムネなし・画像なし ----
  {
    key: 'gn-001',
    authorKey: 'mob-001',
    title: '東京1日間の旅 #1',
    description: '東京を1日で巡るルート。浅草寺を中心に組み立てました。短時間で観光したい方におすすめです。',
    date: '2025-08-09T09:00:00Z',
    createdAt: '2025-08-15T20:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-001'],
    budget: { amount: 3500, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-001',
            details: '浅草寺。雷門と仲見世通り。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 12,
  },

  // ---- gn-002 横浜1日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-002',
    authorKey: 'mob-001',
    title: '神奈川1日間の旅 #2',
    description: '神奈川を1日で巡るルート。鎌倉大仏と江ノ島を中心に組み立てました。週末のお出かけにおすすめです。',
    date: '2025-09-13T08:30:00Z',
    createdAt: '2025-09-20T21:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-002'],
    budget: { amount: 6000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-004',
            details: '鎌倉大仏を参拝。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 4.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-005',
            details: '江ノ島シーキャンドルからの夕景。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 18,
  },

  // ---- gn-003 東京1日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-003',
    authorKey: 'mob-001',
    title: '東京1日間の旅 #3',
    description: '東京を1日で巡るルート。明治神宮と上野公園を中心に組み立てました。歴史好きの方におすすめです。',
    date: '2024-11-23T09:00:00Z',
    createdAt: '2024-12-01T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-017'],
    budget: { amount: 4200, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-018',
            details: '明治神宮で朝のお参り。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-019',
            details: '上野公園を散策。紅葉が綺麗でした。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 1,
    targetViews: 35,
  },

  // ---- gn-004 高尾山〜河口湖2日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-004',
    authorKey: 'mob-001',
    title: '東京・山梨2日間の旅 #4',
    description: '東京と山梨を2日で巡るルート。高尾山と河口湖を中心に組み立てました。週末旅行におすすめです。',
    date: '2025-08-23T08:00:00Z',
    createdAt: '2025-09-02T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-020'],
    budget: { amount: 18000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-022',
            details: '高尾山に登山。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-007',
            details: '河口湖大石公園からの富士山。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 20, distance: 1.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-006',
            details: '富士山五合目で記念写真。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 22,
  },

  // ---- gn-005 箱根2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-005',
    authorKey: 'mob-001',
    title: '神奈川2日間の旅 #5',
    description: '神奈川を2日で巡るルート。箱根の温泉とみなとみらいを中心に組み立てました。リフレッシュにおすすめです。',
    date: '2024-08-15T10:00:00Z',
    createdAt: '2024-09-04T18:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-009'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-016',
            details: '大涌谷で黒たまごを購入。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 30, distance: 4.0, memo: 'ロープウェイ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-015',
            details: 'みなとみらいの夜景を堪能。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-128',
            details: '中華街でランチ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 95,
  },

  // ---- gn-006 軽井沢2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-006',
    authorKey: 'mob-001',
    title: '長野2日間の旅 #6',
    description: '長野を2日で巡るルート。軽井沢の旧軽銀座を中心に組み立てました。避暑地におすすめです。',
    date: '2025-07-26T09:30:00Z',
    createdAt: '2025-08-10T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-007', 'tag-002'],
    budget: { amount: 22000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details: '旧軽井沢銀座を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-023',
            details: '諏訪湖を1周。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 2,
    targetViews: 60,
  },

  // ---- gn-007 日光鬼怒川3日 / 一般 / サムネなし・画像なし / 予算 null ----
  {
    key: 'gn-007',
    authorKey: 'mob-001',
    title: '栃木3日間の旅 #7',
    description: '栃木を3日で巡るルート。日光東照宮と鬼怒川温泉、那須高原を中心に組み立てました。家族旅行におすすめです。',
    date: '2025-05-03T08:00:00Z',
    createdAt: '2025-05-20T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-008'],
    budget: null,
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-009',
            details: '日光東照宮を参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-010',
            details: '鬼怒川温泉で1泊。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-011',
            details: '那須高原でのんびり。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 130,
  },

  // ===========================================================================
  // §B. mob-002 mob_user_002（東京駅周辺カフェ巡り）/ gn-008 〜 gn-014 / 7 本
  // 日数: 1×2 / 2×3 / 3×1 / 4×1   バンド: 無名 3 / 一般 4
  // ===========================================================================

  // ---- gn-008 東京カフェ1日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-008',
    authorKey: 'mob-002',
    title: '東京1日間の旅 #8',
    description: '東京を1日で巡るルート。東京駅丸の内駅舎と築地場外市場を中心に組み立てました。グルメ好きにおすすめです。',
    date: '2024-09-15T09:00:00Z',
    createdAt: '2024-09-25T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-004', 'tag-007'],
    budget: { amount: 5000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-020',
            details: '東京駅丸の内駅舎を眺める。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-119',
            details: '築地場外市場で海鮮丼。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 24,
  },

  // ---- gn-009 京都1日 / 無名 / サムネなし・画像なし / 事前計画(createdAt < date) ----
  {
    key: 'gn-009',
    authorKey: 'mob-002',
    title: '京都1日間の旅 #9',
    description: '京都を1日で巡るルート。錦市場と祇園を中心に組み立てました。グルメと町並みを楽しむのにおすすめです。',
    date: '2026-04-04T09:30:00Z',
    createdAt: '2026-03-20T21:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-004', 'tag-018'],
    budget: { amount: 6500, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-125',
            details: '錦市場を散策。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details: '祇園花見小路で町並みを楽しむ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 8,
  },

  // ---- gn-010 神奈川2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-010',
    authorKey: 'mob-002',
    title: '神奈川2日間の旅 #10',
    description: '神奈川を2日で巡るルート。みなとみらいと中華街を中心に組み立てました。カップルにおすすめです。',
    date: '2025-02-14T10:00:00Z',
    createdAt: '2025-02-25T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-003', 'tag-012'],
    budget: { amount: 24000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-015',
            details: 'みなとみらいで夜景観賞。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-128',
            details: '中華街で食べ歩き。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-014',
            details: '小町通りでお土産探し。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 110,
  },

  // ---- gn-011 大阪2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-011',
    authorKey: 'mob-002',
    title: '大阪2日間の旅 #11',
    description: '大阪を2日で巡るルート。道頓堀と大阪城を中心に組み立てました。週末にサクッと回りたい方におすすめです。',
    date: '2025-08-16T10:00:00Z',
    createdAt: '2025-08-28T19:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-001'],
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-030',
            details: '道頓堀でグリコポーズ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-120',
            details: '黒門市場で食べ歩き。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-036',
            details: '大阪城を見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 145,
  },

  // ---- gn-012 福岡2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-012',
    authorKey: 'mob-002',
    title: '福岡2日間の旅 #12',
    description: '福岡を2日で巡るルート。太宰府天満宮と中洲屋台を中心に組み立てました。グルメ好きにおすすめです。',
    date: '2024-12-07T09:00:00Z',
    createdAt: '2024-12-22T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-005', 'tag-001'],
    budget: { amount: 30000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-090',
            details: '太宰府天満宮を参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-091',
            details: '中洲屋台で締めのラーメン。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 3,
    targetViews: 78,
  },

  // ---- gn-013 京都奈良3日 / 無名 / サムネなし・画像なし / 予算 null ----
  {
    key: 'gn-013',
    authorKey: 'mob-002',
    title: '京都・奈良3日間の旅 #13',
    description: '京都と奈良を3日で巡るルート。清水寺と奈良公園を中心に組み立てました。寺社仏閣好きにおすすめです。',
    date: '2024-04-12T08:30:00Z',
    createdAt: '2024-05-05T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-018', 'tag-001'],
    budget: null,
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details: '清水寺を参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷の千本鳥居。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-028',
            details: '奈良公園で鹿と触れ合う。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.6, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-029',
            details: '東大寺の大仏を見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 14,
  },

  // ---- gn-014 北海道4日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-014',
    authorKey: 'mob-002',
    title: '北海道4日間の旅 #14',
    description: '北海道を4日で巡るルート。札幌と小樽、函館を中心に組み立てました。カフェ巡り好きにおすすめです。',
    date: '2025-07-19T10:00:00Z',
    createdAt: '2025-08-12T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-004', 'tag-003'],
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌大通公園を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-049',
            details: '小樽運河を散歩。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details: '函館山展望台からの夜景。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-122',
            details: '函館朝市で海鮮丼。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 178,
  },

  // ===========================================================================
  // §C. mob-003 mob_user_003（出張ついで観光）/ gn-015 〜 gn-020 / 6 本
  // 日数: 1×2 / 2×3 / 3×1   バンド: 無名 3 / 一般 3
  // ===========================================================================

  // ---- gn-015 名古屋1日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-015',
    authorKey: 'mob-003',
    title: '愛知1日間の旅 #15',
    description: '愛知を1日で巡るルート。名古屋城と熱田神宮を中心に組み立てました。出張ついでの観光におすすめです。',
    date: '2025-01-25T10:00:00Z',
    createdAt: '2025-02-05T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-011'],
    budget: { amount: 4800, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details: '名古屋城を見学。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-067',
            details: '熱田神宮を参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 19,
  },

  // ---- gn-016 大阪1日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-016',
    authorKey: 'mob-003',
    title: '大阪1日間の旅 #16',
    description: '大阪を1日で巡るルート。通天閣と新世界を中心に組み立てました。出張前後にサクッと観光できます。',
    date: '2025-06-08T11:00:00Z',
    createdAt: '2025-06-15T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-003', 'tag-011'],
    budget: { amount: 4200, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-037',
            details: '通天閣の周辺で串カツ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 2,
    targetViews: 55,
  },

  // ---- gn-017 仙台2日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-017',
    authorKey: 'mob-003',
    title: '宮城2日間の旅 #17',
    description: '宮城を2日で巡るルート。松島と仙台牛タン通りを中心に組み立てました。出張ついでの旅におすすめです。',
    date: '2024-10-26T09:30:00Z',
    createdAt: '2024-11-08T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-010', 'tag-017'],
    budget: { amount: 22000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-058',
            details: '松島五大堂を観光。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-123',
            details: '仙台で牛タン定食。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 22,
  },

  // ---- gn-018 金沢2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-018',
    authorKey: 'mob-003',
    title: '石川2日間の旅 #18',
    description: '石川を2日で巡るルート。兼六園とひがし茶屋街を中心に組み立てました。出張帰りにおすすめです。',
    date: '2025-07-22T10:00:00Z',
    createdAt: '2025-08-15T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-001', 'tag-002'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-064',
            details: '兼六園を散策。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-065',
            details: 'ひがし茶屋街でお茶。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-129',
            details: '近江町市場で海鮮丼。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 140,
  },

  // ---- gn-019 広島2日 / 一般 / サムネなし・画像なし ----
  {
    key: 'gn-019',
    authorKey: 'mob-003',
    title: '広島2日間の旅 #19',
    description: '広島を2日で巡るルート。厳島神社と原爆ドームを中心に組み立てました。歴史を感じる旅におすすめです。',
    date: '2024-07-13T09:00:00Z',
    createdAt: '2024-07-30T18:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-001', 'tag-005'],
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-074',
            details: '厳島神社の鳥居を見学。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 10, distance: 1.8, memo: 'フェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-075',
            details: '原爆ドームを見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-083',
            details: '尾道千光寺へ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 165,
  },

  // ---- gn-020 高山白川郷3日 / 無名 / サムネなし・画像なし ----
  {
    key: 'gn-020',
    authorKey: 'mob-003',
    title: '岐阜3日間の旅 #20',
    description: '岐阜を3日で巡るルート。飛騨高山と白川郷を中心に組み立てました。古い町並み好きにおすすめです。',
    date: '2024-11-09T08:00:00Z',
    createdAt: '2024-11-25T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-017', 'tag-002'],
    budget: { amount: 48000, currency: JPY },
    thumbnailKey: null,
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-063',
            details: '飛騨高山の古い町並みを散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-062',
            details: '白川郷の合掌造り集落。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details: '上高地河童橋で記念撮影。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 27,
  },

  // ===========================================================================
  // §D. mob-004 mob_user_004（温泉と美味しいごはん）/ gn-021 〜 gn-027 / 7 本
  // 日数: 1×2 / 2×3 / 3×1 / 4×1   バンド: 無名 3 / 一般 4
  // gn-021 以降はサムネあり、gn-021 〜 gn-030 は画像なし継続
  // ===========================================================================

  // ---- gn-021 草津1日 / 一般 / サムネあり・画像なし ----
  {
    key: 'gn-021',
    authorKey: 'mob-004',
    title: '群馬1日間の旅 #21',
    description: '群馬を1日で巡るルート。草津温泉湯畑を中心に組み立てました。温泉好きにおすすめです。',
    date: '2025-02-23T11:00:00Z',
    createdAt: '2025-03-05T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-011', 'tag-003'],
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-012',
            details: '草津温泉湯畑で湯めぐり。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 88,
  },

  // ---- gn-022 城崎1日 / 無名 / サムネあり・画像なし / 予算 null ----
  {
    key: 'gn-022',
    authorKey: 'mob-004',
    title: '兵庫1日間の旅 #22',
    description: '兵庫を1日で巡るルート。城崎温泉を中心に組み立てました。外湯巡りが好きな方におすすめです。',
    date: '2024-12-21T09:00:00Z',
    createdAt: '2025-01-04T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-011', 'tag-001'],
    budget: null,
    thumbnailKey: 'img-thumb-068',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-040',
            details: '城崎温泉で7つの外湯巡り。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 16,
  },

  // ---- gn-023 別府由布院2日 / 一般 / サムネあり・画像なし ----
  {
    key: 'gn-023',
    authorKey: 'mob-004',
    title: '大分2日間の旅 #23',
    description: '大分を2日で巡るルート。別府海地獄と由布院金鱗湖を中心に組み立てました。温泉好きにおすすめです。',
    date: '2025-08-15T09:00:00Z',
    createdAt: '2025-09-08T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-012'],
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-066',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-092',
            details: '別府の海地獄を見学。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-093',
            details: '由布院金鱗湖の朝霧。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-107',
            details: '黒川温泉の露天風呂。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ---- gn-024 銀山温泉2日 / 一般 / サムネあり・画像なし / 事前計画 ----
  {
    key: 'gn-024',
    authorKey: 'mob-004',
    title: '山形2日間の旅 #24',
    description: '山形を2日で巡るルート。銀山温泉を中心に組み立てました。レトロな温泉街が好きな方におすすめです。',
    date: '2026-02-07T11:00:00Z',
    createdAt: '2026-01-10T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-001', 'tag-012'],
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-069',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-051',
            details: '銀山温泉のガス灯と雪景色。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-059',
            details: '蔵王の御釜を見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 110,
  },

  // ---- gn-025 伊香保2日 / 無名 / サムネあり・画像なし ----
  {
    key: 'gn-025',
    authorKey: 'mob-004',
    title: '群馬2日間の旅 #25',
    description: '群馬を2日で巡るルート。伊香保温泉の石段街を中心に組み立てました。温泉旅行におすすめです。',
    date: '2024-08-31T10:00:00Z',
    createdAt: '2024-09-15T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-001'],
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: 'img-thumb-070',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-013',
            details: '伊香保石段街を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-012',
            details: '草津温泉の湯もみショー。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 25,
  },

  // ---- gn-026 道後温泉3日 / 一般 / サムネあり・画像なし ----
  {
    key: 'gn-026',
    authorKey: 'mob-004',
    title: '愛媛・香川3日間の旅 #26',
    description: '四国を3日で巡るルート。道後温泉と金刀比羅宮を中心に組み立てました。温泉と参拝が好きな方におすすめです。',
    date: '2025-04-12T08:00:00Z',
    createdAt: '2025-05-01T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-005', 'tag-018'],
    budget: { amount: 55000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-078',
            details: '道後温泉本館で湯浴み。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-086',
            details: '金刀比羅宮の階段を登る。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-080',
            details: '小豆島エンジェルロード。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 155,
  },

  // ---- gn-027 北海道4日 / 一般 / サムネあり・画像なし ----
  {
    key: 'gn-027',
    authorKey: 'mob-004',
    title: '北海道4日間の旅 #27',
    description: '北海道を4日で巡るルート。登別温泉と洞爺湖、ニセコを中心に組み立てました。温泉好きにおすすめです。',
    date: '2025-10-18T08:30:00Z',
    createdAt: '2025-11-05T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-017', 'tag-012'],
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-066',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-055',
            details: '登別温泉の地獄谷見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-054',
            details: '洞爺湖を眺めながら。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-056',
            details: 'ニセコのアンヌプリ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌大通公園で締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 132,
  },

  // ===========================================================================
  // §E. mob-005 mob_user_005（バイクで全国）/ gn-028 〜 gn-033 / 6 本
  // 日数: 1×2 / 2×2 / 3×1 / 4×1   バンド: 無名 2 / 一般 4
  // gn-028 〜 gn-030 は画像なし継続、gn-031 以降は画像混在
  // ===========================================================================

  // ---- gn-028 角島大橋1日 / 無名 / サムネあり・画像なし ----
  {
    key: 'gn-028',
    authorKey: 'mob-005',
    title: '山口1日間の旅 #28',
    description: '山口を1日で巡るルート。角島大橋を中心に組み立てました。バイクツーリングにおすすめです。',
    date: '2024-09-21T08:00:00Z',
    createdAt: '2024-10-08T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-010', 'tag-011', 'tag-022'],
    budget: { amount: 5500, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-085',
            details: '角島大橋を渡る。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 20,
  },

  // ---- gn-029 鳥取砂丘1日 / 一般 / サムネあり・画像なし ----
  {
    key: 'gn-029',
    authorKey: 'mob-005',
    title: '鳥取1日間の旅 #29',
    description: '鳥取を1日で巡るルート。鳥取砂丘を中心に組み立てました。絶景好きにおすすめです。',
    date: '2025-08-10T07:00:00Z',
    createdAt: '2025-08-22T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-011'],
    budget: { amount: 4200, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-076',
            details: '鳥取砂丘で朝の砂紋。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 105,
  },

  // ---- gn-030 出雲・隠岐2日 / 無名 / サムネあり・画像なし（画像なしの最終） ----
  {
    key: 'gn-030',
    authorKey: 'mob-005',
    title: '島根2日間の旅 #30',
    description: '島根を2日で巡るルート。出雲大社と隠岐諸島を中心に組み立てました。秘境好きにおすすめです。',
    date: '2025-05-17T08:00:00Z',
    createdAt: '2025-06-02T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-024', 'tag-023'],
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details: '出雲大社を参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-113',
            details: '隠岐の摩天崖を見学。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 150, distance: 65.0, memo: 'フェリー', order: 1 },
            ],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 11,
  },

  // ---- gn-031 ★以降ノード画像混在 / 阿蘇2日 / 一般 ----
  {
    key: 'gn-031',
    authorKey: 'mob-005',
    title: '熊本2日間の旅 #31',
    description: '熊本を2日で巡るルート。阿蘇草千里と黒川温泉を中心に組み立てました。バイクツーリングにおすすめです。',
    date: '2024-08-12T07:30:00Z',
    createdAt: '2024-09-02T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-008'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details: '阿蘇草千里で乗馬体験。',
            imageKeys: ['img-node-s094-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-107',
            details: '黒川温泉でのんびり。',
            imageKeys: ['img-node-s107-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 92,
  },

  // ---- gn-032 富山立山3日 / 一般 ----
  {
    key: 'gn-032',
    authorKey: 'mob-005',
    title: '富山3日間の旅 #32',
    description: '富山を3日で巡るルート。立山室堂平と黒部峡谷を中心に組み立てました。絶景好きにおすすめです。',
    date: '2025-09-06T07:00:00Z',
    createdAt: '2025-09-25T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-010', 'tag-020'],
    budget: { amount: 52000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details: '立山室堂平で高山植物。',
            imageKeys: ['img-node-s070-1', 'img-node-s070-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-071',
            details: '黒部峡谷トロッコ電車。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 80, distance: 20.0, memo: 'トロッコ電車', order: 1 },
            ],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-073',
            details: '東尋坊の断崖。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 168,
  },

  // ---- gn-033 北海道道東4日 / 一般 ----
  {
    key: 'gn-033',
    authorKey: 'mob-005',
    title: '北海道4日間の旅 #33',
    description: '北海道を4日で巡るルート。知床と富良野、美瑛を中心に組み立てました。バイクで広大な大地を満喫できます。',
    date: '2025-07-11T08:00:00Z',
    createdAt: '2025-07-30T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-010'],
    budget: { amount: 78000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details: '知床五湖を散策。',
            imageKeys: ['img-node-s048-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details: '富良野ファーム富田のラベンダー。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-052',
            details: '美瑛の青い池。',
            imageKeys: ['img-node-s052-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-053',
            details: '旭山動物園を見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 138,
  },

  // ===========================================================================
  // §F. mob-006 mob_user_006（北海道在住）/ gn-034 〜 gn-040 / 7 本
  // 日数: 1×3 / 2×2 / 3×1 / 4×1   バンド: 無名 3 / 一般 4
  // ===========================================================================

  // ---- gn-034 札幌1日 / 一般 ----
  {
    key: 'gn-034',
    authorKey: 'mob-006',
    title: '北海道1日間の旅 #34',
    description: '札幌を1日で巡るルート。大通公園と二条市場を中心に組み立てました。地元おすすめのコースです。',
    date: '2024-08-04T09:00:00Z',
    createdAt: '2024-08-18T18:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-007'],
    budget: { amount: 6500, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌大通公園を散策。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-121',
            details: '二条市場で海鮮丼。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 108,
  },

  // ---- gn-035 函館1日 / 無名 / 予算 null ----
  {
    key: 'gn-035',
    authorKey: 'mob-006',
    title: '北海道1日間の旅 #35',
    description: '函館を1日で巡るルート。函館山と朝市を中心に組み立てました。短い時間で観光したい方におすすめです。',
    date: '2025-08-08T10:00:00Z',
    createdAt: '2025-09-02T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-009', 'tag-003'],
    budget: null,
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details: '函館山展望台からの夜景。',
            imageKeys: ['img-node-s047-1'],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 5, distance: 0.8, memo: 'ロープウェイ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-122',
            details: '函館朝市で朝食。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 24,
  },

  // ---- gn-036 小樽1日 / 一般 ----
  {
    key: 'gn-036',
    authorKey: 'mob-006',
    title: '北海道1日間の旅 #36',
    description: '小樽を1日で巡るルート。小樽運河を中心に組み立てました。レトロ好きにおすすめです。',
    date: '2025-10-04T10:00:00Z',
    createdAt: '2025-10-18T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-012', 'tag-007'],
    budget: { amount: 7800, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-049',
            details: '小樽運河を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 3,
    targetViews: 72,
  },

  // ---- gn-037 北海道2日 / 一般 ----
  {
    key: 'gn-037',
    authorKey: 'mob-006',
    title: '北海道2日間の旅 #37',
    description: '北海道を2日で巡るルート。富良野と美瑛を中心に組み立てました。花畑が好きな方におすすめです。',
    date: '2025-07-05T08:00:00Z',
    createdAt: '2025-07-22T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-022'],
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details: 'ファーム富田のラベンダー畑。',
            imageKeys: ['img-node-s046-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-052',
            details: '青い池を見学。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 188,
  },

  // ---- gn-038 札幌・洞爺2日 / 無名 / 事前計画 ----
  {
    key: 'gn-038',
    authorKey: 'mob-006',
    title: '北海道2日間の旅 #38',
    description: '北海道を2日で巡るルート。札幌から洞爺湖を中心に組み立てました。地元民おすすめの動線です。',
    date: '2026-05-30T09:00:00Z',
    createdAt: '2026-04-25T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-008', 'tag-010'],
    budget: { amount: 24000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌大通公園を起点に。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 110, distance: 95.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details: '洞爺湖を眺める。',
            imageKeys: ['img-node-s054-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-055',
            details: '登別の地獄谷。',
            imageKeys: ['img-node-s055-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 17,
  },

  // ---- gn-039 利尻礼文3日 / 一般 ----
  {
    key: 'gn-039',
    authorKey: 'mob-006',
    title: '北海道3日間の旅 #39',
    description: '北海道の離島を3日で巡るルート。利尻島と礼文島を中心に組み立てました。秘境好きにおすすめです。',
    date: '2025-08-25T07:00:00Z',
    createdAt: '2025-09-15T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024'],
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-072',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-114',
            details: '利尻島オタトマリ沼。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 100, distance: 50.0, memo: 'フェリー', order: 1 },
            ],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-115',
            details: '礼文島桃岩展望台で花畑。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-114',
            details: '帰路に利尻富士を眺める。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 152,
  },

  // ---- gn-040 北海道周遊4日 / 無名 ----
  {
    key: 'gn-040',
    authorKey: 'mob-006',
    title: '北海道4日間の旅 #40',
    description: '北海道を4日で巡るルート。札幌・函館・富良野・知床を中心に組み立てました。広大な大地を満喫できます。',
    date: '2025-06-13T07:00:00Z',
    createdAt: '2025-07-01T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-010', 'tag-022'],
    budget: { amount: 92000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌で観光開始。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details: '富良野へ移動。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-052',
            details: '美瑛の青い池。',
            imageKeys: ['img-node-s052-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details: '函館で締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 28,
  },

  // ===========================================================================
  // §G. mob-007 mob_user_007（神社仏閣巡り）/ gn-041 〜 gn-046 / 6 本
  // 日数: 1×2 / 2×2 / 3×1 / 4×1   バンド: 無名 2 / 一般 4
  // ===========================================================================

  // ---- gn-041 京都1日 / 一般 ----
  {
    key: 'gn-041',
    authorKey: 'mob-007',
    title: '京都1日間の旅 #41',
    description: '京都を1日で巡るルート。伏見稲荷大社と清水寺を中心に組み立てました。寺社仏閣巡りが好きな方におすすめです。',
    date: '2024-11-15T07:00:00Z',
    createdAt: '2024-12-01T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-017', 'tag-011'],
    budget: { amount: 5800, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷の千本鳥居を朝早く。',
            imageKeys: ['img-node-s026-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 22, distance: 7.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details: '清水寺の舞台から京都の町並み。',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 158,
  },

  // ---- gn-042 奈良1日 / 一般 ----
  {
    key: 'gn-042',
    authorKey: 'mob-007',
    title: '奈良1日間の旅 #42',
    description: '奈良を1日で巡るルート。東大寺と春日大社を中心に組み立てました。歴史好きにおすすめです。',
    date: '2025-09-19T08:30:00Z',
    createdAt: '2025-10-04T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-001', 'tag-017'],
    budget: { amount: 6200, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-029',
            details: '東大寺の大仏を拝観。',
            imageKeys: ['img-node-s029-1', 'img-node-s029-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-038',
            details: '春日大社の朱の社殿。',
            imageKeys: ['img-node-s038-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 128,
  },

  // ---- gn-043 高野山2日 / 一般 ----
  {
    key: 'gn-043',
    authorKey: 'mob-007',
    title: '和歌山2日間の旅 #43',
    description: '和歌山を2日で巡るルート。高野山奥之院と熊野古道を中心に組み立てました。神聖な空気を感じたい方におすすめです。',
    date: '2025-10-25T08:00:00Z',
    createdAt: '2025-11-12T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-024', 'tag-011'],
    budget: { amount: 35000, currency: JPY },
    thumbnailKey: 'img-thumb-059',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-043',
            details: '高野山奥之院を参拝。',
            imageKeys: ['img-node-s043-1', 'img-node-s043-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-041',
            details: '熊野古道大門坂を歩く。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 40, distance: 1.6, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-042',
            details: '那智の滝を眺める。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 172,
  },

  // ---- gn-044 出雲・島根2日 / 無名 ----
  {
    key: 'gn-044',
    authorKey: 'mob-007',
    title: '島根2日間の旅 #44',
    description: '島根を2日で巡るルート。出雲大社を中心に組み立てました。縁結びを願う方におすすめです。',
    date: '2024-06-08T09:00:00Z',
    createdAt: '2024-06-22T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-001', 'tag-011'],
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details: '出雲大社で縁結び祈願。',
            imageKeys: ['img-node-s077-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-072',
            details: '永平寺の修行体験。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 22,
  },

  // ---- gn-045 京都奈良3日 / 一般 ----
  {
    key: 'gn-045',
    authorKey: 'mob-007',
    title: '京都・奈良3日間の旅 #45',
    description: '京都と奈良を3日で巡るルート。金閣寺や東大寺、伏見稲荷を中心に組み立てました。寺社巡りに最適です。',
    date: '2025-04-03T08:00:00Z',
    createdAt: '2025-04-22T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-018', 'tag-001'],
    budget: { amount: 48000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-033',
            details: '金閣寺を参拝。',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷の千本鳥居。',
            imageKeys: ['img-node-s026-1', 'img-node-s026-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-029',
            details: '東大寺で大仏拝観。',
            imageKeys: ['img-node-s029-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 115,
  },

  // ---- gn-046 西国巡礼4日 / 一般 / 予算 null ----
  {
    key: 'gn-046',
    authorKey: 'mob-007',
    title: '関西4日間の旅 #46',
    description: '関西を4日で巡るルート。京都と奈良、和歌山の有名な寺社を中心に組み立てました。じっくり巡りたい方におすすめです。',
    date: '2024-10-19T07:00:00Z',
    createdAt: '2024-11-08T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-017', 'tag-001'],
    budget: null,
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details: '清水寺を参拝。',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-038',
            details: '春日大社へ。',
            imageKeys: ['img-node-s038-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-043',
            details: '高野山奥之院。',
            imageKeys: ['img-node-s043-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-042',
            details: '那智の滝で締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 95,
  },

  // ===========================================================================
  // §H. mob-008 mob_user_008（夫婦で月一旅行）/ gn-047 〜 gn-052 / 6 本
  // 日数: 1×1 / 2×3 / 3×1 / 4×1   バンド: 無名 2 / 一般 4
  // ===========================================================================

  // ---- gn-047 城崎温泉1日 / 一般 / 事前計画 ----
  {
    key: 'gn-047',
    authorKey: 'mob-008',
    title: '兵庫1日間の旅 #47',
    description: '兵庫を1日で巡るルート。姫路城と城崎温泉を中心に組み立てました。歴史と温泉が一度に楽しめます。',
    date: '2026-06-13T09:30:00Z',
    createdAt: '2026-05-15T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-008', 'tag-012'],
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-068',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-039',
            details: '姫路城を見学。',
            imageKeys: ['img-node-s039-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 90, distance: 65.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-040',
            details: '城崎温泉で外湯巡り。',
            imageKeys: ['img-node-s040-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 112,
  },

  // ---- gn-048 京都嵐山2日 / 一般 ----
  {
    key: 'gn-048',
    authorKey: 'mob-008',
    title: '京都2日間の旅 #48',
    description: '京都を2日で巡るルート。嵐山と祇園を中心に組み立てました。夫婦の月一旅行におすすめです。',
    date: '2025-04-19T08:30:00Z',
    createdAt: '2025-05-04T19:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-018', 'tag-002', 'tag-012'],
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details: '嵐山渡月橋を散策。',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-035',
            details: '祇園花見小路。',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details: '錦市場で食べ歩き。',
            imageKeys: ['img-node-s125-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 195,
  },

  // ---- gn-049 神戸2日 / 無名 ----
  {
    key: 'gn-049',
    authorKey: 'mob-008',
    title: '兵庫2日間の旅 #49',
    description: '兵庫を2日で巡るルート。神戸メリケンパークと南京町を中心に組み立めました。港町デートにおすすめです。',
    date: '2024-11-30T11:00:00Z',
    createdAt: '2024-12-15T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-003', 'tag-012'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-079',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-032',
            details: 'メリケンパークで夜景。',
            imageKeys: ['img-node-s032-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-126',
            details: '南京町で食べ歩き。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 19,
  },

  // ---- gn-050 軽井沢2日 / 一般 ----
  {
    key: 'gn-050',
    authorKey: 'mob-008',
    title: '長野2日間の旅 #50',
    description: '長野を2日で巡るルート。軽井沢を中心に組み立てました。夫婦の避暑地旅におすすめです。',
    date: '2025-08-16T09:00:00Z',
    createdAt: '2025-08-29T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-012'],
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-070',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details: '旧軽井沢銀座でお買い物。',
            imageKeys: ['img-node-s008-1', 'img-node-s008-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-024',
            details: '清里高原で自然散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 138,
  },

  // ---- gn-051 別府由布院3日 / 一般 ----
  {
    key: 'gn-051',
    authorKey: 'mob-008',
    title: '大分3日間の旅 #51',
    description: '大分を3日で巡るルート。別府と由布院、黒川温泉を中心に組み立てました。温泉夫婦旅におすすめです。',
    date: '2025-12-13T09:00:00Z',
    createdAt: '2026-01-04T19:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-017', 'tag-012'],
    budget: { amount: 68000, currency: JPY },
    thumbnailKey: 'img-thumb-066',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-092',
            details: '別府海地獄。',
            imageKeys: ['img-node-s092-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-093',
            details: '由布院金鱗湖。',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-107',
            details: '黒川温泉。',
            imageKeys: ['img-node-s107-1', 'img-node-s107-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 178,
  },

  // ---- gn-052 関東甲信越4日 / 無名 ----
  {
    key: 'gn-052',
    authorKey: 'mob-008',
    title: '関東4日間の旅 #52',
    description: '関東甲信越を4日で巡るルート。日光・那須・草津・伊香保の温泉地を中心に組み立てました。',
    date: '2024-05-25T08:00:00Z',
    createdAt: '2024-06-12T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-002', 'tag-012'],
    budget: { amount: 72000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-009',
            details: '日光東照宮。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-011',
            details: '那須高原。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-012',
            details: '草津湯畑。',
            imageKeys: ['img-node-s012-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-013',
            details: '伊香保石段街。',
            imageKeys: ['img-node-s013-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 26,
  },

  // ===========================================================================
  // §I. mob-009 mob_user_009（日帰り登山）/ gn-053 〜 gn-058 / 6 本
  // 日数: 1×2 / 2×2 / 3×2   バンド: 無名 2 / 一般 4
  // ===========================================================================

  // ---- gn-053 高尾山1日 / 一般 ----
  {
    key: 'gn-053',
    authorKey: 'mob-009',
    title: '東京1日間の旅 #53',
    description: '東京を1日で巡るルート。高尾山を中心に組み立てました。日帰り登山におすすめです。',
    date: '2025-05-04T07:00:00Z',
    createdAt: '2025-05-12T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-020', 'tag-002', 'tag-011'],
    budget: { amount: 3200, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-022',
            details: '高尾山6号路で沢沿い登山。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 92,
  },

  // ---- gn-054 蔵王1日 / 一般 ----
  {
    key: 'gn-054',
    authorKey: 'mob-009',
    title: '山形1日間の旅 #54',
    description: '山形を1日で巡るルート。蔵王御釜を中心に組み立てました。絶景登山におすすめです。',
    date: '2024-09-08T06:30:00Z',
    createdAt: '2024-09-22T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-010', 'tag-020', 'tag-011'],
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-059',
            details: '蔵王御釜のエメラルドグリーン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 7, distance: 1.2, memo: 'リフト', order: 1 },
            ],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 132,
  },

  // ---- gn-055 上高地2日 / 一般 ----
  {
    key: 'gn-055',
    authorKey: 'mob-009',
    title: '長野2日間の旅 #55',
    description: '長野を2日で巡るルート。上高地河童橋を中心に組み立てました。山岳景観が好きな方におすすめです。',
    date: '2025-08-02T07:00:00Z',
    createdAt: '2025-08-22T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-020', 'tag-002'],
    budget: { amount: 25000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details: '上高地河童橋から穂高連峰。',
            imageKeys: ['img-node-s061-1', 'img-node-s061-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details: '立山室堂平を散策。',
            imageKeys: ['img-node-s070-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 168,
  },

  // ---- gn-056 知床2日 / 無名 ----
  {
    key: 'gn-056',
    authorKey: 'mob-009',
    title: '北海道2日間の旅 #56',
    description: '北海道を2日で巡るルート。知床五湖を中心に組み立てました。原生林ハイキングが好きな方におすすめです。',
    date: '2024-07-20T07:00:00Z',
    createdAt: '2024-08-08T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-020', 'tag-024'],
    budget: { amount: 30000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details: '知床五湖一周コース。',
            imageKeys: ['img-node-s048-1', 'img-node-s048-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-054',
            details: '洞爺湖を眺める。',
            imageKeys: ['img-node-s054-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 23,
  },

  // ---- gn-057 屋久島3日 / 一般 ----
  {
    key: 'gn-057',
    authorKey: 'mob-009',
    title: '鹿児島3日間の旅 #57',
    description: '鹿児島を3日で巡るルート。屋久島縄文杉トレッキングを中心に組み立てました。本格登山好きにおすすめです。',
    date: '2025-04-26T05:00:00Z',
    createdAt: '2025-05-15T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-020', 'tag-024', 'tag-002'],
    budget: { amount: 78000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-096',
            details: '屋久島縄文杉トレッキング。',
            imageKeys: ['img-node-s096-1', 'img-node-s096-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-096',
            details: '屋久島の森を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-095',
            details: '桜島湯之平展望所。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 152,
  },

  // ---- gn-058 中部山岳3日 / 無名 / 予算 null ----
  {
    key: 'gn-058',
    authorKey: 'mob-009',
    title: '長野・岐阜3日間の旅 #58',
    description: '長野と岐阜を3日で巡るルート。上高地と高山を中心に組み立てました。山と街並みを両方楽しめます。',
    date: '2024-10-05T07:00:00Z',
    createdAt: '2024-10-25T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-020', 'tag-017', 'tag-001'],
    budget: null,
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details: '上高地で朝霧。',
            imageKeys: ['img-node-s061-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-063',
            details: '飛騨高山の古い町並み。',
            imageKeys: ['img-node-s063-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-062',
            details: '白川郷で合掌造り。',
            imageKeys: ['img-node-s062-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 14,
  },

  // ===========================================================================
  // §J. mob-010 mob_user_010（撮り鉄として鉄道旅）/ gn-059 〜 gn-064 / 6 本
  // 日数: 1×2 / 2×2 / 3×1 / 5×1   バンド: 無名 2 / 一般 4
  // ===========================================================================

  // ---- gn-059 東京駅1日 / 一般 ----
  {
    key: 'gn-059',
    authorKey: 'mob-010',
    title: '東京1日間の旅 #59',
    description: '東京を1日で巡るルート。東京駅丸の内駅舎を中心に組み立てました。鉄道好きにおすすめです。',
    date: '2024-12-08T09:00:00Z',
    createdAt: '2024-12-22T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-009', 'tag-011'],
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-020',
            details: '東京駅丸の内駅舎の夜景。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 105,
  },

  // ---- gn-060 富山黒部1日 / 一般 ----
  {
    key: 'gn-060',
    authorKey: 'mob-010',
    title: '富山1日間の旅 #60',
    description: '富山を1日で巡るルート。黒部峡谷トロッコ電車を中心に組み立めました。鉄道ファンにおすすめです。',
    date: '2025-10-11T08:00:00Z',
    createdAt: '2025-10-28T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-002', 'tag-011'],
    budget: { amount: 9200, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-071',
            details: '黒部峡谷トロッコ電車に乗る。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 80, distance: 20.0, memo: 'トロッコ電車', order: 1 },
            ],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 148,
  },

  // ---- gn-061 18きっぷ2日 / 一般 / 事前計画 ----
  {
    key: 'gn-061',
    authorKey: 'mob-010',
    title: '東海道2日間の旅 #61',
    description: '青春18きっぷで東海道を2日で巡るルート。名古屋・京都を中心に組み立めました。鉄道旅好きにおすすめです。',
    date: '2026-03-22T06:00:00Z',
    createdAt: '2026-02-25T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-011'],
    budget: { amount: 12000, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details: '名古屋城を見学。',
            imageKeys: ['img-node-s066-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 90, distance: 130.0, memo: '在来線', order: 1 },
            ],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-035',
            details: '京都祇園散策。',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 124,
  },

  // ---- gn-062 北海道鉄道2日 / 無名 ----
  {
    key: 'gn-062',
    authorKey: 'mob-010',
    title: '北海道2日間の旅 #62',
    description: '北海道を2日で巡るルート。札幌から函館まで鉄道で移動するルート。鉄道好きにおすすめです。',
    date: '2025-01-12T08:00:00Z',
    createdAt: '2025-01-26T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-001', 'tag-011'],
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details: '札幌大通公園。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 220, distance: 290.0, memo: '北海道新幹線・特急乗継', order: 1 },
            ],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details: '函館山展望台。',
            imageKeys: ['img-node-s047-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 21,
  },

  // ---- gn-063 九州鉄道3日 / 無名 ----
  {
    key: 'gn-063',
    authorKey: 'mob-010',
    title: '九州3日間の旅 #63',
    description: '九州を3日で巡るルート。門司港レトロ・博多・長崎を中心に組み立てました。鉄道旅好きにおすすめです。',
    date: '2024-04-20T07:00:00Z',
    createdAt: '2024-05-08T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-009', 'tag-011'],
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-078',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-103',
            details: '門司港レトロ。',
            imageKeys: ['img-node-s103-1', 'img-node-s103-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-091',
            details: '博多中洲屋台。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-109',
            details: 'ハウステンボスでイルミ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 28,
  },

  // ---- gn-064 山陽山陰5日 / 一般 ----
  {
    key: 'gn-064',
    authorKey: 'mob-010',
    title: '中国地方5日間の旅 #64',
    description: '中国地方を5日で巡るルート。鳥取・出雲・広島・尾道を中心に組み立てました。鉄道で巡る西日本の旅です。',
    date: '2025-09-23T07:00:00Z',
    createdAt: '2025-10-15T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-010', 'tag-011'],
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-076',
            details: '鳥取砂丘。',
            imageKeys: ['img-node-s076-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details: '出雲大社。',
            imageKeys: ['img-node-s077-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-074',
            details: '厳島神社。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 12, distance: 1.8, memo: 'フェリー', order: 1 },
            ],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-083',
            details: '尾道千光寺。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 5,
        nodes: [
          {
            order: 1,
            spotKey: 's-084',
            details: '萩城下町を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ===========================================================================
  // §K. u-001 たびまる（インフルエンサー）/ gn-065 〜 gn-069 / 5 本
  // 日数: 1×2 / 2×1 / 3×1 / 5×1   バンド: 一般 5
  // 口調: 結論先行・「保存版」「黄金ルート」、🚄✈️📌（短文）
  // ===========================================================================

  // ---- gn-065 関東日帰り1日 / 一般 ----
  {
    key: 'gn-065',
    authorKey: 'u-001',
    title: '東京1日間の旅 #65',
    description: '結論、東京の定番を1日で回るならこの動線が最短です。浅草寺と上野公園を中心に組み立てました📌',
    date: '2025-11-08T08:30:00Z',
    createdAt: '2025-11-20T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-017'],
    budget: { amount: 5500, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-001',
            details: '浅草寺は雷門前で必ず1枚。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-019',
            details: '上野公園で紅葉狩り。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 192,
  },

  // ---- gn-066 関西日帰り1日 / 一般 / 予算 null ----
  {
    key: 'gn-066',
    authorKey: 'u-001',
    title: '京都1日間の旅 #66',
    description: '結論、京都を1日で押さえるなら清水寺・伏見稲荷の2軒で十分です。朝イチで動くのが鉄則🚄',
    date: '2025-04-13T06:00:00Z',
    createdAt: '2025-04-25T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-018', 'tag-025'],
    budget: null,
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷は朝6時着で千本鳥居を独占📌',
            imageKeys: ['img-node-s026-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 20, distance: 7.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details: '清水寺の舞台で締め。',
            imageKeys: ['img-node-s025-1', 'img-node-s025-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 10,
    targetViews: 200,
  },

  // ---- gn-067 道頓堀2日 / 一般 ----
  {
    key: 'gn-067',
    authorKey: 'u-001',
    title: '大阪2日間の旅 #67',
    description: '結論、大阪定番を2日で回るならミナミ起点が正解。道頓堀と通天閣を中心に組み立めました🚄',
    date: '2025-08-23T10:00:00Z',
    createdAt: '2025-09-04T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-009'],
    budget: { amount: 35000, currency: JPY },
    thumbnailKey: 'img-thumb-079',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-030',
            details: '道頓堀でグリコポーズ📌',
            imageKeys: ['img-node-s030-1', 'img-node-s030-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-037',
            details: '通天閣で串カツ。',
            imageKeys: ['img-node-s037-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-036',
            details: '大阪城を見学。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 176,
  },

  // ---- gn-068 北陸3日 / 一般 ----
  {
    key: 'gn-068',
    authorKey: 'u-001',
    title: '石川・富山3日間の旅 #68',
    description: '結論、北陸新幹線で3日あれば金沢と立山を一度に楽しめます。兼六園と立山を中心に組み立めました🚄',
    date: '2024-10-26T07:30:00Z',
    createdAt: '2024-11-15T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-001', 'tag-002'],
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-064',
            details: '兼六園を散策。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details: '立山室堂平。',
            imageKeys: ['img-node-s070-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-129',
            details: '近江町市場で締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 192,
  },

  // ---- gn-069 47都道府県5日(沖縄) / 一般 ----
  {
    key: 'gn-069',
    authorKey: 'u-001',
    title: '沖縄5日間の旅 #69',
    description: '結論、沖縄5日あれば本島・宮古・石垣を全部回れます。離島はフライト併用が黄金ルートです✈️📌',
    date: '2025-08-08T09:00:00Z',
    createdAt: '2025-08-30T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-010'],
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-071',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-097',
            details: '美ら海水族館。',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-099',
            details: '古宇利大橋を渡る。',
            imageKeys: ['img-node-s099-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-101',
            details: '宮古島与那覇前浜ビーチ📌',
            imageKeys: ['img-node-s101-1', 'img-node-s101-2'],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 50, distance: 290.0, memo: '那覇空港から', order: 1 },
            ],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-100',
            details: '石垣島川平湾。',
            imageKeys: ['img-node-s100-1'],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 30, distance: 130.0, memo: '宮古→石垣', order: 1 },
            ],
          },
        ],
      },
      {
        day: 5,
        nodes: [
          {
            order: 1,
            spotKey: 's-111',
            details: '国際通りで締めの土産購入🚄',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 10,
    targetViews: 200,
  },

  // ===========================================================================
  // §L. u-002 sakura_trip（関西中心）/ gn-070 〜 gn-074 / 5 本
  // 日数: 1×1 / 2×2 / 3×1 / 4×1   バンド: 一般 5
  // 口調: 柔らかく丁寧・「ふらっと」「のんびり」☕🌸✨（短文）
  // ===========================================================================

  // ---- gn-070 京都カフェ1日 / 一般 ----
  {
    key: 'gn-070',
    authorKey: 'u-002',
    title: '京都1日間の旅 #70',
    description: '京都をふらっと1日で巡るルート。錦市場と祇園のんびりお散歩がおすすめです☕✨',
    date: '2025-03-29T10:00:00Z',
    createdAt: '2025-04-12T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-018', 'tag-004', 'tag-007'],
    budget: { amount: 6800, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-125',
            details: '錦市場でほっこりお買い物☕',
            imageKeys: ['img-node-s125-1', 'img-node-s125-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details: '祇園花見小路をのんびり🌸',
            imageKeys: ['img-node-s035-1', 'img-node-s035-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ---- gn-071 嵐山金閣寺2日 / 一般 ----
  {
    key: 'gn-071',
    authorKey: 'u-002',
    title: '京都2日間の旅 #71',
    description: '京都を2日でふらっと巡るルート。嵐山と金閣寺をのんびり回るのがおすすめです🌸',
    date: '2024-11-23T08:00:00Z',
    createdAt: '2024-12-08T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-005', 'tag-015'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details: '嵐山渡月橋でのんびり。',
            imageKeys: ['img-node-s027-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-033',
            details: '金閣寺の輝き✨',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 25, distance: 6.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-034',
            details: '銀閣寺で締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 156,
  },

  // ---- gn-072 兵庫滋賀2日 / 一般 ----
  {
    key: 'gn-072',
    authorKey: 'u-002',
    title: '兵庫・滋賀2日間の旅 #72',
    description: '関西の隣県を2日でふらっと巡るルート。姫路城と白鬚神社の鳥居がおすすめです🌸',
    date: '2025-05-30T09:00:00Z',
    createdAt: '2025-06-15T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-022'],
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-039',
            details: '姫路城を見学。',
            imageKeys: ['img-node-s039-1', 'img-node-s039-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-044',
            details: '琵琶湖白鬚神社の鳥居✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 132,
  },

  // ---- gn-073 関西寺社3日 / 一般 / 事前計画 ----
  {
    key: 'gn-073',
    authorKey: 'u-002',
    title: '関西3日間の旅 #73',
    description: '関西の寺社を3日でふらっと巡るルート。清水寺・伏見稲荷・東大寺を中心に組み立めました🌸',
    date: '2026-04-10T08:00:00Z',
    createdAt: '2026-03-15T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-018', 'tag-015'],
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details: '清水寺をのんびり参拝☕',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷の千本鳥居。',
            imageKeys: ['img-node-s026-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-029',
            details: '奈良東大寺で大仏拝観。',
            imageKeys: ['img-node-s029-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 118,
  },

  // ---- gn-074 関西海エリア4日 / 一般 ----
  {
    key: 'gn-074',
    authorKey: 'u-002',
    title: '関西4日間の旅 #74',
    description: '関西の海エリアを4日でふらっと巡るルート。神戸と城崎温泉、和歌山を中心に組み立めました✨',
    date: '2025-07-12T08:00:00Z',
    createdAt: '2025-08-02T19:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-015'],
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-032',
            details: '神戸メリケンパーク。',
            imageKeys: ['img-node-s032-1', 'img-node-s032-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-040',
            details: '城崎温泉で湯巡り☕',
            imageKeys: ['img-node-s040-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-041',
            details: '熊野古道大門坂。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-043',
            details: '高野山奥之院。',
            imageKeys: ['img-node-s043-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 152,
  },

  // ===========================================================================
  // §M. u-003 kenji_outdoor（家族4人キャンピングカー）/ gn-075 〜 gn-079 / 5 本
  // 日数: 1×1 / 2×1 / 3×1 / 4×1 / 5×1   バンド: 一般 5
  // 口調: ファミリー実用・駐車場/トイレ等の現地メモ🏕️🚐（短文）
  // ===========================================================================

  // ---- gn-075 那須1日 / 一般 ----
  {
    key: 'gn-075',
    authorKey: 'u-003',
    title: '栃木1日間の旅 #75',
    description: '家族4人で栃木を1日で巡るルート。那須高原を中心に組み立めました。駐車場広めでファミリー向き🚐',
    date: '2025-08-12T08:00:00Z',
    createdAt: '2025-08-25T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002'],
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-011',
            details: '那須高原で家族でハイキング。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-010',
            details: '鬼怒川温泉で1風呂🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 138,
  },

  // ---- gn-076 軽井沢2日 / 一般 ----
  {
    key: 'gn-076',
    authorKey: 'u-003',
    title: '長野2日間の旅 #76',
    description: '家族4人で長野を2日で巡るルート。軽井沢と諏訪湖を中心に組み立めました。子連れOKです🚐',
    date: '2024-08-09T08:00:00Z',
    createdAt: '2024-08-25T19:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002'],
    budget: { amount: 35000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details: '旧軽井沢銀座でお散歩。',
            imageKeys: ['img-node-s008-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-023',
            details: '諏訪湖でファミリーボート🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 158,
  },

  // ---- gn-077 阿蘇黒川3日 / 一般 ----
  {
    key: 'gn-077',
    authorKey: 'u-003',
    title: '熊本3日間の旅 #77',
    description: '家族4人で熊本を3日で巡るルート。阿蘇草千里と黒川温泉を中心に組み立めました。駐車場広め🚐',
    date: '2024-08-10T07:30:00Z',
    createdAt: '2024-09-08T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-008'],
    budget: { amount: 56000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details: '阿蘇草千里で乗馬体験。',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-107',
            details: '黒川温泉で家族湯🏕️',
            imageKeys: ['img-node-s107-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details: '高千穂峡を見学。',
            imageKeys: ['img-node-s105-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ---- gn-078 北海道4日 / 一般 ----
  {
    key: 'gn-078',
    authorKey: 'u-003',
    title: '北海道4日間の旅 #78',
    description: '家族4人で北海道を4日で巡るルート。富良野・美瑛・知床を中心に組み立めました。キャンピングカーで快適🚐',
    date: '2025-08-04T07:00:00Z',
    createdAt: '2025-08-28T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002'],
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details: 'ファーム富田。',
            imageKeys: ['img-node-s046-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-052',
            details: '美瑛青い池。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-053',
            details: '旭山動物園🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details: '知床五湖で家族ハイキング。',
            imageKeys: ['img-node-s048-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 195,
  },

  // ---- gn-079 中部縦断5日 / 一般 ----
  {
    key: 'gn-079',
    authorKey: 'u-003',
    title: '中部5日間の旅 #79',
    description: '家族4人で中部を5日で巡るルート。立山・上高地・白川郷・高山・名古屋を中心に組み立めました🚐',
    date: '2024-08-22T07:00:00Z',
    createdAt: '2024-09-25T19:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002'],
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details: '立山室堂平。',
            imageKeys: ['img-node-s070-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details: '上高地河童橋。',
            imageKeys: ['img-node-s061-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-062',
            details: '白川郷合掌造り🏕️',
            imageKeys: ['img-node-s062-1', 'img-node-s062-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-063',
            details: '飛騨高山の古い町並み。',
            imageKeys: ['img-node-s063-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 5,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details: '名古屋城で締め。',
            imageKeys: ['img-node-s066-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 168,
  },

  // ===========================================================================
  // §N. u-004 mio_couple（カップル系）/ gn-080 〜 gn-082 / 3 本
  // 日数: 1×1 / 2×1 / 3×1   バンド: 一般 3
  // 口調: 彼との二人旅・記念日・ご褒美ステイ💕🥂📷（短文）
  // ===========================================================================

  // ---- gn-080 横浜1日 / 一般 / 予算 null ----
  {
    key: 'gn-080',
    authorKey: 'u-004',
    title: '神奈川1日間の旅 #80',
    description: '彼と1日で巡るルート。横浜みなとみらいの夜景デート💕とっておきの記念日に。',
    date: '2025-12-25T13:00:00Z',
    createdAt: '2026-01-08T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-012', 'tag-022'],
    budget: null,
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-015',
            details: 'みなとみらいでクリスマスデート🥂',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 0.9, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-128',
            details: '中華街で食べ歩き📷',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 186,
  },

  // ---- gn-081 城崎温泉2日 / 一般 ----
  {
    key: 'gn-081',
    authorKey: 'u-004',
    title: '兵庫2日間の旅 #81',
    description: '彼と2日で巡るルート。城崎温泉で浴衣デート💕ご褒美ステイにおすすめです🥂',
    date: '2025-11-22T11:00:00Z',
    createdAt: '2025-12-08T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-012', 'tag-017'],
    budget: { amount: 85000, currency: JPY },
    thumbnailKey: 'img-thumb-068',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-040',
            details: '城崎温泉で外湯巡り💕',
            imageKeys: ['img-node-s040-1', 'img-node-s040-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-039',
            details: '姫路城で記念写真📷',
            imageKeys: ['img-node-s039-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ---- gn-082 沖縄3日 / 一般 / 事前計画 ----
  {
    key: 'gn-082',
    authorKey: 'u-004',
    title: '沖縄3日間の旅 #82',
    description: '彼と3日で巡るルート。古宇利大橋と美ら海水族館を中心に組み立めました💕記念日旅行に。',
    date: '2026-06-20T09:00:00Z',
    createdAt: '2026-05-22T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-012', 'tag-010'],
    budget: { amount: 125000, currency: JPY },
    thumbnailKey: 'img-thumb-071',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-097',
            details: '美ら海水族館でデート📷',
            imageKeys: ['img-node-s097-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-099',
            details: '古宇利大橋で絶景ドライブ💕',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-110',
            details: '残波岬で海風を感じる🥂',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 10,
    targetViews: 200,
  },

  // ===========================================================================
  // §O. u-005 hayato_solo（学生節約・青春18きっぷ）/ gn-083 〜 gn-086 / 4 本
  // 日数: 1×3 / 2×1   バンド: 一般 4
  // 口調: 学生節約・「○○円縛り」・青春18きっぷ💪🎒（短文）
  // ===========================================================================

  // ---- gn-083 18きっぷ東京1日 / 一般 ----
  {
    key: 'gn-083',
    authorKey: 'u-005',
    title: '東京1日間の旅 #83',
    description: '青春18きっぷで東京を1日で巡るルート。浅草と築地を中心に組み立めました。1500円縛りで遊べます💪',
    date: '2025-03-29T06:00:00Z',
    createdAt: '2025-04-08T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-003', 'tag-011'],
    budget: { amount: 1500, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-001',
            details: '浅草寺は無料🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-119',
            details: '築地場外市場で安飯。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 132,
  },

  // ---- gn-084 京都安宿1日 / 一般 ----
  {
    key: 'gn-084',
    authorKey: 'u-005',
    title: '京都1日間の旅 #84',
    description: '京都を1日で巡るルート。清水寺と伏見稲荷で2000円縛り💪学生に最適です🎒',
    date: '2024-09-14T06:00:00Z',
    createdAt: '2024-09-25T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-011', 'tag-016'],
    budget: { amount: 2000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details: '伏見稲荷は無料で参拝可。',
            imageKeys: ['img-node-s026-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 35, distance: 2.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details: '清水寺は400円。',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 148,
  },

  // ---- gn-085 ★無料縛り1日 / 一般 / 予算 0 ----
  {
    key: 'gn-085',
    authorKey: 'u-005',
    title: '東京1日間の旅 #85',
    description: '東京を1日で巡る無料縛りルート。明治神宮と上野公園で0円旅💪学生におすすめです🎒',
    date: '2024-11-02T08:00:00Z',
    createdAt: '2024-11-15T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-011', 'tag-017'],
    budget: { amount: 0, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-018',
            details: '明治神宮は参拝無料🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.8, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-019',
            details: '上野公園も無料で紅葉。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 168,
  },

  // ---- gn-086 18きっぷ大阪2日 / 一般 ----
  {
    key: 'gn-086',
    authorKey: 'u-005',
    title: '大阪2日間の旅 #86',
    description: '青春18きっぷで大阪を2日で巡るルート。道頓堀と通天閣で5000円縛り💪',
    date: '2025-08-11T06:00:00Z',
    createdAt: '2025-08-25T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-011'],
    budget: { amount: 5000, currency: JPY },
    thumbnailKey: 'img-thumb-079',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-030',
            details: '道頓堀でたこ焼き🎒',
            imageKeys: ['img-node-s030-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-037',
            details: '通天閣周辺の串カツ。',
            imageKeys: ['img-node-s037-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 115,
  },

  // ===========================================================================
  // §P. u-006 gourmet_aki（食べ歩き）/ gn-087 〜 gn-090 / 4 本
  // 日数: 1×2 / 2×2   バンド: 一般 4
  // 口調: 食べ歩き・「○食目」「ハシゴ」🍜🍣🍢（短文）
  // ===========================================================================

  // ---- gn-087 横浜中華街1日 / 一般 ----
  {
    key: 'gn-087',
    authorKey: 'u-006',
    title: '神奈川1日間の旅 #87',
    description: '横浜を1日で巡るグルメルート。中華街で1日5食ハシゴ🍜小籠包から焼き小籠包まで。',
    date: '2025-10-25T11:00:00Z',
    createdAt: '2025-11-08T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-007', 'tag-015'],
    budget: { amount: 7800, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-128',
            details: '中華街で1食目🍜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 168,
  },

  // ---- gn-088 大阪粉もん1日 / 一般 / 事前計画 ----
  {
    key: 'gn-088',
    authorKey: 'u-006',
    title: '大阪1日間の旅 #88',
    description: '大阪で1日5食ハシゴ。道頓堀でたこ焼き・お好み焼き・串カツ🍢黒門市場で締めの海鮮。',
    date: '2026-05-23T11:00:00Z',
    createdAt: '2026-05-08T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-009', 'tag-007'],
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-064',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-030',
            details: '道頓堀で粉もんハシゴ🍢',
            imageKeys: ['img-node-s030-1', 'img-node-s030-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: null, order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-120',
            details: '黒門市場で海鮮締め🍣',
            imageKeys: ['img-node-s120-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 188,
  },

  // ---- gn-089 仙台牛タン2日 / 一般 ----
  {
    key: 'gn-089',
    authorKey: 'u-006',
    title: '宮城2日間の旅 #89',
    description: '仙台で2日5食ハシゴ。牛タン通りで定番店3軒を制覇🍢松島で海鮮締め🍣',
    date: '2025-06-22T10:00:00Z',
    createdAt: '2025-07-12T19:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-007', 'tag-015'],
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-123',
            details: '仙台牛タン通りで3軒ハシゴ🍢',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-058',
            details: '松島で焼き牡蠣🍣',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 152,
  },

  // ---- gn-090 福岡もつ鍋ラーメン2日 / 一般 ----
  {
    key: 'gn-090',
    authorKey: 'u-006',
    title: '福岡2日間の旅 #90',
    description: '福岡で2日5食ハシゴ。中洲屋台のラーメンともつ鍋通り🍜博多駅前で締めのスイーツも。',
    date: '2025-08-08T10:00:00Z',
    createdAt: '2025-09-04T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-015'],
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-062',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-091',
            details: '中洲屋台でラーメン🍜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-127',
            details: '博多もつ鍋通りで〆🍢',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ===========================================================================
  // §Q. u-007 island_hopper（離島専門）/ gn-091 〜 gn-092 / 2 本
  // 日数: 3×1 / 7×1   バンド: 一般 2
  // 口調: 島時間・秘境・フェリー🏝️⛴️（短文）
  // ===========================================================================

  // ---- gn-091 隠岐3日 / 一般 ----
  {
    key: 'gn-091',
    authorKey: 'u-007',
    title: '島根3日間の旅 #91',
    description: '隠岐諸島を3日で巡る島時間ルート。摩天崖と西郷港を中心に組み立めました⛴️秘境好きに。',
    date: '2025-07-15T07:00:00Z',
    createdAt: '2025-08-12T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-011'],
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-073',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-113',
            details: '隠岐摩天崖で絶景🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 180, distance: 80.0, memo: 'フェリー', order: 1 },
            ],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-113',
            details: '隠岐の島の集落を散策。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details: '出雲大社で締め。',
            imageKeys: ['img-node-s077-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 152,
  },

  // ---- gn-092 ★南西諸島7日 / 一般 ----
  {
    key: 'gn-092',
    authorKey: 'u-007',
    title: '沖縄・鹿児島7日間の旅 #92',
    description: '南西諸島を7日で巡る島時間ルート。波照間・石垣・宮古・徳之島を中心に組み立めました⛴️離島好きに🏝️',
    date: '2025-07-22T07:00:00Z',
    createdAt: '2025-08-20T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024'],
    budget: { amount: 195000, currency: JPY },
    thumbnailKey: 'img-thumb-074',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details: '首里城で出発⛴️',
            imageKeys: ['img-node-s098-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-101',
            details: '宮古島与那覇前浜🏝️',
            imageKeys: ['img-node-s101-1'],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 50, distance: 290.0, memo: '那覇→宮古', order: 1 },
            ],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-100',
            details: '石垣島川平湾。',
            imageKeys: ['img-node-s100-1', 'img-node-s100-2'],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 30, distance: 130.0, memo: '宮古→石垣', order: 1 },
            ],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-102',
            details: '波照間島ニシ浜で日本最南端🏝️',
            imageKeys: ['img-node-s102-1'],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 80, distance: 30.0, memo: 'フェリー', order: 1 },
            ],
          },
        ],
      },
      {
        day: 5,
        nodes: [
          {
            order: 1,
            spotKey: 's-112',
            details: '慶良間阿嘉島で離島の海。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 6,
        nodes: [
          {
            order: 1,
            spotKey: 's-117',
            details: '徳之島犬田布岬。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 70, distance: 380.0, memo: '徳之島へ', order: 1 },
            ],
          },
        ],
      },
      {
        day: 7,
        nodes: [
          {
            order: 1,
            spotKey: 's-111',
            details: '国際通りで締めの土産⛴️',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 10,
    targetViews: 200,
  },

  // ===========================================================================
  // §R. u-008 natsu_family（小学生2人と夫婦）/ gn-093 〜 gn-096 / 4 本
  // 日数: 1×1 / 2×1 / 3×1 / 4×1   バンド: 一般 4
  // 口調: 子連れ・自由研究・夏休み👨‍👩‍👧‍👦🐠（短文）
  // ===========================================================================

  // ---- gn-093 USJ1日 / 一般 ----
  {
    key: 'gn-093',
    authorKey: 'u-008',
    title: '大阪1日間の旅 #93',
    description: '大阪を子連れで1日で巡るルート。USJで子どもたちが大喜び👨‍👩‍👧‍👦夏休み定番です。',
    date: '2025-08-13T08:00:00Z',
    createdAt: '2025-08-28T19:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-014', 'tag-013'],
    budget: { amount: 8200, currency: JPY },
    thumbnailKey: 'img-thumb-079',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-031',
            details: 'USJで1日中遊ぶ🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 175,
  },

  // ---- gn-094 鳥羽水族館2日 / 一般 / 事前計画 ----
  {
    key: 'gn-094',
    authorKey: 'u-008',
    title: '三重2日間の旅 #94',
    description: '三重を子連れで2日で巡るルート。鳥羽水族館と伊勢神宮を中心に組み立めました🐠自由研究にも最適です。',
    date: '2026-08-09T08:30:00Z',
    createdAt: '2026-07-12T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-014', 'tag-005'],
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-069',
            details: '鳥羽水族館でジュゴン観察🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-068',
            details: '伊勢神宮内宮で参拝。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 158,
  },

  // ---- gn-095 沖縄3日 / 一般 / 予算 null ----
  {
    key: 'gn-095',
    authorKey: 'u-008',
    title: '沖縄3日間の旅 #95',
    description: '沖縄を子連れで3日で巡るルート。美ら海水族館と古宇利大橋を中心に組み立めました👨‍👩‍👧‍👦夏休み旅行に。',
    date: '2024-08-04T08:00:00Z',
    createdAt: '2024-08-25T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-014', 'tag-013'],
    budget: null,
    thumbnailKey: 'img-thumb-072',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-097',
            details: '美ら海水族館🐠',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2', 'img-node-s097-3'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-099',
            details: '古宇利大橋を渡る👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s099-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details: '首里城を見学。',
            imageKeys: ['img-node-s098-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 188,
  },

  // ---- gn-096 ハウステンボス4日 / 一般 ----
  {
    key: 'gn-096',
    authorKey: 'u-008',
    title: '長崎・福岡4日間の旅 #96',
    description: '九州を子連れで4日で巡るルート。ハウステンボスと太宰府を中心に組み立めました👨‍👩‍👧‍👦冬休みにも🐠',
    date: '2024-12-25T08:00:00Z',
    createdAt: '2025-01-15T19:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-013', 'tag-014', 'tag-005'],
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-078',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-109',
            details: 'ハウステンボスのイルミネーション🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-090',
            details: '太宰府天満宮で参拝。',
            imageKeys: ['img-node-s090-1', 'img-node-s090-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-104',
            details: '糸島二見ヶ浦の夕日。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-106',
            details: '青島神社で締め👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s106-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 132,
  },

  // ===========================================================================
  // §S. u-009 photo_yuki（風景写真家）/ gn-097 〜 gn-100 / 4 本
  // 日数: 1×2 / 2×1 / 3×1   バンド: 一般 4
  // 口調: マジックアワー・光と季節📸✨（短文）
  // ===========================================================================

  // ---- gn-097 角島大橋1日 / 一般 ----
  {
    key: 'gn-097',
    authorKey: 'u-009',
    title: '山口1日間の旅 #97',
    description: '山口を1日で巡る撮影ルート。角島大橋のマジックアワー📸✨絶景写真に最適です。',
    date: '2025-06-09T05:00:00Z',
    createdAt: '2025-06-25T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-010', 'tag-022', 'tag-011'],
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-085',
            details: '角島大橋のマジックアワー📸',
            imageKeys: ['img-node-s085-1', 'img-node-s085-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 192,
  },

  // ---- gn-098 諏訪湖1日 / 一般 ----
  {
    key: 'gn-098',
    authorKey: 'u-009',
    title: '長野1日間の旅 #98',
    description: '長野を1日で巡る撮影ルート。諏訪湖の朝霧と夕景を狙う光の旅✨',
    date: '2024-10-20T05:30:00Z',
    createdAt: '2024-11-08T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-022', 'tag-002'],
    budget: { amount: 6800, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-023',
            details: '諏訪湖の朝霧📸',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 158,
  },

  // ---- gn-099 美瑛富良野2日 / 一般 / 事前計画 ----
  {
    key: 'gn-099',
    authorKey: 'u-009',
    title: '北海道2日間の旅 #99',
    description: '北海道を2日で巡る撮影ルート。美瑛青い池と富良野ラベンダー畑📸✨光と季節を追う旅。',
    date: '2026-07-15T05:00:00Z',
    createdAt: '2026-06-15T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-010'],
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-052',
            details: '美瑛青い池の朝光📸',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details: 'ファーム富田のラベンダー✨',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 10,
    targetViews: 200,
  },

  // ---- gn-100 ★最終ルート 高千穂峡3日 / 一般 ----
  {
    key: 'gn-100',
    authorKey: 'u-009',
    title: '九州3日間の旅 #100',
    description: '九州を3日で巡る撮影ルート。高千穂峡と阿蘇、別府の光と季節を追う✨マジックアワー狙いです📸',
    date: '2025-07-25T05:00:00Z',
    createdAt: '2025-09-04T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-010'],
    budget: { amount: 52000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details: '高千穂峡のマジックアワー📸',
            imageKeys: ['img-node-s105-1', 'img-node-s105-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details: '阿蘇草千里の朝光。',
            imageKeys: ['img-node-s094-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-093',
            details: '由布院金鱗湖の朝霧✨',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 178,
  },
];
