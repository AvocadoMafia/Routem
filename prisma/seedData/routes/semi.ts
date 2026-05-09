// Routem シードデータ: 準手作りルート 前半 50 本（sm-001 〜 sm-050）。
//
// 仕様書 docs/seed-spec.md §7.3 / §7.5 / §7.6 / §13.1 に準拠。
// テンプレ展開ベースだが、ペルソナの口調を反映して機械感を抑える。
//
// 著者ペルソナ別の口調指針（curated.ts と同じ方針を準手作りでも踏襲）:
//   u-001 たびまる:       結論先行・断定・「保存版」「黄金ルート」🚄✈️📌
//   u-002 sakura_trip:    柔らかく丁寧・京都愛・「ふらっと」「のんびり」☕🌸✨
//   u-003 kenji_outdoor:  ファミリー実用・駐車場/トイレ等の現地メモ🏕️🚐
//   u-004 mio_couple:     彼との二人旅・記念日・ご褒美ステイ💕🥂📷
//   u-005 hayato_solo:    学生節約・「○○円縛り」「青春18きっぷ」💪🎒
//   u-006 gourmet_aki:    食べ歩き・「○食目」「ハシゴ」🍜🍣🍢
//   u-007 island_hopper:  島時間・秘境・フェリー🏝️⛴️
//   u-008 natsu_family:   子連れ・自由研究・夏休み👨‍👩‍👧‍👦🐠
//   u-009 photo_yuki:     マジックアワー・光と季節・画になる📸✨
//   u-010 newbie_haru:    初心者・「はじめて」「ドキドキ」（控えめ）
//   u-013 longbio_chan:   OL目線・喫茶店/銭湯/路地裏・絵文字多め🐈
//
// 日数分布（仕様書 §7.5.1 を 50 本に按分）:
//   1日 15本 / 2日 18本 / 3日 10本 / 4日 4本 / 5日以上 3本
//
// バンド配分（前半 50 本、§7.5.7）:
//   人気 2 / 中堅 30 / 一般 18（バズ・無名・PRIVATE は後半 sm-051〜100 で扱う）
//
// 夏休みタグ（tag-016）配分: 約 40% = 20 本（date を 7-8 月に集中）
//
// createdAt と date のズレ（§7.6）:
//   - date: 2024-05-15 〜 2026-04-25 の範囲で分散
//   - 通常: createdAt = date + 0〜90 日後
//   - 例外（10% = 5本）: 事前計画として createdAt < date
//     対象: sm-008 / sm-019 / sm-036 / sm-040 / sm-047
//
// thumbnailKey は汎用プール img-thumb-051〜080（6 カテゴリ × 5 枚）から
// テーマに合わせて選択。被りは許容（仕様書 §11.3）。

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

