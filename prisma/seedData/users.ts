// Routem シードデータ: ユーザー 33人 (コア 10 + エッジ 3 + モブ 20)
//
// 仕様書 docs/seed-spec.md §4「ペルソナ設計」と完全一致。
// name / email / age / bio はコア (§4.1) とエッジ (§4.2) の表から完全転記。
// u-013 longbio_chan の bio は §4.2 末尾の長文をそのまま使う（要約・改変禁止）。
//
// ⚠️ 重要: User.id は持たない。Supabase Auth が UUID を払い出す設計のため、
// toUuid() で生成すると Auth UUID と不整合になり FK 違反でデータ全滅する。
// 識別は key（'u-001', 'mob-001' 等）で行い、prisma/seed.ts 側で
// Map<userKey, supabaseAuthUserId> を構築して以降の関連レコードを解決する。
//
// 画像割り当て（決定論的）:
//   - アイコン: userIconImages[1..15] が女性、[16..30] が男性。
//     コア/エッジでは性別に合わせて手動割り当て、モブは残りを連番で配分。
//     u-011 quiet_user, mob-016〜mob-020 はアイコンなし (null)。
//   - 背景: userBackgroundImages 20 枚を 0-indexed で循環（被り可）。
//     u-011 quiet_user, u-013 longbio_chan のみ背景なし (仕様書 §11.5)。

import { Language, Locale } from '@prisma/client';
import type { SeedUser } from './types';

// 全ユーザー共通の Supabase Auth テストパスワード。
// シード環境専用なので git に乗ってよい。プロダクション環境では当然使用しない。
const TEST_PASSWORD = 'RoutemSeed2026!';

// ---------------------------------------------------------------------------
// §A. コアペルソナ 10人 (仕様書 §4.1)
// ---------------------------------------------------------------------------

export const coreUsers: SeedUser[] = [
  {
    key: 'u-001',
    name: 'たびまる',
    email: 'tabimaru@routem.test',
    password: TEST_PASSWORD,
    bio: '47都道府県制覇しました。週末は必ずどこかへ。発信を通じて旅の楽しさを広げたいです🚄',
    age: 32,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-016', // 男性 30代
    backgroundKey: 'img-bg-001',
  },
  {
    key: 'u-002',
    name: 'sakura_trip',
    email: 'sakura@routem.test',
    password: TEST_PASSWORD,
    bio: 'カフェと寺社仏閣めぐりが好き。京都在住、関西中心に発信しています。',
    age: 28,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-001', // 女性 20代
    backgroundKey: 'img-bg-002',
  },
  {
    key: 'u-003',
    name: 'kenji_outdoor',
    email: 'kenji@routem.test',
    password: TEST_PASSWORD,
    bio: '山と海と温泉。家族4人でキャンピングカー旅。',
    age: 41,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-017', // 男性 40代
    backgroundKey: 'img-bg-003',
  },
  {
    key: 'u-004',
    name: 'mio_couple',
    email: 'mio@routem.test',
    password: TEST_PASSWORD,
    bio: '彼と二人旅の記録📷 記念日旅行とご褒美ステイ多め。',
    age: 26,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-002', // 女性 20代
    backgroundKey: 'img-bg-004',
  },
  {
    key: 'u-005',
    name: 'hayato_solo',
    email: 'hayato@routem.test',
    password: TEST_PASSWORD,
    bio: '学生、青春18きっぷの民。安く深く。',
    age: 22,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-018', // 男性 20代
    backgroundKey: 'img-bg-005',
  },
  {
    key: 'u-006',
    name: 'gourmet_aki',
    email: 'aki@routem.test',
    password: TEST_PASSWORD,
    bio: '食べ歩き専門。ミシュランからB級まで。1日5食。',
    age: 35,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-003', // 中性的ニックネーム → 女性 30代に振る
    backgroundKey: 'img-bg-006',
  },
  {
    key: 'u-007',
    name: 'island_hopper',
    email: 'shun@routem.test',
    password: TEST_PASSWORD,
    bio: '離島専門。日本に有人島400以上あるって知ってた？',
    age: 38,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-019', // 男性 30代
    backgroundKey: 'img-bg-007',
  },
  {
    key: 'u-008',
    name: 'natsu_family',
    email: 'natsu@routem.test',
    password: TEST_PASSWORD,
    bio: '小学生2人と夫の4人家族。子連れOK情報を発信中。',
    age: 39,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-004', // 女性 30代
    backgroundKey: 'img-bg-008',
  },
  {
    key: 'u-009',
    name: 'photo_yuki',
    email: 'yuki@routem.test',
    password: TEST_PASSWORD,
    bio: '風景写真家。光と季節を追いかけて。',
    age: 30,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-005', // 中性的ニックネーム → 女性 30代に振る
    backgroundKey: 'img-bg-009',
  },
  {
    key: 'u-010',
    name: 'newbie_haru',
    email: 'haru@routem.test',
    password: TEST_PASSWORD,
    bio: 'はじめまして！旅好きになりたい初心者です。',
    age: 24,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-006', // 中性的ニックネーム → 女性 20代に振る
    backgroundKey: 'img-bg-010',
  },
];

