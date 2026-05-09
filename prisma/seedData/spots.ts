// Routem シードデータ: スポット 129 件。
// 仕様書 docs/seed-spec.md §6「スポット設計」と完全一致。
//
// 全件 source: SpotSource.USER, sourceId: null で投入する想定。
// 緯度経度は EPSG:4326（経緯度）。仕様書記載値をそのまま転記。
// area は都道府県（DB 列ではなくシード内部のメタ情報。エリア別投稿配分や
// 量産ゾーンでのスポット選択に使う）。

import type { SeedSpot } from './types';

export const spots: SeedSpot[] = [
  // -------------------------------------------------------------------------
  // §6.1 関東エリア（基本）
  // -------------------------------------------------------------------------
  { key: 's-001', name: '浅草寺', latitude: 35.7148, longitude: 139.7967, area: '東京' },
  { key: 's-002', name: '東京スカイツリー', latitude: 35.7100, longitude: 139.8107, area: '東京' },
  { key: 's-003', name: '渋谷スクランブル交差点', latitude: 35.6595, longitude: 139.7005, area: '東京' },
  { key: 's-004', name: '鎌倉大仏（高徳院）', latitude: 35.3168, longitude: 139.5358, area: '神奈川' },
  { key: 's-005', name: '江ノ島シーキャンドル', latitude: 35.2997, longitude: 139.4810, area: '神奈川' },
  { key: 's-006', name: '富士山 五合目', latitude: 35.3962, longitude: 138.7300, area: '山梨' },
  { key: 's-007', name: '河口湖 大石公園', latitude: 35.5168, longitude: 138.7556, area: '山梨' },
  { key: 's-008', name: '軽井沢 旧軽井沢銀座', latitude: 36.3540, longitude: 138.6356, area: '長野' },

  // -------------------------------------------------------------------------
  // §6.2 関東・甲信越（追加分）
  // -------------------------------------------------------------------------
  { key: 's-009', name: '日光東照宮', latitude: 36.7580, longitude: 139.5989, area: '栃木' },
  { key: 's-010', name: '鬼怒川温泉', latitude: 36.8000, longitude: 139.7044, area: '栃木' },
  { key: 's-011', name: '那須高原', latitude: 37.0306, longitude: 139.9711, area: '栃木' },
  { key: 's-012', name: '草津温泉 湯畑', latitude: 36.6228, longitude: 138.5969, area: '群馬' },
  { key: 's-013', name: '伊香保温泉 石段街', latitude: 36.4886, longitude: 138.9114, area: '群馬' },
  { key: 's-014', name: '鎌倉 小町通り', latitude: 35.3192, longitude: 139.5500, area: '神奈川' },
  { key: 's-015', name: '横浜 みなとみらい', latitude: 35.4548, longitude: 139.6322, area: '神奈川' },
  { key: 's-016', name: '箱根 大涌谷', latitude: 35.2436, longitude: 139.0211, area: '神奈川' },
  { key: 's-017', name: '江ノ島 弁天橋', latitude: 35.3019, longitude: 139.4839, area: '神奈川' },
  { key: 's-018', name: '明治神宮', latitude: 35.6764, longitude: 139.6993, area: '東京' },
  { key: 's-019', name: '上野公園', latitude: 35.7150, longitude: 139.7732, area: '東京' },
  { key: 's-020', name: '東京駅 丸の内駅舎', latitude: 35.6812, longitude: 139.7671, area: '東京' },
  { key: 's-021', name: 'お台場 レインボーブリッジ', latitude: 35.6360, longitude: 139.7634, area: '東京' },
  { key: 's-022', name: '高尾山', latitude: 35.6253, longitude: 139.2436, area: '東京' },
  { key: 's-023', name: '諏訪湖', latitude: 36.0500, longitude: 138.0833, area: '長野' },
  { key: 's-024', name: '清里高原', latitude: 35.9081, longitude: 138.4344, area: '山梨' },

  // -------------------------------------------------------------------------
  // §6.3 関西エリア（基本）
  // -------------------------------------------------------------------------
  { key: 's-025', name: '清水寺', latitude: 34.9949, longitude: 135.7851, area: '京都' },
  { key: 's-026', name: '伏見稲荷大社', latitude: 34.9671, longitude: 135.7727, area: '京都' },
  { key: 's-027', name: '嵐山 渡月橋', latitude: 35.0128, longitude: 135.6770, area: '京都' },
  { key: 's-028', name: '奈良公園', latitude: 34.6851, longitude: 135.8430, area: '奈良' },
  { key: 's-029', name: '東大寺 大仏殿', latitude: 34.6889, longitude: 135.8398, area: '奈良' },
  { key: 's-030', name: '道頓堀', latitude: 34.6687, longitude: 135.5012, area: '大阪' },
  { key: 's-031', name: 'ユニバーサル・スタジオ・ジャパン', latitude: 34.6654, longitude: 135.4323, area: '大阪' },
  { key: 's-032', name: '神戸 メリケンパーク', latitude: 34.6810, longitude: 135.1882, area: '兵庫' },

  // -------------------------------------------------------------------------
  // §6.4 関西エリア（追加分）
  // -------------------------------------------------------------------------
  { key: 's-033', name: '金閣寺（鹿苑寺）', latitude: 35.0394, longitude: 135.7292, area: '京都' },
  { key: 's-034', name: '銀閣寺（慈照寺）', latitude: 35.0270, longitude: 135.7982, area: '京都' },
  { key: 's-035', name: '京都 祇園 花見小路', latitude: 35.0036, longitude: 135.7750, area: '京都' },
  { key: 's-036', name: '大阪城', latitude: 34.6873, longitude: 135.5259, area: '大阪' },
  { key: 's-037', name: '通天閣', latitude: 34.6524, longitude: 135.5063, area: '大阪' },
  { key: 's-038', name: '春日大社', latitude: 34.6814, longitude: 135.8484, area: '奈良' },
  { key: 's-039', name: '姫路城', latitude: 34.8394, longitude: 134.6939, area: '兵庫' },
  { key: 's-040', name: '城崎温泉', latitude: 35.6260, longitude: 134.8047, area: '兵庫' },
  { key: 's-041', name: '熊野古道 大門坂', latitude: 33.6678, longitude: 135.8911, area: '和歌山' },
  { key: 's-042', name: '那智の滝', latitude: 33.6700, longitude: 135.8911, area: '和歌山' },
  { key: 's-043', name: '高野山 奥之院', latitude: 34.2147, longitude: 135.5919, area: '和歌山' },
  { key: 's-044', name: '琵琶湖 白鬚神社', latitude: 35.2706, longitude: 136.0017, area: '滋賀' },

  // -------------------------------------------------------------------------
  // §6.5 北海道・東北（基本）
  // -------------------------------------------------------------------------
  { key: 's-045', name: '札幌大通公園', latitude: 43.0608, longitude: 141.3543, area: '北海道' },
  { key: 's-046', name: '富良野 ファーム富田', latitude: 43.4146, longitude: 142.4147, area: '北海道' },
  { key: 's-047', name: '函館山展望台', latitude: 41.7595, longitude: 140.7041, area: '北海道' },
  { key: 's-048', name: '知床五湖', latitude: 44.1062, longitude: 145.0901, area: '北海道' },
  { key: 's-049', name: '小樽運河', latitude: 43.1928, longitude: 141.0028, area: '北海道' },
  { key: 's-050', name: '奥入瀬渓流', latitude: 40.5167, longitude: 140.9333, area: '青森' },
  { key: 's-051', name: '銀山温泉', latitude: 38.5683, longitude: 140.5267, area: '山形' },

  // -------------------------------------------------------------------------
  // §6.6 北海道・東北（追加分）
  // -------------------------------------------------------------------------
  { key: 's-052', name: '美瑛 青い池', latitude: 43.4956, longitude: 142.6256, area: '北海道' },
  { key: 's-053', name: '旭山動物園', latitude: 43.7689, longitude: 142.4783, area: '北海道' },
  { key: 's-054', name: '洞爺湖', latitude: 42.5938, longitude: 140.8569, area: '北海道' },
  { key: 's-055', name: '登別温泉 地獄谷', latitude: 42.4961, longitude: 141.1689, area: '北海道' },
  { key: 's-056', name: 'ニセコ アンヌプリ', latitude: 42.8631, longitude: 140.6917, area: '北海道' },
  { key: 's-057', name: '中尊寺 金色堂', latitude: 39.0008, longitude: 141.0975, area: '岩手' },
  { key: 's-058', name: '松島 五大堂', latitude: 38.3683, longitude: 141.0617, area: '宮城' },
  { key: 's-059', name: '蔵王 御釜', latitude: 38.1383, longitude: 140.4500, area: '山形' },
  { key: 's-060', name: '五色沼', latitude: 37.6619, longitude: 140.0725, area: '福島' },

  // -------------------------------------------------------------------------
  // §6.7 中部・北陸（基本）
  // -------------------------------------------------------------------------
  { key: 's-061', name: '上高地 河童橋', latitude: 36.2503, longitude: 137.6347, area: '長野' },
  { key: 's-062', name: '白川郷 合掌造り集落', latitude: 36.2592, longitude: 136.9067, area: '岐阜' },
  { key: 's-063', name: '飛騨高山 古い町並', latitude: 36.1408, longitude: 137.2589, area: '岐阜' },
  { key: 's-064', name: '兼六園', latitude: 36.5621, longitude: 136.6625, area: '石川' },
  { key: 's-065', name: 'ひがし茶屋街', latitude: 36.5722, longitude: 136.6663, area: '石川' },

  // -------------------------------------------------------------------------
  // §6.8 中部・北陸（追加分）
  // -------------------------------------------------------------------------
  { key: 's-066', name: '名古屋城', latitude: 35.1856, longitude: 136.8997, area: '愛知' },
  { key: 's-067', name: '熱田神宮', latitude: 35.1278, longitude: 136.9081, area: '愛知' },
  { key: 's-068', name: '伊勢神宮 内宮', latitude: 34.4548, longitude: 136.7257, area: '三重' },
  { key: 's-069', name: '鳥羽水族館', latitude: 34.4836, longitude: 136.8403, area: '三重' },
  { key: 's-070', name: '立山 室堂平', latitude: 36.5783, longitude: 137.5953, area: '富山' },
  { key: 's-071', name: '黒部峡谷 トロッコ電車', latitude: 36.8167, longitude: 137.5944, area: '富山' },
  { key: 's-072', name: '永平寺', latitude: 36.0556, longitude: 136.3556, area: '福井' },
  { key: 's-073', name: '東尋坊', latitude: 36.2406, longitude: 136.1264, area: '福井' },

  // -------------------------------------------------------------------------
  // §6.9 中国・四国（基本）
  // -------------------------------------------------------------------------
  { key: 's-074', name: '厳島神社', latitude: 34.2959, longitude: 132.3197, area: '広島' },
  { key: 's-075', name: '原爆ドーム', latitude: 34.3955, longitude: 132.4536, area: '広島' },
  { key: 's-076', name: '鳥取砂丘', latitude: 35.5414, longitude: 134.2236, area: '鳥取' },
  { key: 's-077', name: '出雲大社', latitude: 35.4019, longitude: 132.6855, area: '島根' },
  { key: 's-078', name: '道後温泉本館', latitude: 33.8516, longitude: 132.7864, area: '愛媛' },
  { key: 's-079', name: '四万十川 沈下橋', latitude: 33.0364, longitude: 132.9831, area: '高知' },
  { key: 's-080', name: '小豆島 エンジェルロード', latitude: 34.4831, longitude: 134.2558, area: '香川' },

  // -------------------------------------------------------------------------
  // §6.10 中国・四国（追加分）
  // -------------------------------------------------------------------------
  { key: 's-081', name: '倉敷 美観地区', latitude: 34.5953, longitude: 133.7714, area: '岡山' },
  { key: 's-082', name: '後楽園', latitude: 34.6678, longitude: 133.9358, area: '岡山' },
  { key: 's-083', name: '尾道 千光寺', latitude: 34.4108, longitude: 133.2056, area: '広島' },
  { key: 's-084', name: '萩城下町', latitude: 34.4111, longitude: 131.4014, area: '山口' },
  { key: 's-085', name: '角島大橋', latitude: 34.3514, longitude: 130.8814, area: '山口' },
  { key: 's-086', name: '金刀比羅宮', latitude: 34.1856, longitude: 133.8089, area: '香川' },
  { key: 's-087', name: '直島 草間彌生 かぼちゃ', latitude: 34.4517, longitude: 133.9933, area: '香川' },
  { key: 's-088', name: '大歩危・小歩危', latitude: 33.8489, longitude: 133.7867, area: '徳島' },
  { key: 's-089', name: '祖谷のかずら橋', latitude: 33.8633, longitude: 133.7956, area: '徳島' },

  // -------------------------------------------------------------------------
  // §6.11 九州・沖縄（基本）
  // -------------------------------------------------------------------------
  { key: 's-090', name: '太宰府天満宮', latitude: 33.5318, longitude: 130.5350, area: '福岡' },
  { key: 's-091', name: '博多 中洲屋台', latitude: 33.5910, longitude: 130.4083, area: '福岡' },
  { key: 's-092', name: '別府 海地獄', latitude: 33.2922, longitude: 131.4831, area: '大分' },
  { key: 's-093', name: '由布院 金鱗湖', latitude: 33.2664, longitude: 131.3583, area: '大分' },
  { key: 's-094', name: '阿蘇 草千里ヶ浜', latitude: 32.8836, longitude: 131.0494, area: '熊本' },
  { key: 's-095', name: '桜島 湯之平展望所', latitude: 31.5942, longitude: 130.6469, area: '鹿児島' },
  { key: 's-096', name: '屋久島 縄文杉', latitude: 30.3014, longitude: 130.5158, area: '鹿児島' },
  { key: 's-097', name: '沖縄美ら海水族館', latitude: 26.6943, longitude: 127.8780, area: '沖縄' },
  { key: 's-098', name: '首里城', latitude: 26.2173, longitude: 127.7194, area: '沖縄' },
  { key: 's-099', name: '古宇利大橋', latitude: 26.6997, longitude: 128.0231, area: '沖縄' },
  { key: 's-100', name: '石垣島 川平湾', latitude: 24.4533, longitude: 124.1453, area: '沖縄' },
  { key: 's-101', name: '宮古島 与那覇前浜ビーチ', latitude: 24.7350, longitude: 125.2658, area: '沖縄' },
  { key: 's-102', name: '波照間島 ニシ浜', latitude: 24.0669, longitude: 123.7906, area: '沖縄' },

  // -------------------------------------------------------------------------
  // §6.12 九州・沖縄（追加分）
  // -------------------------------------------------------------------------
  { key: 's-103', name: '門司港レトロ', latitude: 33.9447, longitude: 130.9614, area: '福岡' },
  { key: 's-104', name: '糸島 桜井二見ヶ浦', latitude: 33.5917, longitude: 130.1864, area: '福岡' },
  { key: 's-105', name: '高千穂峡', latitude: 32.7128, longitude: 131.3022, area: '宮崎' },
  { key: 's-106', name: '青島神社', latitude: 31.8019, longitude: 131.4750, area: '宮崎' },
  { key: 's-107', name: '黒川温泉', latitude: 33.0794, longitude: 131.1428, area: '熊本' },
  { key: 's-108', name: '軍艦島（端島）', latitude: 32.6275, longitude: 129.7383, area: '長崎' },
  { key: 's-109', name: 'ハウステンボス', latitude: 33.0856, longitude: 129.7867, area: '長崎' },
  { key: 's-110', name: '残波岬', latitude: 26.5614, longitude: 127.9747, area: '沖縄' },
  { key: 's-111', name: '沖縄 国際通り', latitude: 26.2147, longitude: 127.6864, area: '沖縄' },
  { key: 's-112', name: '慶良間諸島 阿嘉島', latitude: 26.2014, longitude: 127.2750, area: '沖縄' },

  // -------------------------------------------------------------------------
  // §6.13 穴場・離島系
  // -------------------------------------------------------------------------
  { key: 's-113', name: '隠岐 摩天崖', latitude: 36.3653, longitude: 133.0944, area: '島根' },
  { key: 's-114', name: '利尻島 オタトマリ沼', latitude: 45.1186, longitude: 141.2422, area: '北海道' },
  { key: 's-115', name: '礼文島 桃岩展望台', latitude: 45.3683, longitude: 141.0286, area: '北海道' },
  { key: 's-116', name: '小笠原 父島 大村海岸', latitude: 27.0942, longitude: 142.1928, area: '東京' },
  { key: 's-117', name: '徳之島 犬田布岬', latitude: 27.7222, longitude: 128.9333, area: '鹿児島' },
  { key: 's-118', name: '奥能登 白米千枚田', latitude: 37.4569, longitude: 137.1697, area: '石川' },

  // -------------------------------------------------------------------------
  // §6.14 グルメ・カフェ・夜景・体験系
  // -------------------------------------------------------------------------
  { key: 's-119', name: '築地場外市場', latitude: 35.6654, longitude: 139.7707, area: '東京' },
  { key: 's-120', name: '黒門市場', latitude: 34.6657, longitude: 135.5067, area: '大阪' },
  { key: 's-121', name: '二条市場', latitude: 43.0586, longitude: 141.3559, area: '北海道' },
  { key: 's-122', name: '函館 朝市', latitude: 41.7733, longitude: 140.7264, area: '北海道' },
  { key: 's-123', name: '仙台 牛タン通り', latitude: 38.2606, longitude: 140.8819, area: '宮城' },
  { key: 's-124', name: '浅草 仲見世通り', latitude: 35.7117, longitude: 139.7967, area: '東京' },
  { key: 's-125', name: '京都 錦市場', latitude: 35.0050, longitude: 135.7647, area: '京都' },
  { key: 's-126', name: '神戸 南京町', latitude: 34.6886, longitude: 135.1869, area: '兵庫' },
  { key: 's-127', name: '福岡 博多もつ鍋通り', latitude: 33.5894, longitude: 130.4019, area: '福岡' },
  { key: 's-128', name: '横浜中華街', latitude: 35.4422, longitude: 139.6464, area: '神奈川' },

  // -------------------------------------------------------------------------
  // §6.15 中部・北陸（後追い追加分）
  // -------------------------------------------------------------------------
  { key: 's-129', name: '近江町市場', latitude: 36.5711, longitude: 136.6589, area: '石川' /* 金沢市・加賀百万石の台所 */ },
];