export const semiRoutesFirstHalf: SeedRoute[] = [
  // ===========================================================================
  // §A. u-001 たびまる（インフルエンサー）の準手作り 8 本（sm-001 〜 sm-008）
  //
  // 口調: 結論先行・「保存版」「黄金ルート」「断言します」、🚄✈️📌
  // 日数内訳: 1日×1 / 2日×2 / 3日×3 / 4日×1 / 5日×1
  // バンド: 中堅 6 / 人気 2（sm-004 那須日光・sm-008 道東5日）
  // ===========================================================================

  // ---- sm-001 高尾山〜河口湖 日帰り（中堅、夏休み、テンプレB 結論先行） ----
  {
    key: 'sm-001',
    authorKey: 'u-001',
    title: '東京から日帰りで富士山が見える 高尾山〜河口湖の1日プラン',
    description:
      '結論、東京から日帰りで富士山と山と湖をぜんぶ味わうならこのルートが正解です。ハイライトは3つ。1) 高尾山6号路の沢沿いを朝のうちに登る、2) 大月乗換で河口湖へ抜けて大石公園のラベンダー畑を浴びる、3) 富士山五合目でゴール代わりに記念写真📌 注意点は最終バスの時間で、五合目発の最終を逃すと詰むので15時には乗ること。装備は普通のスニーカーで十分です🚄',
    date: '2025-08-02T06:30:00Z',
    createdAt: '2025-08-18T20:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-002', 'tag-025'], // 夏休み / 絶景 / 自然 / 弾丸旅行
    budget: { amount: 7800, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-022',
            details:
              '高尾山口駅に7時着、6号路で沢沿いを登る。3時間あれば往復できる体力ルート。山頂からの富士山ビューが朝の方が空気が澄んでて段違い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 70, distance: 55.0, memo: '高尾山口から京王線・大月乗換・富士急で河口湖駅まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '大石公園は河口湖駅からバス20分。湖越しの富士山と季節の花畑が同じ画角に収まる、コスパ最強の絶景ポイントです。ベンチで湖面を眺めながら昼食。',
            imageKeys: ['img-node-s007-1', 'img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 45, distance: 28.0, memo: '富士急バスで富士スバルライン五合目行きへ乗車', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-006',
            details:
              '五合目で標高2300m、高山植物と雲海の境目に立てる時間帯です。最終バスは15時前後なので、滞在は1時間で切り上げて確実に下山。これで日帰り完結📌',
            imageKeys: ['img-node-s006-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 480,
  },

  // ---- sm-002 仙台〜松島 牛タンと景勝地 2日（中堅、テンプレA 旅日記） ----
  {
    key: 'sm-002',
    authorKey: 'u-001',
    title: 'はじめての仙台〜松島 2日でまわるおすすめスポット',
    description:
      '47都道府県制覇の旅で何度か通った仙台ですが、改めて「初めての人向け」の動線を整理しました。1日目は牛タン通りで利久・喜助・伊達の3軒をハシゴしてから仙台城跡で街を見下ろす。2日目は松島まで足を延ばして遊覧船と五大堂、瑞巌寺をワンセット。新幹線と仙石線でぜんぶ繋がるので車不要、観光客にも参考になれば嬉しいです🚄',
    date: '2025-04-19T10:00:00Z',
    createdAt: '2025-05-22T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-001', 'tag-010'], // グルメ / 歴史 / 絶景
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-123',
            details:
              '仙台駅着、迷わず牛タン通りへ直行。利久のたん定食を昼に。塩味の極厚タンは正直この値段で食えるのが反則レベルです📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '仙台駅3階の牛タン通り内を移動、2軒目の喜助へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-123',
            details:
              '2軒目は喜助の極厚芯たん。タレ味と塩味を交互に頼んで食べ比べるのが個人的鉄則。1日2軒で限界という人はここで切り上げてOK。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同じエリア内で別アングルへ移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-123',
            details:
              '帰路前に駅構内のずんだ茶寮で土産を仕入れる。仙台土産の定番でこの旅も気持ちよく締まりました🚄',
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
            details:
              '仙石線で松島海岸駅へ。日本三景の松島を遊覧船で1周してから、赤い橋を渡って五大堂へ。海風と松林のコントラストが頭をリセットしてくれます。',
            imageKeys: ['img-node-s058-1', 'img-node-s058-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '五大堂から瑞巌寺の参道まで歩き、参拝後に駅へ戻る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-058',
            details:
              '帰りに駅前の松華堂菓子店でカステラと抹茶を一服。1泊2日でここまで詰められる東北の優秀さを再認識する旅でした。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '隣接エリアまで歩いて移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-058',
            details:
              '帰路前に駅構内のずんだ茶寮で土産を仕入れる。仙台土産の定番でこの旅も気持ちよく締まりました🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 410,
  },

  // ---- sm-003 出雲・鳥取 神話と砂丘 2日（中堅、テンプレA） ----
  {
    key: 'sm-003',
    authorKey: 'u-001',
    title: '神話の島根と鳥取砂丘 2日で巡る山陰王道コース',
    description:
      '47都道府県のうち山陰は手薄になりがちなので、初訪問の人向けに最短で出雲大社と鳥取砂丘を両方押さえるルートを組み直しました。1日目は出雲大社で参拝→出雲そばを食べて松江へ、2日目に鳥取砂丘でラクダと夕日。レンタカーは出雲空港でピックアップして米子空港で返すのが鉄則です。神話と砂と海、2日でこれだけ違う景色が出てきます📌',
    date: '2024-10-12T08:00:00Z',
    createdAt: '2024-11-05T13:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-001', 'tag-010'], // 寺社仏閣 / 歴史 / 絶景
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details:
              '出雲空港から30分、まずは大注連縄の神楽殿へ。撮影ポイントは正面より斜め前から見上げる構図が縄の太さが伝わります。参拝は2礼4拍手1礼が出雲流。',
            imageKeys: ['img-node-s077-1', 'img-node-s077-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 78.0, memo: '出雲大社から松江市内、宍道湖沿いで夕日を眺めながら走る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-077',
            details:
              '神門通りで出雲そばの三段重を食べてから松江へ移動。宍道湖の夕日を車窓越しに浴びる時間帯が個人的ベスト。松江温泉で1泊。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'スポット内で別の見どころへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-077',
            details:
              '昼食は出雲そばの三段重を食べてから松江市内へ移動。神話の地で食までしっかり味わうのが王道です。',
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
            spotKey: 's-076',
            details:
              '松江から鳥取砂丘まで車で2時間。お昼前に到着して砂の馬の背を登るとちょうど日差しが斜めから入って絵になります。ラクダ撮影は1人500円程度。',
            imageKeys: ['img-node-s076-1', 'img-node-s076-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.5, memo: '砂丘の馬の背を一周、海岸線まで往復', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-076',
            details:
              '夕方は砂の美術館で世界の砂像を眺めて、米子空港へ。山陰は2日でこの密度を組めるので、迷ってる人にはまず1周して欲しい王道です🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '休憩を挟んで撮影ポイントを変更', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-076',
            details:
              '昼食は出雲そばの三段重を食べてから松江市内へ移動。神話の地で食までしっかり味わうのが王道です。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 25,
    targetViews: 370,
  },

  // ---- sm-004 那須高原と日光 3日（人気、夏休み、テンプレB） ----
  {
    key: 'sm-004',
    authorKey: 'u-001',
    title: '【保存版】那須高原と日光 大人の夏休み3日間',
    description:
      '結論、関東圏で夏に「自然と歴史と温泉をぜんぶ」やりたいなら、栃木の北部を3日で縦断するのが正解です。ハイライトは3つ。1) 那須高原の朝の高原散歩、2) 鬼怒川温泉の渓谷露天、3) 日光東照宮の朝一参拝で観光客0人を狙う📌 注意点としては夏でも標高1000m近くは朝晩冷えるので軽い長袖必須。新幹線で那須塩原→そこからレンタカーで全部繋がります。家族でも夫婦でも刺さる王道3日🚄',
    date: '2025-07-25T07:00:00Z',
    createdAt: '2025-08-15T11:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-001', 'tag-002'], // 夏休み / 温泉 / 歴史 / 自然
    budget: { amount: 72000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-011',
            details:
              '那須塩原駅でレンタカー、まずは那須高原へ直行。ロープウェイで茶臼岳の中腹まで登って高原散策。涼しさが東京と別世界です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '那須高原から鬼怒川温泉へ、日塩もみじラインを使うと景色がきれい', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-010',
            details:
              '鬼怒川温泉で1泊目。渓谷沿いの露天風呂付き客室を選べば、夕食後の暗くなってからの川音がご褒美。日帰り入浴でも十分映えます。',
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
            spotKey: 's-009',
            details:
              '8時開門と同時に日光東照宮へ。陽明門の彫刻群は朝の光のほうが陰影がはっきり出ます。眠り猫と三猿、見ざる聞かざる言わざるはマスト📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 14.0, memo: '日光東照宮から華厳の滝、いろは坂を経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-009',
            details:
              '輪王寺と二荒山神社をセットで回って日光二社一寺を完結。昼食は日光名物の湯波料理を駅前で。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 32.0, memo: '日光からいろは坂を上って中禅寺湖、戦場ヶ原まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-009',
            details:
              '中禅寺湖と華厳の滝で日光の自然側を補完。戦場ヶ原は夏でも涼しく、駐車場から30分の散策路で十分満足できます。鬼怒川に戻って2泊目。',
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
            spotKey: 's-010',
            details:
              '最終日は鬼怒川ライン下りで朝の渓谷を一気に下る。所要40分、水しぶきは多少覚悟。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'ライン下り終点から鬼怒川温泉駅前のSL展示まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-010',
            details:
              'SL大樹に乗って鬼怒川温泉駅から下今市駅へ。蒸気機関車の走行音と渓谷の風景がセットで味わえる、最後にもう一発映える締め🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 95,
    targetViews: 1620,
  },

  // ---- sm-005 道後温泉と四国カルスト 3日（中堅、テンプレA） ----
  {
    key: 'sm-005',
    authorKey: 'u-001',
    title: '道後温泉と祖谷渓 四国の山と湯を3日でまわる',
    description:
      '四国は1県ずつ訪ねるより、エリア横断で組んだ方が効率がいい。今回は愛媛の道後温泉から徳島の祖谷渓まで、レンタカーで一気に縦断する3日プランをまとめました。1日目に道後温泉本館の朝風呂、2日目はかずら橋とラフティング、3日目に大歩危で峡谷ボート。秘境の濃さに対して移動はしっかり繋がるので、初めての四国にもおすすめです🚄',
    date: '2024-09-18T09:00:00Z',
    createdAt: '2024-11-02T15:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-024', 'tag-002'], // 温泉 / 秘境 / 自然
    budget: { amount: 68000, currency: JPY },
    thumbnailKey: 'img-thumb-066',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-078',
            details:
              '松山空港から道後温泉直行、本館の朝風呂6時開きを狙う。石造りの神の湯と霊の湯を両方体験するなら2階以上の貸切休憩がベスト。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '道後温泉から松山自動車道経由で大歩危方面へ走り出す', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-078',
            details:
              '昼食は道後の鯛めし定食。午後の移動に備えて、温泉街のからくり時計を見送りつつ車で東へ移動開始。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '近隣のカフェ・売店へ立ち寄り', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-078',
            details:
              '夜は道後温泉本館の坊っちゃんの間で文豪気分。湯上がりに鯛めしと地酒で1日目を締める贅沢🚄',
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
            spotKey: 's-089',
            details:
              '祖谷のかずら橋。シラクチカズラで編まれた橋を渡るスリル感は1度体験する価値あり。橋の下の祖谷渓の青さが見どころです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 20, distance: 12.0, memo: 'かずら橋から琵琶の滝経由で大歩危・小歩危へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-088',
            details:
              '大歩危・小歩危で観光遊覧船。両岸に切り立つ岩壁を縫って下る30分は、四国の山の深さを体に刻まれる時間です📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '展望ポイントまで足を延ばす', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-088',
            details:
              '夜は道後温泉本館の坊っちゃんの間で文豪気分。湯上がりに鯛めしと地酒で1日目を締める贅沢🚄',
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
            spotKey: 's-089',
            details:
              '祖谷渓へ戻って小便小僧像と渓谷ビュー。崖の先端に立つ少年像と眼下の祖谷渓のコントラストはこの旅一番の写真になりました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 70, distance: 55.0, memo: '祖谷渓から徳島市内へ南下、道の駅貞光ゆうゆう館で休憩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-088',
            details:
              '帰路は再度大歩危で休憩、鳴門の渦潮を遠目に四国を抜ける。3日で四国の山と湯と峡谷をぐるっと回れた密度に大満足📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '駐車場戻りつつ周辺を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-088',
            details:
              '夜は道後温泉本館の坊っちゃんの間で文豪気分。湯上がりに鯛めしと地酒で1日目を締める贅沢🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 450,
  },

  // ---- sm-006 角島〜萩・津和野 山口3日（中堅、夏休み、テンプレB） ----
  {
    key: 'sm-006',
    authorKey: 'u-001',
    title: '角島大橋と萩・津和野 山口を3日で満喫',
    description:
      '結論、山口は3日かければ角島大橋と城下町を両方押さえられます。ハイライトは3つ。1) 角島大橋の海上ドライブを朝のうちに、2) 萩の城下町で土塀の路地散策、3) 津和野の鯉の泳ぐ町並み📌 注意点としては山口宇部空港か岩国錦帯橋空港から出入りした方が動線が綺麗で、新幹線で来ると下関乗換が面倒です。夏は暑いので朝活推奨🚄',
    date: '2024-08-08T08:00:00Z',
    createdAt: '2024-08-30T16:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-001', 'tag-022'], // 夏休み / 絶景 / 歴史 / 写真映え
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-085',
            details:
              '宇部空港着、レンタカーで角島大橋へ2時間。朝10時前のエメラルドグリーンが一番濃い時間帯。橋の手前の展望台が定番アングル📌',
            imageKeys: ['img-node-s085-1', 'img-node-s085-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '角島から萩市街の城下町へ、海岸沿いを東進', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-085',
            details:
              '橋を渡って角島の灯台までドライブ。海岸線の白砂と青の対比は本州側の景勝でも屈指です。コバルトブルービーチで海水浴も可能。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '次のスポットへ向かう前に周辺で休憩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-085',
            details:
              '夕方は角島大橋を反対側から眺めるアングル探し。同じ橋でも光と角度で違う表情になるのが面白い📌',
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
            spotKey: 's-084',
            details:
              '萩城下町に朝9時着。土塀の連なる菊屋横丁から高杉晋作誕生地まで歩いて、明治維新の空気を浴びます。レンタサイクルがおすすめ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 75, distance: 60.0, memo: '萩から津和野まで、徳佐経由の県道9号で峠越え', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-084',
            details:
              '昼は萩の見蘭牛丼。午後は津和野へ移動して、太鼓谷稲成神社へ。千本鳥居とは別の山陰の朱色が見られます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'バス停・駅前まで戻る道のり', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-084',
            details:
              '夕方は角島大橋を反対側から眺めるアングル探し。同じ橋でも光と角度で違う表情になるのが面白い📌',
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
            spotKey: 's-084',
            details:
              '最終日は津和野の殿町通りで鯉の泳ぐ水路を散策。安野光雅美術館で旅の余韻を整えてから帰路へ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '津和野から萩・石見空港へ、午後便で東京へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-085',
            details:
              '帰路の途中、道の駅萩しーまーとで地元の海鮮土産を買って空港へ。山口3日、想像以上に密度が濃かったです🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同エリアの別の路地を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-085',
            details:
              '夕方は角島大橋を反対側から眺めるアングル探し。同じ橋でも光と角度で違う表情になるのが面白い📌',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 510,
  },

  // ---- sm-007 北陸縦断 福井から能登 4日（中堅、テンプレA） ----
  {
    key: 'sm-007',
    authorKey: 'u-001',
    title: '北陸縦断4日 福井・金沢・能登半島の王道コース',
    description:
      '北陸新幹線が敦賀まで延びてからは、福井→金沢→能登の縦断がぐっと組みやすくなりました。1日目は永平寺と東尋坊、2日目は金沢で兼六園と茶屋街、3日目に能登半島へ抜けて千枚田、4日目に金沢へ戻って近江町市場で締めるのが個人的ベスト。レンタカーは福井で借りて金沢駅で返却、3泊4日で北陸の主要観光をぜんぶ拾えます📌',
    date: '2025-05-30T08:30:00Z',
    createdAt: '2025-06-25T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-005', 'tag-010', 'tag-003'], // 歴史 / 寺社仏閣 / 絶景 / グルメ
    budget: { amount: 105000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-072',
            details:
              '敦賀から永平寺へ車で1時間。曹洞宗の総本山、回廊と階段の美しさは早朝の凛とした空気のうちに浴びるのが正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 75, distance: 60.0, memo: '永平寺から東尋坊まで国道416号経由で日本海側へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-073',
            details:
              '東尋坊の柱状節理は崖の縁から見下ろす一瞬の足のすくみが面白い。観光船で海側からも撮れば構図が変わります。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同じエリア内で別アングルへ移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-073',
            details:
              '夜は永平寺門前のおそば屋で精進そば。曹洞宗の総本山らしい慎ましい夕食、これも旅の一部です。',
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
            spotKey: 's-064',
            details:
              '兼六園は朝7時の早朝開園を狙う。徽軫灯籠と霞ヶ池の構図はこの時間帯が無人で撮れる正解。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.6, memo: '兼六園から金沢城公園経由でひがし茶屋街へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-065',
            details:
              'ひがし茶屋街で町家カフェと金箔ソフト。観光客が増える11時前までに撮影は済ませる📌',
            imageKeys: ['img-node-s065-1', 'img-node-s065-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '隣接エリアまで歩いて移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-065',
            details:
              '夜は永平寺門前のおそば屋で精進そば。曹洞宗の総本山らしい慎ましい夕食、これも旅の一部です。',
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
            spotKey: 's-118',
            details:
              '金沢から奥能登の白米千枚田まで車で2時間半。海に向かって段になった棚田の景色は、田植えの時期と稲刈り直前で表情がガラッと変わります。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '白米千枚田から輪島朝市まで国道249号で海岸線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-118',
            details:
              '輪島朝市で昼食。鮮魚と漆器の組み合わせは能登ならでは。夜は和倉温泉に泊まって加賀屋系列の上質な湯を浴びる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'スポット内で別の見どころへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-118',
            details:
              '夜は永平寺門前のおそば屋で精進そば。曹洞宗の総本山らしい慎ましい夕食、これも旅の一部です。',
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
            spotKey: 's-129',
            details:
              '最終日は近江町市場で海鮮丼と治部煮、加賀百万石の台所で朝から海鮮三昧。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '近江町市場から兼六園、最後にもう一度日本三名園を眺める', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-064',
            details:
              '兼六園を最後にもう一度散策して土産を片付け、新幹線で東京へ。北陸4日、想像以上に詰められました🚄',
            imageKeys: ['img-node-s064-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '休憩を挟んで撮影ポイントを変更', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '夜は永平寺門前のおそば屋で精進そば。曹洞宗の総本山らしい慎ましい夕食、これも旅の一部です。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 620,
  },

  // ---- sm-008 道東5日（人気、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-008',
    authorKey: 'u-001',
    title: '【夏休み完全版】北海道道東5日 知床〜釧路湿原〜阿寒の黄金ルート',
    description:
      '今年の夏は道東を5日かけて回ってきます。まず知床で2泊して五湖と硫黄山、知床岬クルーズ。3日目に釧路湿原へ移動して塘路湖・コッタロ展望台、4日目に阿寒湖で温泉と遊覧船、最終日に旭山動物園で締める黄金ルート📌 47都道府県の中でも夏の道東はトップ3に入る満足度。レンタカー必須、フェリーは早めに予約を入れておくのが鉄則です🚄',
    date: '2025-07-28T07:30:00Z',
    createdAt: '2025-06-10T14:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-010', 'tag-024'], // 夏休み / 自然 / 絶景 / 秘境
    budget: { amount: 158000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details:
              '女満別空港から知床まで車で2時間半。1湖と2湖の高架木道で熊の心配なくサクッと回るのが安全策。所要1時間で午後着なら十分間に合います。',
            imageKeys: ['img-node-s048-1', 'img-node-s048-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '知床五湖からウトロ漁港まで、宿泊先のチェックインへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              'ウトロで1泊目。夕食はサーモンとオホーツク海の海鮮を浴びるくらい食う。翌朝のクルーズに備えて早寝。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '近隣のカフェ・売店へ立ち寄り', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-048',
            details:
              'ウトロ漁港のサンセットクルーズに乗船。知床連山と夕日が同じフレームに収まる、この街でしかない景色🚄',
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
            spotKey: 's-048',
            details:
              '知床岬クルーズに乗船。ヒグマの遭遇率は時期で変動するけど、断崖と滝の連なりだけでも十分元が取れます。船上は風が強いので羽織必携。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '知床から釧路湿原方面へ、知床横断道路で硫黄山経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              '硫黄山と摩周湖を経由して釧路へ。霧の摩周湖が晴れる確率は3回行って1回くらい、運次第です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '展望ポイントまで足を延ばす', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-048',
            details:
              'ウトロ漁港のサンセットクルーズに乗船。知床連山と夕日が同じフレームに収まる、この街でしかない景色🚄',
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
            spotKey: 's-046',
            details:
              '釧路湿原のコッタロ展望台と細岡展望台で蛇行する釧路川を上から眺める。湿原は一望してこそのスケール感です📌',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 100, distance: 95.0, memo: '釧路湿原から阿寒湖温泉へ、阿寒横断道路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-046',
            details:
              '阿寒湖温泉で遊覧船とマリモ展示観察センターをセット。夜はアイヌコタンの伝統舞踊が想像以上に良かった。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '駐車場戻りつつ周辺を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-046',
            details:
              'ウトロ漁港のサンセットクルーズに乗船。知床連山と夕日が同じフレームに収まる、この街でしかない景色🚄',
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
            spotKey: 's-046',
            details:
              '阿寒湖から旭川方面へ大移動。途中のオンネトーで湖と雌阿寒岳のリフレクションが美しく、寄り道する価値あり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 180, distance: 170.0, memo: '阿寒湖温泉から旭川市内、層雲峡経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-046',
            details:
              '旭川で1泊、夕食は旭川ラーメンで締め。明日に備えて休む。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '次のスポットへ向かう前に周辺で休憩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-046',
            details:
              'ウトロ漁港のサンセットクルーズに乗船。知床連山と夕日が同じフレームに収まる、この街でしかない景色🚄',
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
            spotKey: 's-053',
            details:
              '最終日は旭山動物園でホッキョクグマの行動展示。午前中に園を一周、ペンギンとアザラシの円柱水槽は何度見ても飽きない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '旭山動物園から旭川空港へ、お土産は空港でまとめ買い', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-046',
            details:
              '旭川空港のお土産売場でじゃがポックル・白い恋人を仕入れて羽田便へ。道東5日、満足度マックスでした🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'バス停・駅前まで戻る道のり', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-046',
            details:
              'ウトロ漁港のサンセットクルーズに乗船。知床連山と夕日が同じフレームに収まる、この街でしかない景色🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 110,
    targetViews: 1850,
  },

  // ===========================================================================
  // §B. u-002 sakura_trip の準手作り 6 本（sm-009 〜 sm-014）
  //
  // 口調: 柔らかく丁寧・京都愛・「ふらっと」「のんびり」、🌸☕✨
  // 日数内訳: 1日×3 / 2日×3
  // バンド: 全て中堅
  // ===========================================================================

  // ---- sm-009 京都銀閣寺と哲学の道 1日（中堅、テンプレC 時系列日記） ----
  {
    key: 'sm-009',
    authorKey: 'u-002',
    title: '京都 銀閣寺と哲学の道をのんびり歩く半日プラン',
    description:
      '春の終わりの土曜日、ふらっと銀閣寺へ。観光客が増える前の朝9時前に到着すると、参道のもみじはまだ静かなまま。哲学の道を南に下って永観堂、南禅寺の水路閣まで歩く2時間が私のお気に入りコースです🌸 帰りは岡崎エリアのカフェで一服してから祇園へ抜けるのが京都らしい一日。気負わずふらっと歩きたい人におすすめです☕',
    date: '2025-04-26T08:30:00Z',
    createdAt: '2025-05-12T18:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-004', 'tag-022'], // 寺社仏閣 / カフェ / 写真映え
    budget: { amount: 5800, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-034',
            details:
              '銀閣寺は朝一番、9時開門と同時に入るのが正解。観音殿と銀沙灘、向月台の砂の造形が午前の柔らかい光で一番きれいに見えます🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 2.0, memo: '銀閣寺から哲学の道を南へ、永観堂・南禅寺方面まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details:
              '哲学の道を抜けて南禅寺の水路閣まで。レンガアーチを見上げる構図はインスタでもいつも反応が良くて、京都らしい一枚が必ず撮れます☕',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '南禅寺から地下鉄蹴上駅、四条方面へ移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '夕方は祇園花見小路で甘味屋へ。鍵善良房のくずきりで一日を締めるのが、いつも私の京都の終わり方です✨',
            imageKeys: ['img-node-s035-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 340,
  },

  // ---- sm-010 大阪城と通天閣 1日（中堅、テンプレE 箇条書き感想） ----
  {
    key: 'sm-010',
    authorKey: 'u-002',
    title: '大阪城と通天閣 大阪のレトロを1日で巡る',
    description:
      '京都から日帰りで大阪へ。今回は大阪らしさを濃く感じたかったので、大阪城〜道頓堀〜新世界の通天閣まで動線をぎゅっと詰めました。大阪城は天守閣からの眺望が想像以上に360度。道頓堀でたこ焼きを摘んで、夕方は通天閣のライトアップを下から見上げる構成です。1日でも大阪をひと舐めできる満足感、関西在住の私でもたまにやりたくなるんです✨',
    date: '2025-03-08T09:30:00Z',
    createdAt: '2025-03-25T20:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-003', 'tag-009'], // 歴史 / グルメ / 夜景
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-079',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-036',
            details:
              '大阪城は午前のうちに天守閣まで。展望台からは大阪の街が360度見渡せて、想像以上に開放感があります。お濠の桜は3月後半が見頃🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.5, memo: '大阪城公園駅から大阪環状線で天王寺、なんばへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-030',
            details:
              '道頓堀でたこ焼きと串カツを摘み食い。グリコの看板の前で記念写真を1枚撮るのは、結局のところ大阪に来たら必須行事です✨',
            imageKeys: ['img-node-s030-1', 'img-node-s030-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '道頓堀から千日前経由で新世界・通天閣まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-037',
            details:
              '夕方は通天閣を真下から見上げる。ライトアップ点灯は日没30分後が目安。レトロな新世界の通りに沿って居酒屋で一杯、で大阪らしい〆。',
            imageKeys: ['img-node-s037-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 18,
    targetViews: 290,
  },

  // ---- sm-011 京都北部 金閣寺〜嵐山 1日（中堅、桜、テンプレD Q&A） ----
  {
    key: 'sm-011',
    authorKey: 'u-002',
    title: '京都北部 金閣寺と嵐山を1日で回るおすすめプラン',
    description:
      '「金閣寺と嵐山って1日で回れますか？」と聞かれることが多いので、実際にやってみて分かったことをまとめます。結論、可能です。朝9時に金閣寺を見て、市バスで嵐山へ移動、午後は渡月橋から竹林の小径、最後に祇園へ戻って夕食という流れがちょうど良い密度。観光客の多い時期はバスが渋滞するので、地下鉄+JRの乗り継ぎを覚えておくと安心です☕',
    date: '2025-04-04T09:00:00Z',
    createdAt: '2025-04-22T14:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-018', 'tag-022'], // 寺社仏閣 / 桜 / 写真映え
    budget: { amount: 6800, currency: JPY },
    thumbnailKey: 'img-thumb-059',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-033',
            details:
              '金閣寺は朝9時の開門直後がベスト。鏡湖池に映る金閣の正面構図は、観光客が増える前なら水面の波紋もきれいに撮れます🌸',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 50, distance: 18.0, memo: '金閣寺道から市バス59系統で嵐山天龍寺前まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-027',
            details:
              '嵐山は渡月橋を渡ってから竹林の小径へ。桜の時期は橋の上流側の桜並木が一番映えます。午後の光が竹林に差し込む14時前後を狙うのがおすすめ✨',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 8.0, memo: '嵐電嵐山駅から四条大宮、阪急で河原町へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '夕方は祇園花見小路で軽い夕食。京都の夜の入口を花街の灯りで迎えるのは、何度味わってもいいものです🌸',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 380,
  },

  // ---- sm-012 神戸〜姫路 1泊（中堅、テンプレA） ----
  {
    key: 'sm-012',
    authorKey: 'u-002',
    title: '神戸と姫路 港町と城下町をのんびり1泊2日',
    description:
      '京都に住んでいると関西は近すぎて逆に行かなくなるので、年に何度かこうして近場をちゃんと旅します。神戸でメリケンパークと中華街、夜は北野の異人館でフレンチ。翌朝は姫路まで足を延ばして世界遺産の姫路城を朝のうちに登る2日プラン。海と城と異国情緒を1泊で全部味わえる、関西らしい欲張りな旅です☕',
    date: '2024-11-09T10:00:00Z',
    createdAt: '2024-11-30T17:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-001', 'tag-003'], // 夜景 / 歴史 / グルメ
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-032',
            details:
              'メリケンパークでポートタワーとオリエンタルホテルの船型シルエットを背景に1枚。海風が気持ち良くて、平日の昼は人もまばらで穴場です✨',
            imageKeys: ['img-node-s032-1', 'img-node-s032-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'メリケンパークから南京町の入口まで歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-126',
            details:
              '南京町で豚まんと小籠包を食べ歩き。老祥記の豚まんは並ぶ価値あり。夕方は北野の異人館街でフレンチを予約しておくと夜の流れが綺麗です🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同エリアの別の路地を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-126',
            details:
              'ハーバーランド地区のumieモザイク内で夕食、観覧車に乗ってベイサイドの夜景を眺めて1日目を締める✨',
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
            spotKey: 's-039',
            details:
              '姫路城は朝9時の開門直後を狙う。白漆喰の城壁が朝日を反射して本当に白鷺。天守までの登城は45分、足腰に自信がない人は大手門前から見上げるだけでも価値あります☕',
            imageKeys: ['img-node-s039-1', 'img-node-s039-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '姫路城から好古園、駅前の和菓子店経由で帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-039',
            details:
              '隣の好古園で日本庭園を回ってお土産を買って京都へ。海・城・異国・庭園、関西の一泊コースとしては大満足の濃さでした✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同じエリア内で別アングルへ移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-039',
            details:
              'ハーバーランド地区のumieモザイク内で夕食、観覧車に乗ってベイサイドの夜景を眺めて1日目を締める✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 360,
  },

  // ---- sm-013 奈良 春日大社と若草山 1泊（中堅、紅葉、テンプレC） ----
  {
    key: 'sm-013',
    authorKey: 'u-002',
    title: '奈良 春日大社と若草山で過ごす紅葉の1泊2日',
    description:
      '紅葉の時期、京都が観光客で身動き取れなくなる頃に、ふらっと奈良に逃げるのが私の毎年のお楽しみ🌸 春日大社の参道は紅葉の赤と杉木立の緑のコントラストが見事で、京都とは違う山の静けさがあります。若草山に登って奈良盆地を見下ろせば、東大寺の大屋根まで一望。ならまちで町家カフェ、夜は奈良ホテルで上質な時間を過ごす1泊コースです☕',
    date: '2024-11-23T09:00:00Z',
    createdAt: '2024-12-15T16:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-005', 'tag-002'], // 紅葉 / 寺社仏閣 / 自然
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-038',
            details:
              '春日大社の表参道は朝のうちに。万灯籠の連なる回廊と紅葉のトンネルが、京都ではなかなか味わえない静けさで残ります✨',
            imageKeys: ['img-node-s038-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '春日大社から奈良公園の若草山ふもとへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-028',
            details:
              '若草山は1重目までなら30分で登れる。山頂から見下ろす奈良盆地は東大寺・興福寺の屋根まで一望できて、紅葉シーズンは色のグラデーションも見事🌸',
            imageKeys: ['img-node-s028-1', 'img-node-s028-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '隣接エリアまで歩いて移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-028',
            details:
              '南円堂で参拝、興福寺国宝館の阿修羅像も見学。奈良の仏像建築の幅を1日で押さえる📜',
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
            spotKey: 's-029',
            details:
              '東大寺大仏殿は朝の開門直後がやはり良い。盧舎那仏の前に立つ静かな時間を独り占めできるのは、観光地化された奈良でも数少ない瞬間です☕',
            imageKeys: ['img-node-s029-1', 'img-node-s029-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '東大寺からならまちのカフェエリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-028',
            details:
              'ならまちで町家カフェを2軒巡って京都へ戻ります。鹿せんべいで鹿に追いかけられる時間も含めて、奈良はやっぱり何度来てもいい場所です🌸',
            imageKeys: ['img-node-s028-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'スポット内で別の見どころへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-028',
            details:
              '南円堂で参拝、興福寺国宝館の阿修羅像も見学。奈良の仏像建築の幅を1日で押さえる📜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 20,
    targetViews: 320,
  },

  // ---- sm-014 嵐山と貴船 1泊（中堅、紅葉、テンプレC） ----
  {
    key: 'sm-014',
    authorKey: 'u-002',
    title: '嵐山と貴船で過ごす紅葉の1泊 大人の京都プラン',
    description:
      '紅葉のピークに合わせて、嵐山と貴船を1泊で組みました。1日目は嵐山の渡月橋から常寂光寺、祇王寺と奥嵯峨へ。夜は嵯峨野温泉で1泊。2日目に叡山電車で貴船へ移動して、川床ランチと貴船神社の参道。京都の中でも一番山深い側の紅葉を浴びる構成です。観光客も多いけれど、朝活と夜の温泉で人混みを避けるのがコツ✨',
    date: '2024-11-16T10:00:00Z',
    createdAt: '2024-12-08T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-002', 'tag-005'], // 紅葉 / 自然 / 寺社仏閣
    budget: { amount: 26000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details:
              '嵐山の渡月橋は朝霧が残る7時台がベスト。橋の中央から見る愛宕山の山肌の紅葉と桂川の水面が美しいんです🌸',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.6, memo: '渡月橋から竹林の小径経由で常寂光寺・祇王寺方面', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-027',
            details:
              '奥嵯峨の常寂光寺と祇王寺は紅葉の名所でも比較的人が少ない穴場。苔と紅葉の対比は祇王寺の方が深く残ります✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '休憩を挟んで撮影ポイントを変更', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-027',
            details:
              '竹林の小径で午後の光と風を浴びてから嵯峨野温泉の宿へ。1日目の終わりは温泉で京都の山深さに浸る🌸',
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
            spotKey: 's-035',
            details:
              '叡山電鉄の出町柳駅から鞍馬線で貴船口へ。車窓のもみじトンネルが有名な区間です。徐行運転になるので車内アナウンスも楽しい🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 14.0, memo: '出町柳から叡山電鉄で貴船口、バスで貴船神社の参道へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details:
              '貴船神社の朱色の灯籠と石段は、京都の中でも一番「山の神域」を感じる場所。川床ランチで締めて京都市内へ戻る、贅沢な紅葉1泊2日でした☕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '近隣のカフェ・売店へ立ち寄り', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '竹林の小径で午後の光と風を浴びてから嵯峨野温泉の宿へ。1日目の終わりは温泉で京都の山深さに浸る🌸',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 19,
    targetViews: 285,
  },

  // ===========================================================================
  // §C. u-003 kenji_outdoor の準手作り 5 本（sm-015 〜 sm-019）
  //
  // 口調: ファミリー実用・駐車場/トイレ等のメモ・キャンピングカー、🏕️🚐
  // 日数内訳: 2日×1 / 3日×2 / 4日×1 / 5日×1
  // バンド: 一般 1 / 中堅 3 / 人気 1（sm-019 利尻礼文5日）
  // ===========================================================================

  // ---- sm-015 五色沼ハイキング 1泊（一般、紅葉、テンプレB） ----
  {
    key: 'sm-015',
    authorKey: 'u-003',
    title: '五色沼で家族ハイキング 福島の秋を1泊2日で',
    description:
      '結論、五色沼は子連れでも歩ける優しい紅葉トレイルです。ハイライトは3つ。1) 毘沙呂沼の鏡面リフレクション、2) 青沼の異常な青さ、3) 桧原湖畔の駐車場とトイレが整備されてて子連れ安心。注意点としては10月後半は朝晩冷えるので防寒着をしっかり。我が家はキャンピングカー泊で猪苗代湖畔の道の駅を利用しました🚐',
    date: '2024-10-19T08:00:00Z',
    createdAt: '2024-11-08T20:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-002', 'tag-020', 'tag-013'], // 紅葉 / 自然 / ハイキング / 家族旅行
    budget: { amount: 24000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-060',
            details:
              '五色沼自然探勝路の入口に9時着。毘沙呂沼から青沼までの片道3.6km、子連れで2時間ペース。コースは平坦でベビーカーは無理ですが小学生なら全員歩けます🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '五色沼から猪苗代湖の道の駅まで、夕食と車中泊の準備', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-060',
            details:
              '夕方は桧原湖畔の温泉で汗を流して、道の駅猪苗代でキャンピングカー泊。子供たちは星空観察に夢中で、思い出に残る1泊目🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '展望ポイントまで足を延ばす', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-060',
            details:
              '夕方は猪苗代湖畔のレイクサイドで磐梯山を眺めながら子供たちは石投げ遊び。家族の何気ない時間🏕️',
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
            spotKey: 's-060',
            details:
              '2日目は猪苗代湖畔の朝散歩、湖面の朝霧と磐梯山のシルエットを子供たちと眺める静かな時間🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 24.0, memo: '猪苗代湖から会津若松、鶴ヶ城公園の駐車場へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-060',
            details:
              '会津若松へ車を走らせて鶴ヶ城を見学。紅葉の城郭はスケールが違います。お昼は喜多方ラーメンで福島ぐるっと一周🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '駐車場戻りつつ周辺を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-060',
            details:
              '夕方は猪苗代湖畔のレイクサイドで磐梯山を眺めながら子供たちは石投げ遊び。家族の何気ない時間🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 110,
  },

  // ---- sm-016 奥入瀬と十和田 紅葉3日（中堅、紅葉、テンプレA） ----
  {
    key: 'sm-016',
    authorKey: 'u-003',
    title: '青森 奥入瀬渓流と十和田湖の紅葉3日 ファミリー向け',
    description:
      '紅葉ピークの東北を子連れで攻めるなら、奥入瀬渓流と十和田湖をセットで3日かけるのがちょうど良いペースです。1日目は青森市内で観光しつつ移動、2日目に奥入瀬渓流の遊歩道を子供と一緒に半日ハイク、3日目に十和田湖の遊覧船で締める構成。キャンピングカー旅なので途中の道の駅奥入瀬で1泊するのが我が家のスタイル🚐 子供にも東北の自然のスケールを実感させたくて選んだルートです。',
    date: '2024-10-26T08:30:00Z',
    createdAt: '2024-11-22T14:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-002', 'tag-013', 'tag-020'], // 紅葉 / 自然 / 家族旅行 / ハイキング
    budget: { amount: 52000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-050',
            details:
              '青森市内に9時着、青森ねぶたの家ワ・ラッセで子供向け文化体験。昼に奥入瀬方面へ移動開始。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '青森市内から奥入瀬渓流の道の駅まで、八甲田経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-050',
            details:
              '道の駅奥入瀬でキャンピングカー泊。夕食は地元の蕎麦と岩魚の塩焼き。子供たちは冷たい川の水に大はしゃぎでした🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '次のスポットへ向かう前に周辺で休憩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-050',
            details:
              '青森ベイブリッジ近くのワ・ラッセでねぶた山車を見学。子供たちは光と音に圧倒されてました🚐',
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
            spotKey: 's-050',
            details:
              '奥入瀬渓流の石ヶ戸から雲井の滝までの3kmが家族向けハイライト。遊歩道は基本平坦、紅葉と滝のコラボがどこを切り取っても絵になります🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 16.0, memo: '奥入瀬渓流から十和田湖畔の宿泊エリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-050',
            details:
              '十和田湖畔の休屋でテント泊orペンション泊。湖面に映る紅葉のリフレクションは早朝が最高です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'バス停・駅前まで戻る道のり', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-050',
            details:
              '青森ベイブリッジ近くのワ・ラッセでねぶた山車を見学。子供たちは光と音に圧倒されてました🚐',
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
            spotKey: 's-050',
            details:
              '十和田湖の遊覧船で湖上から紅葉を眺める1時間。下船後は乙女の像で記念撮影。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '十和田湖から青森市内・青森空港まで、八甲田の紅葉を車窓越しに', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-050',
            details:
              '帰路は八甲田山系の紅葉ロードを通って青森空港へ。子連れで東北3日、自然のスケールに満点の旅でした🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同エリアの別の路地を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-050',
            details:
              '青森ベイブリッジ近くのワ・ラッセでねぶた山車を見学。子供たちは光と音に圧倒されてました🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 350,
  },

  // ---- sm-017 立山〜黒部 3日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-017',
    authorKey: 'u-003',
    title: '富山 立山黒部アルペンルートと黒部峡谷 3日間',
    description:
      '夏休みに家族4人で立山黒部を縦断してきました。1日目は立山駅からケーブルカー・バス・トロリーバスを乗り継いで室堂平、雷鳥沢のお花畑をハイキング。2日目に黒部ダムの放水と展望台、3日目に宇奈月温泉から黒部峡谷トロッコ電車で欅平まで。子供たちは乗り物が次々変わるのが楽しいらしく、立山黒部はファミリー向けにも本気でおすすめできます🚐',
    date: '2024-08-13T07:00:00Z',
    createdAt: '2024-09-05T18:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-013', 'tag-020'], // 夏休み / 絶景 / 家族旅行 / ハイキング
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details:
              '立山駅から美女平・室堂平まで乗り換え4回。室堂平で標高2450m、雷鳥沢へ片道40分の散策コースが家族向けにちょうど良い負荷です🏕️',
            imageKeys: ['img-node-s070-1', 'img-node-s070-2'],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 90, distance: 8.0, memo: '室堂から大観峰まで立山トンネルトロリーバス、ロープウェイで黒部平へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-070',
            details:
              '黒部平から黒部湖までケーブルカー。湖畔のロッジで1泊目、子供たちは標高差で耳が痛いと騒いでました。星空はめちゃくちゃきれい🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '同じエリア内で別アングルへ移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-070',
            details:
              '昼食は黒部ダムのダムカレー、緑のグリーンピースと白いライスがダム放水を再現してて子供大喜び🚐',
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
            spotKey: 's-071',
            details:
              '黒部ダムの観光放水は迫力満点。展望台から見下ろすと足がすくむ高さです。レインボーブリッジが見えたら大当たり🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '黒部ダムから扇沢へ抜け、宇奈月温泉まで車で南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-071',
            details:
              '宇奈月温泉で2泊目、温泉でアルペンルートの疲れを抜く。家族風呂付きの宿を選んだので、子連れでも気を遣わずゆっくりできました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '隣接エリアまで歩いて移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-071',
            details:
              '昼食は黒部ダムのダムカレー、緑のグリーンピースと白いライスがダム放水を再現してて子供大喜び🚐',
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
            spotKey: 's-071',
            details:
              '黒部峡谷トロッコ電車で宇奈月から欅平まで往復2時間半。窓のないオープン車両は風と渓谷の音をダイレクトに浴びる、子供大喜びの体験🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '宇奈月から富山市街、富山駅で新幹線に乗り換え帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-071',
            details:
              '富山駅で寿司といかの黒作りをお土産に、北陸新幹線で東京へ。立山黒部3日、家族で標高差1500mを体感する旅でした🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'スポット内で別の見どころへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-071',
            details:
              '昼食は黒部ダムのダムカレー、緑のグリーンピースと白いライスがダム放水を再現してて子供大喜び🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 580,
  },

  // ---- sm-018 道南 函館・洞爺・登別 4日（中堅、テンプレA） ----
  {
    key: 'sm-018',
    authorKey: 'u-003',
    title: '道南ぐるり 函館・洞爺湖・登別温泉の4日間',
    description:
      '北海道の道南は車で繋ぐと家族向けにちょうど良い密度です。1日目に函館で朝市と山頂夜景、2日目は洞爺湖で遊覧船とクマ牧場、3日目に登別温泉で地獄谷と温泉、4日目に新千歳で土産整理して帰路。キャンピングカーじゃなくレンタカーでも回れる、道南の王道4日コース🚐 子供たちが温泉と動物に大満足だった旅でした。',
    date: '2025-05-04T08:00:00Z',
    createdAt: '2025-06-02T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-009', 'tag-013', 'tag-002'], // 温泉 / 夜景 / 家族旅行 / 自然
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details:
              '函館空港着、まず函館朝市で海鮮丼。子供向けにイクラ丼とウニ丼を頼んでシェア、親はビールで朝から贅沢🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 8.0, memo: '函館朝市から五稜郭、その後函館山ロープウェイ駅まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-047',
            details:
              '夜は函館山の夜景。日没30分前にロープウェイで上がるのが鉄則。寒い時期はダウンが必要です✨',
            imageKeys: ['img-node-s047-1', 'img-node-s047-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '休憩を挟んで撮影ポイントを変更', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-047',
            details:
              '夜は函館の老舗居酒屋で塩ラーメンと海鮮居酒屋メニュー。子供たちは海鮮丼の残りで満腹に🚐',
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
            details:
              '函館から洞爺湖まで車で2時間。湖畔の道の駅で休憩しつつ、遊覧船でナカジマまで往復。湖の真ん中から見る有珠山が圧巻🏕️',
            imageKeys: ['img-node-s054-1', 'img-node-s054-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '洞爺湖から登別温泉へ、有珠山ロープウェイ経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '昭和新山くまぼくじょうで子供たちは大はしゃぎ。1時間滞在で十分、登別温泉へ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '近隣のカフェ・売店へ立ち寄り', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-054',
            details:
              '夜は函館の老舗居酒屋で塩ラーメンと海鮮居酒屋メニュー。子供たちは海鮮丼の残りで満腹に🚐',
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
            spotKey: 's-055',
            details:
              '登別温泉の地獄谷を朝散策。蒸気が噴き上がる風景は子供たちにとって異世界体験。トレッキングシューズじゃなくスニーカーで十分です🏕️',
            imageKeys: ['img-node-s055-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '地獄谷遊歩道から大湯沼川天然足湯まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-055',
            details:
              '大湯沼川の天然足湯で足ダレ。川そのものが温泉で、子供たちは足を入れるたび「あつい！」と叫んで楽しい時間でした🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '展望ポイントまで足を延ばす', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-055',
            details:
              '夜は函館の老舗居酒屋で塩ラーメンと海鮮居酒屋メニュー。子供たちは海鮮丼の残りで満腹に🚐',
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
            spotKey: 's-055',
            details:
              '最終日は登別から新千歳空港まで車で1時間。途中のサーモンパークでサケの遡上を観察、子供たちは夏休みの自由研究のネタにしてました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 70, distance: 60.0, memo: '登別から新千歳空港、千歳サーモンパーク経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-055',
            details:
              '新千歳空港でスープカレー専門店ラビットで締めて帰京。道南4日、家族旅としては満点の密度でした🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '駐車場戻りつつ周辺を散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-055',
            details:
              '夜は函館の老舗居酒屋で塩ラーメンと海鮮居酒屋メニュー。子供たちは海鮮丼の残りで満腹に🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 470,
  },

  // ---- sm-019 利尻礼文 5日（人気、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-019',
    authorKey: 'u-003',
    title: '利尻礼文 花の浮島と最北端の5日間 家族旅',
    description:
      '次の夏休み、家族で日本最北の利尻礼文に行く計画を組みました。稚内からフェリーで利尻島へ渡り、利尻富士を仰ぎ見る2泊。3日目に礼文島へフェリー移動、桃岩展望台と8時間ハイキングコース。最終日に稚内に戻って宗谷岬で日本最北端の碑へ。花の浮島と呼ばれる利尻礼文は6月〜8月の限定シーズンしかチャンスがないので、事前計画として投稿しておきます🚐',
    date: '2025-08-04T07:30:00Z',
    createdAt: '2025-06-22T16:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-002', 'tag-013'], // 夏休み / 離島 / 自然 / 家族旅行
    budget: { amount: 138000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-114',
            details:
              '稚内空港から港へ移動、利尻島行きフェリーで2時間。港で利尻富士を初めて見上げる瞬間は子供も親も無言になる迫力🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 100, distance: 55.0, memo: '稚内港から利尻島鴛泊港まで、ハートランドフェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-114',
            details:
              '鴛泊で1泊目、夕食は利尻昆布の出汁が効いたウニ丼。子供たちはウニ初体験、夫婦は地酒で乾杯🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '次のスポットへ向かう前に周辺で休憩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-114',
            details:
              '稚内市内のグルメは宗谷黒牛のステーキ。最果ての牛肉は脂が甘く子供たちも夢中、夫婦は地酒で乾杯🏕️',
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
            spotKey: 's-114',
            details:
              'オタトマリ沼の遊歩道散策、利尻富士のリフレクションが朝のうちに撮れます。子連れで30分の周遊コース🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: 'オタトマリ沼から姫沼、利尻富士の北麓を走る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-114',
            details:
              '午後は姫沼でリフレクション撮影。ハイキングコースは1周2km、子連れでも歩けます。',
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
            spotKey: 's-115',
            details:
              '鴛泊から礼文島香深港へフェリーで45分移動。香深からスコトン岬や桃岩展望台へ、レンタカーで島を一周します。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 45, distance: 22.0, memo: '利尻島鴛泊港から礼文島香深港まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-115',
            details:
              '桃岩展望台のレブンウスユキソウは8月でも見られる年があるそうです。礼文の花の固有種を観察するのが今回の旅のメイン目的🚐',
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
            spotKey: 's-115',
            details:
              '礼文島の8時間ハイキングコースは子連れにはハード過ぎるので、4時間コースに短縮。ゴロタ岬から澄海岬の海岸線が圧巻🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 110, distance: 60.0, memo: '香深港から稚内港へ戻る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-115',
            details:
              '香深港から稚内へ戻り、稚内市内で1泊。夕食は稚内の海鮮居酒屋でホッケと宗谷黒牛、子供たちはタラバ蟹に夢中。',
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
            spotKey: 's-114',
            details:
              '最終日は宗谷岬まで車で1時間、日本最北端の碑で家族写真。樺太の方向を指す案内板を子供たちと眺める時間が忘れがたい🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 30.0, memo: '宗谷岬から稚内空港まで、ノシャップ岬経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-114',
            details:
              '稚内空港へ戻り、最後にノシャップ岬の灯台で利尻富士のシルエットに別れを告げる。最果てを家族で踏める旅は、忘れられない夏休みになりました🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 78,
    targetViews: 1280,
  },

  // ===========================================================================
  // §D. u-004 mio_couple の準手作り 5 本（sm-020 〜 sm-024）
  //
  // 口調: 彼との二人旅・記念日・ご褒美ステイ・写真重視、💕🥂📷
  // 日数内訳: 1日×1 / 2日×3 / 3日×1
  // バンド: 一般 1 / 中堅 4
  // ===========================================================================

  // ---- sm-020 横浜中華街と夜景 1日（一般、テンプレB） ----
  {
    key: 'sm-020',
    authorKey: 'u-004',
    title: '横浜デート1日 中華街とみなとみらいの夜景',
    description:
      '東京から日帰りで彼と横浜デート。ハイライトは3つ。1) 山下公園と中華街でランチコース、2) みなとみらいでカップヌードルミュージアムを子供みたいに楽しむ、3) 夜景は大さん橋から赤レンガ越しに撮るのがいちばん画になる💕 注意点としては中華街のお店は予約必須、当日並ぶと2時間コースなので事前にネットで席を取りましょう📷',
    date: '2025-02-14T11:00:00Z',
    createdAt: '2025-03-01T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-003', 'tag-009'], // カップル / グルメ / 夜景
    budget: { amount: 12500, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-128',
            details:
              '横浜中華街で予約していた老舗のフカヒレコース。彼が紹興酒を頼んでくれて、お昼から贅沢に乾杯🥂 平日でも混むので12時前入店を推奨。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '中華街から山下公園、赤レンガ倉庫経由でみなとみらいへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-015',
            details:
              'みなとみらいで観覧車に乗ってデート気分🎡 高さ112mから東京湾越しのスカイラインが見えて、彼がスマホでひたすら撮っていました📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '観覧車から大さん橋までのウォーターフロントを歩く', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-015',
            details:
              '夜景は大さん橋の屋上から。赤レンガ倉庫越しのみなとみらいのビル群と、左手にベイブリッジが入る構図が一番画になります💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 175,
  },

  // ---- sm-021 鎌倉江ノ島 1泊（中堅、夏、テンプレC） ----
  {
    key: 'sm-021',
    authorKey: 'u-004',
    title: '鎌倉と江ノ島で過ごすふたり旅 1泊2日',
    description:
      '記念日のちょっと手前、お互い忙しい時期に1泊で鎌倉に逃避行してきました。1日目は鎌倉大仏と長谷寺、夕方に江ノ島で夕日を見ながらシラス丼。江ノ島の宿に泊まって、2日目は朝のシーキャンドルと小町通りでお土産。湘南海岸沿いを歩く時間がとにかく癒しでした💕 写真も二人ぶん撮ってもらえる場所が多くて、カップル旅にちょうど良い濃さです📷',
    date: '2025-06-21T10:00:00Z',
    createdAt: '2025-07-08T20:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-016', 'tag-022', 'tag-005'], // カップル / 夏休み / 写真映え / 寺社仏閣
    budget: { amount: 36000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-004',
            details:
              '鎌倉大仏は1230年代から鎮座する露坐の大仏。台座の前で2人並んで撮ってもらうのが定番ですが、横顔から撮るとお寺の雰囲気が伝わって写真が変わります📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '高徳院から長谷寺の参道まで歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-005',
            details:
              '夕方は江ノ島へ移動。江島神社まで参拝してから島の西側へ抜けて、夕日と稚児ヶ淵をフレームに入れる絶景ポイント💕',
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
            spotKey: 's-005',
            details:
              '朝のシーキャンドル展望台で湘南海岸を一望。空気が澄んだ朝なら富士山まで見える日もあります🥂 朝食はテラスでパンケーキ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 10.0, memo: '江ノ電で江ノ島から鎌倉駅、小町通りへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-014',
            details:
              '小町通りで彼と二人並んで食べ歩き。鎌倉プリンと豊島屋の鳩サブレを土産に買って、ふたりで満足の鎌倉旅でした💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 410,
  },

  // ---- sm-022 草津伊香保 群馬温泉ふたり旅 1泊（中堅、夏休み、テンプレB） ----
  {
    key: 'sm-022',
    authorKey: 'u-004',
    title: '草津と伊香保 群馬の名湯ふたり旅 1泊2日',
    description:
      '結論、関東のカップル温泉旅なら草津と伊香保のセットが一番贅沢です。ハイライトは3つ。1) 草津湯畑のライトアップを夜2人で歩く、2) 伊香保の石段街で365段を一緒に登る、3) 露天風呂付き客室でゆっくり💕 注意点としては草津と伊香保は車で1時間半離れているので、片方の街で1泊する構成がベスト。今回は伊香保の石段街沿いの宿に泊まりました🥂',
    date: '2024-08-30T11:00:00Z',
    createdAt: '2024-09-22T17:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-008', 'tag-016'], // カップル / 温泉 / 夏休み
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-012',
            details:
              '草津湯畑は到着して即向かう。湯けむりと硫黄の匂いが強烈で、露天の湯滝を見ながら2人で写真を撮るのがお決まりです📷',
            imageKeys: ['img-node-s012-1', 'img-node-s012-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '湯畑から西の河原公園、白旗の湯まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-012',
            details:
              '湯畑のライトアップは日没後30分から。ベンチで彼と2人並んで湯けむりに包まれる夜は、どんな夜景デートよりロマンチック💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '草津温泉から伊香保温泉へ、夜のうちに移動して翌朝の石段街へ備える', order: 1 },
            ],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-013',
            details:
              '伊香保の石段街365段を朝のうちに登る。石段の中央には伊香保温泉のお湯が流れていて、昔の湯治場の風情が残っています🥂',
            imageKeys: ['img-node-s013-1'],
            transitSteps: [],
          },
          {
            order: 2,
            spotKey: 's-013',
            details:
              '石段街の頂上の伊香保神社で参拝してから、伊香保ロープウェイで見晴展望台へ。彼と2人並んで関東平野を見下ろす時間で旅を締めました💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 420,
  },

  // ---- sm-023 直島と倉敷 1泊（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-023',
    authorKey: 'u-004',
    title: '直島と倉敷 アートと町並みのふたり旅 1泊2日',
    description:
      '彼がアート好きで、ずっと行きたがっていた直島へ夏休みに連れて行ってもらいました🥂 1日目は岡山から船で直島、地中美術館とベネッセハウスの島内アート巡り。夜は倉敷美観地区まで戻って町家ステイで1泊。2日目は美観地区の朝散策と倉紡記念館で大原コレクションを観賞。アートと歴史の濃さでカップル旅にも刺さる、関西発の良コースでした💕',
    date: '2025-07-19T09:00:00Z',
    createdAt: '2025-08-05T18:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-006', 'tag-016', 'tag-001'], // カップル / アート / 夏休み / 歴史
    budget: { amount: 48000, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-087',
            details:
              '直島の宮浦港に降りて即、草間彌生の赤かぼちゃで記念撮影📷 そこからベネッセハウス、地中美術館をバスとレンタサイクルで回るのが王道。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 25, distance: 8.0, memo: '直島宮浦港から宇野港、JRで倉敷駅まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-087',
            details:
              'ベネッセハウスの収蔵品は写真OKエリアと禁止エリアがあるので注意。彼と2人で「これ家に飾りたい」と話す時間がアート旅ならではの贅沢🥂',
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
            spotKey: 's-081',
            details:
              '倉敷美観地区は朝7時前の散策が圧倒的にきれい。観光客がいない白壁の町並みと柳並木、川舟流しの船頭さんしかいない時間帯💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '美観地区から大原美術館、倉敷川沿いを散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-082',
            details:
              '岡山に戻る前に後楽園で岡山三大庭園を堪能。日本三名園の中で一番開放感がある気がします。彼が写真を200枚撮っていたので大満足の旅📷',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 460,
  },

  // ---- sm-024 東京記念日 3日（中堅、テンプレC） ----
  {
    key: 'sm-024',
    authorKey: 'u-004',
    title: '東京記念日3日間 大人のご褒美ステイと夜景',
    description:
      '付き合って5周年の記念に、東京で3日間のご褒美ステイをしてきました📷 1日目は明治神宮で参拝してから皇居前広場で散策、夜は東京駅丸の内駅舎を眺めながらディナー。2日目はお台場でクルーズと観覧車、夜景ディナー。3日目はホテルでゆっくり朝食、東京駅でお土産を買って帰路。普段住んでる街でも、宿泊してデートすると別の景色に見える3日間でした💕',
    date: '2025-01-25T13:00:00Z',
    createdAt: '2025-02-18T17:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-009', 'tag-005'], // カップル / 夜景 / 寺社仏閣
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-078',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-018',
            details:
              '明治神宮の南参道から本殿へ。記念日のお参りで二人並んで二礼二拍手一礼。森の中の参道は東京とは思えない静寂で、デートの始まりにぴったり🥂',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 8.0, memo: '原宿駅から東京駅まで山手線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-020',
            details:
              '東京駅丸の内駅舎は夜のライトアップが圧巻。KITTEのテラスから真正面の構図で2人並んで写真📷 そこからホテルへチェックイン。',
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
            spotKey: 's-021',
            details:
              'お台場でレインボーブリッジを背景にクルーズ船で湾内一周。船上から見る東京タワーとスカイツリーの両方が同時に見える瞬間が好き💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 20, distance: 7.0, memo: 'ゆりかもめでお台場海浜公園からお台場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-021',
            details:
              '夜は大江戸温泉物語跡地のフレンチレストランで記念ディナー。窓越しに見えるレインボーブリッジのライトアップが最高の演出でした🥂',
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
            spotKey: 's-020',
            details:
              '最終日はホテルの朝食をのんびり、東京駅丸の内地下街でお土産。グランスタの限定スイーツを記念日プレゼントに🥂',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '東京駅から皇居外苑、二重橋前まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-020',
            details:
              '帰る前に皇居外苑で2人で散歩、二重橋前で最後の記念写真📷 住んでる街なのに旅行気分を味わえる贅沢な3日間でした💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 350,
  },

  // ===========================================================================
  // §E. u-005 hayato_solo の準手作り 4 本（sm-025 〜 sm-028）
  //
  // 口調: 学生節約・「○○円縛り」「青春18きっぷ」「節約」、💪🎒
  // 日数内訳: 1日×4（学生ソロは日帰り中心）
  // バンド: 中堅 1 / 一般 3
  // ===========================================================================

  // ---- sm-025 青春18 東京〜静岡 1日（中堅、テンプレD Q&A） ----
  {
    key: 'sm-025',
    authorKey: 'u-005',
    title: '青春18きっぷで東京から静岡へ 富士山眺めて日帰り',
    description:
      '「青春18きっぷで日帰り旅行ってどこまで行ける？」って聞かれることが多いので、東京から静岡まで実際に行ってみたログをまとめます。結論、東海道線で熱海乗換、富士川あたりで富士山を車窓から拝んで、清水でちびまる子ちゃんランドと寿司、夕方には東京に戻れます。所要往復8時間、運賃2,410円のうちに静岡を1日で味わう貧乏旅の醍醐味💪',
    date: '2024-09-14T05:30:00Z',
    createdAt: '2024-10-02T22:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011', 'tag-025', 'tag-010'], // ソロ旅 / 弾丸旅行 / 絶景
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-020',
            details:
              '東京駅5時52分発の東海道線小田原行きから旅スタート。熱海で乗換、車窓から富士山が見え始めるのは沼津あたりから🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 180, distance: 145.0, memo: '東京駅から東海道線で熱海乗換、清水駅まで普通列車のみ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-006',
            details:
              '富士川駅で途中下車、ホームから真正面の富士山を1枚📷 18きっぷは途中下車自由なので、こういう寄り道ができるのが醍醐味です💪',
            imageKeys: ['img-node-s006-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 22.0, memo: '富士川駅から清水駅まで普通列車', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-006',
            details:
              '清水で寿司ランチ、河岸の市の回転寿司は1皿130円〜で生マグロが食べられる学生救済のグルメ。夕方の上り電車で東京へ戻って日帰り完結🎒',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 18,
    targetViews: 250,
  },

  // ---- sm-026 東京下町3000円縛り 1日（一般、夏休み、テンプレD） ----
  {
    key: 'sm-026',
    authorKey: 'u-005',
    title: '東京下町を3000円で1日 浅草〜上野〜原宿の節約コース',
    description:
      '「東京観光って金かかるんでしょ？」と地方の友達に言われたので、3000円縛りで1日回ってみせるルートを実証してきました。浅草寺で参拝、仲見世で食べ歩き、上野公園で美術館（無料デー狙い）、最後は明治神宮で締める3000円コース。徒歩と都営バス1日券で交通費は1000円以下、メシは仲見世のメンチカツとあんみつ、ランチは丸亀製麺で400円💪 学生でも東京は楽しめます🎒',
    date: '2025-07-12T09:00:00Z',
    createdAt: '2025-07-30T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-005'], // 夏休み / ソロ旅 / 寺社仏閣
    budget: { amount: 3000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-001',
            details:
              '浅草寺は朝9時に到着、観光客が増える前に雷門と五重塔を撮る。参拝は無料、御朱印は500円なのでパスして節約🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '浅草寺から仲見世通りを抜けて雷門まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-124',
            details:
              '仲見世通りでメンチカツ300円、人形焼き5個400円。観光客向け価格でも分量を考えればコスパは良い方です💪',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 8, distance: 4.0, memo: '銀座線で浅草から上野まで、山手線で上野駅へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-019',
            details:
              '上野公園で東京国立博物館（学生1000円、無料デーなら0円）、外を歩くだけなら無料で蓮池や西郷像も見られます🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 7.0, memo: '上野駅から原宿駅まで山手線', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-018',
            details:
              '締めは明治神宮の南参道、東京の真ん中とは思えない森の中の参道で1日を整えて帰る。3000円コース、無事完走💪',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 130,
  },

  // ---- sm-027 大阪日帰り5000円 1日（一般、夏休み、テンプレD） ----
  {
    key: 'sm-027',
    authorKey: 'u-005',
    title: '大阪日帰り5000円縛り 通天閣・道頓堀・黒門市場',
    description:
      '「ソロ旅で大阪、いくらあれば足りる？」という質問に答えるための実証旅。新幹線抜きで考えれば、大阪市内交通+食費で5000円あれば一日中遊べます。新世界の通天閣の麓で串カツ、道頓堀でたこ焼きと粉もん、夕方に黒門市場で食べ歩きという王道コース。地下鉄1日乗車券800円を活用すれば移動費は心配いらない、節約ソロ旅のテンプレです🎒',
    date: '2025-08-22T10:30:00Z',
    createdAt: '2025-09-14T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-003'], // 夏休み / ソロ旅 / グルメ
    budget: { amount: 5000, currency: JPY },
    thumbnailKey: 'img-thumb-062',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-037',
            details:
              '通天閣は登らず下から見上げるだけで十分。新世界の路地でビリケンさん像と1枚撮って、串カツ屋で1串100円から食べ歩き💪',
            imageKeys: ['img-node-s037-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 5.0, memo: '新今宮から地下鉄で難波、道頓堀へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-030',
            details:
              '道頓堀でたこ焼き500円、お好み焼き800円。グリコの看板の前で記念写真撮ったら、もう大阪行ったって言える🎒',
            imageKeys: ['img-node-s030-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '道頓堀から黒門市場まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-120',
            details:
              '黒門市場でフルーツとカニカマと半額シールの寿司を買い食い、合計5000円縛りで満腹🎒 ソロ大阪は学生でも余裕でいけます💪',
            imageKeys: ['img-node-s120-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 145,
  },

  // ---- sm-028 高知 四万十川 サイクリング 1日（一般、夏休み、テンプレE） ----
  {
    key: 'sm-028',
    authorKey: 'u-005',
    title: '四万十川 沈下橋を自転車で渡る学生ソロ1日プラン',
    description:
      '高知の四万十川を自転車で1日かけて沈下橋3本を渡ってきました。地元のレンタサイクル屋で1日1500円、川沿いのサイクリングロードを20kmほど走って、佐田沈下橋・三里沈下橋・岩間沈下橋をハシゴ。途中の道の駅でかつおの塩タタキを食べて、夕方に中村駅へ戻るソロコース。学生でも体力があれば楽しめる、夏休みの貧乏旅の決定版🎒💪',
    date: '2025-08-19T08:00:00Z',
    createdAt: '2025-09-08T18:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-021', 'tag-002'], // 夏休み / ソロ旅 / サイクリング / 自然
    budget: { amount: 6500, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-079',
            details:
              '中村駅から四万十川沿いを北上、佐田沈下橋に9時着。橋の真ん中でしばらく立ち止まって、川面の透明度を上から眺めるだけで価値ある体験💪',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BIKE, duration: 60, distance: 12.0, memo: '佐田沈下橋から三里沈下橋まで川沿いを走る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-079',
            details:
              '三里沈下橋でランチ休憩。川辺の道の駅で買ったかつおの塩タタキ丼700円が学生救済の旨さ🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BIKE, duration: 50, distance: 10.0, memo: '三里沈下橋から岩間沈下橋へ、川を遡上', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-079',
            details:
              '岩間沈下橋で締め。3本の沈下橋それぞれに違う表情があって、自転車だからこそ味わえる距離感の旅でした💪 中村駅へ戻って高知へ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 95,
  },

  // ===========================================================================
  // §F. u-006 gourmet_aki の準手作り 6 本（sm-029 〜 sm-034）
  //
  // 口調: 食べ歩き専門・「○食目」「ハシゴ」「絶対外せない」、🍜🍣🍢
  // 日数内訳: 1日×4 / 2日×2
  // バンド: 中堅 5 / 一般 1（sm-032 高松うどん）
  // ===========================================================================

  // ---- sm-029 横浜中華街 食い倒れ 1日（中堅、テンプレB） ----
  {
    key: 'sm-029',
    authorKey: 'u-006',
    title: '横浜中華街フルコース 1日5食ハシゴの王道ルート',
    description:
      '結論、横浜中華街は1日5食でようやく中華の幅が見えます。ハイライトは3つ。1) 朝は王府井の生煎包から、2) 昼は萬珍樓の点心10種コース、3) 夜は四五六菜館の名物オムレツで〆🍜 注意点としては各店ボリューム控えめに頼むこと、欲張ると3軒目で死にます。横浜中華街500軒のうち、ミシュラン掲載店から路地裏の老舗まで実食してきたランキング上位5軒を1日でハシゴするコース🍢',
    date: '2025-03-22T10:00:00Z',
    createdAt: '2025-04-15T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-022'], // グルメ / 写真映え
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-063',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-128',
            details:
              '1食目は王府井の生煎包。皮の底のカリッとした焼き目が中華街でもトップクラス。1個220円、これを4個でスタート🍜',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '王府井から萬珍樓本店まで歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-128',
            details:
              '2〜3食目は萬珍樓の点心ランチコース。蒸し点心10種の食べ比べで一気に中華の幅を抑えられる、コスパ最強の昼食🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '萬珍樓から市場通りの謝甜記弐号店まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-128',
            details:
              '4食目は謝甜記弐号店の中華粥。横浜中華街でこの薄さの粥を出す店は希少、午後の胃のリセットに最適🍣',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '謝甜記から四五六菜館まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-128',
            details:
              '5食目は四五六菜館の名物オムレツ卵チャーハン。1日5食のフィナーレ、これで中華街フルコース完走🍜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 380,
  },

  // ---- sm-030 京都錦市場 食べ歩き 1日（中堅、テンプレE 箇条書き） ----
  {
    key: 'sm-030',
    authorKey: 'u-006',
    title: '京都 錦市場フル制覇 1日で京の食材を食べ尽くす',
    description:
      '京都の台所と呼ばれる錦市場、観光地化されたとは言うものの食通の店が今も400m間に密集してます。今回は朝9時から夕方まで、おばんざい・出汁巻き玉子・京漬物・抹茶スイーツを順番に攻めて1日で錦市場の食を全把握。1食目は三木鶏卵のだし巻き玉子、最終食は祇園の鍵善良房のくずきりという贅沢コース🍢 観光ガイドには載らない買い食い動線を共有します🍜',
    date: '2025-04-12T09:00:00Z',
    createdAt: '2025-05-04T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-007'], // グルメ / ショッピング
    budget: { amount: 7000, currency: JPY },
    thumbnailKey: 'img-thumb-064',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-125',
            details:
              '錦市場の東口から入場、1食目は三木鶏卵の出汁巻き玉子300円。京都の出汁文化のスタンダード、ここから食べ比べが始まります🍜',
            imageKeys: ['img-node-s125-1', 'img-node-s125-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: '錦市場の中ほど、井上佃煮店・打田漬物まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details:
              '2〜3食目は井上佃煮のちりめん山椒、打田漬物の千枚漬けを試食。生湯葉と豆乳ドーナツも忘れずに🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '錦市場西端から祇園花見小路の鍵善良房まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '4食目は祇園鍵善良房のくずきり、5食目に祇園小石の黒糖わらび餅で締め。京都の食、1日で軽くは把握できないけれど入口としては満点🍣',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 360,
  },

  // ---- sm-031 神戸 南京町と元町グルメ 1日（中堅、夏休み、テンプレB） ----
  {
    key: 'sm-031',
    authorKey: 'u-006',
    title: '神戸食べ歩き1日 南京町と元町商店街フルコース',
    description:
      '結論、神戸は中華と神戸牛と洋菓子を1日で全部回れる稀有な街です。ハイライトは3つ。1) 南京町の老祥記で豚まん3個（朝のうち）、2) 三宮のステーキランドで神戸牛ランチ、3) 元町のフロインドリーブで老舗洋菓子🍢 注意点としては老祥記とステーキランドは行列必至なので、開店30分前到着が鉄則。夏休み中の混雑時は午前10時前に1食目を済ませるのが正解🍜',
    date: '2024-08-17T09:30:00Z',
    createdAt: '2024-09-08T18:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003'], // 夏休み / グルメ
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-065',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-126',
            details:
              '南京町の老祥記、豚まん3個400円。皮の薄さと餡の旨味が反則。開店11時、開店30分前到着で待ち1巡目を狙う🍜',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '南京町から三宮ステーキランドまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-032',
            details:
              '2食目はステーキランド神戸店の神戸牛ステーキランチ3500円。鉄板焼きで目の前で焼いてくれて、コスパは三宮トップクラス🍢',
            imageKeys: ['img-node-s032-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '三宮から元町商店街のフロインドリーブまで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-032',
            details:
              '3食目はフロインドリーブのミルフィーユとケーニヒスクローネのチーズケーキで洋菓子締め。神戸の食、1日でこの幅を体験できる街は他にないかも🍣',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 410,
  },

  // ---- sm-032 高松うどん巡り 1日（一般、テンプレE） ----
  {
    key: 'sm-032',
    authorKey: 'u-006',
    title: '高松うどん巡り 1日5軒ハシゴで讃岐を制覇',
    description:
      '香川のうどんは1軒ずつ食べてたら一生かかるので、1日5軒のハシゴでベストを決めるツアーをやってきました。1食目はうどんバカ一代の釜バターうどん、2食目は山越うどんの釜玉、3食目は谷川米穀店の冷やかけ、4食目は中村うどん、5食目はこんぴらうどん。全店制覇で合計2500円、讃岐は本当にうどんで生きていける街でした🍜',
    date: '2025-05-10T08:00:00Z',
    createdAt: '2025-05-30T17:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-011'], // グルメ / ソロ旅
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-086',
            details:
              '1食目はうどんバカ一代、朝7時開店の釜バターうどん400円。バターと卵黄と熱々麺の組み合わせが朝食として反則の美味さ🍜',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: '高松市内から綾川町の山越うどんまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-086',
            details:
              '2〜3食目は山越うどんの釜玉と谷川米穀店の冷やかけ。讃岐の名店2連発、1食300円台は反則のコスパです🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 16.0, memo: '谷川米穀店から琴平町、金刀比羅宮の参道へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-086',
            details:
              '4〜5食目はこんぴら参道のうどん店2軒で締め。金刀比羅宮の785段の階段を登る前に食べると胃がきつい、登った後の方がおすすめです🍣',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 165,
  },

  // ---- sm-033 札幌 二条市場と海鮮 1泊（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-033',
    authorKey: 'u-006',
    title: '札幌 二条市場で海鮮三昧と夜のラーメン横丁 1泊2日',
    description:
      '夏休みに札幌へ食い倒れ1泊。1日目は二条市場で海鮮丼、夜は薄野のラーメン横丁で味噌・塩・醤油を3軒ハシゴ。2日目は朝のうちに大通公園を散策してから空港へ。北海道の食は短期間でも反則レベルの満足度なので、グルメ目的なら1泊でも全然元が取れます🍜 1日5食ペースで札幌の食をぎゅっと詰めた濃い旅でした🍢',
    date: '2024-08-23T11:00:00Z',
    createdAt: '2024-09-12T14:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003'], // 夏休み / グルメ
    budget: { amount: 36000, currency: JPY },
    thumbnailKey: 'img-thumb-062',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-121',
            details:
              '1食目は二条市場の海鮮丼、ウニイクラの2色丼2800円。新千歳空港から札幌駅着の足でそのまま市場に直行、入店11時の壁は強い🍣',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '二条市場から大通公園、ススキノのラーメン横丁まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-045',
            details:
              '2〜4食目はススキノのラーメン横丁。すみれの味噌、麺屋彩未の味噌、白樺山荘の塩を1軒ずつハーフサイズで攻める🍜',
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
            spotKey: 's-045',
            details:
              '5食目は朝のスープカレー。大通公園周辺の名店GARAKUは行列必至、開店30分前到着が鉄則です🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 30.0, memo: '札幌駅から快速エアポートで新千歳空港', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-045',
            details:
              '空港の北菓楼でバウムクーヘン、ロイズで生チョコをお土産に。札幌1泊、5食詰めても食べきれない街でした🍣',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 440,
  },

  // ---- sm-034 別府 グルメと温泉 1泊（中堅、テンプレA） ----
  {
    key: 'sm-034',
    authorKey: 'u-006',
    title: '別府 地獄めぐりと温泉グルメの1泊2日',
    description:
      '大分の別府は温泉地のイメージが強いけど、実は地獄蒸し料理と関アジ・関サバの食文化が深い街です。1日目は海地獄から血の池地獄まで地獄めぐり、夜は地獄蒸し工房で野菜と豚肉を蒸して食べる体験型ディナー。2日目は朝風呂のあと由布院金鱗湖まで足を延ばして、湯布院ランチコースで〆🍜 グルメ視点で別府を1泊で堪能するコースです🍢',
    date: '2025-03-29T10:00:00Z',
    createdAt: '2025-04-22T19:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-003'], // 温泉 / グルメ
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-068',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-092',
            details:
              '別府海地獄、青いコバルトブルーの源泉温度98度。地獄蒸しプリンを売店で買って、地獄めぐりの1食目は熱々の温泉卵🍢',
            imageKeys: ['img-node-s092-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '海地獄から血の池地獄、その後鉄輪温泉の地獄蒸し工房まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-092',
            details:
              '夜は鉄輪温泉の地獄蒸し工房で野菜・豚肉・かぼすを蒸籠で蒸して食べる体験型ディナー。素材の旨さがダイレクトに来る、別府ならではの食🍜',
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
            spotKey: 's-093',
            details:
              '2日目は由布院金鱗湖まで車で50分。湖畔の朝霧と紅葉のリフレクションが映える、観光地化されてるけど美しい風景🍣',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '金鱗湖から湯の坪街道のグルメ店へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-093',
            details:
              '湯の坪街道で由布院プリンとコロッケを買い食い、Bスピークのロールケーキでお土産。別府〜由布院、グルメ視点で1泊満足コースでした🍜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 25,
    targetViews: 390,
  },

  // ===========================================================================
  // §G. u-007 island_hopper の準手作り 2 本（sm-035 〜 sm-036）
  //
  // 口調: 島時間・秘境・「フェリーで」、🏝️⛴️
  // 日数内訳: 3日×1 / 5日×1
  // バンド: 中堅 1 / 一般 1（sm-036 例外: createdAt < date）
  // ===========================================================================

  // ---- sm-035 小豆島と直島 アート3日（中堅、テンプレA） ----
  {
    key: 'sm-035',
    authorKey: 'u-007',
    title: '瀬戸内 小豆島と直島 島時間アート3日間',
    description:
      '瀬戸内の島々はそれぞれ違う色を持ってます。今回は岡山発で小豆島と直島を3日でハシゴする島めぐりルートをまとめました。1日目は小豆島でエンジェルロードと寒霞渓、2日目は直島で地中美術館とベネッセハウス、3日目は豊島でアート鑑賞して帰路。フェリーの時刻表をしっかり押さえれば、島時間の濃さを2泊3日でぎっしり詰められる、瀬戸内の入門編としてもおすすめです⛴️',
    date: '2025-04-26T08:00:00Z',
    createdAt: '2025-05-22T17:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-006', 'tag-010'], // 離島 / アート / 絶景
    budget: { amount: 62000, currency: JPY },
    thumbnailKey: 'img-thumb-071',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-080',
            details:
              '高松港から小豆島土庄港までフェリー1時間。エンジェルロードは干潮時のみ現れる砂の道、潮見表をしっかり確認するのが鉄則です🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 60, distance: 35.0, memo: '高松港から小豆島土庄港まで内海フェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-080',
            details:
              '寒霞渓のロープウェイで頂上まで。瀬戸内海と渓谷を一望できる、小豆島で外せない展望スポット⛴️',
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
            spotKey: 's-087',
            details:
              '小豆島から直島へは草壁港経由でフェリー乗継。直島宮浦港の赤かぼちゃで記念写真、定番だけど避けて通れない🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 50, distance: 28.0, memo: '小豆島から直島まで小豆島フェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-087',
            details:
              '地中美術館とベネッセハウスを島内バスで巡る。安藤忠雄建築とモネ・ターレル・ウォルターデマリアの作品、現代アートの聖地⛴️',
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
            spotKey: 's-087',
            details:
              '最終日は直島から豊島へ寄って豊島美術館。半屋外のコンクリート空間に水滴が浮かぶ作品「母型」は一生の体験、必見です🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 30, distance: 12.0, memo: '豊島から犬島経由で岡山宇野港へ戻るフェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-087',
            details:
              '帰路は犬島の精錬所美術館にも寄り道。瀬戸内国際芸術祭のスケールを3島ハシゴで体感した3日間、島時間の濃さに大満足⛴️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 510,
  },

  // ---- sm-036 沖縄離島周遊 5日（一般、夏休み、例外: createdAt < date） ----
  {
    key: 'sm-036',
    authorKey: 'u-007',
    title: '沖縄離島マラソン 石垣・波照間・慶良間の5日間',
    description:
      '次の夏は沖縄の離島3つを5日でハシゴする計画です。石垣島ベースで1日目に川平湾、2日目に波照間島へフェリーで日帰り、3日目に慶良間阿嘉島でシュノーケル、4日目に再度波照間で星空観察、最終日に石垣から那覇経由で帰路。波照間は欠航率高いので2回挑戦の保険込み、慶良間ブルーと石垣の海と波照間の星空、沖縄離島の三本柱を5日で押さえる秘境マラソンです⛴️',
    date: '2025-08-12T07:00:00Z',
    createdAt: '2025-06-28T15:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024', 'tag-010'], // 夏休み / 離島 / 秘境 / 絶景
    budget: { amount: 175000, currency: JPY },
    thumbnailKey: 'img-thumb-072',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-100',
            details:
              '那覇経由で石垣島へ。レンタカーで川平湾までドライブ、グラスボートでサンゴと熱帯魚を観察🏝️ 川平のエメラルドグリーンは何度見ても飽きない海です。',
            imageKeys: ['img-node-s100-1', 'img-node-s100-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 42.0, memo: '川平湾から石垣港、夕食は離島ターミナル近くで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-100',
            details:
              '石垣港で1泊目、ユーグレナモールで八重山そばと島豆腐料理。離島フェリーの欠航情報を翌日のために確認しておく⛴️',
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
            spotKey: 's-102',
            details:
              '石垣港から波照間島へフェリー1時間。日本最南端の有人島、ニシ浜の青さは「ハテルマブルー」の通り別格です🏝️',
            imageKeys: ['img-node-s102-1'],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 70, distance: 50.0, memo: '波照間島から石垣島へ戻る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-102',
            details:
              '波照間で半日滞在、最南端の碑で記念撮影。夕方のフェリーで石垣に戻る、波照間は天気で帰れない日もあるので余裕日を確保するのが鉄則⛴️',
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
            spotKey: 's-112',
            details:
              '石垣から那覇経由で慶良間諸島阿嘉島まで移動。1日かかるけど、慶良間ブルーと呼ばれる海の透明度は本州とは別世界です🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 60, distance: 410.0, memo: '石垣から那覇まで空路', order: 1 },
              { mode: TransitMode.SHIP, duration: 90, distance: 40.0, memo: '泊港から阿嘉島まで高速船', order: 2 },
            ],
          },
          {
            order: 2,
            spotKey: 's-112',
            details:
              '阿嘉島で1泊、シュノーケルで初心者でもサンゴと熱帯魚を観察できる海。観光客が少ない島時間の濃さが慶良間の真骨頂⛴️',
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
            spotKey: 's-102',
            details:
              '阿嘉島から那覇に戻り、再度石垣経由で波照間へ。星空観察ツアー目的、波照間の天文台は南十字星が見える日本でも数少ない場所🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 65, distance: 410.0, memo: '那覇から石垣まで空路、再度フェリーで波照間へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-102',
            details:
              '波照間で2泊目、夜は星空観察。光害ゼロの離島の夜空は、東京暮らしの人間の目には別の宇宙に映る次元の違いがある⛴️',
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
            spotKey: 's-100',
            details:
              '最終日の朝は石垣島の川平湾で最後にもう一度海を浴びる。グラスボートでサンゴと熱帯魚に別れを告げる、離島マラソンの締めくくり🏝️',
            imageKeys: ['img-node-s100-1'],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 220, distance: 1950.0, memo: '石垣空港から那覇経由で羽田まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-100',
            details:
              '石垣空港から那覇経由で羽田へ。フェリーと飛行機を5回乗り継いで沖縄の海と星をぜんぶ浴びた5日間、離島ハマりは加速するばかり⛴️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 175,
  },

  // ===========================================================================
  // §H. u-008 natsu_family の準手作り 5 本（sm-037 〜 sm-041）
  //
  // 口調: 子連れOK・自由研究・「うちの子」「夏休み」、👨‍👩‍👧‍👦🐠
  // 日数内訳: 2日×2 / 3日×1 / 4日×2
  // バンド: 中堅 3 / 一般 2（sm-038, sm-041）
  // ===========================================================================

  // ---- sm-037 鳥羽水族館と伊勢神宮 子連れ1泊（中堅、テンプレA） ----
  {
    key: 'sm-037',
    authorKey: 'u-008',
    title: '鳥羽水族館と伊勢神宮 子連れで行く三重1泊2日',
    description:
      'うちの子たちが「ジュゴン見たい！」と騒いだので、夏休み手前に三重へ1泊2日。1日目は鳥羽水族館で日本で唯一のジュゴンとマナティを観察、2日目は伊勢神宮の内宮を朝の参拝。子連れOK情報としては鳥羽水族館はベビーカーOK、伊勢神宮の内宮は砂利道なので抱っこ紐が安心です👨‍👩‍👧‍👦 自由研究のネタにもなる、関東圏の家族旅にちょうど良いコース🐠',
    date: '2025-06-14T09:00:00Z',
    createdAt: '2025-06-28T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-013', 'tag-014', 'tag-005'], // 家族旅行 / 子連れ / 寺社仏閣
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-069',
            details:
              '鳥羽水族館は朝9時開館と同時に入場、ジュゴンの「セレナ」は午前のうちが活発です。ベビーカー貸出あり、館内バリアフリー◎🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: '鳥羽水族館から伊勢神宮内宮の駐車場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-069',
            details:
              '夕方は鳥羽湾めぐりとイルカ島の遊覧船。子供たちは初めての海上遊覧で大はしゃぎ。鳥羽駅近くのホテルで1泊👨‍👩‍👧‍👦',
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
            details:
              '伊勢神宮内宮は朝6時から参拝可。子連れの場合は早朝7-8時が観光客も少なく、宇治橋を渡る時の空気が清々しいです🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '内宮からおはらい町・おかげ横丁へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-068',
            details:
              'おはらい町とおかげ横丁で赤福と伊勢うどんの朝食。子供向けのお土産屋もたくさんあって、家族連れには優しい街です👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 18,
    targetViews: 290,
  },

  // ---- sm-038 那須高原 子連れ3日（一般、夏休み、テンプレA） ----
  {
    key: 'sm-038',
    authorKey: 'u-008',
    title: '那須高原で過ごす夏休み 子連れ3日間',
    description:
      '夏休み恒例の那須高原3日間。1日目はりんどう湖ファミリー牧場で動物ふれあい、2日目に那須サファリパークと那須温泉、3日目は那須どうぶつ王国でアルパカと触れ合い。標高高めで涼しいので、東京から日帰り圏なのに避暑地気分が味わえる、子連れの夏休みにはやっぱり那須が間違いなしです👨‍👩‍👧‍👦 子供向け施設だけで3日埋まる便利な高原です🐠',
    date: '2024-08-15T09:00:00Z',
    createdAt: '2024-09-02T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014'], // 夏休み / 家族旅行 / 子連れ
    budget: { amount: 55000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-011',
            details:
              'りんどう湖ファミリー牧場で乳搾り体験とジップライン、子供たちは1日中はしゃげるテーマパーク状態。日陰も多くて夏でも安心👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 20, distance: 12.0, memo: 'りんどう湖から那須温泉のホテルまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-011',
            details:
              '夜は那須温泉のファミリープランで露天風呂とビュッフェ。標高1000mで朝晩は涼しく、夏でも長袖が必要🐠',
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
            details:
              '那須サファリパークで車内からライオンとトラを観察。窓ガラス越しに虎が真横に来る瞬間、子供たちは絶叫してました👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 15.0, memo: 'サファリパークから那須温泉ファミリーランド経由でホテルへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-011',
            details:
              '夜は那須温泉のホテルで露天風呂と花火大会。子供たち夏休みのハイライトポイントを次々消化していく🐠',
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
            details:
              '最終日は那須どうぶつ王国でアルパカ・カピバラ・ペンギンとふれあい。半日で園内を一周できます👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '那須どうぶつ王国から那須塩原駅、新幹線で帰京', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-011',
            details:
              '那須塩原駅でチーズケーキ工房MANIWA FARMの土産を仕入れて新幹線で帰路。3日間、那須だけで子供たちが大満足できる優秀な高原リゾートでした🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 155,
  },

  // ---- sm-039 USJと大阪城 子連れ4日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-039',
    authorKey: 'u-008',
    title: 'USJと大阪城 夏休み子連れ大阪4日間',
    description:
      '夏休みに小学生2人を連れて大阪へ4日間。1〜2日目はUSJで丸2日かけてマリオエリアとハリポタ、3日目は大阪城公園と歴史博物館で子供の自由研究、4日目は道頓堀でたこ焼きと食い倒れ。USJは2日チケットがコスパ最強、子供たちは大満足で4日でも足りないくらいでした👨‍👩‍👧‍👦 夏休みの大阪は日陰と水分対策必須です🐠',
    date: '2024-08-09T08:30:00Z',
    createdAt: '2024-08-28T17:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-001'], // 夏休み / 家族旅行 / 子連れ / 歴史
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-080',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-031',
            details:
              'USJ初日はマリオエリア。スーパーマリオワールドのキノコ王国は子供大興奮、パワーアップバンドを4本買って家族で挑戦👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'マリオエリアからミニオンパーク、ジュラシックパークへ移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-031',
            details:
              '午後はミニオンパークとジュラシックパークのフライング・ダイナソー。エクスプレスパス活用で待ち時間半分以下、子連れは必須投資です🐠',
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
            spotKey: 's-031',
            details:
              'USJ2日目はハリーポッターエリア。ホグワーツ城の中まで入ってフォービドゥンジャーニー、子供たちはバタービール片手にホグズミード村でお買い物👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: 'ハリポタエリアからミニオンライド再訪、ニューヨークエリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-031',
            details:
              'ミニオンライド再挑戦と夜のショー鑑賞。閉園時間まで遊んで子供たちは爆睡で帰宅、宿に着く頃には1人寝落ち🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 20, distance: 8.0, memo: 'USJからユニバーサルシティ駅、翌朝大阪城へ', order: 1 },
            ],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-036',
            details:
              '大阪城公園は朝のうちに天守閣登頂。子供の歴史自由研究のネタとして秀吉と石垣の話を解説しながら回ると教育的👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '大阪城から大阪歴史博物館', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-036',
            details:
              '大阪歴史博物館で実物大の難波宮復元。子供たちは古代の建物に興味津々で、自由研究の材料が揃った🐠',
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
            spotKey: 's-030',
            details:
              '最終日は道頓堀でたこ焼きとお好み焼き、グリコの看板で記念撮影📷',
            imageKeys: ['img-node-s030-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '道頓堀から黒門市場経由で新幹線新大阪駅へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-120',
            details:
              '黒門市場で551蓬莱の豚まんと果物を買って新大阪駅から帰京。家族で大阪4日、子供たちの夏休み一番の思い出になりました👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s120-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 510,
  },

  // ---- sm-040 軽井沢おもちゃと諏訪湖 子連れ4日（中堅、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-040',
    authorKey: 'u-008',
    title: '軽井沢おもちゃ王国と諏訪湖 子連れ4日間',
    description:
      'お盆前の家族旅行、軽井沢と諏訪湖を4日でつなげるルートをまとめました。1日目は軽井沢のアウトレットで子供服を更新、2日目は軽井沢おもちゃ王国でアスレチック、3日目は諏訪湖の遊覧船と諏訪大社、4日目は北八ヶ岳ロープウェイで坪庭散策。子連れ4日、移動距離は短めで体力配分しやすい構成です👨‍👩‍👧‍👦 自由研究のネタにもなる、夏休みの定番ルート🐠',
    date: '2024-08-04T08:00:00Z',
    createdAt: '2024-06-22T19:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-002'], // 夏休み / 家族旅行 / 子連れ / 自然
    budget: { amount: 105000, currency: JPY },
    thumbnailKey: 'img-thumb-069',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '軽井沢駅で子供たちのお小遣いをアウトレットで使い切る。プリンスショッピングプラザはベビーカーOK、フードコートで休憩しやすい👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s008-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 15.0, memo: 'アウトレットから旧軽井沢銀座、ホテルチェックイン', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '旧軽井沢銀座で散策と夕食。涼しい高原の夜、子供たちは初めての軽井沢で大はしゃぎでした🐠',
            imageKeys: ['img-node-s008-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '軽井沢おもちゃ王国でアスレチックと水遊び場。1日中遊べて、夏でも標高高めで涼しい子連れの聖地です👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: 'おもちゃ王国から白糸の滝、軽井沢のホテルへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '夕方は白糸の滝で涼を取って、軽井沢のホテルへ戻る。子供たちは滝のしぶきに大はしゃぎでした🐠',
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
            spotKey: 's-023',
            details:
              '諏訪湖の遊覧船で湖上1周40分。船上から夏の山々が見えて、子供たちは魚に手を振ってました🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '諏訪湖から諏訪大社上社本宮、北八ヶ岳ロープウェイ方面へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-023',
            details:
              '諏訪大社で参拝、御柱祭の説明を子供にすると目を輝かせます。夜は諏訪湖の花火大会のミニ版を見て寝る👨‍👩‍👧‍👦',
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
            spotKey: 's-023',
            details:
              '最終日は北八ヶ岳ロープウェイで坪庭散策。標高2237mの高山植物群落は子供の自由研究の素材に最適👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '北八ヶ岳ロープウェイから諏訪IC、中央道で東京方面', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-023',
            details:
              '帰路は諏訪SAでお土産整理、八ヶ岳の伏流水と地元のジャムをまとめ買い。4日間の家族旅を締めて帰宅🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 380,
  },

  // ---- sm-041 山中湖と河口湖 子連れ1泊（一般、夏休み、テンプレA） ----
  {
    key: 'sm-041',
    authorKey: 'u-008',
    title: '富士五湖 山中湖と河口湖の子連れ1泊2日',
    description:
      '夏休みのウィークエンドに家族で富士五湖へ1泊。1日目は山中湖で白鳥型遊覧船と花の都公園、2日目は河口湖で大石公園と富士急ハイランドのトーマスランド。富士山がどの場所からでも近く見える贅沢、子供たちは「お山が大きい！」と大はしゃぎ。子連れの夏休みウィークエンドにはちょうど良い密度です👨‍👩‍👧‍👦🐠',
    date: '2025-07-19T09:00:00Z',
    createdAt: '2025-08-04T20:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-010'], // 夏休み / 家族旅行 / 子連れ / 絶景
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-006',
            details:
              '山中湖白鳥の湖号で湖上クルーズ40分。富士山を真正面に見ながら、白鳥のペダルボートが湖面に並ぶ夏の風景は子供たち大喜び👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s006-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: '山中湖から河口湖へ、湖畔のホテルへチェックイン', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-006',
            details:
              '夕方は山中湖花の都公園で向日葵畑。富士山を背景にひまわりとセットで撮れる絶景ポイントです🐠',
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
            details:
              '河口湖大石公園で湖越しの富士山と季節の花畑。子連れでも疲れない散策コース、ベビーカーOK👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s007-1', 'img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '大石公園から富士急ハイランドのトーマスランドへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '富士急ハイランドのトーマスランドで子連れ向けアトラクション。絶叫系は大人だけで、子供たちはきかんしゃトーマス系を満喫🐠',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 170,
  },

  // ===========================================================================
  // §I. u-009 photo_yuki の準手作り 6 本（sm-042 〜 sm-047）
  //
  // 口調: 風景写真家・「マジックアワー」「光が」「画になる」、📸✨
  // 日数内訳: 1日×1 / 2日×4 / 3日×1
  // バンド: 中堅 4 / 一般 2（sm-042, sm-046）
  // ===========================================================================

  // ---- sm-042 江ノ島 夕日の1日（一般、テンプレE） ----
  {
    key: 'sm-042',
    authorKey: 'u-009',
    title: '江ノ島シーキャンドル 夕日のマジックアワーを撮る1日',
    description:
      '東京から日帰りで江ノ島の夕日を撮りに行ってきました。江ノ電で江ノ島駅、徒歩で弁天橋を渡って島内へ。シーキャンドル展望台からの夕日と、稚児ヶ淵の岩礁に落ちる西日の組み合わせが今日のターゲット📸 マジックアワーの15分間で構図を3パターン押さえる集中勝負、写真好きには江ノ島の夕方は外せない時間帯です✨',
    date: '2025-03-15T13:00:00Z',
    createdAt: '2025-03-30T22:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-011'], // 写真映え / 絶景 / ソロ旅
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-017',
            details:
              '江ノ電江ノ島駅から弁天橋まで徒歩15分、橋の上から見る江ノ島の島影が画になる定番アングル📸 軽い望遠レンズが活きる距離感です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.0, memo: '弁天橋から江島神社経由でシーキャンドル展望台まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-005',
            details:
              'シーキャンドル展望台からの夕日。日没15分前に到着、富士山のシルエットを画面右に入れて湘南海岸を斜めに切る構図が画になる✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: 'シーキャンドルから稚児ヶ淵まで階段を下る', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-005',
            details:
              '稚児ヶ淵の岩礁に落ちる夕日と波しぶきを長秒露光。三脚必須、ND8フィルターで波の流れを2秒露光すると一発で画になる写真が撮れます📸',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 135,
  },

  // ---- sm-043 蔵王御釜 朝景1泊（中堅、紅葉、テンプレE） ----
  {
    key: 'sm-043',
    authorKey: 'u-009',
    title: '蔵王御釜と銀山温泉 紅葉の1泊2日フォトトリップ',
    description:
      '東北の紅葉ピークに合わせて、蔵王御釜と銀山温泉を1泊で撮影してきました。1日目は朝の蔵王御釜、エメラルドグリーンの火口湖と紅葉のコントラスト📸 2日目は早朝の銀山温泉、ガス灯が点る木造の温泉街を5時台の青い時間で押さえる。1泊で東北の山と温泉街、両方の表情を持ち帰れる写真旅でした✨',
    date: '2024-10-13T05:00:00Z',
    createdAt: '2024-11-04T15:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-022', 'tag-010', 'tag-008'], // 紅葉 / 写真映え / 絶景 / 温泉
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-059',
            details:
              '蔵王御釜は朝7時着、火口湖のエメラルドグリーンと斜面の紅葉のコントラストを広角で1枚📸 ガスが出やすいので朝早い方が見える確率が高い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '蔵王御釜から銀山温泉まで車移動、宿は石段沿いの木造旅館', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-051',
            details:
              '銀山温泉に夕方着。チェックインしてから橋の上で温泉街の俯瞰構図を仕込んでおく。ガス灯点灯は18時前後、青い時間との重ね撮りが翌朝の本番✨',
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
            spotKey: 's-051',
            details:
              '銀山温泉の青い時間は朝5時から30分。ガス灯と木造旅館とまだ暗い空のコントラスト、三脚必須、絞りF8、ISO400で長秒露光が定番📸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '銀山温泉街から白銀の滝、温泉街の終端まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-051',
            details:
              '温泉街の奥にある白銀の滝で水の流れを2秒露光。冬の凍りつく前の瞬間を撮るのが、東北のフォトトリップらしい締めの1枚✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 510,
  },

  // ---- sm-044 白川郷ライトアップ 1泊（中堅、テンプレE） ----
  {
    key: 'sm-044',
    authorKey: 'u-009',
    title: '白川郷の冬ライトアップと飛騨高山 1泊2日フォトトリップ',
    description:
      '冬の白川郷ライトアップは1年で数日しか開催されない伝統行事です。今年は予約抽選を勝ち取って、合掌造りの集落が夕方から雪と光で別世界になる瞬間を撮影してきました📸 翌日は朝の飛騨高山で古い町並と朝市を撮影。冬の中部、限定タイミングを狙う写真旅の正攻法を共有します✨',
    date: '2025-01-25T14:00:00Z',
    createdAt: '2025-02-12T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-001'], // 写真映え / 絶景 / 歴史
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-070',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-062',
            details:
              '白川郷ライトアップは17:30〜19:30の2時間限定。展望台の城山天守閣展望台はシャトルバスで10分、雪と光の合掌造り集落の俯瞰は一生ものの画📸',
            imageKeys: ['img-node-s062-1', 'img-node-s062-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '白川郷から飛騨高山の宿まで国道156号', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-062',
            details:
              '夜の白川郷を撮り終えて高山に移動、町家の宿で1泊。翌朝の高山陣屋朝市に備えて早寝✨',
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
            spotKey: 's-063',
            details:
              '飛騨高山の古い町並、朝7時の凛とした空気を切り取る。雪が残る町家の屋根と朝日の組み合わせは冬限定のマジックアワー📸',
            imageKeys: ['img-node-s063-1', 'img-node-s063-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '上三之町から宮川朝市・高山陣屋まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-063',
            details:
              '宮川朝市の出店ごしに古い町並みを撮影。地元のおばちゃんと町家のシルエットが同フレームに収まる構図は朝の20分しか撮れません✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 580,
  },

  // ---- sm-045 函館夜景 1泊（中堅、テンプレE） ----
  {
    key: 'sm-045',
    authorKey: 'u-009',
    title: '函館山と小樽運河 北海道の夜景フォトトリップ1泊2日',
    description:
      '世界三大夜景と呼ばれる函館山の夜景を撮りに、北海道へ1泊で。1日目は函館山ロープウェイで日没後の青い時間を狙う、2日目は朝のうちに小樽運河へ移動して石造倉庫と運河の朝霧。北海道の夜と朝、両方の表情を1泊で押さえる写真旅。三脚と広角ズーム、防寒対策が必須装備です📸 冬の北海道は空気が澄んで写真の解像感が桁違い✨',
    date: '2025-02-08T15:00:00Z',
    createdAt: '2025-02-26T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-009', 'tag-010'], // 写真映え / 夜景 / 絶景
    budget: { amount: 36000, currency: JPY },
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-047',
            details:
              '函館山ロープウェイで山頂、日没30分前に着いて三脚を設置。青い時間（日没後20分）が空のグラデーションと街灯のオレンジが最高に映える瞬間📸',
            imageKeys: ['img-node-s047-1', 'img-node-s047-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 180, distance: 280.0, memo: '函館から札幌経由で小樽運河沿いの宿まで夜間移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-047',
            details:
              '夜の函館を撮り終えて、小樽方面へ深夜移動。翌朝の小樽運河に備えて宿入り✨',
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
            details:
              '小樽運河は朝6時の朝霧が画になる時間帯。石造倉庫の壁とガス灯、運河の水面が青い時間に同時に写る20分が勝負📸 三脚必須、F11で2秒露光が基本。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '運河沿いから堺町通り、北一硝子館の街並みへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-049',
            details:
              '堺町通りの北一硝子館前で、レトロな街並みと観光客のいない朝7時の空気感を切り取る。1泊2日で函館と小樽、両方の青い時間を持ち帰る写真旅は満点✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 540,
  },

  // ---- sm-046 尾道千光寺 夕日1泊（一般、テンプレE） ----
  {
    key: 'sm-046',
    authorKey: 'u-009',
    title: '尾道 千光寺の夕日と坂道猫を撮る1泊2日',
    description:
      '尾道は写真家にとって聖地のような町です。1日目は千光寺の展望台で夕日と瀬戸内海を撮影、2日目は朝の坂道で猫と石畳と古い民家。映画ロケ地としても有名な尾道らしい構図を、夕方と朝の2回の光で切り取ります📸 写真好きの友達に勧めたい、瀬戸内の山と海と坂の町。1泊で十分撮影し甲斐があります✨',
    date: '2024-09-28T13:00:00Z',
    createdAt: '2024-10-22T18:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-011'], // 写真映え / 絶景 / ソロ旅
    budget: { amount: 22000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-083',
            details:
              '千光寺ロープウェイで山頂、夕日と瀬戸内海と尾道水道を一画面に収める広角構図📸 18時頃の日没前30分が金色光のピークです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '千光寺山から坂道を下って文学のこみち、宿のある旧市街へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-083',
            details:
              '夕方の坂道は猫密度が高い時間帯。坂と石段と猫を1フレームに入れる、尾道らしい1枚を狙う✨',
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
            details:
              '朝6時の千光寺道は観光客ゼロ、坂と古民家と海の3点セットを朝光で押さえる。50mmレンズが画角的に正解📸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '千光寺道から尾道商店街、しまなみ海道入口の駅前へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-083',
            details:
              '尾道商店街でラーメンと焼きたてパン屋。朝8時のベッチャー寺院前で観光客と地元客の境目を1枚撮って、瀬戸内の写真旅を締める✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 175,
  },

  // ---- sm-047 宮古島 朝景3日（中堅、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-047',
    authorKey: 'u-009',
    title: '宮古島 朝のマジックアワーを撮る3日間 フォトトリップ',
    description:
      '次の夏は宮古島で朝景中心の3日間を計画してます。1日目は到着後に与那覇前浜ビーチの夕景、2日目は朝5時から伊良部大橋の朝景、3日目は古宇利大橋経由で那覇に戻る前に再度前浜ビーチで朝景。宮古ブルーと呼ばれる海の色を、朝のマジックアワーと夕方の両方で切り取る予定📸 写真旅の事前計画として今投稿しておきます✨',
    date: '2025-07-30T05:00:00Z',
    createdAt: '2025-06-05T19:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-010', 'tag-023'], // 夏休み / 写真映え / 絶景 / 離島
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-073',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-101',
            details:
              '与那覇前浜ビーチに到着後、夕方の海を撮影。宮古ブルーの海と白砂と夕日の組み合わせは、広角レンズで縦構図が個人的ベスト📸',
            imageKeys: ['img-node-s101-1', 'img-node-s101-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 12.0, memo: '与那覇前浜から東平安名崎の灯台まで南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-101',
            details:
              '島の最東端、東平安名崎の灯台で日没後の青い時間を撮る。崖と灯台と紫の空のコントラスト、宮古ならではの構図✨',
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
            spotKey: 's-101',
            details:
              '伊良部大橋を朝5時から撮影。夜明け前の青い時間に橋と海面の対比、5:30前後のマジックアワーで橋が金色になる瞬間が真の本番✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '伊良部大橋から池間大橋経由で島の北岸を回る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-101',
            details:
              '池間大橋とその先の池間島も寄り道、夕方は再度与那覇前浜で夕景。1日で同じ海を朝・夕方両方で撮ると、海の表情の幅が分かる📸',
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
            spotKey: 's-099',
            details:
              '最終日は宮古島から那覇経由で本島へ移動して古宇利大橋。沖縄の3つの橋（伊良部・池間・古宇利）を3日間で撮り比べる📸',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 6.0, memo: '古宇利大橋から島内のティーヌ浜・ハートロックへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-099',
            details:
              '古宇利島のティーヌ浜・ハートロックで波と岩のコントラスト撮影。3日間で沖縄の海の表情をぜんぶ持ち帰る、写真家にとっては夢のような旅✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 42,
    targetViews: 680,
  },

  // ===========================================================================
  // §J. u-010 newbie_haru の準手作り 1 本（sm-048）
  //
  // 口調: 初心者・「はじめて」「ドキドキ」、控えめ
  // 日数: 1日 / バンド: 一般
  // ===========================================================================

  // ---- sm-048 はじめての箱根 日帰り（一般、テンプレD） ----
  {
    key: 'sm-048',
    authorKey: 'u-010',
    title: 'はじめての箱根 日帰りで温泉と富士山を見てきた',
    description:
      '旅行初心者の私が、はじめて1人で箱根に日帰り旅行してきました！「箱根って色々ありすぎてどこから行けばいい？」と迷う初心者向けに、自分が実際にやった大涌谷→芦ノ湖→河口湖（ちょっと延長）の流れを共有します。新宿からロマンスカーで90分、箱根登山鉄道とロープウェイを乗り継いで大涌谷の黒たまご、芦ノ湖の遊覧船。温泉に入る時間まではなかったけど、初心者でも1日で箱根を体感できました。',
    date: '2025-04-19T08:30:00Z',
    createdAt: '2025-05-02T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-010', 'tag-011'], // 温泉 / 絶景 / ソロ旅
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-069',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-016',
            details:
              '箱根ロープウェイで大涌谷に到着、噴煙を間近で見るのは初めてでドキドキでした。名物の黒たまご、6個入り500円は1人で食べきれず半分は持ち帰り。',
            imageKeys: ['img-node-s016-1', 'img-node-s016-2'],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 35, distance: 6.0, memo: '大涌谷からロープウェイで桃源台、芦ノ湖の遊覧船乗り場へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '芦ノ湖から河口湖まで足を延ばしてみたら、大石公園で富士山と湖が並ぶ景色。初めての旅で1日にこれだけ詰めるのは欲張りすぎたかも、でも大満足の1日でした。',
            imageKeys: ['img-node-s007-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 4,
    targetViews: 85,
  },

  // ===========================================================================
  // §K. u-013 longbio_chan の準手作り 2 本（sm-049 〜 sm-050）
  //
  // 口調: OL目線・喫茶店/銭湯/路地裏好き・絵文字多め🐈
  // 日数: 2日 / 3日 / バンド: 一般 / 中堅
  // ===========================================================================

  // ---- sm-049 飛騨高山 古い町並と銭湯 1泊（一般、テンプレC） ----
  {
    key: 'sm-049',
    authorKey: 'u-013',
    title: '飛騨高山の古い町並と銭湯と喫茶店の1泊2日',
    description:
      'みなさんも知ってると思うけど、私は古い銭湯と昔ながらの喫茶店が大好物🐈 今回は飛騨高山に1泊して、観光地化されすぎてない朝市と路地裏の銭湯と老舗喫茶店を巡るマニアックな旅をしてきました。1日目は夕方着で陣屋朝市の前夜祭、2日目は早朝の上三之町散策と老舗喫茶バグパイプでモーニング、最後にひだ千光寺の大樹を見て帰路。普通の観光ガイドには載らない高山の生活感、正直最高でした✨',
    date: '2024-11-30T14:00:00Z',
    createdAt: '2024-12-22T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-004', 'tag-011'], // 歴史 / カフェ / ソロ旅
    budget: null,
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-063',
            details:
              '高山駅着、宿に荷物を預けてすぐ古い町並へ。上三之町の夕暮れの提灯と古民家のシルエットが想像以上に画になる時間帯でした✨ 観光客がはけた17時過ぎが穴場🐈',
            imageKeys: ['img-node-s063-1', 'img-node-s063-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '上三之町から飛騨高山温泉の銭湯まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-063',
            details:
              '高山温泉の老舗銭湯で1風呂浴びる。観光客はほぼいない地元民の銭湯、こういう場所こそ街の生活が見えて好物✨ 夕食は地元の蕎麦屋で日本酒1合と冷やかけ。',
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
            spotKey: 's-063',
            details:
              '朝6時に陣屋朝市へ。地元のおばちゃんが朝採れ野菜を並べる時間帯、観光客は誰もいなくて、買い物かごを持って混じる時間が至福🐈',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '陣屋朝市から喫茶バグパイプ、上三之町経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-063',
            details:
              '老舗喫茶バグパイプでモーニング。ナポリタンとブレンドコーヒー、新聞を広げて2時間粘れる空気感がたまらないんです✨ こういう旅、一生やめられない🐈',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 115,
  },

  // ---- sm-050 函館の喫茶店と銭湯巡り 3日（中堅、テンプレC 時系列） ----
  {
    key: 'sm-050',
    authorKey: 'u-013',
    title: '函館の喫茶店と銭湯と路地裏 3日間ぐるぐる旅',
    description:
      '今年の私のテーマは「観光地化されてない街角」🐈 函館は朝市と夜景で有名だけど、本当は西部地区の元町〜十字街の坂と路地裏、地元の銭湯と昭和の喫茶店こそが函館の真骨頂だと思っています。今回は3日かけて、有名観光地はサクッと済ませて、残りの時間は路地裏散歩と銭湯と純喫茶でじっくり。観光客が見ないもう一つの函館を、3日間でぐるぐる味わってきました✨',
    date: '2024-09-21T10:00:00Z',
    createdAt: '2024-10-18T22:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-004', 'tag-009', 'tag-011', 'tag-001'], // カフェ / 夜景 / ソロ旅 / 歴史
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-122',
            details:
              '羽田から函館空港、まず朝市で海鮮丼を朝食代わりに🐈 観光客が一番集まる時間帯だけど、ウニとイクラの2色丼は外せない、観光地は観光地で楽しむ派です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: '函館朝市から市電で十字街、元町散策の起点へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-049',
            details:
              '小樽運河ではなく函館の旧函館区公会堂周辺の坂道を散策。八幡坂・基坂・大三坂、それぞれ違う表情の坂が連なる西部地区が私の本命✨',
            imageKeys: [],
            transitSteps: [],
          },
          {
            order: 3,
            spotKey: 's-122',
            details:
              '夜は十字街の昭和な居酒屋で1人飲み。地元客と話しながら、明日の銭湯候補を教えてもらいました🐈',
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
            details:
              '朝は元町の純喫茶ピーベリーへ。木製カウンターと焙煎機の匂い、ブレンド600円とサンドイッチで2時間粘る、これぞ私のスタイルの朝✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: 'ピーベリーから函館山ロープウェイ駅、夕方の夜景に備える', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-047',
            details:
              '日没前に函館山に登って夜景。観光客の波の中でも、青い時間（日没後20分）の表情は何度見てもため息が出る🐈',
            imageKeys: ['img-node-s047-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-049',
            details:
              '最終日は朝風呂で大正湯。100年続く銭湯の青いタイルとレトロな番台が、観光地化されてない函館の生活感そのもの。これがあるから旅をやめられない🐈',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '大正湯から喫茶レイモンハウス、函館空港行きシャトルバス停まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-122',
            details:
              '空港行きの前に喫茶レイモンハウスでハムサンドとコーヒー。3日間の函館は、観光地と路地裏のバランスが私の理想形でした✨ また絶対来ます🐈',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 14,
    targetViews: 245,
  },

];