// ---------------------------------------------------------------------------
// §B. エッジケース 3人 (仕様書 §4.2)
// ---------------------------------------------------------------------------

export const edgeCaseUsers: SeedUser[] = [
  {
    key: 'u-011',
    name: 'quiet_user',
    email: 'quiet@routem.test',
    password: TEST_PASSWORD,
    bio: '', // 仕様書 §4.2「（空文字）」
    age: null,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,       // §11.5: アイコンなし
    backgroundKey: null, // §11.5: 背景なし
  },
  {
    key: 'u-012',
    name: 'private_only',
    email: 'private@routem.test',
    password: TEST_PASSWORD,
    bio: 'プライベート専用です。',
    age: null,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-020', // 性別不明 → 男性枠の余りに割り当て
    backgroundKey: 'img-bg-011',
  },
  {
    key: 'u-013',
    name: 'longbio_chan',
    email: 'longbio@routem.test',
    password: TEST_PASSWORD,
    // 仕様書 §4.2「u-013 の bio（完全転記）」より。改行・記号も原文通り。
    bio: 'はじめまして、旅と食と猫をこよなく愛する社会人5年目のOLです🐈 北は北海道の知床から南は沖縄の波照間島まで、これまで国内47都道府県のうち42県を訪れました（残り5県、絶賛コンプ中です）。特に好きなのは、ガイドブックには載っていないような小さな町の喫茶店や、地元の人しか行かないような銭湯、夜の路地裏の小さな居酒屋。観光地化されすぎていない、その土地の生活が見える場所が大好物です。週末は必ずどこかへ出かけていて、有給は全て旅行に使うタイプ。Routemでは、私の旅の記録と、次に行きたい場所のメモを兼ねて投稿しています。同じような価値観の方、フォローしてもらえると嬉しいです。質問やおすすめ情報、いつでも歓迎です！',
    age: null,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-007', // OL → 女性枠
    backgroundKey: null,     // §11.5: 背景なし
  },
];

// ---------------------------------------------------------------------------
// §C. モブユーザー 20人 (仕様書 §4.3)
//
// mob-001〜mob-010: 投稿1〜2本、フォロー多め、よくいいねする層
// mob-011〜mob-020: 投稿0、ROM 専
//
// 仕様書 §11.5「mob_011〜mob_020 の半分はアイコンなし」より、
// mob-016〜mob-020 を null とする（ROM 専のうち後半半分）。
// ---------------------------------------------------------------------------

