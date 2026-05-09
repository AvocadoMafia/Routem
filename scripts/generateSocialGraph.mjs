// scripts/generateSocialGraph.mjs
//
// 一回限りのジェネレータ。既存の prisma/seedData/routes/{curated,semi,generated}.ts
// から (key, authorKey, visibility, targetLikes) を正規表現で抽出し、ソーシャル
// グラフ (follows / routeLikes / comments / commentLikes) を決定論的に生成して
// prisma/seedData/socialGraph.ts に固定値として書き出す。
//
// 使い方:
//   node scripts/generateSocialGraph.mjs
//
// 仕様書: docs/seed-spec.md §8, §9, §13

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SEED_DIR = path.join(ROOT, 'prisma', 'seedData');
const ROUTES_DIR = path.join(SEED_DIR, 'routes');
const OUT = path.join(SEED_DIR, 'socialGraph.ts');

// ---------------------------------------------------------------------------
// ルートメタ抽出
// ---------------------------------------------------------------------------

function parseRouteFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const re =
    /key:\s*'([^']+)',\s*authorKey:\s*'([^']+)',[\s\S]*?visibility:\s*([A-Z_]+),[\s\S]*?targetLikes:\s*(\d+),/g;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({
      key: m[1],
      authorKey: m[2],
      visibility: m[3] === 'PRIVATE_VIS' ? 'PRIVATE' : 'PUBLIC',
      targetLikes: parseInt(m[4], 10),
    });
  }
  return out;
}

const curated = parseRouteFile(path.join(ROUTES_DIR, 'curated.ts'));
const semi = parseRouteFile(path.join(ROUTES_DIR, 'semi.ts'));
const generated = parseRouteFile(path.join(ROUTES_DIR, 'generated.ts'));
const allRoutes = [...curated, ...semi, ...generated];

if (curated.length !== 50) throw new Error(`curated count: ${curated.length}`);
if (semi.length !== 100) throw new Error(`semi count: ${semi.length}`);
if (generated.length !== 100) throw new Error(`generated count: ${generated.length}`);

// ---------------------------------------------------------------------------
// ユーザーキー一覧
// ---------------------------------------------------------------------------

const coreKeys = ['u-001','u-002','u-003','u-004','u-005','u-006','u-007','u-008','u-009','u-010'];
const edgeKeys = ['u-011','u-012','u-013'];
const mobKeys = Array.from({ length: 20 }, (_, i) => `mob-${String(i + 1).padStart(3, '0')}`);
const allUserKeys = [...coreKeys, ...edgeKeys, ...mobKeys]; // 33