// ============================================================================
// 准手作りルート 後半 50 本（sm-051 〜 sm-100）
//
// 仕様書 docs/seed-spec.md §7.3 / §7.5 / §7.6 / §13.1 に準拠。
// sm-098〜sm-100 は visibility: 'PRIVATE'（u-012 専用枠、メモ口調・絵文字なし）。
//
// 著者配分:
//   u-001 たびまる         7本 (sm-051〜sm-057) — 47都道府県シリーズ続き
//   u-002 sakura_trip     6本 (sm-058〜sm-063) — 関西・京都中心
//   u-003 kenji_outdoor   5本 (sm-064〜sm-068) — 北海道・自然・ファミリー
//   u-004 mio_couple      5本 (sm-069〜sm-073) — カップル温泉・記念日
//   u-005 hayato_solo     4本 (sm-074〜sm-077) — 学生節約・18きっぷ
//   u-006 gourmet_aki     6本 (sm-078〜sm-083) — グルメハシゴ
//   u-007 island_hopper   3本 (sm-084〜sm-086) — 隠岐・徳之島・小笠原
//   u-008 natsu_family    5本 (sm-087〜sm-091) — 子連れ夏休み
//   u-009 photo_yuki      6本 (sm-092〜sm-097) — 写真旅・マジックアワー
//   u-012 private_only    3本 (sm-098〜sm-100) — すべて PRIVATE
//
// 日数分布: 1日 15本 / 2日 18本 / 3日 11本 / 4日 4本 / 5日以上 2本
//
// バンド配分:
//   バズ 1（sm-051 福井編 たびまる）
//   人気 2（sm-071 軽井沢万平 mio / sm-093 阿蘇朝霧紅葉 yuki）
//   中堅 約 23 / 一般 約 21
//   PRIVATE 3（sm-098-100 u-012、いいね・閲覧 0）
//
// 夏休みタグ（tag-016）: 約 21 本（=42%）。date は 7-8 月に集中。
//
// createdAt と date のズレ（§7.6）の例外（事前計画）:
//   sm-067 富士キャンプ / sm-088 旭山動物園 / sm-096 沖縄朝景

