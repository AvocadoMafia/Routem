// Routem シードデータ: 画像 URL プール（フェーズ 1: ユーザーアイコン 30 + 背景 20）
//
// 仕様書 docs/seed-spec.md §11「画像 URL 戦略」と一致。
// すべて Unsplash の外部 URL を直接使い、DB へは
//   Image.status = EXTERNAL / Image.key = null / Image.url = ここの url
// で投入する。next.config.ts の images.remotePatterns に
//   { protocol: 'https', hostname: 'images.unsplash.com' }
// を追加しないと next/image が 400 を返すので注意。
//
// URL 形式: https://images.unsplash.com/photo-{ID}?w={width}&q={quality}&auto=format
//   - アイコン: w=256,  q=80
//   - 背景:     w=1600, q=80
//
// 各 ID は Unsplash 検索ページから抽出した後、HTTP 200 OK を WebFetch で
// 個別検証済み（フェーズ 1 全 50 枚 ＝ アイコン 30 + 背景 20）。
// 検証ログ（採用 / 不採用の内訳）は本タスクの完了報告を参照。
//
// key は 'img-icon-001' / 'img-bg-001' 形式。DB 保存時に
// toUuid('image', key) で決定論的 UUID に変換される（仕様書 §13.1）。

import { ImageType } from '@prisma/client';
import type { SeedImage } from './types';

// ---------------------------------------------------------------------------
// ユーザーアイコン（30 枚）
//
// 各ユーザーに 1 枚ずつ固有割り当てする想定（仕様書 §11.3）。
// 性別配分: 女性 15 + 男性 15。具体的なペルソナへのマッピングは
// prisma/seedData/users.ts 側で決める。
//   - 女性ペルソナ候補: u-002 sakura_trip / u-004 mio_couple /
//     u-008 natsu_family + モブ女性
//   - 男性ペルソナ候補: u-001 たびまる / u-003 kenji_outdoor /
//     u-005 hayato_solo / u-007 island_hopper + モブ男性
//   - 中性的ニックネーム（u-006 aki / u-009 yuki / u-010 haru）は
//     ペルソナ設計者の判断で振る
// 抽出元検索クエリ: japanese-woman-portrait / asian-woman-smile /
// japanese-man-face / asian-man-portrait
// ---------------------------------------------------------------------------