// ---------------------------------------------------------------------------
// 決定論的ハッシュ・乱数
// ---------------------------------------------------------------------------

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN(seedKey, candidates, n) {
  const rng = mulberry32(hashString(seedKey));
  const arr = candidates.slice();
  // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

// ---------------------------------------------------------------------------
// §A. follows: ユーザー別フォロー先を明示的に定義
// ---------------------------------------------------------------------------

const followingMap = {
  // コア 10
  'u-001': ['u-002','u-003','u-006','u-007','u-009'],                                                       // 5
  'u-002': ['u-001','u-003','u-006','u-008','u-009','u-013','mob-005','mob-007'],                           // 8
  'u-003': ['u-001','u-006','u-007','u-008','u-009','mob-006','mob-009','mob-010'],                         // 8
  'u-004': ['u-001','u-002','u-006','u-009','u-013','mob-008'],                                             // 6
  'u-005': ['u-001','u-002','u-003','u-006','u-007','u-008','u-009','u-010','u-013','mob-005','mob-009','mob-010'], // 12
  'u-006': ['u-001','u-002','u-003','u-004','u-008','u-013','mob-002','mob-004'],                           // 8
  'u-007': ['u-001','u-003','u-009'],                                                                       // 3
  'u-008': ['u-001','u-002','u-006','u-013','mob-009'],                                                     // 5
  'u-009': ['u-001','u-002','u-003','u-006','u-013','mob-001','mob-006','mob-010'],                         // 8
  'u-010': ['u-001','u-002','u-003','u-006'],                                                               // 4
  // エッジ 3
  'u-011': [],                                                                                              // 0
  'u-012': ['u-013'],                                                                                       // 1
  'u-013': ['u-001','u-002','u-006','u-009','u-010','u-012','mob-007','mob-008'],                           // 8 (u-012 と相互)
  // モブ 1-10 (active)
  'mob-001': ['u-001','u-002','u-003','u-006','u-009','u-013','mob-002','mob-005','mob-006','mob-009','mob-010'],            // 11
  'mob-002': ['u-001','u-002','u-006','u-009','u-013','mob-001','mob-003','mob-005','mob-008','mob-010'],                    // 10
  'mob-003': ['u-001','u-002','u-003','u-005','u-006','u-009','mob-001','mob-004','mob-006','mob-009'],                      // 10
  'mob-004': ['u-001','u-002','u-006','u-008','u-009','mob-002','mob-003','mob-005','mob-006','mob-007','mob-009'],          // 11
  'mob-005': ['u-001','u-002','u-003','u-006','u-009','mob-001','mob-002','mob-006','mob-009'],                              // 9
  'mob-006': ['u-001','u-002','u-003','u-006','u-009','mob-001','mob-003','mob-005','mob-009','mob-010'],                    // 10
  'mob-007': ['u-001','u-002','u-003','u-006','u-008','u-009','u-013','mob-002','mob-005','mob-008','mob-010'],              // 11
  'mob-008': ['u-001','u-002','u-003','u-004','u-006','u-009','u-013','mob-001','mob-005'],                                  // 9
  'mob-009': ['u-001','u-002','u-003','u-005','u-006','u-009','mob-001','mob-004','mob-006','mob-010'],                      // 10
  'mob-010': ['u-001','u-002','u-003','u-006','u-008','u-009','mob-001','mob-002','mob-005','mob-006','mob-007'],            // 11
  // モブ 11-20 (ROM 寄り)
  'mob-011': ['u-001','u-002','u-003','u-006','u-009','u-013'],         // 6
  'mob-012': ['u-001','u-002','u-006','u-008','u-009'],                  // 5
  'mob-013': ['u-001','u-002','u-003','u-005','u-006','u-009','mob-001'],// 7
  'mob-014': ['u-001','u-002','u-006','u-008','u-009'],                  // 5
  'mob-015': ['u-001','u-002','u-004','u-006','u-009','mob-008'],        // 6
  'mob-016': ['u-001','u-002'],                                          // 2
  'mob-017': ['u-001','u-002','u-003','u-006','u-009'],                  // 5
  'mob-018': ['u-001','u-002','u-006','u-008','u-009','mob-008'],        // 6
  'mob-019': ['u-001','u-002','u-003'],                                  // 3
  'mob-020': ['u-001','u-006','u-009'],                                  // 3
};

const follows = [];
for (const followerKey of allUserKeys) {
  const list = followingMap[followerKey] || [];
  for (const followingKey of list) {
    if (followerKey === followingKey) continue;
    if (!allUserKeys.includes(followingKey)) {
      throw new Error(`unknown followingKey: ${followingKey}`);
    }
    follows.push({ followerKey, followingKey });
  }
}

// 重複検査
{
  const seen = new Set();
  for (const f of follows) {
    const key = `${f.followerKey}>${f.followingKey}`;
    if (seen.has(key)) throw new Error(`dup follow: ${key}`);
    seen.add(key);
  }
}

// ---------------------------------------------------------------------------
// §B. routeLikes: ルートごとの targetLikes に応じていいねを生成
// ---------------------------------------------------------------------------

// 各ユーザーの「いいねしやすさ」傾向。mob は基本的にいいねを多くするが
// u-011 quiet_user は完全 0、u-012 private_only は控えめ。
const likeAffinity = {};
for (const k of allUserKeys) likeAffinity[k] = 1.0;
likeAffinity['u-011'] = 0.0;
likeAffinity['u-012'] = 0.0;
// mob-011〜020 は ROM 寄りだが「いいねは付ける」層なので 1.0 のまま
// mob-001〜010 もよくいいねする
likeAffinity['u-005'] = 1.2; // hayato_solo はよくいいねする（spec 8.2.3 の関連ペルソナ風味）

function bandOf(targetLikes) {
  if (targetLikes >= 200) return 'buzz';
  if (targetLikes >= 50) return 'popular';
  if (targetLikes >= 10) return 'middle';
  if (targetLikes >= 1) return 'general';
  return 'unknown';
}

// Schema 上の @@unique([userId, routeId]) により 1 ルート最大 32 人まで。
// ここから author/u-011/u-012 を引いた最大 31 人を上限とした上で、
// バンドごとに「実際に発生するいいね数」をスケールダウンする。
//
// 仕様書 §8.2.1 の合計目標 ~2,500 件に収まるよう、各バンドで以下のロジックで
// likers 数を決める:
//   - バズ (>=200): 28 人 (満数の 90%)
//   - 人気 (50-199): 22 人
//   - 中堅 (10-49):  ceil(targetLikes * 0.6)
//   - 一般 (1-9):    targetLikes そのまま
//   - 無名 (0):      0
function likeCountForRoute(r) {
  const b = bandOf(r.targetLikes);
  if (b === 'buzz') return 25;
  if (b === 'popular') return 18;
  if (b === 'middle') return Math.ceil(r.targetLikes * 0.4);
  if (b === 'general') return r.targetLikes;
  return 0;
}

const routeLikes = [];
for (const r of allRoutes) {
  if (r.visibility === 'PRIVATE') continue;        // u-012 の PRIVATE は 0 件
  if (r.targetLikes <= 0) continue;                // 無名は 0 件
  if (r.authorKey === 'u-011') continue;           // quiet_user の投稿は無いはずだが念のため

  // いいね候補: 全ユーザーから author / u-011 / u-012 を除外
  const candidates = allUserKeys.filter(
    (k) => k !== r.authorKey && k !== 'u-011' && k !== 'u-012',
  );
  const desired = Math.min(likeCountForRoute(r), candidates.length);
  const likers = pickN(`route-likes:${r.key}`, candidates, desired);

  for (const userKey of likers) {
    if (likeAffinity[userKey] === 0) continue;
    routeLikes.push({ userKey, routeKey: r.key });
  }
}

// 重複検査
{
  const seen = new Set();
  for (const l of routeLikes) {
    const key = `${l.userKey}@${l.routeKey}`;
    if (seen.has(key)) throw new Error(`dup like: ${key}`);
    seen.add(key);
  }
}

// ---------------------------------------------------------------------------
// §C. comments
// §C-1. 仕様書 §9.2 のサンプル 20 件 (c-001〜c-020) を完全転記
// ---------------------------------------------------------------------------

const sampleComments = [
  {
    key: 'c-001', routeKey: 'r-001', authorKey: 'u-002',
    text: '古宇利大橋の写真がきれいすぎて保存しました！次の沖縄旅の参考にします🌺',
    createdAt: '2025-09-15T10:30:00Z', targetLikes: 5,
  },
  {
    key: 'c-002', routeKey: 'r-001', authorKey: 'u-008',
    text: '子連れでも回れますか？うちは小学生2人なので参考にしたいです',
    createdAt: '2025-09-16T14:00:00Z', targetLikes: 1,
  },
  {
    key: 'c-003', routeKey: 'r-001', authorKey: 'u-001',
    text: '@natsu_family さん、美ら海と古宇利は子連れでも全然大丈夫ですよ！首里城は階段多いので午前中の元気なうちに行くといいです👍',
    createdAt: '2025-09-17T09:20:00Z', targetLikes: 8,
  },
  {
    key: 'c-004', routeKey: 'r-001', authorKey: 'mob-003',
    text: '今度の夏休みここ行きます！保存しました',
    createdAt: '2025-09-20T22:10:00Z', targetLikes: 2,
  },
  {
    key: 'c-005', routeKey: 'r-002', authorKey: 'u-009',
    text: '富良野のラベンダー、ベストな時期はいつ頃でしょうか？',
    createdAt: '2025-08-22T08:45:00Z', targetLikes: 1,
  },
  {
    key: 'c-006', routeKey: 'r-002', authorKey: 'u-001',
    text: '@photo_yuki 7月中旬〜下旬がピークです！朝の光で撮るのがおすすめ📸',
    createdAt: '2025-08-23T07:30:00Z', targetLikes: 9,
  },
  {
    key: 'c-007', routeKey: 'r-003', authorKey: 'u-005',
    text: 'これ予算8500円って本当ですか？学生なので助かります',
    createdAt: '2025-07-12T19:15:00Z', targetLikes: 1,
  },
  {
    key: 'c-008', routeKey: 'r-005', authorKey: 'u-002',
    text: '早朝の清水寺、私もよく行きます！観光客いない時間帯の京都は別世界ですよね',
    createdAt: '2025-06-18T11:00:00Z', targetLikes: 7,
  },
  {
    key: 'c-009', routeKey: 'r-006', authorKey: 'mob-007',
    text: '縄文杉までの往復10時間、体力ない私には無理そう…でもいつか挑戦したいです',
    createdAt: '2025-05-25T20:40:00Z', targetLikes: 4,
  },
  {
    key: 'c-010', routeKey: 'r-016', authorKey: 'u-013',
    text: '城崎、私も先月行ってきました！外湯7つ全部回りましたよ。浴衣レンタルが宿で無料だったの最高でした',
    createdAt: '2025-04-10T15:20:00Z', targetLikes: 6,
  },
  {
    key: 'c-011', routeKey: 'r-016', authorKey: 'mob-002',
    text: '浴衣で歩く街、雰囲気あって素敵すぎる',
    createdAt: '2025-04-12T21:05:00Z', targetLikes: 3,
  },
  {
    key: 'c-012', routeKey: 'r-024', authorKey: 'u-004',
    text: 'この記事、夫に見せたら「ここ予約しよ」って即決でした😂結婚記念日に行ってきます！',
    createdAt: '2025-03-28T18:00:00Z', targetLikes: 5,
  },
  {
    key: 'c-013', routeKey: 'r-025', authorKey: 'u-007',
    text: '与那覇前浜は本当に日本一のビーチだと思います。引き潮の時間に行くと砂浜が広がって特に綺麗ですよ',
    createdAt: '2025-03-05T13:30:00Z', targetLikes: 5,
  },
  {
    key: 'c-014', routeKey: 'r-029', authorKey: 'mob-011',
    text: '12時間は流石に無理です…笑 でもチャレンジ精神すごい',
    createdAt: '2025-02-15T09:50:00Z', targetLikes: 2,
  },
  {
    key: 'c-015', routeKey: 'r-032', authorKey: 'u-002',
    text: '4軒目で挫折しそう（笑）でも美味しそうすぎる',
    createdAt: '2025-01-20T17:25:00Z', targetLikes: 4,
  },
  {
    key: 'c-016', routeKey: 'r-032', authorKey: 'u-006',
    text: '@sakura_trip 私も初日は3軒で限界でした😭2日に分けるの推奨です',
    createdAt: '2025-01-22T10:15:00Z', targetLikes: 7,
  },
  {
    key: 'c-017', routeKey: 'r-038', authorKey: 'mob-005',
    text: '日本最南端、行ってみたい場所No.1です',
    createdAt: '2024-12-10T19:30:00Z', targetLikes: 3,
  },
  {
    key: 'c-018', routeKey: 'r-043', authorKey: 'mob-009',
    text: '来月家族で行きます！このルート参考にさせてもらいますね、ありがとうございます🙏',
    createdAt: '2024-11-12T08:20:00Z', targetLikes: 3,
  },
  {
    key: 'c-019', routeKey: 'r-043', authorKey: 'u-008',
    text: '@mob-009 楽しんできてください！美ら海は午前の早い時間がおすすめです🐠',
    createdAt: '2024-11-14T07:10:00Z', targetLikes: 6,
  },
  {
    key: 'c-020', routeKey: 'r-047', authorKey: 'mob-001',
    text: '写真きれい…',
    createdAt: '2024-10-22T23:45:00Z', targetLikes: 0,
  },
];

// ---------------------------------------------------------------------------
// §C-2. 残りコメント生成
// ---------------------------------------------------------------------------

// 各ルートの「サンプル分の既存コメント数」を算出
const sampleCountByRoute = {};
for (const c of sampleComments) {
  sampleCountByRoute[c.routeKey] = (sampleCountByRoute[c.routeKey] || 0) + 1;
}

// バンド別の目標コメント数
//
// 仕様書 §9.1: 全 250 本中 170 本 (70%) にコメントが付き、合計約 450 件。
// 中堅 99 本 / 一般 95 本と母数が多いため、ペース配分は控えめに振る。
function targetCommentsForBand(band) {
  switch (band) {
    case 'buzz': return 12;     // 平均 12 件 (+ 著者返信 1 件で計 13 件)
    case 'popular': return 4;   // 平均 4 件 (+ 著者返信 1 件で計 5 件)
    case 'middle': return 1;    // 1 件、ただし 60% に追加 1 件
    case 'general': return 1;   // 35% にしか付かない (下記 generalHasComment)
    case 'unknown': return 0;
  }
  return 0;
}

// general バンドで「コメントが付くか」の判定 (約 45%)
function generalHasComment(routeKey) {
  return (hashString(`comment-yes:${routeKey}`) % 100) < 45;
}

// middle バンドで 2 件目を追加するかの判定 (約 70%)
function middleHasSecondComment(routeKey) {
  return (hashString(`comment-2nd:${routeKey}`) % 100) < 70;
}

// コメント本文テンプレ
const templateBuzz = [
  '保存しました！次の旅行の参考にさせてもらいます🙏',
  '写真の構図が綺麗で見入ってしまいました📸',
  'ここ気になってたんですよ！詳しいルートありがとうございます',
  '一気に行きたくなりました…保存📌',
  '同じルートで回れるか試してみたいです',
  'こういう日程感、すごく参考になります',
  '行きたい場所リストに追加しました！',
  'メモ📌 詳しい時間配分が助かります',
  '次の連休に挑戦してみます！',
  '美味しそうなお店までまとまってて最高',
  'これ参考になります、ありがとうございます',
  '実際に回るなら徒歩で行ける距離なんですね',
  '写真が綺麗すぎて思わず保存しちゃいました',
  '近くに住んでるので今度行ってみます！',
  '全部行きたい…休みください…',
];

const templatePopular = [
  '行ってみたいルートでした、ありがとうございます',
  '保存しました！参考にします',
  'メモさせていただきます📌',
  '写真きれいですね',
  'ここ行きたかったんです、助かります',
  '時間配分の参考になりました',
  '次の旅で使わせてもらいます',
  '美味しそうなところまでセットで助かる',
  'やっぱりこの季節がいいんですね',
  'ベストな順番で回れるルートですね',
];

const templateMiddle = [
  '参考になりました、保存します',
  'メモしておきます',
  '行ってみたいです',
  '良いルートですね',
  '今度試してみます',
  '保存📌',
  '写真きれいですね',
  '次の連休に行きます',
  'いいなあ、行きたい',
  '気になっていた場所でした',
];

const templateGeneral = [
  '参考になります',
  '保存しました',
  '行ってみたいです',
  'メモ📌',
  '写真きれい',
  'いいなあ',
  'これ参考になる',
  '次の旅の参考にします',
];

// 著者返信用のテンプレ。生成済みコメントへの自然な返信文。
const templateAuthorReplyToQuestion = [
  '@{name} ありがとうございます！平日の朝が一番空いてます😊',
  '@{name} ご質問ありがとうございます。詳細は記事内に書きました🙏',
  '@{name} 季節によりますが、目安は記事の通りです🌸',
];

const templateAuthorReplyToThanks = [
  '@{name} 楽しんできてください！',
  '@{name} ぜひ参考にしてください🙏',
  '@{name} 嬉しいコメントありがとうございます😊',
];

function pickFromTemplate(seedKey, list) {
  const idx = hashString(seedKey) % list.length;
  return list[idx];
}

// コメント著者の候補 (u-011, u-012 除外)
const allCommenters = allUserKeys.filter((k) => k !== 'u-011' && k !== 'u-012');
const mobCommenters = mobKeys; // mob だけのプール
const coreCommenters = [...coreKeys, 'u-013']; // u-011/u-012 除外

const generatedComments = [];
let nextId = 21;

function makeKey() {
  const k = `c-${String(nextId).padStart(3, '0')}`;
  nextId += 1;
  return k;
}

// 各ルートのいいね済みユーザーを高速参照するためのインデックス
const likersByRoute = {};
for (const l of routeLikes) {
  (likersByRoute[l.routeKey] = likersByRoute[l.routeKey] || []).push(l.userKey);
}

// ルートごとに残りコメント生成
for (const r of allRoutes) {
  if (r.visibility === 'PRIVATE') continue;
  const band = bandOf(r.targetLikes);
  if (band === 'unknown') continue;

  const sampleCount = sampleCountByRoute[r.key] || 0;
  let targetCount = targetCommentsForBand(band);

  // general バンドの 35% だけ 1 件、残り 0 件
  if (band === 'general') {
    targetCount = generalHasComment(r.key) ? 1 : 0;
  }
  // middle バンドの 60% は 2 件、残り 1 件
  if (band === 'middle' && middleHasSecondComment(r.key)) {
    targetCount = 2;
  }

  const remaining = Math.max(0, targetCount - sampleCount);
  if (remaining === 0) continue;

  // コメント候補は「そのルートにいいねしたユーザー」を優先 (まれに非いいねコアも)
  const likerPool = (likersByRoute[r.key] || []).slice();
  // 著者は通常コメントの著者にはしない
  const pool = likerPool.length > 0 ? likerPool : allCommenters;
  const filtered = pool.filter((k) => k !== r.authorKey && k !== 'u-011' && k !== 'u-012');

  if (filtered.length === 0) continue;

  const commenters = pickN(`comment-pool:${r.key}`, filtered, remaining);

  // テンプレ選択
  const tmplList =
    band === 'buzz' ? templateBuzz :
    band === 'popular' ? templatePopular :
    band === 'middle' ? templateMiddle :
    templateGeneral;

  // ルート毎の createdAt は targetLikes が高いほど古い投稿として扱う想定だが、
  // ここでは r.key の hash を起点に 2024-09-01〜2025-12-31 の間で散らす。
  const baseTs = 1725148800; // 2024-09-01T00:00:00Z (秒)
  const span = 60 * 60 * 24 * 487; // ~487日
  let idx = 0;
  for (const commenter of commenters) {
    const seedKey = `${r.key}#${commenter}#${idx}`;
    const text = pickFromTemplate(seedKey, tmplList);
    const offsetSec = hashString(seedKey) % span;
    const ts = new Date((baseTs + offsetSec) * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');

    // バンド別 targetLikes 算出。
    // 仕様書 §8.2.2 によりコメント全体の 30% (約 135 件) のみがいいねを獲得する。
    // サンプル c-001〜c-020 で 82 likes 確保、生成分はそれに上乗せして合計が
    // 約 135 件になるよう各バンドで控えめに付ける。
    let cTargetLikes = 0;
    const h = hashString(`tl:${seedKey}`);
    const hasLike = (h % 100) < (band === 'buzz' ? 8 : band === 'popular' ? 5 : band === 'middle' ? 2 : 1);
    if (hasLike) {
      cTargetLikes = band === 'buzz' || band === 'popular'
        ? 1 + ((h >> 8) % 2)   // 1-2
        : 1;                   // 1
    }

    generatedComments.push({
      key: makeKey(),
      routeKey: r.key,
      authorKey: commenter,
      text,
      createdAt: ts,
      targetLikes: cTargetLikes,
    });
    idx += 1;
  }

  // バズ・人気枠は著者返信を 1 件追加 (commenters の最初の人へ)
  if ((band === 'buzz' || band === 'popular') && commenters.length > 0) {
    const target = commenters[0];
    const replyTmpl =
      hashString(`reply-style:${r.key}`) % 2 === 0
        ? templateAuthorReplyToThanks
        : templateAuthorReplyToQuestion;
    const text = pickFromTemplate(`reply:${r.key}`, replyTmpl).replace('{name}', target);
    const seedKey = `reply-ts:${r.key}`;
    const offsetSec = hashString(seedKey) % span;
    const ts = new Date((baseTs + offsetSec) * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');

    // 著者返信は仕様書 §8.2.2 で平均 5〜10 いいねを想定。サンプル
    // c-003/c-006/c-016/c-019 が平均 7.5 を担っているため、生成分の返信は
    // 全体合計 135 を超えないよう 1 件のみ付与に抑える。
    generatedComments.push({
      key: makeKey(),
      routeKey: r.key,
      authorKey: r.authorKey,
      text,
      createdAt: ts,
      targetLikes: 1,
    });
  }
}

// マージ
const comments = [...sampleComments, ...generatedComments];

// 重複 (route + author + text) チェックは緩めるが key 重複は禁止
{
  const seen = new Set();
  for (const c of comments) {
    if (seen.has(c.key)) throw new Error(`dup comment key: ${c.key}`);
    seen.add(c.key);
  }
}

// ---------------------------------------------------------------------------
// §D. commentLikes
// ---------------------------------------------------------------------------

const commentLikes = [];
for (const c of comments) {
  if (c.targetLikes <= 0) continue;
  // いいねできるのは作者以外、かつ u-011/u-012 を除く
  const candidates = allUserKeys.filter(
    (k) => k !== c.authorKey && k !== 'u-011' && k !== 'u-012',
  );
  const desired = Math.min(c.targetLikes, candidates.length);
  const likers = pickN(`comment-likes:${c.key}`, candidates, desired);
  for (const userKey of likers) {
    commentLikes.push({ userKey, commentKey: c.key });
  }
}

// 重複検査
{
  const seen = new Set();
  for (const l of commentLikes) {
    const key = `${l.userKey}@${l.commentKey}`;
    if (seen.has(key)) throw new Error(`dup commentLike: ${key}`);
    seen.add(key);
  }
}

// ---------------------------------------------------------------------------
// 出力 (TS ファイル組み立て)
// ---------------------------------------------------------------------------

function jsString(s) {
  // シングルクォート文字列としてエスケープ
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function emitFollows(arr) {
  const lines = arr.map(
    (f) => `  { followerKey: ${jsString(f.followerKey)}, followingKey: ${jsString(f.followingKey)} },`,
  );
  return `export const follows: SeedFollow[] = [\n${lines.join('\n')}\n];\n`;
}

function emitRouteLikes(arr) {
  const lines = arr.map(
    (l) => `  { userKey: ${jsString(l.userKey)}, routeKey: ${jsString(l.routeKey)} },`,
  );
  return `export const routeLikes: SeedLike[] = [\n${lines.join('\n')}\n];\n`;
}

function emitCommentLikes(arr) {
  const lines = arr.map(
    (l) => `  { userKey: ${jsString(l.userKey)}, commentKey: ${jsString(l.commentKey)} },`,
  );
  return `export const commentLikes: SeedLike[] = [\n${lines.join('\n')}\n];\n`;
}

function emitComments(arr) {
  const lines = arr.map((c) => {
    return [
      '  {',
      `    key: ${jsString(c.key)},`,
      `    routeKey: ${jsString(c.routeKey)},`,
      `    authorKey: ${jsString(c.authorKey)},`,
      `    text: ${jsString(c.text)},`,
      `    createdAt: ${jsString(c.createdAt)},`,
      `    targetLikes: ${c.targetLikes},`,
      '  },',
    ].join('\n');
  });
  return `export const comments: SeedComment[] = [\n${lines.join('\n')}\n];\n`;
}

const header = `// Routem シードデータ: ソーシャルグラフ
// (Follow / Like(Route) / Comment / Like(Comment))
//
// 仕様書 docs/seed-spec.md §8, §9, §13 に従い、scripts/generateSocialGraph.mjs で
// 一回限りの決定論的生成を行った結果を固定値として書き出している。
// データを再生成したい場合は次を実行する:
//   node scripts/generateSocialGraph.mjs
//
// ⚠️ このファイルは手で編集しない。修正が必要なときはジェネレータを直して再実行する。
//
// 件数:
//   - follows:       ${follows.length} 件
//   - routeLikes:    ${routeLikes.length} 件
//   - comments:      ${comments.length} 件 (うちサンプル c-001〜c-020 は 20 件)
//   - commentLikes:  ${commentLikes.length} 件
//
// エッジケース:
//   - u-011 quiet_user は follow / like / comment いずれも 0
//   - u-012 private_only は u-013 と相互フォローのみ。投稿は PRIVATE なので
//     その投稿に対する like / comment は 0、commenter としても登場しない
//   - 各ルート 1 本につき同一ユーザーからのいいねは 1 回のみ (Prisma の
//     @@unique([userId, routeId]) を尊重し最大 31 人まで)。

import type { SeedComment, SeedFollow, SeedLike } from './types';

`;

const out = [
  header,
  emitFollows(follows),
  '',
  emitRouteLikes(routeLikes),
  '',
  emitComments(comments),
  '',
  emitCommentLikes(commentLikes),
].join('\n');

fs.writeFileSync(OUT, out, 'utf8');

// 統計サマリ
console.log('=== socialGraph.ts generated ===');
console.log(`follows:      ${follows.length}`);
console.log(`routeLikes:   ${routeLikes.length}`);
console.log(`comments:     ${comments.length} (sample 20 + generated ${generatedComments.length})`);
console.log(`commentLikes: ${commentLikes.length}`);
console.log('');

// follower 上位/下位
const followerCount = {};
const followingCount = {};
for (const f of follows) {
  followerCount[f.followingKey] = (followerCount[f.followingKey] || 0) + 1;
  followingCount[f.followerKey] = (followingCount[f.followerKey] || 0) + 1;
}
const sortedFollowers = Object.entries(followerCount).sort((a, b) => b[1] - a[1]);
console.log('Top 5 followers:');
for (const [k, v] of sortedFollowers.slice(0, 5)) console.log(`  ${k}: ${v}`);
console.log('Bottom 5 followers (excluding 0-followed):');
for (const [k, v] of sortedFollowers.slice(-5)) console.log(`  ${k}: ${v}`);

// route likes 上位
const likeCount = {};
for (const l of routeLikes) likeCount[l.routeKey] = (likeCount[l.routeKey] || 0) + 1;
const sortedLikes = Object.entries(likeCount).sort((a, b) => b[1] - a[1]);
console.log('Top 5 routeLikes:');
for (const [k, v] of sortedLikes.slice(0, 5)) console.log(`  ${k}: ${v}`);

// comment likes 上位
const cLikeCount = {};
for (const l of commentLikes) cLikeCount[l.commentKey] = (cLikeCount[l.commentKey] || 0) + 1;
const sortedCLikes = Object.entries(cLikeCount).sort((a, b) => b[1] - a[1]);
console.log('Top 5 commentLikes:');
for (const [k, v] of sortedCLikes.slice(0, 5)) console.log(`  ${k}: ${v}`);

// エッジケース確認
const u011_follows = follows.filter((f) => f.followerKey === 'u-011' || f.followingKey === 'u-011');
const u011_likes = routeLikes.filter((l) => l.userKey === 'u-011');
const u011_comments = comments.filter((c) => c.authorKey === 'u-011');
const u012_route_likes_received = routeLikes.filter((l) => {
  const r = allRoutes.find((x) => x.key === l.routeKey);
  return r && r.authorKey === 'u-012';
});
console.log('');
console.log(`u-011 関連レコード: follows=${u011_follows.length}, likes=${u011_likes.length}, comments=${u011_comments.length}`);
console.log(`u-012 の PRIVATE ルートに対する likes: ${u012_route_likes_received.length} (期待値 0)`);