const PRIVATE_VIS = RouteVisibility.PRIVATE;

export const semiRoutesSecondHalf: SeedRoute[] = [
  // ===========================================================================
  // §A. u-001 たびまる の準手作り 7 本（sm-051 〜 sm-057）
  //
  // 47都道府県シリーズ後半。前半（sm-001〜sm-008）と被らないエリアを中心に、
  // 福井・岡山・香川・鹿児島・三重・四国・沖縄を 7 本でカバー。
  // 口調は「保存版」「黄金ルート」「断言します」🚄✈️📌
  // 日数内訳: 1日×2 / 2日×2 / 3日×2 / 4日×1
  // バンド: バズ 1（sm-051 福井） / 中堅 5 / 一般 1（sm-057 沖縄リピート）
  // ===========================================================================

  // ---- sm-051 福井 1日（バズ、夏休み、テンプレB 結論先行） ----
  {
    key: 'sm-051',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 福井 永平寺と東尋坊で禅と絶景の1日',
    description:
      '47都道府県制覇シリーズも残り5県、今回は福井編📌 永平寺で道元禅師の禅の世界に触れて、午後は東尋坊で日本海の柱状節理を浴びる1日コース。北陸新幹線敦賀延伸で福井が一気に身近になりました🚄 結論、本気で福井を味わうなら永平寺で朝の坐禅、東尋坊で夕日、これが黄金ルート。断言します、日帰りでも禅と海の二本柱で福井のエッセンスは押さえられます。北陸新幹線開業後の保存版ルート📌',
    date: '2025-08-09T08:00:00Z',
    createdAt: '2025-08-26T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-005', 'tag-010', 'tag-001'], // 夏休み / 寺社仏閣 / 絶景 / 歴史
    budget: { amount: 13500, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-072',
            details:
              '永平寺は朝8時着、参道の杉並木と苔の石畳を抜けて山門へ。承陽殿で道元禅師に手を合わせ、坐禅体験は事前予約で30分1500円📌 修行僧の作法を間近で見られるのは永平寺ならではです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 65.0, memo: '永平寺から東尋坊までレンタカーで北陸自動車道経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-073',
            details:
              '東尋坊は柱状節理の絶壁が約1km続く日本海の絶景。遊覧船で海から見上げる構図がスケール感倍増、片道1500円🚄 観光協会の案内所で潮位を確認しておくと安全圏が分かります。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '東尋坊メイン断崖から東尋坊タワー展望台まで遊歩道', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-073',
            details:
              '夕方は東尋坊タワー展望台へ。海抜100mから日本海に沈む夕日と断崖を一画面に収める、福井の保存版ショット📌 北陸新幹線で東京から日帰りが現実的になりました🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 320,
    targetViews: 5800,
  },

  // ---- sm-052 岡山 2日（中堅、夏休み、テンプレA 旅日記） ----
  {
    key: 'sm-052',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 岡山 倉敷美観地区と後楽園 1泊2日',
    description:
      '47都道府県シリーズ岡山編📌 倉敷美観地区の白壁と柳並木、日本三名園の後楽園を1泊2日で押さえる王道ルート。1日目は倉敷の川舟流しと大原美術館で日本初の西洋美術館を味わって、夜は本町通り沿いの町家宿で1泊。2日目は朝の後楽園で借景の岡山城を眺めて新幹線で帰路🚄 結論、岡山は倉敷の歴史美観と後楽園の庭園美の二本柱、断言します、関西から1泊で寄れる距離感が最高です。保存版📌',
    date: '2025-08-22T09:00:00Z',
    createdAt: '2025-09-12T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-001', 'tag-002', 'tag-022'], // 夏休み / 歴史 / 自然 / 写真映え
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-081',
            details:
              '倉敷美観地区は朝10時の川舟流しから。倉敷川の白壁と柳並木をゆっくり進む20分の舟旅、町並み保存運動の本気度がよく分かる景観です📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '倉敷川沿いから大原美術館まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-081',
            details:
              '大原美術館は日本初の西洋美術館。エル・グレコの受胎告知やモネの睡蓮を本物で見られるのは、地方都市の美術館としては破格🚄 入館料2000円。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.3, memo: '大原美術館から本町通りの宿まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-081',
            details:
              '夜は本町通り沿いの町家宿で1泊、夕食は地ビールと黄ニラの郷土料理。観光客が引いた夜の倉敷川沿いを散歩するのが地元目線📌',
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
            spotKey: 's-082',
            details:
              '後楽園は朝7時開園と同時に入る。日本三名園のひとつ、岡山城を借景に取り入れた池泉回遊式庭園は朝の光が一番映えます📌 入園料500円。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '後楽園から岡山城天守閣へ月見橋経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-082',
            details:
              '岡山城は黒漆塗りの烏城。天守閣から後楽園を見下ろすと、庭園と城がワンセットの設計だったことが体感できます🚄 帰路は岡山駅から新幹線で関西へ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 620,
  },

  // ---- sm-053 香川 1日（中堅、テンプレE 弾丸列挙） ----
  {
    key: 'sm-053',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 香川 金刀比羅宮と小豆島弾丸1日',
    description:
      '47都道府県シリーズ香川編📌 朝に金刀比羅宮の785段を登って、フェリーで小豆島のエンジェルロードを歩く弾丸日帰り。要点を箇条書きで残します。1) 金刀比羅宮は奥社まで行くと1368段、本宮までで十分達成感あり 2) 高松港から小豆島へは内海フェリー1時間 3) エンジェルロードは干潮時のみ現れる砂の道で潮見表必須🚄 結論、香川を1日で味わうなら金刀比羅宮と小豆島の二刀流、断言します、弾丸で十分濃い📌',
    date: '2025-05-10T07:00:00Z',
    createdAt: '2025-05-28T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-022', 'tag-025'], // 寺社仏閣 / 写真映え / 弾丸旅行
    budget: { amount: 11000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-086',
            details:
              '金刀比羅宮は朝7時に登り始める。表参道365段から本宮までの785段、足腰の弱い人は籠かご800円もあるけど自力推奨、達成感が変わります📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 70, distance: 45.0, memo: '琴平から高松築港まで琴電、高松港へ歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-086',
            details:
              '本宮の社殿は標高251mで讃岐平野を一望、金毘羅さんの守護神宮としての威厳。ここで朱印をいただいて下山🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 60, distance: 32.0, memo: '高松港から小豆島土庄港まで内海フェリー', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-080',
            details:
              'エンジェルロードは干潮時刻の前後3時間のみ現れる砂の道。潮見表で14-15時を狙って到着、対岸の中余島まで歩いて渡るのが小豆島の絶景体験📌',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 450,
  },

  // ---- sm-054 鹿児島 屋久島と桜島 3日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-054',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 鹿児島 桜島と屋久島の縄文杉3日',
    description:
      '47都道府県シリーズ鹿児島編📌 1日目に桜島湯之平展望所で活火山と鹿児島湾を一望、2日目はフェリーで屋久島へ渡って縄文杉日帰りトレッキング、3日目は屋久島の白谷雲水峡を朝に歩いて鹿児島へ戻る3日構成。屋久島の縄文杉は片道5時間の山道、登山靴と雨具マスト🚄 結論、鹿児島は活火山と原生林の二本柱、断言します、3日で南九州の自然のスケールを浴びるべきです📌',
    date: '2025-08-15T07:00:00Z',
    createdAt: '2025-09-08T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-010', 'tag-024', 'tag-020'], // 夏休み / 自然 / 絶景 / 秘境 / ハイキング
    budget: { amount: 92000, currency: JPY },
    thumbnailKey: 'img-thumb-075',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-095',
            details:
              '鹿児島港からフェリー15分で桜島に上陸、湯之平展望所まで車で20分。標高373mから北岳と南岳の間近、噴煙が見える日は迫力が桁違い📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 15, distance: 4.0, memo: '桜島港から鹿児島港へ戻り、宿で1泊', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-095',
            details:
              '桜島フェリーで戻る前に、湯之平の足湯に浸かる。火山灰の下で温かい温泉が湧く鹿児島湾、地元の人と話しながら屋久島の天気予報をチェック🚄',
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
            spotKey: 's-096',
            details:
              '鹿児島港から屋久島宮之浦港まで高速船トッピー2時間。宮之浦から荒川登山口までバス35分、4時起きで縄文杉日帰りトレッキング開始📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 120, distance: 70.0, memo: '鹿児島港から屋久島宮之浦港まで高速船トッピー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-096',
            details:
              '縄文杉は推定樹齢2000-7000年、トロッコ道8.5km+山道2.5kmで片道11km、往復10時間の体力勝負。本物に対面した瞬間の沈黙、屋久島でしか味わえません🚄',
            imageKeys: ['img-node-s096-1', 'img-node-s096-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-096',
            details:
              '最終日は白谷雲水峡を朝のうちに2時間散策、もののけ姫の森のモデルと言われる苔むす原生林📌 弥生杉コースが体力的にちょうど良い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 120, distance: 70.0, memo: '宮之浦港から鹿児島港まで高速船で帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-095',
            details:
              '鹿児島港に戻って桜島を遠目に、しろくま白熊で名物かき氷で締め。3日間で活火山と原生林、南九州の自然の振り幅を浴びました🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 36,
    targetViews: 580,
  },

  // ---- sm-055 三重 伊勢神宮と鳥羽 2日（中堅、テンプレA） ----
  {
    key: 'sm-055',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 三重 伊勢神宮と鳥羽湾を2日',
    description:
      '47都道府県シリーズ三重編📌 1日目は伊勢神宮内宮を朝のうちに正式参拝、おはらい町・おかげ横丁で赤福本店、午後は鳥羽水族館でジュゴンを観察。鳥羽駅近くで1泊して2日目は鳥羽湾めぐり遊覧船と外宮参拝で帰路。伊勢は外宮先祭が古来の作法ですが、今回は時間配分の都合で内宮優先🚄 結論、三重は伊勢の聖域と鳥羽の海の二本柱、断言します、2日で十分に三重の幅を持ち帰れます📌',
    date: '2025-04-19T08:00:00Z',
    createdAt: '2025-05-08T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-001', 'tag-002'], // 寺社仏閣 / 歴史 / 自然
    budget: { amount: 36000, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-068',
            details:
              '伊勢神宮内宮は朝8時、宇治橋から参道の砂利道を踏みしめて正宮へ。20年ごとの式年遷宮で清められた社殿は他と違う空気が漂います📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '内宮宇治橋からおかげ横丁・おはらい町まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-068',
            details:
              'おかげ横丁で赤福本店、創業300年の餡の塩梅と作りたての柔らかさ。伊勢うどんの中むらや、てこね寿司もこの一帯で全部試せます🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: 'おかげ横丁から鳥羽水族館の駐車場まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-069',
            details:
              '鳥羽水族館は日本で唯一ジュゴンとマナティを両方飼育。アシカショーと巨大水槽の回遊魚も見応えあり、入館料2800円📌',
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
            spotKey: 's-069',
            details:
              '朝は鳥羽湾めぐり遊覧船でイルカ島へ。リアス海岸の入江と養殖筏を眺めながら50分のクルーズ、海女の伝統と真珠養殖の歴史を解説してくれます🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 17.0, memo: '鳥羽から伊勢神宮外宮の駐車場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-068',
            details:
              '帰路前に内宮を再度参拝してから伊勢神宮外宮の方角に手を合わせて締め。本来は外宮先祭ですが今回は時間配分で逆順、次回は外宮から回ります📌',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 520,
  },

  // ---- sm-056 四国 山と渓谷 3日（中堅、テンプレA） ----
  {
    key: 'sm-056',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 四国 大歩危・祖谷・四万十の渓谷3日',
    description:
      '47都道府県シリーズ四国の山岳ルート📌 徳島の大歩危・祖谷渓谷から愛媛・高知の渓谷を3日で縦断する保存版。1日目は大歩危ライン下りと祖谷のかずら橋、2日目は祖谷渓谷の秘境集落と高知へ移動、3日目は四万十川の沈下橋を見て道後温泉で締め🚄 結論、四国の本気はリアス海岸ではなく内陸の渓谷にあり、断言します、3日かけて山深さを浴びるべきです。観光ルートから一段奥に入る本物志向の旅📌',
    date: '2025-06-07T08:00:00Z',
    createdAt: '2025-06-30T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-024', 'tag-002', 'tag-008'], // 秘境 / 自然 / 温泉
    budget: { amount: 78000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-088',
            details:
              '大歩危は吉野川の侵食でできた峡谷、観光遊覧船で30分。エメラルドグリーンの川面と切り立つ岩肌、四国の秘境感がいきなり全開📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 20.0, memo: '大歩危から祖谷のかずら橋までは山道で30分', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-089',
            details:
              '祖谷のかずら橋はシラクチカズラで編まれた長さ45mの吊り橋。渡り賃550円、渡る時の足元のスケスケ感は思ったより怖い、それが祖谷の体験🚄',
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
            spotKey: 's-089',
            details:
              '祖谷渓谷の小便小僧像から見下ろす200mの絶壁。秘境集落の落合は重要伝統的建造物群保存地区で日本のチベットと呼ばれる山深さ📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 180, distance: 130.0, memo: '祖谷から高知の四万十町まで山越え', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-079',
            details:
              '夕方に四万十川沿いの道の駅へ、清流の透明度と沈下橋の橋脚を眺めながら宿入り。高知のかつおの塩タタキで夕食🚄',
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
            spotKey: 's-079',
            details:
              '朝は四万十川の沈下橋3本巡り。佐田・三里・岩間の沈下橋それぞれ違う構図で、川面に映る橋の輪郭を撮れる時間帯は朝の8時前後📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 150, distance: 120.0, memo: '四万十町から松山道後温泉まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-078',
            details:
              '締めは道後温泉本館の朝風呂。重要文化財の木造三層楼で坊っちゃん湯を浴びて、四国の山と海の3日間を整える🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 490,
  },

  // ---- sm-057 沖縄 リピート 4日（一般、夏休み、テンプレA） ----
  {
    key: 'sm-057',
    authorKey: 'u-001',
    title: '47都道府県シリーズ 沖縄 本島1周 古宇利と美ら海と首里城4日',
    description:
      '47都道府県シリーズ沖縄リピート編📌 沖縄は何度行っても飽きないので、今回は本島北部・中部・南部を4日でぐるりと一周。1日目は那覇着で首里城と国際通り、2日目に北部へ移動して残波岬と美ら海水族館、3日目に古宇利大橋で朝景、4日目は南部の戦跡を辿って帰路。沖縄2回目以降の人にちょうど良い濃度です✈️ 結論、沖縄は本島だけでも4日必要、断言します、定番3つを朝夕で2周するのが47都道府県リピートの王道📌',
    date: '2025-07-26T07:30:00Z',
    createdAt: '2025-09-01T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-001'], // 夏休み / 絶景 / 歴史
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-071',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              '那覇空港からゆいレールで首里城公園へ。火災後の正殿復元工事が進行中で、工事中の様子も含めて見学できるのは今だけ📌',
            imageKeys: ['img-node-s098-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 9.0, memo: '首里駅から国際通り県庁前駅までゆいレール', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '夜は国際通りでソーキそばとオリオン生ビール、土産物屋を冷やかしながら屋台を回るのが沖縄1日目の定番✈️',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-110',
            details:
              'レンタカーで北上、残波岬の灯台と断崖は午後の光で広角構図がきれい。展望台から東シナ海とサンゴ礁を一画面📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '残波岬から美ら海水族館の駐車場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '美ら海水族館は16時以降の入場券が割引、ジンベエザメと回遊魚の黒潮の海大水槽は閉館前の17時頃が一番空いてゆっくり見られます🚄',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-099',
            details:
              '古宇利大橋は朝7時の青い時間がベスト、橋の南北両端から橋脚と海を一画面に入れる構図が定番📌 古宇利島の北側ハートロックも朝のうちに。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '古宇利島から美ら海水族館の備瀬集落まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '備瀬のフクギ並木を散策、屋根越しの集落と並木道は沖縄の原風景。午後は名護で泊まって翌日の南部回りに備える✈️',
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
            spotKey: 's-098',
            details:
              '最終日は南部回り、ひめゆりの塔と平和記念公園で戦跡を辿る。沖縄観光のもう一つの軸として外せない場所です📌',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: '南部から那覇空港までレンタカー返却', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '空港前に国際通りで再度土産買い物、4日間の沖縄リピート完走。47都道府県シリーズも残り県数が見えてきました🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 9,
    targetViews: 175,
  },

  // ===========================================================================
  // §B. u-002 sakura_trip の準手作り 6 本（sm-058 〜 sm-063）
  //
  // 関西・京都中心。前半（sm-009〜sm-014）と被らない切り口で、
  // 伏見稲荷・清水寺・錦市場・城崎・高野山・関西桜縦断を 6 本で。
  // 口調: 柔らかく丁寧・「ふらっと」「のんびり」「お気に入り」☕🌸✨
  // 日数内訳: 1日×3 / 2日×2 / 3日×1
  // バンド: 中堅 5 / 一般 1（sm-060 錦市場お茶）
  // ===========================================================================

  // ---- sm-058 京都 伏見稲荷千本鳥居 1日（中堅、テンプレC 時系列） ----
  {
    key: 'sm-058',
    authorKey: 'u-002',
    title: '京都 伏見稲荷千本鳥居と稲荷山ふらっと1日',
    description:
      '日曜の朝、ふらっと伏見稲荷へ。千本鳥居は朝7時前なら参拝客もまばらで、朱の鳥居の連なりがいちばんきれいに撮れる時間帯です🌸 奥社まで進んで稲荷山一周は2時間コース、四ツ辻からの京都市内眺望が思いがけずご褒美。下山後は錦市場に寄って、抹茶わらび餅とお豆腐ドーナツでお茶休憩☕ 観光地ど真ん中なのに、時間と体力の使い方次第でぐっと京都の奥が見えるお気に入りコースです✨',
    date: '2025-05-04T07:00:00Z',
    createdAt: '2025-05-22T18:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-022', 'tag-015'], // 寺社仏閣 / 写真映え / 女子旅
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details:
              '伏見稲荷大社は朝7時着、本殿で参拝してから千本鳥居へ。観光客がまばらな朝のうちに、朱の連なりを下からのアングルで撮るのが定番です🌸',
            imageKeys: ['img-node-s026-1', 'img-node-s026-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.5, memo: '千本鳥居から奥社・四ツ辻経由で稲荷山一周', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-026',
            details:
              '稲荷山一周は意外とハード、四ツ辻からは京都市内が一望できて立ち寄った人だけのご褒美✨ 下山時はおもかる石で願い事のおまけ付き☕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: '伏見稲荷駅から京阪・地下鉄経由で四条河原町・錦市場へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-125',
            details:
              '昼過ぎは錦市場でお茶休憩、抹茶わらび餅とお豆腐ドーナツ。ぶらぶら歩きながら老舗の佃煮屋を眺めるのが京都らしい時間の過ごし方🌸',
            imageKeys: ['img-node-s125-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 380,
  },

  // ---- sm-059 京都 清水寺と祇園夜散歩 1日（中堅、テンプレA） ----
  {
    key: 'sm-059',
    authorKey: 'u-002',
    title: '京都 清水寺の夕景と祇園夜散歩を楽しむ1日',
    description:
      '京都の清水寺は朝より夕方派です🌸 観光客のピークが引いた15時以降に音羽の滝から舞台に上がって、夕方の山影と京都盆地のグラデーションを眺めるのが私のお気に入り。日没後は産寧坂を下って祇園まで歩いて、花見小路の置屋の灯りでぼんやり夜を始める1日コース☕ 朝活が得意じゃない人でも京都らしさを濃く味わえる、夕方からの京都はわりと穴場です✨',
    date: '2025-03-15T14:30:00Z',
    createdAt: '2025-04-02T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-022', 'tag-009', 'tag-015'], // 寺社仏閣 / 写真映え / 夜景 / 女子旅
    budget: { amount: 6500, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details:
              '清水寺は15時着、観光客のピークが引いた時間帯。本堂の舞台から夕方の山影と京都盆地を眺めると、朝とは別の京都が見えます🌸',
            imageKeys: ['img-node-s025-1', 'img-node-s025-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '清水寺から産寧坂・二寧坂を経由して八坂の塔・祇園へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details:
              '日没前に音羽の滝で延命水を1杯。三本の滝それぞれの効能を選んでもらいに来る人もいますが、私は端から1本ずつ全部🌸',
            imageKeys: ['img-node-s025-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '産寧坂から花見小路の入口まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '祇園花見小路の夜は格別、提灯の灯りと石畳の質感、置屋の格子戸の向こうに芸妓さんが見えることもあります☕ 一力茶屋の前で夜の京都を1枚✨',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 450,
  },

  // ---- sm-060 京都 錦市場と老舗お茶 1日（一般、テンプレE） ----
  {
    key: 'sm-060',
    authorKey: 'u-002',
    title: '京都 錦市場でローカル目線のお茶とお漬物1日',
    description:
      '京都に住んでいると、観光地巡りより錦市場と老舗のお茶屋さんが日常のお気に入り☕ 今回は地元目線で錦市場を端から端まで歩いて、京つけものや出汁巻き玉子を試食しながら、最後は祇園の老舗茶寮で抹茶パフェ。観光地化されたエリアでも、地元の人が立ち寄る店を選ぶと違う京都が見えます🌸 ふらっと半日で楽しめる、私の繰り返しコースです✨',
    date: '2024-11-23T11:00:00Z',
    createdAt: '2024-12-08T17:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-004', 'tag-011'], // グルメ / カフェ / ソロ旅
    budget: { amount: 5800, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-125',
            details:
              '錦市場の西側入口から東へ歩いて、有次の包丁屋から錦平野の出汁巻き玉子まで端から端まで400m🌸 地元の主婦が買い物する平日午後がいちばん落ち着いて回れます。',
            imageKeys: ['img-node-s125-1', 'img-node-s125-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '錦市場東端から祇園花見小路まで河原町経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details:
              '錦市場の中で必ず買うのは、大安の千枚漬けと打田漬物の柴漬け。京都の冬の食卓の必需品で、お茶うけにも欠かせない☕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '河原町から祇園花見小路まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '祇園の老舗茶寮 都路里で抹茶パフェ、白玉と抹茶アイスの濃さが京都らしい締めの甘味🌸 平日午後は意外と並ばずに入れます✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 130,
  },

  // ---- sm-061 城崎温泉 浴衣でふらっと 2日（中堅、テンプレB 結論先行） ----
  {
    key: 'sm-061',
    authorKey: 'u-002',
    title: '城崎温泉 浴衣でふらっと外湯巡り 1泊2日',
    description:
      '結論、城崎温泉は1泊で外湯7湯を全制覇するのが正解です🌸 ハイライトは3つ。1) 浴衣に下駄でカランコロン、温泉街そのものが旅館の延長 2) 一の湯・御所の湯・地蔵湯は7湯のうち外せない3湯 3) 夜の柳並木と外湯のライトアップが幻想的☕ 注意点としては外湯は混雑時間帯（17-20時）を避けて、夕方早めor朝風呂で回るのがおすすめ。京都から特急きのさきで2時間半、関西の女子旅お気に入り温泉です✨',
    date: '2025-01-18T11:00:00Z',
    createdAt: '2025-02-05T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-015', 'tag-022'], // 温泉 / 女子旅 / 写真映え
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-040',
            details:
              '城崎温泉駅に14時着、駅前の足湯さとの湯から旅スタート。チェックイン前にまずは1湯、浴衣に着替えて温泉街の入口へ🌸',
            imageKeys: ['img-node-s040-1', 'img-node-s040-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'さとの湯から旅館街・一の湯まで温泉街の柳並木を歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-040',
            details:
              '夕方は一の湯と御所の湯をハシゴ、合間に温泉街の射的場で遊ぶ昭和な楽しみ方☕ 旅館で会席料理の夕食、但馬牛と松葉ガニ。',
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
            spotKey: 's-040',
            details:
              '朝風呂は鴻の湯、朝6時開湯の露天風呂で湯気越しの柳並木を眺める。朝食前に1湯、これが城崎流の朝🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '鴻の湯から大谿川沿いの土産物通りまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-040',
            details:
              'チェックアウト前に地蔵湯と柳湯で7湯のうち5湯まで、残り2湯は次回の口実に。土産は但馬牛の佃煮と城崎ビール✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 410,
  },

  // ---- sm-062 高野山宿坊と熊野古道 2日（中堅、テンプレA） ----
  {
    key: 'sm-062',
    authorKey: 'u-002',
    title: '高野山宿坊と熊野古道 関西の聖地2日',
    description:
      '関西在住なのに高野山と熊野古道を1度もちゃんと回ったことがなかったので、思い切って2日かけて聖地巡礼☕ 1日目は高野山奥之院で空海の御廟、宿坊で精進料理と朝のお勤め体験。2日目は那智勝浦へ移動して熊野古道大門坂と那智の滝🌸 早朝の参拝と山道の静けさは観光地とは別の時間軸、心が整う旅でした✨ 関西の聖地2つを1泊2日で押さえる、お気に入りに加わるであろう精進ルートです。',
    date: '2024-10-26T08:00:00Z',
    createdAt: '2024-11-15T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-024', 'tag-001'], // 寺社仏閣 / 秘境 / 歴史
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-043',
            details:
              '高野山は南海高野線とケーブルカーで2時間半。奥之院の参道は樹齢千年の杉並木と20万基の墓石が並ぶ別世界、空海の御廟まで歩く2kmの静寂🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '奥之院から金剛峯寺・宿坊街までの参道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-043',
            details:
              '宿坊の恵光院で1泊、夕食は精進料理。胡麻豆腐と季節の天ぷら、肉魚なしでも満足度の高い品数☕ 朝のお勤めは6時から、般若心経を一緒に唱えます。',
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
            spotKey: 's-041',
            details:
              '高野山から那智勝浦まで車で3時間半、紀伊半島南端の熊野古道大門坂へ。樹齢800年の夫婦杉と苔むす石畳、まさに祈りの道🌸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.8, memo: '大門坂から那智大社・那智の滝まで参道を上る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-042',
            details:
              '那智の滝は落差133m、日本一の直瀑。飛瀧神社の鳥居越しに滝と山を一画面に収める構図が定番、聖地の力をそのまま受ける感じ✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 440,
  },

  // ---- sm-063 関西 桜縦断 3日（中堅、桜、テンプレC 時系列） ----
  {
    key: 'sm-063',
    authorKey: 'u-002',
    title: '関西 桜縦断3日 嵐山・大阪城・姫路城',
    description:
      '4月の桜のピーク3日間、京都・大阪・兵庫の名城と桜の名所を縦断してきました🌸 1日目は嵐山渡月橋の桜と祇園白川の夜桜、2日目は大阪城公園の桜と道頓堀グリコ前、3日目は姫路城の世界遺産と桜の絶景。関西の桜は3日かけて回ると、寺社・城・川・夜桜と表情の振り幅が一気に広がります☕ 桜の時期しか撮れない関西の決定版、お気に入りの3日構成です✨',
    date: '2025-04-05T08:00:00Z',
    createdAt: '2025-04-22T19:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-018', 'tag-022', 'tag-005', 'tag-001'], // 桜 / 写真映え / 寺社仏閣 / 歴史
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details:
              '嵐山渡月橋は朝9時、桜と桂川と渡月橋を一画面に。竹林の小径も桜の時期だけ違う色味になります🌸',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 11.0, memo: '嵐電嵐山駅から四条河原町・祇園へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details:
              '夜は祇園白川の夜桜、ぼんぼりに照らされた花見小路と巽橋の桜は京都ならではの夜の絵☕ 夕食は京都四条で湯豆腐と京会席。',
            imageKeys: ['img-node-s035-2'],
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
            details:
              '大阪城公園は朝9時、約3000本の桜並木と天守閣を一画面に収める構図が圧巻🌸 桜のピークは内堀沿いの遊歩道。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.5, memo: '大阪城から地下鉄でなんば、道頓堀へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-030',
            details:
              '夕方は道頓堀でたこ焼きとお好み焼き、グリコの前で記念写真。夜は梅田で1泊して翌日の姫路に備える☕',
            imageKeys: ['img-node-s030-1'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-039',
            details:
              '姫路城は朝8時、白漆喰の白鷺と桜のコラボは世界遺産ならでは🌸 内堀沿いの三の丸広場の桜並木が一番映える時間帯は午前中。',
            imageKeys: ['img-node-s039-1', 'img-node-s039-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 50, distance: 95.0, memo: '姫路駅から新幹線で京都・新大阪へ帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-039',
            details:
              '天守閣からの眺めは姫路城下と桜並木が一望、関西の桜縦断の締めくくり。3日かけて関西の桜を浴びる、お気に入りに加わる旅でした✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 590,
  },

  // ===========================================================================
  // §C. u-003 kenji_outdoor の準手作り 5 本（sm-064 〜 sm-068）
  //
  // 北海道・自然・キャンピングカーで家族 4 人。前半（sm-015〜sm-019）と
  // 被らないエリア（知床/信州/山陰/富士山周辺/阿蘇）を中心に。
  // 口調: ファミリー実用・駐車場/トイレ等の現地メモ🏕️🚐
  // 日数内訳: 2日×1 / 3日×2 / 4日×1 / 5日×1
  // バンド: 中堅 4 / 一般 1（sm-066 山陰）
  // sm-067 例外: createdAt < date（事前計画として旅行前に投稿）
  // ===========================================================================

  // ---- sm-064 知床半島 ファミリー5日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-064',
    authorKey: 'u-003',
    title: '知床ウトロと羅臼 家族4人キャンピングカー5日',
    description:
      '夏休みの知床半島5日、家族4人とキャンピングカーで世界遺産を回ってきました🏕️ 1日目はウトロで知床五湖の高架木道、2日目は知床岬クルーズで野生動物探し、3日目は羅臼側へ移動して野付半島、4日目は美瑛・青い池まで南下、5日目は旭山動物園で帰路。子供たちはヒグマとシャチを実際に見られて自由研究のネタ完成🚐 駐車場情報: 知床五湖は大型駐車場あり、ウトロ道の駅は車中泊禁止なので注意。家族で世界遺産を浴びる5日間、おすすめです🚐',
    date: '2025-08-04T08:00:00Z',
    createdAt: '2025-08-29T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002', 'tag-010', 'tag-024'], // 夏休み / 家族旅行 / 自然 / 絶景 / 秘境
    budget: { amount: 195000, currency: JPY },
    thumbnailKey: 'img-thumb-054',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details:
              '知床五湖の高架木道は車椅子もOK、ヒグマ目撃情報があっても木道は開放されてます🏕️ 駐車場は大型対応、ウトロ道の駅で車中泊は禁止なので近隣のキャンプ場を予約。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.5, memo: '高架木道往復800m、車椅子・ベビーカーOK', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              'オシンコシンの滝は知床八景のひとつ、駐車場から徒歩3分の好アクセス。子供たちは滝のしぶきにキャアキャアでした🚐',
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
            spotKey: 's-048',
            details:
              '知床岬クルーズはウトロ漁港から3時間、ヒグマとイルカ、シャチ運が良ければの遭遇率🏕️ 大人6500円、子供3500円。トイレは船内にあるので安心。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 120, distance: 90.0, memo: 'ウトロから知床横断道路で羅臼側へ越境', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              '羅臼側に移動、知床峠から国後島が見える日もあります。羅臼の宿はキャンピングカー対応の駐車場ありを事前予約🚐',
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
            spotKey: 's-048',
            details:
              '羅臼側から野付半島へ。トドワラの立ち枯れ風景は他にない景観、子供にも分かりやすい自然遺産の解説看板🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 240, distance: 220.0, memo: '野付半島から美瑛・青い池まで車中泊スタイルで南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              '中標津の道の駅で車中泊休憩、夕食は地元のスーパーで海鮮丼の素と新鮮野菜、キャンピングカーの台所で簡単調理🚐',
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
            spotKey: 's-052',
            details:
              '美瑛・青い池に到着、駐車場は500円、有料化されてから整備されて子連れでも歩きやすくなりました🏕️ 朝の光のうちに撮影。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: '美瑛から旭川市内の宿へ、夜は旭山動物園に備える', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '美瑛の丘で家族写真、パッチワークの路と四季彩の丘で青空と花畑を一画面に🚐 旭川市内のホテルで久々のベッドに1泊。',
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
            spotKey: 's-053',
            details:
              '旭山動物園は子連れ向けの動線が完璧、ペンギン館とホッキョクグマ館は朝のうちが見やすい🏕️ 駐車場は朝9時で満車なので開園前到着推奨。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '旭山動物園から新千歳空港・札幌方面へ帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-053',
            details:
              '旭山の最後はもぐもぐタイムでアザラシの円柱水槽、子供たちが一番盛り上がった瞬間🚐 5日間の知床ファミリー旅、自由研究のネタもバッチリ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 520,
  },

  // ---- sm-065 信州 上高地と諏訪湖 ファミリー4日（中堅、テンプレA） ----
  {
    key: 'sm-065',
    authorKey: 'u-003',
    title: '信州 上高地と白馬・諏訪湖 ファミリーキャンピングカー4日',
    description:
      'お盆休み4日間、信州を家族4人キャンピングカーで縦断🏕️ 1日目は上高地で河童橋と明神池ハイキング、2日目は早朝の大正池から白馬山麓へ移動、3日目は白馬岩岳からゴンドラで山頂、4日目は諏訪湖で帰路。長野は夏でも涼しくて子連れ向き、駐車場情報: 上高地はマイカー規制で沢渡から低公害バス必須、白馬岩岳は無料駐車場大型対応🚐 信州ファミリー旅の決定版、ぜひ参考にしてください🚐',
    date: '2024-08-13T07:00:00Z',
    createdAt: '2024-09-02T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002', 'tag-020'], // 夏休み / 家族旅行 / 自然 / ハイキング
    budget: { amount: 92000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details:
              '上高地はマイカー規制、沢渡駐車場でキャンピングカーを停めて低公害バスへ。河童橋から梓川と穂高連峰の絶景🏕️',
            imageKeys: ['img-node-s061-1', 'img-node-s061-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 90, distance: 4.0, memo: '河童橋から明神池まで往復、子連れでも2時間半', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-061',
            details:
              '明神池は穂高神社奥宮の神域、透き通る池の底に岩魚が見える。子供たちは初めての山岳ハイキングで大満足🚐',
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
            spotKey: 's-061',
            details:
              '早朝の大正池、朝霧と立ち枯れ木と焼岳の構図は早起きしないと見られない🏕️ 子供を起こして頑張った価値ある絶景。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 120, distance: 95.0, memo: '上高地から白馬山麓まで国道147号', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-061',
            details:
              '白馬山麓に移動、栂池高原のオートキャンプ場で1泊。電源と水道完備、シャワー棟もあって家族向け🚐',
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
            details:
              '白馬岩岳マウンテンリゾートはゴンドラで山頂、雲の上のテラスから北アルプスを一望🏕️ 子供向けアスレチックも充実、1日遊べる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 130, distance: 105.0, memo: '白馬から諏訪湖まで国道19号・中央道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-023',
            details:
              '諏訪湖SAでキャンピングカー1泊、日没の諏訪湖が秋の気配。明日の朝の湖畔散歩に備えて早寝🚐',
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
            spotKey: 's-023',
            details:
              '諏訪湖の朝は霧が立つ日もあり、湖畔の遊歩道を子供たちと散歩🏕️ 諏訪大社上社で旅の安全祈願して帰路。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 180, distance: 220.0, memo: '諏訪湖から関東圏へ中央道経由で帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-023',
            details:
              '昼食は諏訪インター近くの蕎麦屋で信州そば、4日間の信州ファミリー旅は涼しくて気持ちよかった🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 380,
  },

  // ---- sm-066 山陰 出雲と鳥取 ファミリー3日（一般、テンプレB） ----
  {
    key: 'sm-066',
    authorKey: 'u-003',
    title: '山陰 出雲大社と鳥取砂丘 家族3日キャンピングカー旅',
    description:
      '結論、山陰は出雲大社と鳥取砂丘の2大巨頭を3日でつなぐと、関西から行ける家族旅としてちょうど良い濃度です🏕️ ハイライトは3つ。1) 出雲大社の縁結びと稲佐の浜 2) 鳥取砂丘でラクダ体験と砂丘登り 3) 浦富海岸で海水浴と磯遊び🚐 注意点: 出雲大社の駐車場は午前中で満車になるので朝9時着推奨。鳥取砂丘は炎天下で熱中症対策必須、子連れは午前か夕方が無難。',
    date: '2025-05-04T08:00:00Z',
    createdAt: '2025-05-25T18:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-013', 'tag-005', 'tag-002', 'tag-010'], // 家族旅行 / 寺社仏閣 / 自然 / 絶景
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details:
              '出雲大社は朝9時着、勢溜の大鳥居から本殿まで子供たちと参拝🏕️ 注連縄の大きさに息子が大興奮、社務所で家族でお守り。',
            imageKeys: ['img-node-s077-1', 'img-node-s077-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 4.5, memo: '出雲大社から稲佐の浜まで車で', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-077',
            details:
              '稲佐の浜で神話の浜辺、神在月に八百万の神が上陸する場所として知られる聖地🚐 子供たちは砂浜で貝拾いに夢中。',
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
            spotKey: 's-077',
            details:
              '出雲市内のオートキャンプ場で1泊明けて、鳥取砂丘へ移動。途中の道の駅で出雲そばと地元の野菜🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 150, distance: 120.0, memo: '出雲から鳥取砂丘までは山陰道経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-076',
            details:
              '鳥取砂丘は午後到着、ラクダ体験1500円が子連れの定番。砂丘の馬の背まで登って日本海を一望、子供たちは初体験で大はしゃぎ🚐',
            imageKeys: ['img-node-s076-1', 'img-node-s076-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 3,
        nodes: [
          {
            order: 1,
            spotKey: 's-076',
            details:
              '朝の鳥取砂丘は風紋がきれい、観光客が増える前の朝7時が狙い目🏕️ 砂の美術館とセットでも回れるが今回はパス。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 240, distance: 280.0, memo: '鳥取から関西圏へ中国道経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-076',
            details:
              '帰路の途中、浦富海岸で海水浴と磯遊び。透明度の高い日本海で海の生き物を観察できる、自由研究の続きにも🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 150,
  },

  // ---- sm-067 富士山周辺 ファミリーキャンプ3日（中堅、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-067',
    authorKey: 'u-003',
    title: '富士山周辺 河口湖と五合目 家族3日キャンピングカーキャンプ',
    description:
      '次の夏休みは富士山周辺で家族キャンプ3日を計画中🏕️ 1日目は河口湖大石公園で湖畔キャンプとサイクリング、2日目は富士山五合目で雲海の絶景と高山植物観察、3日目は朝の河口湖で湖面と富士山を撮って帰路。駐車場情報: 河口湖大石公園は無料、富士スバルラインは7-8月マイカー規制ありで富士山パーキングからシャトルバス🚐 子連れキャンピングカー旅の事前計画、参考にどうぞ。',
    date: '2025-08-09T07:00:00Z',
    createdAt: '2025-06-22T19:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-002', 'tag-010'], // 夏休み / 家族旅行 / 自然 / 絶景
    budget: { amount: 58000, currency: JPY },
    thumbnailKey: 'img-thumb-044',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-007',
            details:
              '河口湖大石公園のラベンダー畑と富士山を一画面、夏は紫の花畑と山頂の雪渓のコントラスト🏕️ オートキャンプ場は事前予約必須。',
            imageKeys: ['img-node-s007-1', 'img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.0, memo: '河口湖湖畔をサイクリング、レンタル1日500円', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '湖畔のキャンプ場で1泊、夜は星空観察。富士山と天の川を同フレームに入れる写真は夏の特権、子供と一緒に星座観察🚐',
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
            spotKey: 's-006',
            details:
              '富士山五合目は標高2300m、夏でも気温は10度前後で子連れは長袖必須🏕️ 高山植物の観察と雲海展望、自由研究のネタが豊富。',
            imageKeys: ['img-node-s006-1', 'img-node-s006-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 60, distance: 35.0, memo: '富士山パーキングから富士スバルラインシャトルバス', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-006',
            details:
              '小御嶽神社で家族の旅の安全祈願、子供たちは初めての高山体験で標高表示にテンション上昇🚐',
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
            spotKey: 's-007',
            details:
              '最終日は朝6時、河口湖の湖面に映る逆さ富士を狙う。風が止まる早朝が条件、子供は早起きできない時用の保険🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 120, distance: 100.0, memo: '河口湖から中央道経由で関東圏へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '富士急ハイランド近くの道の駅で休憩、富士の湧水とほうとうで昼食。3日間富士山を満喫した夏の思い出🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 370,
  },

  // ---- sm-068 阿蘇と黒川温泉 ファミリー2日（中堅、テンプレA） ----
  {
    key: 'sm-068',
    authorKey: 'u-003',
    title: '阿蘇草千里と黒川温泉 家族で湯めぐり2日',
    description:
      '九州ファミリー旅、阿蘇と黒川温泉を2日で🏕️ 1日目は阿蘇草千里で乗馬体験、火口見学のあと黒川温泉に移動、夜は宿の露天風呂と入湯手形で外湯巡り。2日目は黒川の朝湯と地獄谷遊歩道、阿蘇神社経由で帰路🚐 駐車場情報: 草千里は大型OKだが繁忙期は満車、黒川温泉は宿の駐車場利用が無難。子供連れでも黒川温泉の貸切露天は予約すれば利用可、家族風呂が充実で子連れOK温泉郷です。',
    date: '2024-11-02T09:00:00Z',
    createdAt: '2024-11-22T18:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-013', 'tag-008', 'tag-002', 'tag-014'], // 家族旅行 / 温泉 / 自然 / 子連れ
    budget: { amount: 48000, currency: JPY },
    thumbnailKey: 'img-thumb-068',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details:
              '阿蘇草千里は朝10時、乗馬体験は引き馬コース1500円で子供も乗れます🏕️ 草原と中岳の煙のコントラストが阿蘇らしい絶景。',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '阿蘇草千里から黒川温泉までやまなみハイウェイ経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-107',
            details:
              '黒川温泉に午後着、入湯手形1500円で外湯3湯選べる仕組み。子連れOKの貸切風呂を予約しておくと安心🚐',
            imageKeys: ['img-node-s107-1', 'img-node-s107-2'],
            transitSteps: [],
          },
          {
            order: 3,
            spotKey: 's-107',
            details:
              '夕食は宿の郷土料理会席、馬刺しと阿蘇の地鶏。夜は入湯手形でもう1湯、温泉街の散策で田の倉橋のライトアップが幻想的🏕️',
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
            details:
              '朝湯で1日スタート、宿の露天風呂で阿蘇の山並みを眺めながら朝食🚐 旅の疲れがほぐれる温泉郷の朝の時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '黒川温泉から阿蘇神社まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '帰路に阿蘇神社で家族の安全祈願。地震で被災して再建された楼門も見学できる、子供たちにも歴史の話が伝わる🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 450,
  },

  // ===========================================================================
  // §D. u-004 mio_couple の準手作り 5 本（sm-069 〜 sm-073）
  //
  // カップル温泉・記念日・ご褒美ステイ系。前半（sm-020〜sm-024）と
  // 被らないエリア（箱根/由布院/軽井沢/お台場/京都桜）を中心に。
  // 口調: 彼との二人旅・「ご褒美」「記念日」💕🥂📷
  // 日数内訳: 1日×1 / 2日×3 / 3日×1
  // バンド: 中堅 3 / 人気 1（sm-071 軽井沢万平記念日） / 一般 1（sm-072 お台場）
  // ===========================================================================

  // ---- sm-069 箱根温泉 ふたり旅 2日（中堅、紅葉、テンプレB 結論先行） ----
  {
    key: 'sm-069',
    authorKey: 'u-004',
    title: '箱根温泉ふたり旅 大涌谷と露天風呂付客室1泊2日',
    description:
      '結論、関東のカップル温泉旅で迷ったら箱根の大涌谷とロープウェイ、露天風呂付客室の組み合わせがいちばん間違いがないです💕 ハイライトは3つ。1) 大涌谷の黒たまごと噴煙の絶景を二人で 2) 強羅の露天風呂付客室で記念日のご褒美ステイ 3) ロープウェイから芦ノ湖と富士山を一画面に🥂 注意点としては大涌谷ロープウェイは火山ガス濃度で運休になる日があるので、当日朝に運行情報を確認してから出発📷 紅葉の時期がいちばん画になる時期です。',
    date: '2024-11-15T11:00:00Z',
    createdAt: '2024-12-08T19:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-012', 'tag-017', 'tag-022'], // 温泉 / カップル / 紅葉 / 写真映え
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-069',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-016',
            details:
              '大涌谷ロープウェイで11時着、噴煙と紅葉の山肌を彼と並んで眺める💕 黒たまごは2人で5個セット、寿命7年延びる縁起物の定番。',
            imageKeys: ['img-node-s016-1', 'img-node-s016-2'],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 25, distance: 4.5, memo: '大涌谷から強羅駅までロープウェイ・登山鉄道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-016',
            details:
              '強羅の露天風呂付客室で1泊、私たちのご褒美ステイ🥂 シャンパンの差し入れと、夕食は懐石コース。彼が予約してくれた記念日プラン📷',
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
            spotKey: 's-016',
            details:
              '朝の露天風呂で紅葉の山肌を眺めながらゆっくり💕 朝食は和食膳、湯豆腐と季節の小鉢。チェックアウト前にもう1度温泉に。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 30, distance: 6.0, memo: '強羅から早雲山経由で芦ノ湖までロープウェイ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-016',
            details:
              '芦ノ湖でランチクルーズ、海賊船で湖面と富士山と紅葉の3点セット📷 関東のカップル温泉、箱根は何度行っても二人の定番です✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 480,
  },

  // ---- sm-070 由布院 金鱗湖 ふたり旅 2日（中堅、テンプレC 時系列） ----
  {
    key: 'sm-070',
    authorKey: 'u-004',
    title: '由布院 金鱗湖と別府海地獄 ふたり旅1泊2日',
    description:
      '彼が「冬の由布院に泊まりたい」と言い出したので、ご褒美の年末旅💕 1日目は別府海地獄で温泉地獄めぐり、夕方に由布院へ移動して湯の坪街道を散策、夜は露天風呂付客室の宿。2日目は朝の金鱗湖で湖面の朝霧と由布岳の絶景を撮って帰路📷 由布院は冬の朝霧が一番画になる季節、彼との記念日にちょうど良い大分2大温泉地のセットでした🥂',
    date: '2024-12-28T10:00:00Z',
    createdAt: '2025-01-14T19:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-012', 'tag-022'], // 温泉 / カップル / 写真映え
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-066',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-092',
            details:
              '別府海地獄、コバルトブルーの熱湯が沸き立つ地獄。湯気と青の対比が冬のほうがくっきり📷 地獄蒸しプリンが彼のお気に入り💕',
            imageKeys: ['img-node-s092-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '別府から由布院まで湯布院IC経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-093',
            details:
              '由布院に夕方着、湯の坪街道で雑貨屋とカフェ巡り。ジェラートとB-speakのロールケーキは外せない🥂',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [],
          },
          {
            order: 3,
            spotKey: 's-093',
            details:
              '宿は露天風呂付客室、雪が舞う夜の温泉と地酒のご褒美ステイ💕 彼との記念日にぴったりの大人の由布院。',
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
            spotKey: 's-093',
            details:
              '朝6時の金鱗湖、冬の朝霧が湖面から立ち昇って由布岳と一画面に📷 マジックアワーの限定景色、彼のスマホでも撮ってもらいました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '金鱗湖から由布院駅まで湯の坪街道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-093',
            details:
              '由布院駅前のCafe La Ruche辺りでゆっくり朝食、由布岳の借景。彼との記念日由布院、大満足の2日間でした🥂',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 510,
  },

  // ---- sm-071 軽井沢 記念日3日（人気、紅葉、テンプレB 結論先行） ----
  {
    key: 'sm-071',
    authorKey: 'u-004',
    title: '軽井沢万平ホテル 記念日のご褒美ステイ3日間',
    description:
      '結論、彼との記念日に軽井沢万平ホテル3日は完璧でした💕 ハイライトは3つ。1) 万平ホテル本館の歴史的建造物に泊まる 2) ジョン・レノンも訪れた老舗の朝食ルーム 3) 雲場池の紅葉とハルニレテラスの森散歩🥂 注意点としては万平ホテルは2024年改装後の予約が取りにくいので3ヶ月前から手配。記念日プランで部屋付サービスとデコレーションケーキを頼むと最高に映える📷 紅葉の10-11月が一年でいちばん美しい季節、ぜひ大切な人と。',
    date: '2025-10-25T11:00:00Z',
    createdAt: '2025-11-12T19:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-017', 'tag-003', 'tag-022'], // カップル / 紅葉 / グルメ / 写真映え
    budget: { amount: 165000, currency: JPY },
    thumbnailKey: 'img-thumb-070',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '軽井沢駅から万平ホテルまで送迎、本館アルプス館の歴史的建造物にチェックイン💕 部屋には記念日デコレーション、彼が予約してくれたサプライズ🥂',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '万平ホテルから旧軽井沢銀座通りまで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '旧軽井沢銀座でアンティーク雑貨屋とジャム工房、ミカドコーヒーで一息。紅葉が始まった軽井沢の街並みを彼と歩く📷',
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
            spotKey: 's-008',
            details:
              '朝食は万平ホテルの本館ダイニング、ジョン・レノンも食べたロイヤルミルクティーとフレンチトースト💕 朝の光が差し込む空間が記念日らしい。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '万平ホテルから雲場池の駐車場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '雲場池の紅葉は10月後半がピーク、池に映る紅葉を一周20分の遊歩道で撮影📷 二人並んでセルフタイマーで記念日の1枚。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 8.0, memo: '雲場池からハルニレテラスへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-008',
            details:
              'ハルニレテラスで川沿いランチ、川上庵の蕎麦と地ビール🥂 夕方は万平に戻って館内のジョン・レノンバーで記念日カクテル💕',
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
            spotKey: 's-008',
            details:
              '最終日は朝の白糸の滝、紅葉と滝のしぶきを背景に二人で写真。万平ホテルから車で30分の隠れた名所📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '軽井沢から関越自動車道で東京まで帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '帰り際にチャーチストリートで彼にプレゼント。3日間の記念日軽井沢は私の中で最高ランクの旅、ありがとう💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 78,
    targetViews: 1450,
  },

  // ---- sm-072 お台場と東京タワー カップル夜景 1日（一般、テンプレD Q&A） ----
  {
    key: 'sm-072',
    authorKey: 'u-004',
    title: '東京カップル夜景デート お台場とスカイツリーと渋谷1日',
    description:
      '「東京で1日カップル夜景デートのおすすめは？」と聞かれることが多いので、私と彼の定番コースをまとめました💕 結論、お台場レインボーブリッジ→スカイツリー→渋谷スクランブルの3点で東京の夜景3形態を全部押さえられます。お台場は海越しの夜景、スカイツリーは展望台から東京一望、渋谷は街なかの賑わい🥂 注意点としてはスカイツリーは事前ネット予約で時短、土日の19時以降は特に混むので早め推奨📷',
    date: '2025-02-22T15:00:00Z',
    createdAt: '2025-03-12T19:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-009', 'tag-012', 'tag-022'], // 夜景 / カップル / 写真映え
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-078',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-021',
            details:
              'お台場のレインボーブリッジは夕方17時着、橋の遊歩道から東京湾を渡る💕 ビーナスフォートでカフェ休憩のあと夜景の準備。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 12.0, memo: 'お台場から押上スカイツリー駅までゆりかもめ・地下鉄', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-002',
            details:
              'スカイツリー天望デッキは19時、彼と並んで東京湾と東京タワーが見える方角の窓際🥂 入場料3100円、事前ネット予約で時短。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: 'スカイツリーから渋谷駅まで半蔵門線', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-003',
            details:
              '締めは渋谷スクランブル交差点と渋谷ストリームの夜景。交差点を彼と並んで渡って、街の賑わいを浴びる📷 2人の東京デート定番✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 120,
  },

  // ---- sm-073 京都老舗旅館 ふたりで桜2日（中堅、桜、テンプレA） ----
  {
    key: 'sm-073',
    authorKey: 'u-004',
    title: '京都ふたりで桜旅 嵐山と祇園の老舗旅館1泊2日',
    description:
      '彼との春の記念日、京都で桜を見ながら老舗旅館に泊まるご褒美旅💕 1日目は嵐山渡月橋の桜と竹林の小径を歩いて、夜は祇園の老舗旅館で京懐石。2日目は朝の祇園花見小路を散歩してから清水寺の桜を堪能📷 京都の桜は4月初旬がピーク、桜と寺社と老舗旅館の組み合わせはカップルの記念日としていちばん画になる時期です🥂 二人の京都桜旅、思い出に残る2日間。',
    date: '2025-04-04T10:00:00Z',
    createdAt: '2025-04-25T20:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-018', 'tag-012', 'tag-005', 'tag-022'], // 桜 / カップル / 寺社仏閣 / 写真映え
    budget: { amount: 78000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details:
              '嵐山渡月橋に午後着、桜と桂川と渡月橋を背景に二人並んで1枚📷 観光客が増える前の14時前後がベスト💕',
            imageKeys: ['img-node-s027-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '渡月橋から竹林の小径・天龍寺まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-027',
            details:
              '竹林の小径は彼と二人で並んで歩くだけで画になる。天龍寺の庭園は世界遺産、桜と庭石と借景の3点セット🥂',
            imageKeys: ['img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 11.0, memo: '嵐山から祇園四条までJR・京阪', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '祇園の老舗旅館に夕方着、夕食は京懐石コース。彼が予約してくれた記念日プランで桜のデコレーションケーキ💕',
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
            spotKey: 's-035',
            details:
              '朝の祇園花見小路は観光客がまばら、桜と石畳と置屋の格子戸を二人並んでゆっくり散歩📷',
            imageKeys: ['img-node-s035-1', 'img-node-s035-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 18, distance: 4.5, memo: '祇園から清水寺まで市バス', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details:
              '清水寺の桜は本堂の舞台越しに京都市内と桜並木を一画面🥂 二人での記念日京都桜旅、本物の春の京都を浴びました💕',
            imageKeys: ['img-node-s025-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 580,
  },

  // ===========================================================================
  // §E. u-005 hayato_solo の準手作り 4 本（sm-074 〜 sm-077）
  //
  // 学生節約・青春18きっぷ・低予算ソロ。前半（sm-025〜sm-028）と
  // 被らないエリア・テーマで4本（名古屋/京都/北海道弾丸/夜行バス）。
  // 口調: 「○○円縛り」「学生でも」「青春18きっぷ」💪🎒
  // 日数内訳: 1日×3 / 2日×1
  // バンド: 中堅 2 / 一般 2
  // ===========================================================================

  // ---- sm-074 18きっぷ 東京〜名古屋 名古屋めし1日（中堅、夏休み、テンプレD Q&A） ----
  {
    key: 'sm-074',
    authorKey: 'u-005',
    title: '青春18きっぷで東京から名古屋 名古屋めし日帰り',
    description:
      '「18きっぷで東京から名古屋まで何時間？」って聞かれたので実際にやってみたログ。結論、東海道線で熱海・浜松・豊橋を乗り継いで6時間半、運賃2410円のうちに名古屋までたどり着けます。着いたら名古屋城を外から眺めて、味噌煮込みうどんと手羽先と熱田神宮のひつまぶしを1日でハシゴする貧乏旅の王道🎒 帰りは夜行で東京戻り、運賃と食費合わせて6000円縛り、学生でも余裕でいけます💪',
    date: '2025-08-15T05:30:00Z',
    createdAt: '2025-09-04T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-003'], // 夏休み / ソロ旅 / グルメ
    budget: { amount: 6000, currency: JPY },
    thumbnailKey: 'img-thumb-062',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details:
              '名古屋駅から地下鉄で名古屋城、外観だけ眺めて入場料500円は節約🎒 金鯱と本丸御殿を遠目に1枚撮って次のグルメへ。',
            imageKeys: ['img-node-s066-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '名古屋城から味噌煮込みうどん山本屋本店栄店まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-066',
            details:
              '味噌煮込みうどんは山本屋本店、卵入りで1380円。八丁味噌の濃さが想像以上で名古屋に来た実感💪 ご飯セットは無料で大盛り対応。',
            imageKeys: ['img-node-s066-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 4.5, memo: '栄から熱田神宮駅まで地下鉄', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-067',
            details:
              '熱田神宮で参拝、境内の宮きしめんで2食目。東門近くの蓬莱軒は混むのでパスして駅前のひつまぶし1500円コースで節約🎒',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 12,
    targetViews: 210,
  },

  // ---- sm-075 京都ソロ4000円 1日（一般、夏休み、テンプレD） ----
  {
    key: 'sm-075',
    authorKey: 'u-005',
    title: '京都ソロ4000円縛り 伏見稲荷・清水寺・祇園の学生コース',
    description:
      '「京都って観光地ばかりで金かかるんでしょ？」と聞かれたので、4000円縛りで1日回ってきた実証ルート💪 朝の伏見稲荷千本鳥居（参拝無料）→ 昼は清水寺（拝観料500円）→ 夕方の祇園花見小路（散歩無料）。交通費は地下鉄バス1日券1100円、ランチは天下一品の総本店900円、お土産は錦市場で和菓子500円。学生でも京都の主要スポットは押さえられる、節約ソロ旅のテンプレ🎒',
    date: '2025-08-26T07:00:00Z',
    createdAt: '2025-09-15T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-005'], // 夏休み / ソロ旅 / 寺社仏閣
    budget: { amount: 4000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details:
              '伏見稲荷大社は朝7時着、千本鳥居の参拝はもちろん無料🎒 観光客のピーク前に奥社まで行って戻る2時間コース。',
            imageKeys: ['img-node-s026-1', 'img-node-s026-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: '伏見稲荷から清水五条まで京阪電車', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details:
              '清水寺は拝観料500円、舞台と音羽の滝で京都らしさを浴びる💪 学生だけど節約のためお守りはパス、参拝のみで御利益。',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '清水寺から産寧坂・八坂神社経由で祇園花見小路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '夕方は祇園花見小路で散歩、置屋の格子戸を眺めるだけで0円🎒 4000円縛りで京都を1日味わう、学生ソロ旅の王道完了💪',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 5,
    targetViews: 95,
  },

  // ---- sm-076 北海道弾丸 札幌1泊（中堅、夏休み、テンプレB） ----
  {
    key: 'sm-076',
    authorKey: 'u-005',
    title: '北海道&東日本パスで札幌1泊弾丸ソロ',
    description:
      '結論、青森から北海道&東日本パス11330円で札幌まで弾丸1泊ソロは可能です💪 ハイライトは3つ。1) 青森から青函トンネル経由で函館、特急乗継で札幌まで一気に北上 2) 札幌大通公園の街歩きと小樽運河の夜景 3) 帰りは新千歳から夜行バスでさらに節約🎒 注意点として北海道&東日本パスは特急自由席のみ、指定席は別料金。学生のうちに北海道弾丸、夏休みの記念旅にちょうど良い経験です。',
    date: '2025-08-30T06:00:00Z',
    createdAt: '2025-09-22T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-025'], // 夏休み / ソロ旅 / 弾丸旅行
    budget: { amount: 18000, currency: JPY },
    thumbnailKey: 'img-thumb-077',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-049',
            details:
              '青森から特急で函館経由札幌へ、車中で12時間。途中の小樽運河で1時間下車、運河沿いを歩く🎒 ガス灯のレトロな夜景。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 45, distance: 35.0, memo: '小樽から札幌までJR函館本線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-121',
            details:
              '札幌の二条市場で夕食、海鮮丼1500円が学生救済の旨さ💪 サーモンとイクラの2色丼、これだけは節約せずにご褒美で。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '二条市場から札幌大通公園まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-045',
            details:
              '夜の札幌大通公園、テレビ塔のライトアップを下から見上げて1日目終了。札幌駅近くのカプセルホテルで節約宿泊🎒',
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
            spotKey: 's-045',
            details:
              '朝の大通公園を散歩、ラベンダーと夏の青空。2日目は朝から札幌時計台と旧道庁を外観だけ眺める節約観光💪',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 60, distance: 50.0, memo: '札幌から新千歳空港まで快速エアポート', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-045',
            details:
              '新千歳空港から夜行バスで仙台経由、青森に戻る大ループ🎒 北海道&東日本パスをフル活用した学生弾丸ソロ完了💪',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 11,
    targetViews: 195,
  },

  // ---- sm-077 18きっぷ 東京〜京都 夜行バス節約 2日（一般、夏休み、テンプレD） ----
  {
    key: 'sm-077',
    authorKey: 'u-005',
    title: '18きっぷと夜行バス 東京〜京都2日 節約ソロ旅',
    description:
      '「青春18きっぷで東京から京都って実際何時間かかるの？」と聞かれたのでログ。結論、東海道線でずっと普通列車乗り継ぎ、9時間半。1日目で京都到着、伏見稲荷を歩いて宿はゲストハウス3000円🎒 2日目は清水寺と錦市場でお茶、夜行バスで東京戻り。18きっぷ1日2410円+夜行バス4500円+宿3000円+ご飯3000円=12910円縛りで京都2日、学生でも普通に行けます💪',
    date: '2025-08-08T05:00:00Z',
    createdAt: '2025-08-31T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-011', 'tag-005'], // 夏休み / ソロ旅 / 寺社仏閣
    budget: { amount: 13000, currency: JPY },
    thumbnailKey: 'img-thumb-057',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-020',
            details:
              '東京駅5時52分発の東海道線小田原行きから旅スタート、熱海・豊橋・米原で乗継いで京都到着15時🎒 9時間半の電車旅は18きっぷの醍醐味。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 570, distance: 510.0, memo: '東京駅から京都駅までJR東海道線普通列車のみ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-026',
            details:
              '京都到着後、伏見稲荷で千本鳥居を歩いて参拝🎒 ゲストハウスは京都駅近くで1泊3000円、シャワー共同で節約宿。',
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
            spotKey: 's-025',
            details:
              '2日目朝は清水寺、拝観料500円で本堂と音羽の滝💪 学生証提示で割引はないけど、参拝のみなら無料コースもあり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 25, distance: 8.0, memo: '清水寺から錦市場まで市バス', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details:
              '昼は錦市場で食べ歩き、お豆腐ドーナツ300円とコロッケ200円で節約ランチ🎒',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 480, distance: 460.0, memo: '京都駅から東京新宿へ夜行バス4500円', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-125',
            details:
              '夜行バス出発前に京都駅でラーメン、新福菜館の中華そば850円💪 夜行で寝てる間に東京着、節約2日完走🎒',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 14,
    targetViews: 235,
  },

  // ===========================================================================
  // §F. u-006 gourmet_aki の準手作り 6 本（sm-078 〜 sm-083）
  //
  // グルメ食べ歩き専門。前半（sm-029〜sm-034）と被らないエリアで6本
  // （名古屋/福岡/仙台/沖縄/金沢/築地浅草）。
  // 口調: 「○食目」「ハシゴ」「絶対外せない」🍜🍣🍢
  // 日数内訳: 1日×4 / 2日×2
  // バンド: 中堅 5 / 一般 1（sm-081 沖縄国際通り）
  // ===========================================================================

  // ---- sm-078 名古屋めしハシゴ 1日（中堅、テンプレB） ----
  {
    key: 'sm-078',
    authorKey: 'u-006',
    title: '名古屋めし1日5食ハシゴ ひつまぶし・味噌煮込み・手羽先',
    description:
      '結論、名古屋は1日5食で名古屋めしの全幅が見えます🍜 ハイライトは3つ。1) 朝はモーニング、コメダ珈琲のシロノワール 2) 昼は熱田蓬莱軒のひつまぶし 3) 夜は世界の山ちゃんの手羽先🍢 注意点としては蓬莱軒は11時前の整理券で並ぶこと、夕方は山ちゃんが激混みなので18時前入店推奨。名古屋めしランキング上位5軒を1日でハシゴするコース、味噌・八丁・赤味噌の濃さの違いを舌で覚えるのが目的🍣',
    date: '2025-04-12T09:30:00Z',
    createdAt: '2025-05-02T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-022'], // グルメ / 写真映え
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-063',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details:
              '1食目は栄のコメダ珈琲モーニング、トースト+ゆで卵が無料サービス🍜 名古屋人の日常を朝から味わう、シロノワールも追加で文化体験。',
            imageKeys: ['img-node-s066-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 5.0, memo: '栄から熱田神宮駅まで地下鉄名城線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-067',
            details:
              '2食目は熱田蓬莱軒のひつまぶし4900円。ひつまぶしの食べ方3段階（そのまま→薬味→出汁茶漬け）でうなぎの幅を完食🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.5, memo: '熱田神宮から栄まで地下鉄', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-066',
            details:
              '3食目は山本屋本店の味噌煮込みうどん、八丁味噌の濃さが東京から来た人間には衝撃🍣 ご飯おかわり無料は嬉しいサービス。',
            imageKeys: ['img-node-s066-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '栄の山本屋から世界の山ちゃん本店まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-066',
            details:
              '4食目は世界の山ちゃん本店、幻の手羽先5本セット700円。スパイシーな味付けと胡椒の効きがビールを呼ぶ🍜 5食目はあんかけスパで〆。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 360,
  },

  // ---- sm-079 福岡博多 屋台と中洲モツ鍋 1日（中堅、テンプレE 箇条書き） ----
  {
    key: 'sm-079',
    authorKey: 'u-006',
    title: '福岡博多 屋台とモツ鍋 1日4食ハシゴコース',
    description:
      '博多の食は屋台と老舗鍋屋の二刀流🍜 ランキング上位を箇条書きで残します。1) 太宰府天満宮で梅ヶ枝餅、参道の老舗かさの家 2) 博多もつ鍋通りでおおやま、白味噌スープが絶対外せない 3) 中洲屋台街で屋台ラーメンと焼き鳥、博多名物の長浜ラーメン🍢 注意点としては中洲屋台は18時頃から営業、ピークは20-22時。屋台は現金のみが多い、3000円札用意推奨🍣',
    date: '2025-03-29T10:00:00Z',
    createdAt: '2025-04-20T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-022'], // グルメ / 写真映え
    budget: { amount: 11500, currency: JPY },
    thumbnailKey: 'img-thumb-064',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-090',
            details:
              '1食目は太宰府天満宮の参道、かさの家の梅ヶ枝餅130円。皮の焼き目と甘さ控えめの粒餡が朝の腹ごしらえに最適🍜',
            imageKeys: ['img-node-s090-1', 'img-node-s090-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 16.0, memo: '太宰府から博多駅まで西鉄・地下鉄', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-127',
            details:
              '2食目は博多もつ鍋通りの「おおやま」、白味噌スープのもつ鍋は4種類のもつと野菜が三段重ね🍢 〆のチャンポン麺は外せない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '博多もつ鍋通りから中洲屋台街まで那珂川沿いを歩く', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-091',
            details:
              '3食目は中洲屋台で焼き鳥とラーメン、屋台ラーメンの元祖長浜ラーメンは細麺で替え玉が無料🍣 屋台のおっちゃんと話しながらの夜食は博多の日常体験。',
            imageKeys: [],
            transitSteps: [],
          },
          {
            order: 4,
            spotKey: 's-091',
            details:
              '4食目は屋台で〆の餃子、宝雲亭の一口餃子は皮がパリッと中ジューシー🍜 博多1日ハシゴの締めくくり、グルメ満足度満点。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 400,
  },

  // ---- sm-080 仙台牛タン 1日（中堅、テンプレB） ----
  {
    key: 'sm-080',
    authorKey: 'u-006',
    title: '仙台牛タン三軒ハシゴ 利久・伊達の牛たん・閣の食べ比べ1日',
    description:
      '結論、仙台牛タンは三大老舗を1日でハシゴしないと本当の幅は分かりません🍜 ハイライトは3つ。1) 利久の極厚芯たん、肉厚と塩気のバランスが王道 2) 伊達の牛たんの厚切り、塩・タレ・味噌の3種食べ比べ 3) 閣の希少部位、タン元・タン中・タン先の食感の差🍢 注意点としては牛タン専門店はランチ時混雑必至、開店直後の11時着がベスト。新幹線の駅弁では絶対味わえない厚みです🍣',
    date: '2024-10-12T10:30:00Z',
    createdAt: '2024-11-04T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-011'], // グルメ / ソロ旅
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-065',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-123',
            details:
              '1軒目は利久の本店、極厚芯たん定食2700円。極厚なのに柔らかく、塩気のキレが王道🍜 麦飯とテールスープのセットが文句なし。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '利久から伊達の牛たん本舗まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-123',
            details:
              '2軒目は伊達の牛たん本舗、塩・タレ・味噌の三種盛り定食2400円。一皿で3種類の味を比べられるのは老舗ならでは🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '伊達の牛たんから閣まで仙台駅近隣', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-123',
            details:
              '3軒目は閣の希少部位コース、タン元の柔らかさとタン先の歯ごたえが違う🍣 牛タン1日3食、仙台の真髄を完食。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 20,
    targetViews: 340,
  },

  // ---- sm-081 沖縄国際通り グルメハシゴ 1日（一般、夏休み、テンプレE） ----
  {
    key: 'sm-081',
    authorKey: 'u-006',
    title: '沖縄国際通り 1日4食ハシゴ ソーキそば・ステーキ・ぜんざい',
    description:
      '沖縄1日グルメ目線で国際通りを歩いてきました🍜 1) ソーキそば、首里そばの自家製麺と豚骨カツオ出汁 2) アメリカンステーキは88ステーキで250gパテ 3) ぜんざいは富士家の白玉ぜんざい、夏は氷山のような盛りで暑気払い🍢 那覇市内のグルメは国際通り周辺で完結、沖縄に1日しかない人にちょうど良い濃度のハシゴコース🍣',
    date: '2025-07-22T10:00:00Z',
    createdAt: '2025-08-12T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-011'], // 夏休み / グルメ / ソロ旅
    budget: { amount: 7500, currency: JPY },
    thumbnailKey: 'img-thumb-061',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-111',
            details:
              '1食目は首里そばのソーキそば750円、自家製麺と豚骨カツオの出汁が絶妙な配合🍜 沖縄そばのスタンダードを最初に押さえる。',
            imageKeys: ['img-node-s111-1', 'img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '首里そばから国際通り沿いの88ステーキまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '2食目は88ステーキの250gテンダーロイン、アメリカン仕込みのボリュームに沖縄の食文化の幅を感じる🍢',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '88ステーキから富士家のぜんざい店まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '3食目は富士家の白玉ぜんざい600円、氷山と金時豆と白玉の沖縄定番🍣 夏の暑気払いはこれ1杯で。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '富士家から那覇市場へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '4食目は牧志公設市場の海ぶどう丼、市場2階の食堂で1500円🍜 沖縄国際通りハシゴ完了、国際通りだけで完結する沖縄グルメ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 130,
  },

  // ---- sm-082 金沢 近江町市場と寿司 2日（中堅、テンプレA） ----
  {
    key: 'sm-082',
    authorKey: 'u-006',
    title: '金沢近江町市場と寿司 2日でハシゴするグルメ旅',
    description:
      '金沢の食を2日かけて深く味わうコース🍜 1日目は近江町市場で海鮮丼、ひがし茶屋街で和菓子と抹茶。夜は金沢駅近の回らない寿司屋。2日目は朝の近江町でカニと甘エビの食べ比べ、兼六園の松風閣で和菓子の老舗🍢 北陸新幹線で東京から2時間半、近江町市場の海鮮と兼六園の和菓子の二本柱を1泊2日で押さえる、金沢グルメの王道です🍣',
    date: '2024-12-07T11:00:00Z',
    createdAt: '2024-12-26T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-001'], // グルメ / 歴史
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-064',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-129',
            details:
              '近江町市場に11時着、海鮮丼の山さん寿司で日本海の旬ネタ十二貫2000円🍜 ノドグロ・カニ・甘エビが市場価格で味わえる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '近江町市場からひがし茶屋街まで浅野川沿い', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-065',
            details:
              'ひがし茶屋街で和菓子、茶寮ふくみつでお抹茶と上生菓子🍢 江戸時代の茶屋建築の中で味わう茶菓子は金沢ならではの体験。',
            imageKeys: ['img-node-s065-1', 'img-node-s065-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'ひがし茶屋街から金沢駅前の寿司屋まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-129',
            details:
              '夜は金沢駅近の回らない寿司、おまかせコース8000円で旬のネタを大将仕立て🍣 ガリと白板昆布の使い方が金沢仕様。',
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
            details:
              '朝の近江町市場、開店直後8時台はマグロの解体ショーと地元客中心。立ち食い寿司いきいき亭の朝食セット1500円🍜',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '近江町市場から兼六園の松風閣まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-064',
            details:
              '兼六園の松風閣で抹茶と上生菓子の老舗体験🍢 庭園を眺めながら、金沢の甘味文化の深さを味わう2日間の締め。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 425,
  },

  // ---- sm-083 築地と浅草 食い倒れ2日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-083',
    authorKey: 'u-006',
    title: '築地と浅草 1泊2日で東京下町の食い倒れハシゴ',
    description:
      '東京下町の食を2日でハシゴ🍜 1日目は築地場外市場で朝の海鮮丼、玉子焼きと出汁、大江戸寿司で立ち食い。2日目は浅草仲見世通りでメンチカツと人形焼き、夕方は浅草の老舗洋食店ヨシカミでハヤシライス🍢 東京下町の食はミシュラン以外にも掘ると深く、築地と浅草の二大エリアを2日でハシゴするのが正解🍣 夏休みの東京観光、定番だけど押さえておくべき食の王道。',
    date: '2025-07-19T08:00:00Z',
    createdAt: '2025-08-08T19:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-003', 'tag-022'], // 夏休み / グルメ / 写真映え
    budget: { amount: 18000, currency: JPY },
    thumbnailKey: 'img-thumb-065',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-119',
            details:
              '1食目は築地場外の大江戸寿司で立ち食い朝食、つまみ寿司10貫2500円🍜 マグロと中トロの目利きが市場ならでは。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '築地場外市場の中で店から店へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-119',
            details:
              '2食目は丸武の玉子焼き、出汁の効いた厚焼き卵を1切れずつ食べ歩き🍢 寺田屋で本鮪丼1500円、3食目は鳥めし鳥藤分店の親子丼。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '築地から浅草まで地下鉄銀座線', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-001',
            details:
              '夕方は浅草寺で参拝してから仲見世で人形焼き、3個400円🍣 観光客に紛れて食べ歩きする1日目の締め。',
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
            spotKey: 's-124',
            details:
              '4食目は浅草仲見世のメンチカツ、有名店の浅草メンチが1個400円🍜 揚げたてサクサクが朝の腹ごしらえに。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '仲見世通りから浅草の老舗洋食ヨシカミまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-124',
            details:
              '5食目はヨシカミのハヤシライス1500円、創業1951年の老舗洋食🍢 デミグラスソースの濃さが下町の洋食の真髄。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: '浅草から築地まで地下鉄銀座線・日比谷線', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-119',
            details:
              '締めは築地に戻って6食目、かのや築地店のうどんと天ぷら🍣 2日で6食ハシゴ、東京下町の食を堪能した夏の食い倒れ完了🍜',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 18,
    targetViews: 300,
  },

  // ===========================================================================
  // §G. u-007 island_hopper の準手作り 3 本（sm-084 〜 sm-086）
  //
  // 離島・秘境専門。前半（sm-035, sm-036）と被らない離島で3本
  // （隠岐諸島/徳之島/小笠原父島）。
  // 口調: 「島時間」「秘境」「フェリーで」🏝️⛴️
  // 日数内訳: 3日×1 / 4日×1 / 5日×1
  // バンド: 中堅 2 / 一般 1（sm-086 父島）
  // ===========================================================================

  // ---- sm-084 隠岐諸島 3日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-084',
    authorKey: 'u-007',
    title: '隠岐諸島 摩天崖と西ノ島 島時間3日間',
    description:
      '隠岐諸島は日本海に浮かぶ島後・島前の四島群、本土から最寄りの七類港でも高速船で2時間半の秘境です🏝️ 1日目は島後で水若酢神社と隠岐の歴史、2日目は西ノ島へ移動して摩天崖の絶壁を歩く、3日目は知夫里島の赤壁で帰路。隠岐は後鳥羽上皇の流刑地として知られる秘境、本土とは違う時間が流れる島時間⛴️ フェリーの時刻表を抑えれば3日で島前後3島ハシゴできる、秘境離島の入門編。',
    date: '2025-08-03T07:00:00Z',
    createdAt: '2025-08-26T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024', 'tag-010'], // 夏休み / 離島 / 秘境 / 絶景
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-074',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-113',
            details:
              '七類港から島後の西郷港まで高速船2時間半、まずは水若酢神社で参拝🏝️ 隠岐の中心島で人口1万人、本土からの距離感が島時間の入口。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 70, distance: 35.0, memo: '島後西郷港から島前西ノ島別府港まで内航船', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-113',
            details:
              '島前西ノ島の宿で1泊、夕食は岩がきと隠岐牛のステーキ。本土ではなかなか食べられない島の旨味⛴️',
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
            details:
              '西ノ島の摩天崖は日本海に切り立つ257mの大絶壁🏝️ 国賀海岸の遊歩道を歩いて摩天崖の頂上へ、足元の海と絶壁のスケール感は隠岐ならでは。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.0, memo: '摩天崖から国賀海岸通天橋まで遊歩道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-113',
            details:
              '通天橋は海食で岩が橋のようにくり抜かれた奇景、隠岐の代表的なフォトスポット⛴️ 西ノ島で2泊目、宿は別府港近くの民宿。',
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
            spotKey: 's-113',
            details:
              '最終日は知夫里島へ内航船15分、赤ハゲ山の赤壁を望む。島前カルデラの中で最も小さな島の島時間、人口600人の素朴さ🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 150, distance: 70.0, memo: '島前から本土七類港まで高速船で帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-113',
            details:
              '七類港行きの高速船で隠岐諸島を後にする。3日間で4島のうち3島を回った島時間、本土に戻ると時計の針が早く戻る感覚⛴️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 360,
  },

  // ---- sm-085 徳之島 4日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-085',
    authorKey: 'u-007',
    title: '徳之島 闘牛と犬田布岬の秘境4日間',
    description:
      '徳之島は奄美群島の中で観光客がいちばん少ない秘境離島🏝️ 4日かけて島の四隅を回ってきました。1日目は鹿児島から飛行機で徳之島亀徳港、犬田布岬で東シナ海の絶景。2日目は徳之島闘牛場で本場の闘牛観戦、地元の文化に触れる。3日目はムシロ瀬と畦プリンスビーチでウミガメ観察、4日目は朝の集落散歩で帰路⛴️ 奄美大島とは違う徳之島ならではの時間が流れる、本物の秘境離島です。',
    date: '2025-07-26T07:00:00Z',
    createdAt: '2025-08-22T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024', 'tag-002'], // 夏休み / 離島 / 秘境 / 自然
    budget: { amount: 130000, currency: JPY },
    thumbnailKey: 'img-thumb-075',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-117',
            details:
              '鹿児島空港から徳之島空港まで飛行機1時間、レンタカーで犬田布岬へ🏝️ 切り立つ断崖と東シナ海の青、観光客がほぼいない静寂が秘境の証。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '犬田布岬から亀徳港の宿まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '亀徳新港近くの民宿で1泊、夕食は島豚の塩焼きと鶏飯。徳之島の郷土料理を素朴に味わう島時間⛴️',
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
            spotKey: 's-117',
            details:
              '徳之島闘牛場で闘牛観戦、本場の闘牛は牛同士のぶつかり合いと島民の応援が熱気🏝️ 闘牛は徳之島の伝統文化、観光客向けではない地元行事。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '闘牛場から南端の井之川集落へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '井之川の集落でハジチ料理（島料理）の老舗を訪問、ヤギ汁とパパイヤ漬け⛴️ 観光ガイドに載らない島の食文化体験。',
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
            spotKey: 's-117',
            details:
              'ムシロ瀬は徳之島北端の岩礁海岸、6月-8月はウミガメの産卵が見られる秘境🏝️ 早朝に立ち寄って、波打ち際の岩の質感と海を撮影。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: 'ムシロ瀬から畦プリンスビーチまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '畦プリンスビーチでシュノーケル、サンゴと熱帯魚と運が良ければウミガメ⛴️ 観光地化されていない徳之島ならではの透明度。',
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
            spotKey: 's-117',
            details:
              '最終日は朝の集落散歩、徳之島の空き家と石垣と亜熱帯植物の組み合わせは奄美群島とは違う風景🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 60, distance: 320.0, memo: '徳之島空港から鹿児島空港へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '徳之島空港から鹿児島へ、4日間の秘境離島ハシゴは観光客の少なさが財産⛴️ 奄美群島の中で一番濃い島時間でした🏝️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 18,
    targetViews: 305,
  },

  // ---- sm-086 小笠原父島 5日（一般、夏休み、テンプレA） ----
  {
    key: 'sm-086',
    authorKey: 'u-007',
    title: '小笠原父島 おがさわら丸で行く5日間の秘境離島',
    description:
      '小笠原諸島父島は世界自然遺産、東京から船でしか行けない究極の秘境離島🏝️ 竹芝桟橋から父島まで定期船おがさわら丸で24時間、運賃片道3万円。1日目-2日目は航海、3日目は父島大村海岸でホエールウォッチング、4日目は南島ツアーで石灰岩の特殊地形、5日目は出航前に小港海岸の散策⛴️ 観光客にも東京都民にも縁遠い、日本国内なのに完全に別世界の離島。学生のうちか退職後にしか行けない時間の使い方です。',
    date: '2025-08-09T11:00:00Z',
    createdAt: '2025-09-12T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-023', 'tag-024', 'tag-010', 'tag-002'], // 夏休み / 離島 / 秘境 / 絶景 / 自然
    budget: { amount: 220000, currency: JPY },
    thumbnailKey: 'img-thumb-071',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-116',
            details:
              '竹芝桟橋11時発のおがさわら丸に乗船🏝️ 出港後は東京湾を眺めながら24時間の船旅スタート、デッキでくつろぐのが小笠原旅の入口。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 1440, distance: 1000.0, memo: '竹芝桟橋から父島二見港まで定期船おがさわら丸', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '船内2泊目、夕食は船内レストランでカレーライス。電波が完全に途切れる時間が小笠原旅の特権⛴️ 翌朝の父島着に備えて早寝。',
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
            spotKey: 's-116',
            details:
              '11時頃に父島二見港着、宿のお迎えで大村海岸近くの民宿へ🏝️ 父島の最初の景色は青い海とハイビスカス、亜熱帯の本気。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '二見港から大村海岸まで歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '大村海岸の白砂とエメラルドグリーンの海、観光客がいない貸切状態。夕方はウェザーステーションで日没を眺める⛴️',
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
            spotKey: 's-116',
            details:
              'ホエールウォッチングツアー6時間、ザトウクジラとイルカの群れに遭遇🏝️ 7月8月は出産期で親子クジラが見える、小笠原ハイシーズン。',
            imageKeys: [],
            transitSteps: [],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '夕方は宿に戻ってシャワー、夜は星空観察。光害ゼロの父島の夜空は天の川がくっきり見える別の宇宙⛴️',
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
            spotKey: 's-116',
            details:
              '南島ツアーは石灰岩の特殊地形と扇池、入島制限ありで認定ガイド付きのみ上陸可🏝️ 父島観光のハイライト、世界自然遺産の真髄。',
            imageKeys: [],
            transitSteps: [],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '南島ツアー後に小港海岸でシュノーケル、サンゴ礁と熱帯魚に囲まれる⛴️ 夕方は集落のお見送り行事、おがさわら丸出航前の伝統。',
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
            spotKey: 's-116',
            details:
              '15時出航のおがさわら丸に乗船、父島の人々が手を振る伝統のお見送り🏝️ 港から船まで島民とお別れする独特の儀式。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 1440, distance: 1000.0, memo: '父島から竹芝桟橋まで帰路24時間', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '帰路24時間、デッキで小笠原を振り返る島時間。日本国内なのにここまで遠いって体験が心に残る5日間⛴️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 6,
    targetViews: 115,
  },

  // ===========================================================================
  // §H. u-008 natsu_family の準手作り 5 本（sm-087 〜 sm-091）
  //
  // 子連れ夏休みファミリー。前半（sm-037〜sm-041）と被らないエリア。
  // 沖縄/北海道/九州/道央/名古屋を 5 本でカバー。
  // 口調: 「うちの子」「子連れOK」「夏休み」👨‍👩‍👧‍👦🐠
  // 日数内訳: 2日×2 / 3日×2 / 4日×1
  // バンド: 中堅 4 / 一般 1（sm-091 名古屋子連れ）
  // sm-088 例外: createdAt < date（事前計画）
  // ===========================================================================

  // ---- sm-087 沖縄美ら海と古宇利大橋 子連れ2日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-087',
    authorKey: 'u-008',
    title: '沖縄美ら海水族館と古宇利大橋 子連れ夏休み2日',
    description:
      'うちの子たちが「ジンベエザメ見たい！」と熱望してたので、夏休みに沖縄北部2日。1日目は美ら海水族館でジンベエザメと回遊魚、2日目は古宇利大橋でハートロックとシュノーケル。子連れOK情報としては美ら海はベビーカー貸出あり、古宇利島ビーチは浅瀬で小さい子も安心👨‍👩‍👧‍👦 移動はレンタカー、那覇空港から美ら海まで2時間半。沖縄子連れの定番ルート、夏休みの自由研究にも🐠',
    date: '2025-07-29T08:00:00Z',
    createdAt: '2025-08-15T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-010'], // 夏休み / 家族旅行 / 子連れ / 絶景
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-072',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-097',
            details:
              '美ら海水族館は朝10時着、ジンベエザメの黒潮の海大水槽は子供たちが一番釘付けになるスポット🐠 ベビーカー貸出無料、館内バリアフリー◎',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '美ら海水族館から海洋博公園内のエメラルドビーチまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              'エメラルドビーチで遊泳、ライフセーバー常駐で子連れ安心。子供たちは初めての沖縄の海で大はしゃぎ👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s097-3'],
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
            details:
              '古宇利大橋を朝渡って古宇利島へ、橋の真ん中で記念写真🐠 全長1960mの絶景ドライブは子供たちのテンションも最高。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '古宇利大橋からハートロックの駐車場へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-099',
            details:
              '古宇利島の北側ハートロックでシュノーケル、浅瀬でサンゴと熱帯魚を観察👨‍👩‍👧‍👦 自由研究のネタが揃う子連れ夏休みのハイライト。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 430,
  },

  // ---- sm-088 旭山動物園と富良野 子連れ3日（中堅、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-088',
    authorKey: 'u-008',
    title: '旭山動物園と富良野ラベンダー 子連れ夏休み3日',
    description:
      '次の夏休みは旭山動物園と富良野・美瑛を3日で計画中👨‍👩‍👧‍👦 1日目は旭山動物園でホッキョクグマとペンギン、2日目は富良野のラベンダー畑と美瑛の青い池、3日目は朝の四季彩の丘で帰路。北海道の夏は子連れに優しい気温、駐車場はどの観光地も大型対応🐠 旭山動物園の動物の見せ方は世界レベルで、子供の好奇心が爆発する場所。事前計画として今投稿しておきます🐠',
    date: '2025-07-25T09:00:00Z',
    createdAt: '2025-06-10T18:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-002'], // 夏休み / 家族旅行 / 子連れ / 自然
    budget: { amount: 105000, currency: JPY },
    thumbnailKey: 'img-thumb-052',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-053',
            details:
              '旭山動物園は朝9時開園と同時に入場、ペンギン館とホッキョクグマ館の行動展示は子供たちが一番集中して見るスポット🐠 もぐもぐタイムも午前中。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '旭山動物園から富良野のホテルへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-053',
            details:
              '夕方は旭川市内のラーメン村でラーメン、子供向けに醤油ラーメンの優しい味付け👨‍👩‍👧‍👦 富良野のホテルで1泊。',
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
            details:
              '富良野のファーム富田はラベンダー畑のメッカ、紫の絨毯と青空のコントラストは子供たちにも分かる絶景🐠 入場無料。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: 'ファーム富田から美瑛・青い池まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '美瑛・青い池はコバルトブルーの水と立ち枯れの白樺が幻想的、子供たちは「アニメみたい」と興奮👨‍👩‍👧‍👦',
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
            spotKey: 's-052',
            details:
              '最終日は朝の四季彩の丘、パッチワークの花畑とトラクターバス。子供向けにはアルパカ牧場併設で動物体験🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '美瑛から旭川空港まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '旭川空港から羽田へ帰路、3日間の北海道家族旅は自由研究と思い出が満載👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 460,
  },

  // ---- sm-089 高千穂と阿蘇 子連れ3日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-089',
    authorKey: 'u-008',
    title: '高千穂峡と阿蘇 子連れで行く九州自然3日',
    description:
      'うちの子たちが「神話の世界に行きたい」と図鑑を指差したので、高千穂と阿蘇を3日で👨‍👩‍👧‍👦 1日目は高千穂峡でボートと真名井の滝、2日目は阿蘇草千里で乗馬と中岳火口、3日目は黒川温泉で朝湯と帰路。子連れOK情報: 高千穂峡ボートは小学生から1人乗船可、草千里乗馬は引き馬で4歳から、阿蘇火口は天候で立入規制あり🐠 九州の自然と神話の世界、子供の自由研究にも最適です🐠',
    date: '2025-08-13T08:00:00Z',
    createdAt: '2025-09-05T19:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-002'], // 夏休み / 家族旅行 / 子連れ / 自然
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-053',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details:
              '高千穂峡は朝着でボート1時間、真名井の滝の真下まで漕ぐと子供たちが大歓声🐠 ライフジャケット必須、小学生以上から1人乗船可。',
            imageKeys: ['img-node-s105-1', 'img-node-s105-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '高千穂から阿蘇草千里まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '阿蘇草千里到着、夕方の草原と中岳の煙のコントラスト👨‍👩‍👧‍👦 草原で子供たちは追いかけっこ、自然の中で遊ぶ夏休みの定番。',
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
            spotKey: 's-094',
            details:
              '草千里の乗馬体験は引き馬コース1500円、4歳から可能🐠 子供たちは初めての馬に大興奮、写真スポットとしても最適。',
            imageKeys: ['img-node-s094-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: '草千里から黒川温泉まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-107',
            details:
              '黒川温泉に午後着、子連れOKの貸切風呂を予約しておくと安心。家族風呂で温泉入門、宿の夕食は子供向けメニューあり👨‍👩‍👧‍👦',
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
            spotKey: 's-107',
            details:
              '朝湯で1日スタート、宿の露天風呂で阿蘇の山並み🐠 入湯手形を使って外湯1湯ハシゴ、温泉郷の朝の散歩。',
            imageKeys: ['img-node-s107-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 120, distance: 95.0, memo: '黒川温泉から熊本空港まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '帰路に阿蘇神社で家族の旅の安全祈願、3日間の九州子連れ旅。神話と自然と温泉、夏休みの記憶👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 370,
  },

  // ---- sm-090 北海道道央 札幌・小樽・登別・洞爺 子連れ4日（中堅、夏休み、テンプレA） ----
  {
    key: 'sm-090',
    authorKey: 'u-008',
    title: '北海道道央 札幌から登別・洞爺 子連れ4日',
    description:
      '北海道道央を子連れで4日、札幌・小樽・登別・洞爺の定番コース👨‍👩‍👧‍👦 1日目は札幌大通公園と二条市場、2日目は小樽運河と北一硝子、3日目は登別温泉地獄谷と熊牧場、4日目は洞爺湖と帰路。子連れOK情報: 登別温泉は地獄谷の遊歩道がベビーカーOK、熊牧場は子供が大喜び、洞爺湖は遊覧船で湖上散歩🐠 北海道道央の王道、夏休みの家族旅にちょうど良い濃度。',
    date: '2025-08-18T08:00:00Z',
    createdAt: '2025-09-08T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-014', 'tag-008'], // 夏休み / 家族旅行 / 子連れ / 温泉
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-067',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details:
              '札幌大通公園で噴水と花壇、テレビ塔展望台から札幌の街を一望🐠 子供たちは初めての札幌ですっかり開放モード。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園から二条市場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-121',
            details:
              '夕食は二条市場で海鮮丼、子供向けのイクラとサーモン丼👨‍👩‍👧‍👦 北海道の海の幸を子連れで味わう。',
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
            details:
              '小樽運河は朝のうちに散策、ガス灯と石造倉庫の街並みは子供にも分かりやすい歴史🐠 北一硝子館でオルゴール工房体験。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '小樽から登別温泉まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-055',
            details:
              '登別温泉に夕方着、子連れOKの宿で家族風呂を予約。温泉街の地獄谷は夜のライトアップが幻想的👨‍👩‍👧‍👦',
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
            spotKey: 's-055',
            details:
              '登別地獄谷の遊歩道はベビーカーOK、噴煙と硫黄の匂いに子供たちが興奮🐠 のぼりべつクマ牧場でヒグマの餌やり体験。',
            imageKeys: ['img-node-s055-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '登別から洞爺湖までドライブ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '洞爺湖に着いて湖畔のホテルで1泊、夜は洞爺湖花火大会のロングラン花火が子供たちの夏の思い出👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s054-1', 'img-node-s054-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 4,
        nodes: [
          {
            order: 1,
            spotKey: 's-054',
            details:
              '朝の洞爺湖遊覧船で湖上散歩50分、湖の中央の中島で野生のリスを見られる日も🐠 子供たちは湖の透明度に驚いてました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: '洞爺湖から新千歳空港まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '新千歳空港から羽田へ帰路、4日間の北海道道央子連れ旅は温泉と自然と海鮮で満点👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 25,
    targetViews: 400,
  },

  // ---- sm-091 名古屋城と熱田神宮 子連れ2日（一般、テンプレA） ----
  {
    key: 'sm-091',
    authorKey: 'u-008',
    title: '名古屋城と熱田神宮 子連れで愛知の歴史2日',
    description:
      '小学生の長男が「名古屋城のしゃちほこ見たい」と社会の宿題で言うので、名古屋城と熱田神宮を子連れで2日👨‍👩‍👧‍👦 1日目は名古屋城天守と本丸御殿で歴史体験、2日目は熱田神宮で日本神話の三種の神器の伝説。子連れOK情報: 名古屋城本丸御殿は土足禁止で抱っこ紐推奨、熱田神宮は砂利道なのでベビーカーよりも抱っこ紐安心🐠 自由研究にも繋がる愛知の歴史2日、関東圏から新幹線で1泊にちょうど良い。',
    date: '2025-04-26T09:00:00Z',
    createdAt: '2025-05-15T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-013', 'tag-014', 'tag-001', 'tag-005'], // 家族旅行 / 子連れ / 歴史 / 寺社仏閣
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-056',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details:
              '名古屋城は朝9時開城と同時に入場、本丸御殿の障壁画と金鯱は子供たちにも分かりやすい歴史🐠 入城料500円、小学生100円の子連れ価格。',
            imageKeys: ['img-node-s066-1', 'img-node-s066-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '名古屋城天守閣から本丸御殿まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-066',
            details:
              '昼食は名古屋城内の金シャチ横丁でひつまぶしと味噌煮込み、子供向けに醤油ラーメンも👨‍👩‍👧‍👦 名古屋駅近くのホテルで1泊。',
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
            spotKey: 's-067',
            details:
              '熱田神宮は朝10時、鳥居から本殿までの参道は樹齢千年のクスノキが並ぶ🐠 三種の神器の草薙剣の伝説を子供に話しながら参拝。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '熱田神宮から宮きしめんの店まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-067',
            details:
              '神宮内の宮きしめんで昼食、平打ち麺と出汁が子供にも食べやすい👨‍👩‍👧‍👦 名古屋駅から新幹線で帰路、2日間の歴史子連れ旅完了。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 7,
    targetViews: 135,
  },

  // ===========================================================================
  // §I. u-009 photo_yuki の準手作り 6 本（sm-092 〜 sm-097）
  //
  // 風景写真家。前半（sm-042〜sm-047）と被らないテーマで6本
  // （美瑛/阿蘇朝霧/角島夕景/高千穂/沖縄朝景/那智雨）。
  // 口調: 「マジックアワー」「光と季節」「画になる」📸✨
  // 日数内訳: 1日×1 / 2日×4 / 3日×1
  // バンド: 中堅 4 / 人気 1（sm-093 阿蘇朝霧紅葉） / 一般 1（sm-097 那智）
  // sm-096 例外: createdAt < date（事前計画）
  // ===========================================================================

  // ---- sm-092 美瑛青い池と富良野ラベンダー 写真旅2日（中堅、夏休み、テンプレE） ----
  {
    key: 'sm-092',
    authorKey: 'u-009',
    title: '美瑛青い池と富良野ラベンダー 真夏の写真旅2日',
    description:
      '北海道の夏は色がぜんぶ濃い📸 1日目は富良野ラベンダー畑のピーク時期に合わせて午後の柔らかい光、2日目は美瑛青い池の早朝マジックアワー。富良野は紫の絨毯、美瑛はコバルトブルーの水面、季節と時間で別世界に変わる風景写真の聖地✨ レンズは広角と標準、三脚と偏光フィルター必須。夏の北海道、写真好きにとって絶対外せない2日間の聖地巡礼。',
    date: '2025-07-13T13:00:00Z',
    createdAt: '2025-08-04T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-002', 'tag-010'], // 夏休み / 写真映え / 自然 / 絶景
    budget: { amount: 45000, currency: JPY },
    thumbnailKey: 'img-thumb-051',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details:
              'ファーム富田に午後14時着、ラベンダーと青空を一画面に収める広角構図📸 偏光フィルターで紫の発色をくっきり、絞りF8で被写界深度。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: 'ファーム富田から美瑛の宿まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-046',
            details:
              '夕方のファーム富田再訪、傾いた光がラベンダーの紫を金色に変える瞬間✨ 一日の中で同じ被写体が二回違う表情を見せる時間帯。',
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
            spotKey: 's-052',
            details:
              '美瑛青い池は朝5時の青い時間がベスト📸 風がない朝なら水面に立ち枯れの白樺が完璧に映る、長秒露光2秒、ISO200。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '青い池から四季彩の丘・パッチワークの路まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '美瑛のパッチワークの路で丘の波と花畑を50mmで切り取る。マイルドセブンの丘、ケンとメリーの木、北海道の写真聖地✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 470,
  },

  // ---- sm-093 阿蘇草千里 朝霧と紅葉 写真旅2日（人気、紅葉、テンプレE） ----
  {
    key: 'sm-093',
    authorKey: 'u-009',
    title: '阿蘇草千里 朝霧と紅葉のマジックアワー写真旅2日',
    description:
      '阿蘇の紅葉と朝霧のセットは1年でわずか2週間しか撮れない限定タイミング📸 1日目夕方に阿蘇草千里到着、夕日と中岳の煙のシルエット。2日目は朝5時から草千里の朝霧、霧と草原と紅葉と中岳が一画面に揃う瞬間を狙う✨ マジックアワーは霧が出る日のみ、天気予報と気象条件のチェックが命。レンズは広角と望遠の2本、三脚必須、絞りF11で2秒露光が定番。九州の写真聖地、ベテランカメラマンの聖地巡礼ルート。',
    date: '2024-10-20T15:00:00Z',
    createdAt: '2024-11-10T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-017', 'tag-022', 'tag-002', 'tag-010'], // 紅葉 / 写真映え / 自然 / 絶景
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-055',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details:
              '阿蘇草千里に夕方16時着、夕日と中岳の煙が金色に染まる瞬間を望遠で切り取る📸 シルエット構図と逆光のフレア、阿蘇ならではの絵。',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '草千里展望所から阿蘇火口まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '阿蘇中岳火口は夕方の青い時間に撮ると噴煙が幻想的✨ 火山ガス濃度で立入規制ありの日もあるので事前確認。',
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
            spotKey: 's-094',
            details:
              '朝5時から草千里に三脚設置、朝霧が立ち昇って草原と紅葉と中岳のシルエットが浮かび上がる📸 光が来る前の青い時間、これがマジックアワー本番。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: '草千里から大観峰展望所まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '大観峰の朝霧は阿蘇カルデラ全体を覆う雲海、紅葉の山肌の上に乳白色の海が広がる✨ 阿蘇でしか撮れない秋の風景写真の真骨頂。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 65,
    targetViews: 1200,
  },

  // ---- sm-094 角島大橋 夕焼け1日（中堅、夏休み、テンプレE） ----
  {
    key: 'sm-094',
    authorKey: 'u-009',
    title: '角島大橋 夕焼けと星空を撮る山口1日フォトトリップ',
    description:
      '山口の角島大橋は日本一美しい橋と呼ばれる絶景📸 1日でじっくり撮るために、午後の青い時間→夕焼け→マジックアワー→星空の4段階で同じ橋の表情を切り取りに行きました。レンズは広角14-24mmと望遠70-200mmの2本体制、三脚は強風対策で重めのもの✨ 角島は夕焼けの時間帯が一番映える、橋と海と空のグラデーションが溶け合う瞬間がベスト。夏の弾丸写真旅、おすすめです。',
    date: '2025-07-30T15:00:00Z',
    createdAt: '2025-08-19T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-010', 'tag-011'], // 夏休み / 写真映え / 絶景 / ソロ旅
    budget: { amount: 12500, currency: JPY },
    thumbnailKey: 'img-thumb-049',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-085',
            details:
              '角島大橋は午後15時着、まずは橋の全景を広角で押さえる📸 海士ヶ瀬戸の青と橋の白のコントラスト、絞りF11で被写界深度。',
            imageKeys: ['img-node-s085-1', 'img-node-s085-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 5, distance: 1.5, memo: '角島大橋展望台から角島灯台まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-085',
            details:
              '夕方は角島灯台で日没、灯台と橋を一画面に望遠で✨ 夕焼けのオレンジが海面に反射する瞬間が一番画になる時間帯。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 5, distance: 1.5, memo: '灯台から再度角島大橋展望台まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-085',
            details:
              '夜は角島大橋で星空撮影、光害が少ない橋の上から天の川が橋脚越しに見える📸 ISO3200、絞りF2.8、シャッター20秒で星と橋の長秒露光。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 22,
    targetViews: 360,
  },

  // ---- sm-095 高千穂峡マジックアワー 2日（中堅、テンプレE） ----
  {
    key: 'sm-095',
    authorKey: 'u-009',
    title: '高千穂峡 神話の渓谷でマジックアワーを撮る2日',
    description:
      '高千穂峡は神話の世界の渓谷、写真家にとっての聖地📸 1日目は午後着でボートに乗って真名井の滝を水面から、2日目は朝5時の高千穂峡でマジックアワー。岩肌と苔と水面のグラデーションが青い時間に溶け合う瞬間は別世界✨ 観光客のいない朝のうちが本気の撮影タイム、レンズは広角14-24mmと標準24-70mm、ND8フィルターで滝の水流を絹に変える長秒露光が定番技法。九州の秘境フォトトリップ。',
    date: '2024-11-09T14:00:00Z',
    createdAt: '2024-12-01T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-024', 'tag-010', 'tag-011'], // 写真映え / 秘境 / 絶景 / ソロ旅
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-050',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details:
              '高千穂峡は午後14時着、ボート1時間で真名井の滝の真下まで漕ぐ📸 水面からの構図と岩肌、観光客が一番多い時間帯ですが定番カットは押さえる。',
            imageKeys: ['img-node-s105-1', 'img-node-s105-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'ボート乗り場から遊歩道で真名井の滝展望台まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-105',
            details:
              '夕方は遊歩道から滝の俯瞰構図、ND8フィルターで2秒露光して水の流れを絹に変える✨ 紅葉が混じる秋の高千穂は色の幅が広がる。',
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
            spotKey: 's-105',
            details:
              '朝5時の高千穂峡、観光客ゼロの中で青い時間のマジックアワー📸 岩肌と苔と滝、空のグラデーション、神話の世界がそのまま写真に。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 70.0, memo: '高千穂から青島神社まで南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-106',
            details:
              '青島神社の鬼の洗濯板、波状岩と海の対比が午前光で一番きれいに見える✨ 神話の続きの神社、宮崎の写真旅の締め。',
            imageKeys: ['img-node-s106-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 460,
  },

  // ---- sm-096 沖縄 残波岬と古宇利 朝景3日（中堅、夏休み、テンプレA、例外: createdAt < date） ----
  {
    key: 'sm-096',
    authorKey: 'u-009',
    title: '沖縄北部 残波岬と古宇利大橋 朝景マジックアワー3日',
    description:
      '次の夏は沖縄本島北部で朝景3日を計画📸 1日目は那覇着で夕方の首里城、2日目は早朝の古宇利大橋で青い時間、3日目は残波岬の朝景。沖縄の朝のマジックアワーは本州とは光の質が違う、湿度と海の青の濃さが合わさって独特の画になる✨ レンズは広角14-24mmと望遠70-200mm、NDフィルターで海面の動きを抑える長秒露光が定番。事前計画として今投稿しておきます🌅',
    date: '2025-07-12T05:00:00Z',
    createdAt: '2025-05-25T19:00:00Z', // 例外: 事前計画
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-022', 'tag-010', 'tag-023'], // 夏休み / 写真映え / 絶景 / 離島
    budget: { amount: 105000, currency: JPY },
    thumbnailKey: 'img-thumb-073',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              '那覇着、夕方の首里城公園で守礼門と石畳📸 復元工事中の正殿の外観も含めて、今しか撮れない構図がある。',
            imageKeys: ['img-node-s098-1', 'img-node-s098-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 75, distance: 60.0, memo: '那覇から古宇利島の宿へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-099',
            details:
              '古宇利島の宿に夜着、明日の朝景に備えて早寝。海風の音だけが聞こえる本島北部の静寂✨',
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
            spotKey: 's-099',
            details:
              '古宇利大橋は朝5時の青い時間、橋脚と海と空のグラデーションが一画面に📸 橋の南北両端から狙うと違う構図、マジックアワーは20分限定。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '古宇利島の北側ハートロックまで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-099',
            details:
              '古宇利島の北側ハートロックで朝のもう一画、岩のシルエットと水平線の朝日✨ 沖縄の朝は湿度が高く色がしっとり。',
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
            spotKey: 's-110',
            details:
              '残波岬は朝5時、灯台と東シナ海の絶壁を朝の柔らかい光で📸 30mの断崖と海のスケール感、広角で全景、望遠で部分を切り取る。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: '残波岬から那覇空港まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-110',
            details:
              '残波岬の灯台は登れる、上から見下ろす構図は朝の光線が一番きれい✨ 3日間の沖縄朝景フォトトリップ完了、夏の沖縄は朝こそ撮るべき。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 485,
  },

  // ---- sm-097 那智の滝と熊野古道 雨と霧 2日（一般、テンプレC 時系列） ----
  {
    key: 'sm-097',
    authorKey: 'u-009',
    title: '那智の滝と熊野古道 雨と霧の聖地写真旅2日',
    description:
      '熊野の聖地は晴天より雨の日が画になる📸 1日目は雨の熊野古道大門坂で、苔むす石畳と杉並木と雨粒のしずく、2日目は朝霧の那智の滝で日本一の直瀑を望遠で切り取る。雨の日限定の構図、観光客が少なくて撮影に集中できる✨ レンズは標準24-70mmと望遠70-200mm、防水カメラカバー必須。マジックアワーとは違う、湿度のある光の聖地。',
    date: '2024-10-05T10:00:00Z',
    createdAt: '2024-10-28T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-024', 'tag-005'], // 写真映え / 秘境 / 寺社仏閣
    budget: { amount: 32000, currency: JPY },
    thumbnailKey: 'img-thumb-060',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-041',
            details:
              '熊野古道大門坂は雨の日が本番、苔むす石畳と樹齢800年の夫婦杉に雨粒が光る📸 標準レンズでしっとりした質感を切り取る。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.8, memo: '大門坂から那智大社・那智の滝まで参道を上る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-042',
            details:
              '那智の滝の夕方、雨で水量が増えた直瀑のしぶきが霧のように立ち上る✨ ND8フィルターで2秒露光、滝の白い線が絹に変わる。',
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
            spotKey: 's-042',
            details:
              '朝6時の那智の滝、霧が立ち昇って滝と一体になる瞬間📸 観光客ゼロの中で望遠で滝壺の白いしぶきを切り取る、雨上がりの聖地。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '那智の滝から大門坂を下る帰路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-041',
            details:
              '帰路の大門坂、朝霧が苔むす石畳に立ち込めて、参道全体が乳白色に包まれる✨ 雨の翌朝にしか撮れない聖地の表情。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 155,
  },

  // ===========================================================================
  // §J. u-012 private_only の準手作り 3 本（sm-098 〜 sm-100、すべて PRIVATE）
  //
  // 仕様書 §4.2「投稿はあるが全て visibility: PRIVATE」のエッジケース。
  // 口調: メモ口調・絵文字なし・敬語なし・短文。
  // タグも控えめ、いいね・閲覧・コメントすべて 0（PRIVATE で発見されない設定）。
  // 日数内訳: 1日×1 / 2日×1 / 3日×1
  // ===========================================================================

  // ---- sm-098 関東日帰りメモ 1日 PRIVATE ----
  {
    key: 'sm-098',
    authorKey: 'u-012',
    title: '東京日帰りメモ 渋谷・原宿・上野',
    description:
      '関東日帰りで回ったメモ。渋谷スクランブルから原宿明治神宮、上野公園で昼食、夕方解散。混雑時間帯のメモ、無料スポットの記録。次回も同じ動線で回れるよう書き留める。',
    date: '2025-06-08T10:00:00Z',
    createdAt: '2025-06-12T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PRIVATE_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011'], // ソロ旅
    budget: { amount: 3500, currency: JPY },
    thumbnailKey: 'img-thumb-076',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-003',
            details: '渋谷スクランブル交差点。10時着、混雑前。スクランブル一周徒歩。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 8, distance: 2.5, memo: '渋谷から原宿までJR山手線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-018',
            details: '明治神宮。参拝のみ無料。砂利道で歩きにくい。森の中で気温下がる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 4.5, memo: '原宿から上野までJR山手線', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-019',
            details: '上野公園で昼食、不忍池でハスを見る。次回は朝の方が静か。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 0,
  },

  // ---- sm-099 京都メモ 1泊2日 PRIVATE ----
  {
    key: 'sm-099',
    authorKey: 'u-012',
    title: '京都1泊メモ 清水寺・伏見稲荷・錦市場',
    description:
      '京都1泊で回ったメモ。1日目清水寺と祇園、2日目伏見稲荷と錦市場。バス1日券600円、地下鉄+バス1日券1100円。観光地の混雑時間帯と裏道の記録。次回の動線改善のため。',
    date: '2025-03-22T08:00:00Z',
    createdAt: '2025-03-26T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PRIVATE_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-011'], // 寺社仏閣 / ソロ旅
    budget: { amount: 22000, currency: JPY },
    thumbnailKey: 'img-thumb-058',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details: '清水寺。9時着で混雑前。拝観料500円。舞台と音羽の滝。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '清水寺から祇園花見小路まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details: '祇園花見小路。撮影禁止区域あり。夕方17時頃に置屋の格子戸。',
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
            details: '伏見稲荷。朝7時着で観光客少ない。千本鳥居から奥社、稲荷山一周は2時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 18, distance: 6.0, memo: '伏見稲荷から四条河原町まで京阪・地下鉄', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details: '錦市場。お豆腐ドーナツとわらび餅。観光客多い。次回は午前中早めに。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 0,
  },

  // ---- sm-100 沖縄メモ 3日 PRIVATE ----
  {
    key: 'sm-100',
    authorKey: 'u-012',
    title: '沖縄3日メモ 美ら海・古宇利・首里',
    description:
      '沖縄3日で回ったメモ。レンタカーで本島北部・中部・南部を周回。1日目首里城と国際通り、2日目美ら海と古宇利、3日目残波岬と帰路。駐車場と料金の記録。次回の動線参考に。',
    date: '2024-11-16T08:00:00Z',
    createdAt: '2024-11-22T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PRIVATE_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011', 'tag-010'], // ソロ旅 / 絶景
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-072',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details: '首里城公園。復元工事中。守礼門と石畳。駐車場320円。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 9.0, memo: '首里から国際通りまでレンタカー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details: '国際通り。夕食ソーキそば750円。土産物屋で泡盛。駐車場高い。',
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
            spotKey: 's-097',
            details: '美ら海水族館。入館料2180円、16時以降1510円。ジンベエザメ大水槽。駐車場無料。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 20, distance: 12.0, memo: '美ら海から古宇利大橋まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-099',
            details: '古宇利大橋。橋の南北で停車スポットあり。朝の方が空いてる。',
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
            spotKey: 's-110',
            details: '残波岬。灯台料金300円。風強い。駐車場無料。朝の光が良い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '残波岬から那覇空港までレンタカー返却', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details: '空港前に国際通りで土産。次回は3日では足りない、5日要。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 0,
    targetViews: 0,
  },
];

/**
 * 准手作りルート 全 100 本統合 export
 * seed.ts 側の Route 一括 upsert に使用する。
 */
export const semiRoutes: SeedRoute[] = [
  ...semiRoutesFirstHalf,
  ...semiRoutesSecondHalf,
];