export const userIconImages: SeedImage[] = [
  // --- 女性 15 枚 ---
  { key: 'img-icon-001', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1586181899465-54e1c911a1eb?w=256&q=80&auto=format' },
  { key: 'img-icon-002', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1624706477323-a31e11c3ea1f?w=256&q=80&auto=format' },
  { key: 'img-icon-003', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1732209988983-f88c9b543212?w=256&q=80&auto=format' },
  { key: 'img-icon-004', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1624091844772-554661d10173?w=256&q=80&auto=format' },
  { key: 'img-icon-005', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1633531008092-055a03a8ea0e?w=256&q=80&auto=format' },
  { key: 'img-icon-006', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1697731133066-a1b450b31725?w=256&q=80&auto=format' },
  { key: 'img-icon-007', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1622649217024-a6fb1b017e9b?w=256&q=80&auto=format' },
  { key: 'img-icon-008', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1693305991125-1b87c60e5578?w=256&q=80&auto=format' },
  { key: 'img-icon-009', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1635375296298-7026a6ba8fde?w=256&q=80&auto=format' },
  { key: 'img-icon-010', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1659287119710-888f78a1a73b?w=256&q=80&auto=format' },
  { key: 'img-icon-011', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1600481176431-47ad2ab2745d?w=256&q=80&auto=format' },
  { key: 'img-icon-012', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1643646805556-350c057663dd?w=256&q=80&auto=format' },
  { key: 'img-icon-013', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?w=256&q=80&auto=format' },
  { key: 'img-icon-014', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1554226761-beb7579ea7fb?w=256&q=80&auto=format' },
  { key: 'img-icon-015', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1668876220502-5dfd1e9709a0?w=256&q=80&auto=format' },

  // --- 男性 15 枚 ---
  { key: 'img-icon-016', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1664255898524-0cf78e27416f?w=256&q=80&auto=format' },
  { key: 'img-icon-017', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1624395213043-fa2e123b2656?w=256&q=80&auto=format' },
  { key: 'img-icon-018', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1619193597120-1d1edb42e34b?w=256&q=80&auto=format' },
  { key: 'img-icon-019', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1630572780329-e051273e980f?w=256&q=80&auto=format' },
  { key: 'img-icon-020', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1664255898007-37e69038d38c?w=256&q=80&auto=format' },
  { key: 'img-icon-021', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1664255898978-90578f6bd1ac?w=256&q=80&auto=format' },
  { key: 'img-icon-022', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1720467438431-c1b5659a933e?w=256&q=80&auto=format' },
  { key: 'img-icon-023', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1707202282188-f8d03b2791b5?w=256&q=80&auto=format' },
  { key: 'img-icon-024', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1628134667148-1a5827a87702?w=256&q=80&auto=format' },
  { key: 'img-icon-025', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=256&q=80&auto=format' },
  { key: 'img-icon-026', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1599147427753-f9d14563933d?w=256&q=80&auto=format' },
  { key: 'img-icon-027', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1724979215609-585e3f42b992?w=256&q=80&auto=format' },
  { key: 'img-icon-028', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1633177188754-980c2a6b6266?w=256&q=80&auto=format' },
  { key: 'img-icon-029', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1623512083603-5068ca8290f4?w=256&q=80&auto=format' },
  { key: 'img-icon-030', type: ImageType.USER_ICON, url: 'https://images.unsplash.com/photo-1718986017030-b6ba6f96827b?w=256&q=80&auto=format' },
];

// ---------------------------------------------------------------------------
// ユーザー背景（20 枚）
//
// 日本の風景写真。横長で映える構図。被って良い（ペルソナ間で同じ背景が
// 使われても問題ない、仕様書 §11.3）。
// 抽出元検索クエリ: japan-landscape / mount-fuji / kyoto-temple
// ---------------------------------------------------------------------------

export const userBackgroundImages: SeedImage[] = [
  // --- 一般風景（japan-landscape）12 枚 ---
  { key: 'img-bg-001', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=80&auto=format' },
  { key: 'img-bg-002', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1713608062733-d57898fb62a9?w=1600&q=80&auto=format' },
  { key: 'img-bg-003', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1657199372069-bd8cb49315c4?w=1600&q=80&auto=format' },
  { key: 'img-bg-004', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=80&auto=format' },
  { key: 'img-bg-005', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1520312501384-dbdb83a1cb11?w=1600&q=80&auto=format' },
  { key: 'img-bg-006', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1466354424719-343280fe118b?w=1600&q=80&auto=format' },
  { key: 'img-bg-007', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1610375228550-d5cabc1d4090?w=1600&q=80&auto=format' },
  { key: 'img-bg-008', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1526374073174-7661a8028eb4?w=1600&q=80&auto=format' },
  { key: 'img-bg-009', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1600&q=80&auto=format' },
  { key: 'img-bg-010', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1551241090-67de81d3541c?w=1600&q=80&auto=format' },
  { key: 'img-bg-011', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=1600&q=80&auto=format' },
  { key: 'img-bg-012', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1600&q=80&auto=format' },
  { key: 'img-bg-013', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1510307853572-cd978ae81304?w=1600&q=80&auto=format' },
  { key: 'img-bg-014', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1690685302792-8e9c47bbe4c9?w=1600&q=80&auto=format' },

  // --- 富士山（mount-fuji）3 枚 ---
  { key: 'img-bg-015', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1600&q=80&auto=format' },
  { key: 'img-bg-016', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1610375229632-c7158c35a537?w=1600&q=80&auto=format' },
  { key: 'img-bg-017', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=1600&q=80&auto=format' },

  // --- 京都・寺社（kyoto-temple）3 枚 ---
  { key: 'img-bg-018', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1614360380098-63e2fbfda70b?w=1600&q=80&auto=format' },
  { key: 'img-bg-019', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1637679105331-a0cea188b83e?w=1600&q=80&auto=format' },
  { key: 'img-bg-020', type: ImageType.USER_BG, url: 'https://images.unsplash.com/photo-1717060772955-9c810b87f83c?w=1600&q=80&auto=format' },
];

// ---------------------------------------------------------------------------
// ルートサムネ（80 枚 = 手作り50本専用 + 汎用30枚）
//
// 仕様書 docs/seed-spec.md §11.3 参照。手作り 50 本（r-001〜r-050）は
// それぞれ専用の写真を img-thumb-001〜050 に固有割り当てする。
// 残り 30 枚（img-thumb-051〜080）は 6 カテゴリ × 5 枚で「準手作り 100 本
// + 量産 100 本」のサムネを被らせて使うためのプール。
//
// URL は w=1200, q=80（横長サムネ用）。
// 全 80 枚すべて WebFetch で 200 OK を個別検証済み。
//
// 各エントリのコメントに対応ルート ID と Unsplash 検索クエリを残してある。
// 「※○○系の流用」とコメントされているものは、特定スポットの写真が
// Unsplash に少ないため類似カテゴリから流用したもの（後で差し替えやすい）。
// ---------------------------------------------------------------------------

export const routeThumbnailImages: SeedImage[] = [
  // ===========================================================
  // A. 手作り 50 本専用サムネ（img-thumb-001 〜 050）
  // ===========================================================

  // --- u-001 たびまる（10本） ---
  { key: 'img-thumb-001', /* r-001 沖縄本島3泊4日 / okinawa-beach */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1610971250019-f677bc1300be?w=1200&q=80&auto=format' },
  { key: 'img-thumb-002', /* r-002 北海道5日間 / hokkaido-summer */                 type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1603435580027-f30889418372?w=1200&q=80&auto=format' },
  { key: 'img-thumb-003', /* r-003 高尾山〜河口湖 / fuji-mountain */                type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1576675466684-456bcdeccfbf?w=1200&q=80&auto=format' },
  { key: 'img-thumb-004', /* r-004 鳥取砂丘 / tottori-sand */                       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1691506877501-bcc804a150d0?w=1200&q=80&auto=format' },
  { key: 'img-thumb-005', /* r-005 京都早朝清水寺 / kyoto-kiyomizu-temple */         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1669002232151-4eee981d4acc?w=1200&q=80&auto=format' },
  { key: 'img-thumb-006', /* r-006 屋久島縄文杉 / yakushima */                       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1723536415988-318f84346aac?w=1200&q=80&auto=format' },
  { key: 'img-thumb-007', /* r-007 金沢2日間 / kanazawa-garden */                    type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1705333126839-bfad0503313e?w=1200&q=80&auto=format' },
  { key: 'img-thumb-008', /* r-008 軽井沢2泊3日 / karuizawa-japan */                 type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1706596416494-ea4671ad1489?w=1200&q=80&auto=format' },
  { key: 'img-thumb-009', /* r-009 高千穂と黒川温泉 / takachiho-gorge */              type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1575027251078-dcf2be2ddb3f?w=1200&q=80&auto=format' },
  { key: 'img-thumb-010', /* r-010 飛騨高山〜白川郷〜金沢 / shirakawago */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1560865612-70efb2c7fd57?w=1200&q=80&auto=format' },

  // --- u-002 sakura_trip（8本） ---
  { key: 'img-thumb-011', /* r-011 伏見稲荷早朝 / kyoto-kiyomizu-temple */             type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1675659262258-1fea895c6b11?w=1200&q=80&auto=format' },
  { key: 'img-thumb-012', /* r-012 京都カフェ巡り / kyoto-cafe-machiya（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1707126186318-a3dde00d600e?w=1200&q=80&auto=format' },
  { key: 'img-thumb-013', /* r-013 奈良公園と鹿 / nara-deer-park */                   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1755456974212-430fa27f1d71?w=1200&q=80&auto=format' },
  { key: 'img-thumb-014', /* r-014 道頓堀フルコース / dotonbori-osaka */              type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1591224858513-b37c02197cff?w=1200&q=80&auto=format' },
  { key: 'img-thumb-015', /* r-015 高野山1泊宿坊 / koyasan */                          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1574095203563-aa3b2519ab33?w=1200&q=80&auto=format' },
  { key: 'img-thumb-016', /* r-016 城崎温泉浴衣 / kinosaki-onsen（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1644413280492-27c3b7801791?w=1200&q=80&auto=format' },
  { key: 'img-thumb-017', /* r-017 嵐山保津川下り / arashiyama-bamboo */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1670735845005-09c877eb2853?w=1200&q=80&auto=format' },
  { key: 'img-thumb-018', /* r-018 神戸三宮〜中華街 / kobe-japan（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1559480671-12ceff3e511d?w=1200&q=80&auto=format' },

  // --- u-003 kenji_outdoor（5本） ---
  { key: 'img-thumb-019', /* r-019 道東縦断4泊5日 / hokkaido-summer */                 type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1624112931739-4f84f574f3dd?w=1200&q=80&auto=format' },
  { key: 'img-thumb-020', /* r-020 上高地河童橋 / kamikochi */                          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1731897510082-e5f28ed72e34?w=1200&q=80&auto=format' },
  { key: 'img-thumb-021', /* r-021 阿蘇草千里乗馬 / aso-japan */                        type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=80&auto=format' },
  { key: 'img-thumb-022', /* r-022 ニセコアクティビティ / hokkaido-summer */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1659655977437-c0098ea6805d?w=1200&q=80&auto=format' },
  { key: 'img-thumb-023', /* r-023 立山黒部アルペン / tateyama-kurobe（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1723727910824-bd8aff56c30e?w=1200&q=80&auto=format' },

  // --- u-004 mio_couple（5本） ---
  { key: 'img-thumb-024', /* r-024 別府由布院全室露天 / beppu-japan */                  type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1698877540112-89b42bbf78b5?w=1200&q=80&auto=format' },
  { key: 'img-thumb-025', /* r-025 宮古島オーシャンビュー / miyakojima */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1664888883015-bd23fd1147a9?w=1200&q=80&auto=format' },
  { key: 'img-thumb-026', /* r-026 京都老舗旅館 / kyoto-kiyomizu-temple */              type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1729864881494-d96345092845?w=1200&q=80&auto=format' },
  { key: 'img-thumb-027', /* r-027 箱根美術館 / hakone-japan */                         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1733413215296-958bc8ce2b42?w=1200&q=80&auto=format' },
  { key: 'img-thumb-028', /* r-028 軽井沢万平ホテル / karuizawa-japan */                type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1720704796711-01c4e359ca16?w=1200&q=80&auto=format' },

  // --- u-005 hayato_solo（3本） ---
  { key: 'img-thumb-029', /* r-029 18きっぷ東京〜京都 / shinkansen */                   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1514337224818-9787cf717f2a?w=1200&q=80&auto=format' },
  { key: 'img-thumb-030', /* r-030 学生ソロ沖縄 / okinawa-beach */                      type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1631594995853-c7a17fbb7105?w=1200&q=80&auto=format' },
  { key: 'img-thumb-031', /* r-031 2万円沖縄 / okinawa-beach */                         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1578809606407-567084e461a6?w=1200&q=80&auto=format' },

  // --- u-006 gourmet_aki（6本） ---
  { key: 'img-thumb-032', /* r-032 福岡食い倒れ / ramen-japan */                         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?w=1200&q=80&auto=format' },
  { key: 'img-thumb-033', /* r-033 大阪粉もん / dotonbori-osaka */                       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1713925104991-57f3a9feed52?w=1200&q=80&auto=format' },
  { key: 'img-thumb-034', /* r-034 函館朝市と夜景 / hakodate-night-view（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1706875311168-bd3b08547236?w=1200&q=80&auto=format' },
  { key: 'img-thumb-035', /* r-035 仙台牛タン三軒 / sendai-japan（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1697289318826-c3b456196f1c?w=1200&q=80&auto=format' },
  { key: 'img-thumb-036', /* r-036 名古屋めし全部 / nagoya-castle */                     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1747546314703-6c4fc20c5a37?w=1200&q=80&auto=format' },
  { key: 'img-thumb-037', /* r-037 金沢近江町海鮮 / kanazawa-garden */                   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1714997177229-b44004464aa5?w=1200&q=80&auto=format' },

  // --- u-007 island_hopper（5本） ---
  { key: 'img-thumb-038', /* r-038 波照間島最南端 / okinawa-beach ※南国島の流用 */       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1729290098101-fef6e9be922d?w=1200&q=80&auto=format' },
  { key: 'img-thumb-039', /* r-039 利尻礼文花の浮島 / furano-lavender ※花畑の流用 */     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1626911635167-0b3006fbda39?w=1200&q=80&auto=format' },
  { key: 'img-thumb-040', /* r-040 小笠原父島5泊6日 / miyakojima ※島の流用 */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1664888883053-2b68ebd16502?w=1200&q=80&auto=format' },
  { key: 'img-thumb-041', /* r-041 隠岐諸島4島 / oki-islands（フェーズ3+追加で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1495161963834-ce3d2023df2a?w=1200&q=80&auto=format' },
  { key: 'img-thumb-042', /* r-042 徳之島 / kagoshima-japan（フェーズ3+追加で流用→鹿児島県内画像に差し替え。徳之島直撮り無し） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1704686508379-8ee92cad45f6?w=1200&q=80&auto=format' },

  // --- u-008 natsu_family（4本） ---
  { key: 'img-thumb-043', /* r-043 子連れ沖縄美ら海 / okinawa-beach */                   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1754228811035-d220f70b86d9?w=1200&q=80&auto=format' },
  { key: 'img-thumb-044', /* r-044 富士山五合目河口湖 / fuji-mountain */                 type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=1200&q=80&auto=format' },
  { key: 'img-thumb-045', /* r-045 軽井沢おもちゃ草津 / karuizawa-japan */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1706596365171-b0524cd890c6?w=1200&q=80&auto=format' },
  { key: 'img-thumb-046', /* r-046 ハウステンボス長崎 / huis-ten-bosch（フェーズ3+追加で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1513242285-8905cc370848?w=1200&q=80&auto=format' },

  // --- u-009 photo_yuki（4本） ---
  { key: 'img-thumb-047', /* r-047 美瑛青い池1泊 / biei-japan */                          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1755937304340-45b900eb56c1?w=1200&q=80&auto=format' },
  { key: 'img-thumb-048', /* r-048 上高地朝霧 / kamikochi */                              type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1660328916952-47b013013e95?w=1200&q=80&auto=format' },
  { key: 'img-thumb-049', /* r-049 角島大橋 / tsunoshima-bridge（フェーズ3で流用→専用に差し替え） */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1639798479313-20c174cfc5ef?w=1200&q=80&auto=format' },
  { key: 'img-thumb-050', /* r-050 高千穂峡マジックアワー / takachiho-gorge */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1729440174930-1e5c5cfa573c?w=1200&q=80&auto=format' },

  // ===========================================================
  // B. 汎用旅行サムネ（img-thumb-051 〜 080、6 カテゴリ × 5 枚）
  // 準手作り 100 本 + 量産 100 本のサムネに被らせて使う
  // ===========================================================

  // --- 夏景色・自然（5枚） ---
  { key: 'img-thumb-051', /* B 夏景色 / biei-japan */          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1735298954705-b38de4186813?w=1200&q=80&auto=format' },
  { key: 'img-thumb-052', /* B 夏景色 / biei-japan */          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1686672711914-d82878928929?w=1200&q=80&auto=format' },
  { key: 'img-thumb-053', /* B 夏景色 / biei-japan */          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1755937139737-2fbd8a03124d?w=1200&q=80&auto=format' },
  { key: 'img-thumb-054', /* B 夏景色 / hokkaido-summer */     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1696677049696-927e3d1cfbb5?w=1200&q=80&auto=format' },
  { key: 'img-thumb-055', /* B 夏景色 / aso-japan */           type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1574236170878-f66e35f83207?w=1200&q=80&auto=format' },

  // --- 寺社仏閣・鳥居（5枚） ---
  { key: 'img-thumb-056', /* B 寺社 / kyoto-kiyomizu-temple */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1763366243805-63d4aee2c658?w=1200&q=80&auto=format' },
  { key: 'img-thumb-057', /* B 寺社 / kyoto-kiyomizu-temple */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1595923868018-3feccc1c34f7?w=1200&q=80&auto=format' },
  { key: 'img-thumb-058', /* B 寺社 / kyoto-kiyomizu-temple */ type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1678599059455-0afe61ea38a2?w=1200&q=80&auto=format' },
  { key: 'img-thumb-059', /* B 寺社 / koyasan */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1669876105402-2a406d90acee?w=1200&q=80&auto=format' },
  { key: 'img-thumb-060', /* B 寺社 / koyasan */               type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1713508457196-3043f11bc94f?w=1200&q=80&auto=format' },

  // --- 食・グルメ（5枚） ---
  { key: 'img-thumb-061', /* B 食 / ramen-japan */             type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1632440722549-692fc6af969e?w=1200&q=80&auto=format' },
  { key: 'img-thumb-062', /* B 食 / ramen-japan */             type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1734313276354-75c96b3c0c36?w=1200&q=80&auto=format' },
  { key: 'img-thumb-063', /* B 食 / ramen-japan */             type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1496114212242-bac8bd9de53d?w=1200&q=80&auto=format' },
  { key: 'img-thumb-064', /* B 食 / sushi-japanese */          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80&auto=format' },
  { key: 'img-thumb-065', /* B 食 / sushi-japanese */          type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=1200&q=80&auto=format' },

  // --- 温泉・旅館（5枚） ---
  { key: 'img-thumb-066', /* B 温泉 / beppu-japan */           type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1769177609233-615884bbb597?w=1200&q=80&auto=format' },
  { key: 'img-thumb-067', /* B 温泉 / beppu-japan */           type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1750661025302-b0f9b2f29871?w=1200&q=80&auto=format' },
  { key: 'img-thumb-068', /* B 温泉 / beppu-japan */           type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1750661078752-4b050022c98b?w=1200&q=80&auto=format' },
  { key: 'img-thumb-069', /* B 温泉 / karuizawa-japan */       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1654332356704-dd80bf63373f?w=1200&q=80&auto=format' },
  { key: 'img-thumb-070', /* B 温泉 / karuizawa-japan */       type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1713972206739-172d8dc63666?w=1200&q=80&auto=format' },

  // --- 離島・ビーチ（5枚） ---
  { key: 'img-thumb-071', /* B 離島 / okinawa-beach */         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1769348535762-549652bd4a33?w=1200&q=80&auto=format' },
  { key: 'img-thumb-072', /* B 離島 / okinawa-beach */         type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1680699641261-49e4edddc878?w=1200&q=80&auto=format' },
  { key: 'img-thumb-073', /* B 離島 / miyakojima */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1664888883596-e61e0a53c71c?w=1200&q=80&auto=format' },
  { key: 'img-thumb-074', /* B 離島 / miyakojima */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1664888882941-361bb95c233a?w=1200&q=80&auto=format' },
  { key: 'img-thumb-075', /* B 離島 / miyakojima */            type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1717399259719-e7cc1a94d061?w=1200&q=80&auto=format' },

  // --- 都市夜景・ネオン（5枚） ---
  { key: 'img-thumb-076', /* B 都市夜景 / shibuya-night */     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1729707397413-d4b10d6a0376?w=1200&q=80&auto=format' },
  { key: 'img-thumb-077', /* B 都市夜景 / shibuya-night */     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1697070435626-63c64ff18888?w=1200&q=80&auto=format' },
  { key: 'img-thumb-078', /* B 都市夜景 / shibuya-night */     type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1728543960657-18ec56d37b41?w=1200&q=80&auto=format' },
  { key: 'img-thumb-079', /* B 都市夜景 / dotonbori-osaka */   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1717264617077-25c8cfbb548a?w=1200&q=80&auto=format' },
  { key: 'img-thumb-080', /* B 都市夜景 / dotonbori-osaka */   type: ImageType.ROUTE_THUMBNAIL, url: 'https://images.unsplash.com/photo-1704004363922-817412a85ef3?w=1200&q=80&auto=format' },
];

// === フェーズ 2: ルートサムネ追記済み ===

// ---------------------------------------------------------------------------
// ノード写真プール（Record<spotKey, SeedImage[]>）
//
// 仕様書 docs/seed-spec.md §11.3 / §6 / §7.1 参照。
// 手作り 50 本で頻出するスポットを優先的に網羅し、
// 1 スポットあたり 2〜3 枚の写真を充てるレコード型プール。
//
// key 命名: 'img-node-{spotKeyDigits}-{idx}' 形式
//   例: s-097（美ら海水族館）の 1 枚目 → 'img-node-s097-1'
//
// URL は w=1000, q=80（ノード写真用）。
// 全 106 枚すべて WebFetch で 200 OK を個別検証済み（フェーズ3）。
//
// 「※○○系の流用」コメント: 該当スポット専用の写真が Unsplash で見つから
// ず、テーマが近い別のスポット写真を使っている。後で良いものが見つかれば
// 差し替えやすいよう注記。
// ---------------------------------------------------------------------------

export const spotNodeImages: Record<string, SeedImage[]> = {
  // === 関東・甲信越 ===
  's-006': [ // 富士山五合目
    { key: 'img-node-s006-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1675610598855-a2a9d261101d?w=1000&q=80&auto=format' },
    { key: 'img-node-s006-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1610894377860-d73415b792b2?w=1000&q=80&auto=format' },
  ],
  's-007': [ // 河口湖大石公園
    { key: 'img-node-s007-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1541574823565-f1d660886187?w=1000&q=80&auto=format' },
    { key: 'img-node-s007-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1547823065-4cbbb2d4d185?w=1000&q=80&auto=format' },
  ],
  's-008': [ // 軽井沢 旧軽井沢銀座
    { key: 'img-node-s008-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1705028572444-a411c7a9c8d1?w=1000&q=80&auto=format' },
    { key: 'img-node-s008-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1734262869969-dee916ff2fea?w=1000&q=80&auto=format' },
  ],
  's-012': [ // 草津温泉 湯畑（karuizawa-japan プールから流用、温泉街風景）
    { key: 'img-node-s012-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1691502069153-7ff6a2ada2fd?w=1000&q=80&auto=format' },
    { key: 'img-node-s012-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1725605932168-c0b353fef256?w=1000&q=80&auto=format' },
  ],
  's-013': [ // 伊香保温泉 石段街（karuizawa-japan ※温泉系の流用）
    { key: 'img-node-s013-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1714538247922-280698e0e20c?w=1000&q=80&auto=format' },
  ],
  's-016': [ // 箱根 大涌谷
    { key: 'img-node-s016-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1672594859456-50b7dc769a69?w=1000&q=80&auto=format' },
    { key: 'img-node-s016-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1583901362846-13c55e045708?w=1000&q=80&auto=format' },
  ],

  // === 関西 ===
  's-025': [ // 清水寺
    { key: 'img-node-s025-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669954791579-15a45890449f?w=1000&q=80&auto=format' },
    { key: 'img-node-s025-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669002231775-e89f457ad675?w=1000&q=80&auto=format' },
    { key: 'img-node-s025-3', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1731062415404-357332519c26?w=1000&q=80&auto=format' },
  ],
  's-026': [ // 伏見稲荷大社
    { key: 'img-node-s026-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669002232054-bf62de230e1f?w=1000&q=80&auto=format' },
    { key: 'img-node-s026-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1632922916380-805f09957a8c?w=1000&q=80&auto=format' /* arashiyama-bamboo ※京都全般の流用 */ },
  ],
  's-027': [ // 嵐山 渡月橋
    { key: 'img-node-s027-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1698618988744-737573cb6a7a?w=1000&q=80&auto=format' },
    { key: 'img-node-s027-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1704026438453-fde2ceb923ad?w=1000&q=80&auto=format' },
  ],
  's-028': [ // 奈良公園
    { key: 'img-node-s028-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1732427201528-18be215b9764?w=1000&q=80&auto=format' },
    { key: 'img-node-s028-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1666621955070-b1800aef7f9b?w=1000&q=80&auto=format' },
    { key: 'img-node-s028-3', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1732629558099-2f5b913c0885?w=1000&q=80&auto=format' },
  ],
  's-029': [ // 東大寺 大仏殿
    { key: 'img-node-s029-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1732629558278-f527fc461a3b?w=1000&q=80&auto=format' },
    { key: 'img-node-s029-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1690734492406-65c292a05d4b?w=1000&q=80&auto=format' },
  ],
  's-030': [ // 道頓堀
    { key: 'img-node-s030-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1647334933038-4cb684cd9a7e?w=1000&q=80&auto=format' },
    { key: 'img-node-s030-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1594359145132-1299d4373684?w=1000&q=80&auto=format' },
  ],
  's-032': [ // 神戸 メリケンパーク
    { key: 'img-node-s032-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1607586355793-34ab20949e28?w=1000&q=80&auto=format' },
    { key: 'img-node-s032-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1581524070124-957d29ec032f?w=1000&q=80&auto=format' },
  ],
  's-033': [ // 金閣寺（鹿苑寺）（arashiyama-bamboo ※京都の流用）
    { key: 'img-node-s033-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1702384225869-1efa3239b608?w=1000&q=80&auto=format' },
  ],
  's-035': [ // 京都 祇園 花見小路
    { key: 'img-node-s035-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669711673398-e60264c3237a?w=1000&q=80&auto=format' },
    { key: 'img-node-s035-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669002231828-c96fa41b38f0?w=1000&q=80&auto=format' },
  ],
  's-037': [ // 通天閣
    { key: 'img-node-s037-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1721537504435-f58e34e03c19?w=1000&q=80&auto=format' },
  ],
  's-038': [ // 春日大社
    { key: 'img-node-s038-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1731065211522-709833b1c6a0?w=1000&q=80&auto=format' },
  ],
  's-039': [ // 姫路城
    { key: 'img-node-s039-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1573416033034-e42e14b545d2?w=1000&q=80&auto=format' },
    { key: 'img-node-s039-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1708656376421-8db46939bcfe?w=1000&q=80&auto=format' },
  ],
  's-040': [ // 城崎温泉
    { key: 'img-node-s040-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1644413600587-cdd220fa24f1?w=1000&q=80&auto=format' },
    { key: 'img-node-s040-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1644413405683-ffc59956cac1?w=1000&q=80&auto=format' },
  ],
  's-043': [ // 高野山 奥之院
    { key: 'img-node-s043-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1672899939135-4bca7071f771?w=1000&q=80&auto=format' },
    { key: 'img-node-s043-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1730707359128-1cfede26278a?w=1000&q=80&auto=format' },
  ],

  // === 北海道・東北 ===
  's-046': [ // 富良野 ファーム富田
    { key: 'img-node-s046-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1762886457606-ece40185cdf0?w=1000&q=80&auto=format' /* furano-lavender */ },
    { key: 'img-node-s046-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1734614005996-329ab06be0ce?w=1000&q=80&auto=format' /* biei-japan ※花畑系の流用 */ },
  ],
  's-047': [ // 函館山展望台
    { key: 'img-node-s047-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1492086517200-9393d4eb53bf?w=1000&q=80&auto=format' },
    { key: 'img-node-s047-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1609609018625-afef0a259159?w=1000&q=80&auto=format' },
  ],
  's-048': [ // 知床五湖
    { key: 'img-node-s048-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1625115001003-734f54ed7da3?w=1000&q=80&auto=format' },
    { key: 'img-node-s048-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1625114998314-6f5c12e3fa00?w=1000&q=80&auto=format' },
  ],
  's-052': [ // 美瑛 青い池
    { key: 'img-node-s052-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1755937303965-2ac18f5e72bb?w=1000&q=80&auto=format' },
    { key: 'img-node-s052-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1657313950352-beba636a7bf6?w=1000&q=80&auto=format' },
  ],
  's-054': [ // 洞爺湖
    { key: 'img-node-s054-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1625114976996-fb69707c1cc2?w=1000&q=80&auto=format' },
    { key: 'img-node-s054-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1686397141552-522171dfcc28?w=1000&q=80&auto=format' },
  ],
  's-055': [ // 登別温泉 地獄谷（hokkaido-summer ※自然系の流用）
    { key: 'img-node-s055-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1686397141343-2ef62423ea92?w=1000&q=80&auto=format' },
  ],
  's-056': [ // ニセコ アンヌプリ（hokkaido-summer ※自然系の流用）
    { key: 'img-node-s056-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1724909618654-405bf1cf2f4c?w=1000&q=80&auto=format' },
  ],
  's-058': [ // 松島 五大堂
    { key: 'img-node-s058-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1628927014154-e5be67e9bfa1?w=1000&q=80&auto=format' },
    { key: 'img-node-s058-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1699638626802-3464918d57be?w=1000&q=80&auto=format' },
  ],

  // === 中部・北陸 ===
  's-061': [ // 上高地 河童橋
    { key: 'img-node-s061-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1729756801076-8983ce7e565d?w=1000&q=80&auto=format' },
    { key: 'img-node-s061-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1731614046129-273e33741d3c?w=1000&q=80&auto=format' },
  ],
  's-062': [ // 白川郷 合掌造り集落
    { key: 'img-node-s062-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1646220812899-e97a7711f5e1?w=1000&q=80&auto=format' },
    { key: 'img-node-s062-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1644836512182-977899856efe?w=1000&q=80&auto=format' },
  ],
  's-063': [ // 飛騨高山 古い町並
    { key: 'img-node-s063-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1617284349156-26a70e5cece0?w=1000&q=80&auto=format' },
    { key: 'img-node-s063-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1617284349256-175eda5ca189?w=1000&q=80&auto=format' },
  ],
  's-064': [ // 兼六園
    { key: 'img-node-s064-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1612476766753-9ec24a16df41?w=1000&q=80&auto=format' },
    { key: 'img-node-s064-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1585441794545-dad6fcd6ae42?w=1000&q=80&auto=format' },
    { key: 'img-node-s064-3', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1721140488641-aa8297f2cdd3?w=1000&q=80&auto=format' },
  ],
  's-065': [ // ひがし茶屋街
    { key: 'img-node-s065-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1706972471411-868e6fa1a904?w=1000&q=80&auto=format' },
    { key: 'img-node-s065-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1673076941487-51e4e90b6e34?w=1000&q=80&auto=format' },
  ],
  's-066': [ // 名古屋城
    { key: 'img-node-s066-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1719805053349-e8974bb0c60d?w=1000&q=80&auto=format' },
    { key: 'img-node-s066-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1708373130353-a2d6710af5ca?w=1000&q=80&auto=format' },
  ],
  's-070': [ // 立山 室堂平
    { key: 'img-node-s070-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1703145665789-974ab664c04e?w=1000&q=80&auto=format' },
    { key: 'img-node-s070-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1764250538851-d6ab5c7affab?w=1000&q=80&auto=format' },
  ],

  // === 中国・四国 ===
  's-076': [ // 鳥取砂丘
    { key: 'img-node-s076-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1635902917191-6f3e1445c116?w=1000&q=80&auto=format' },
    { key: 'img-node-s076-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1693188074158-00e5edb3d0ac?w=1000&q=80&auto=format' },
  ],
  's-077': [ // 出雲大社
    { key: 'img-node-s077-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1766933942979-c9cd3e24efb5?w=1000&q=80&auto=format' },
    { key: 'img-node-s077-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1766932582066-218e78af0ec9?w=1000&q=80&auto=format' },
  ],
  's-085': [ // 角島大橋
    { key: 'img-node-s085-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1611210040662-dcd41b879c8f?w=1000&q=80&auto=format' },
    { key: 'img-node-s085-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1609474294819-b18d936efbfa?w=1000&q=80&auto=format' },
  ],

  // === 九州・沖縄 ===
  's-090': [ // 太宰府天満宮
    { key: 'img-node-s090-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1698790708686-e6e68ec23c45?w=1000&q=80&auto=format' },
    { key: 'img-node-s090-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1624949088052-dc32ac993163?w=1000&q=80&auto=format' },
  ],
  's-092': [ // 別府 海地獄
    { key: 'img-node-s092-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1611765050984-6b9374966ba3?w=1000&q=80&auto=format' /* beppu-japan */ },
  ],
  's-093': [ // 由布院 金鱗湖
    { key: 'img-node-s093-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1752917860666-ca5678d606a4?w=1000&q=80&auto=format' /* beppu-japan */ },
    { key: 'img-node-s093-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1752917870379-ed88be3c2050?w=1000&q=80&auto=format' /* beppu-japan */ },
  ],
  's-094': [ // 阿蘇 草千里ヶ浜
    { key: 'img-node-s094-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1672739618798-174b3e18c926?w=1000&q=80&auto=format' },
    { key: 'img-node-s094-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1677254817050-cb9b29fbb16e?w=1000&q=80&auto=format' },
  ],
  's-096': [ // 屋久島 縄文杉
    { key: 'img-node-s096-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1690476072350-be1db216a0b2?w=1000&q=80&auto=format' },
    { key: 'img-node-s096-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1671477888643-78407cfe02f7?w=1000&q=80&auto=format' },
  ],
  's-097': [ // 沖縄美ら海水族館
    { key: 'img-node-s097-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888882993-5bc4b906db5e?w=1000&q=80&auto=format' },
    { key: 'img-node-s097-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888883235-dd2b4055ae26?w=1000&q=80&auto=format' },
    { key: 'img-node-s097-3', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888883613-056db50331a7?w=1000&q=80&auto=format' },
  ],
  's-098': [ // 首里城
    { key: 'img-node-s098-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1680699641341-d65c6c678ed2?w=1000&q=80&auto=format' /* okinawa-beach ※沖縄景観の流用 */ },
    { key: 'img-node-s098-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888908848-d7e8ec255537?w=1000&q=80&auto=format' /* miyakojima ※沖縄景観の流用 */ },
  ],
  's-099': [ // 古宇利大橋
    { key: 'img-node-s099-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1754228806660-f0ea8606a3b4?w=1000&q=80&auto=format' },
    { key: 'img-node-s099-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1754228771091-e0c10ce4550c?w=1000&q=80&auto=format' },
  ],
  's-100': [ // 石垣島 川平湾
    { key: 'img-node-s100-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888883224-b6e6c1815c2b?w=1000&q=80&auto=format' /* miyakojima */ },
    { key: 'img-node-s100-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1715136500907-08c94feeb7ca?w=1000&q=80&auto=format' /* miyakojima */ },
  ],
  's-101': [ // 宮古島 与那覇前浜ビーチ
    { key: 'img-node-s101-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888883426-702dd22cb8a3?w=1000&q=80&auto=format' },
    { key: 'img-node-s101-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1717399259737-3e6039912a4b?w=1000&q=80&auto=format' },
  ],
  's-102': [ // 波照間島 ニシ浜（miyakojima ※南国島の流用）
    { key: 'img-node-s102-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1717400133654-7a4f7213d150?w=1000&q=80&auto=format' },
  ],
  's-103': [ // 門司港レトロ
    { key: 'img-node-s103-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1650607796679-e9e64a8aa15d?w=1000&q=80&auto=format' },
    { key: 'img-node-s103-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1580561531175-2fde1356e355?w=1000&q=80&auto=format' },
  ],
  's-105': [ // 高千穂峡
    { key: 'img-node-s105-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1699073141845-5c6436fde432?w=1000&q=80&auto=format' },
    { key: 'img-node-s105-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1773933609615-8efca4a7c512?w=1000&q=80&auto=format' },
  ],
  's-106': [ // 青島神社（takachiho-gorge ※宮崎の流用）
    { key: 'img-node-s106-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1773933609532-8915323a5cb2?w=1000&q=80&auto=format' },
  ],
  's-107': [ // 黒川温泉
    { key: 'img-node-s107-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1600506222605-73be85eefcc9?w=1000&q=80&auto=format' /* beppu-japan */ },
    { key: 'img-node-s107-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1554869797-ff04e100c1ba?w=1000&q=80&auto=format' /* beppu-japan */ },
  ],
  's-111': [ // 沖縄 国際通り
    { key: 'img-node-s111-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1664888883622-82b01cd3c5d1?w=1000&q=80&auto=format' /* miyakojima */ },
    { key: 'img-node-s111-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1620398926717-a93267adf629?w=1000&q=80&auto=format' /* miyakojima */ },
  ],

  // === 市場・グルメ ===
  's-120': [ // 黒門市場
    { key: 'img-node-s120-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1713925104999-76200e6494e5?w=1000&q=80&auto=format' /* dotonbori-osaka */ },
  ],
  's-125': [ // 京都 錦市場
    { key: 'img-node-s125-1', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669002231757-e9fd5bd0bef7?w=1000&q=80&auto=format' /* kyoto-kiyomizu-temple */ },
    { key: 'img-node-s125-2', type: ImageType.NODE_IMAGE, url: 'https://images.unsplash.com/photo-1669002231655-eecec5c00e3a?w=1000&q=80&auto=format' /* kyoto-kiyomizu-temple */ },
  ],
};

// === フェーズ 3: ノード写真追記済み ===

// ---------------------------------------------------------------------------
// 全画像統合 export
//
// seed.ts で images テーブルへの一括 upsert に使う。userIcon / userBg /
// routeThumbnail / nodeImage の 4 種類を一つのフラットリストにまとめる。
// 各 SeedImage は key で一意。DB 保存時に toUuid('image', key) で UUID 化。
// ---------------------------------------------------------------------------

export const allImages: SeedImage[] = [
  ...userIconImages,        // 30
  ...userBackgroundImages,  // 20
  ...routeThumbnailImages,  // 80
  ...Object.values(spotNodeImages).flat(), // 106
];                                          // 合計 236