export const mobUsers: SeedUser[] = [
  {
    key: 'mob-001',
    name: 'mob_user_001',
    email: 'mob001@routem.test',
    password: TEST_PASSWORD,
    bio: '東京近郊で日帰り旅をよくします。',
    age: 25,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-008', // 残りの女性枠から
    backgroundKey: 'img-bg-012',
  },
  {
    key: 'mob-002',
    name: 'mob_user_002',
    email: 'mob002@routem.test',
    password: TEST_PASSWORD,
    bio: '週末はカフェ巡り。最近は東京駅周辺がお気に入り。',
    age: 30,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-009',
    backgroundKey: 'img-bg-013',
  },
  {
    key: 'mob-003',
    name: 'mob_user_003',
    email: 'mob003@routem.test',
    password: TEST_PASSWORD,
    bio: '出張ついでの観光が好きな会社員です。',
    age: 35,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-010',
    backgroundKey: 'img-bg-014',
  },
  {
    key: 'mob-004',
    name: 'mob_user_004',
    email: 'mob004@routem.test',
    password: TEST_PASSWORD,
    bio: '温泉と美味しいごはん目当てに旅行しています。',
    age: 28,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-011',
    backgroundKey: 'img-bg-015',
  },
  {
    key: 'mob-005',
    name: 'mob_user_005',
    email: 'mob005@routem.test',
    password: TEST_PASSWORD,
    bio: 'バイクで全国を巡るのが目標。',
    age: 33,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-012',
    backgroundKey: 'img-bg-016',
  },
  {
    key: 'mob-006',
    name: 'mob_user_006',
    email: 'mob006@routem.test',
    password: TEST_PASSWORD,
    bio: '北海道在住。地元のおすすめ情報を投稿します。',
    age: 38,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-013',
    backgroundKey: 'img-bg-017',
  },
  {
    key: 'mob-007',
    name: 'mob_user_007',
    email: 'mob007@routem.test',
    password: TEST_PASSWORD,
    bio: '神社仏閣巡りが趣味です。',
    age: 26,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-014',
    backgroundKey: 'img-bg-018',
  },
  {
    key: 'mob-008',
    name: 'mob_user_008',
    email: 'mob008@routem.test',
    password: TEST_PASSWORD,
    bio: '夫婦で月一旅行。子供がいないうちに色々行きたい。',
    age: 31,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-015', // 女性枠の最後
    backgroundKey: 'img-bg-019',
  },
  {
    key: 'mob-009',
    name: 'mob_user_009',
    email: 'mob009@routem.test',
    password: TEST_PASSWORD,
    bio: '日帰り登山が中心の山好きです。',
    age: 24,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-021', // 残りの男性枠から
    backgroundKey: 'img-bg-020',
  },
  {
    key: 'mob-010',
    name: 'mob_user_010',
    email: 'mob010@routem.test',
    password: TEST_PASSWORD,
    bio: '撮り鉄として鉄道旅メインで楽しんでいます。',
    age: 40,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-022',
    backgroundKey: 'img-bg-001', // 20枚を循環
  },
  {
    key: 'mob-011',
    name: 'mob_user_011',
    email: 'mob011@routem.test',
    password: TEST_PASSWORD,
    bio: 'ROM 専。気になる旅のメモ集めとして使ってます。',
    age: 22,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-023',
    backgroundKey: 'img-bg-002',
  },
  {
    key: 'mob-012',
    name: 'mob_user_012',
    email: 'mob012@routem.test',
    password: TEST_PASSWORD,
    bio: '皆さんの投稿を参考にしている初心者です。',
    age: 27,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-024',
    backgroundKey: 'img-bg-003',
  },
  {
    key: 'mob-013',
    name: 'mob_user_013',
    email: 'mob013@routem.test',
    password: TEST_PASSWORD,
    bio: 'いつか行きたい場所を保存中。',
    age: 29,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-025',
    backgroundKey: 'img-bg-004',
  },
  {
    key: 'mob-014',
    name: 'mob_user_014',
    email: 'mob014@routem.test',
    password: TEST_PASSWORD,
    bio: '九州の情報を集めるアカウントです。',
    age: 36,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-026',
    backgroundKey: 'img-bg-005',
  },
  {
    key: 'mob-015',
    name: 'mob_user_015',
    email: 'mob015@routem.test',
    password: TEST_PASSWORD,
    bio: 'カップル旅行の参考に色々見ています。',
    age: 32,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: 'img-icon-027',
    backgroundKey: 'img-bg-006',
  },
  // ---- mob-016 〜 mob-020: §11.5 によりアイコンなし ----
  {
    key: 'mob-016',
    name: 'mob_user_016',
    email: 'mob016@routem.test',
    password: TEST_PASSWORD,
    bio: '旅好きですがまだ投稿していません。',
    age: 23,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,
    backgroundKey: 'img-bg-007',
  },
  {
    key: 'mob-017',
    name: 'mob_user_017',
    email: 'mob017@routem.test',
    password: TEST_PASSWORD,
    bio: '地方在住。都会の旅行情報を集めるのが楽しい。',
    age: 41,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,
    backgroundKey: 'img-bg-008',
  },
  {
    key: 'mob-018',
    name: 'mob_user_018',
    email: 'mob018@routem.test',
    password: TEST_PASSWORD,
    bio: '家族で行ける場所を物色中。',
    age: 34,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,
    backgroundKey: 'img-bg-009',
  },
  {
    key: 'mob-019',
    name: 'mob_user_019',
    email: 'mob019@routem.test',
    password: TEST_PASSWORD,
    bio: 'いつか海外も行きたいけどまずは国内から。',
    age: 45,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,
    backgroundKey: 'img-bg-010',
  },
  {
    key: 'mob-020',
    name: 'mob_user_020',
    email: 'mob020@routem.test',
    password: TEST_PASSWORD,
    bio: 'おすすめの絶景スポットがあれば教えてください。',
    age: 37,
    locale: Locale.JA,
    language: Language.JA,
    iconKey: null,
    backgroundKey: 'img-bg-011',
  },
];

// ---------------------------------------------------------------------------
// 全ユーザー統合 export
// seed.ts で User テーブルへの一括 ensureAuthUser に使用する。
// ---------------------------------------------------------------------------

export const allUsers: SeedUser[] = [...coreUsers, ...edgeCaseUsers, ...mobUsers];
