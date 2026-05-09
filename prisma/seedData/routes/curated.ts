// Routem シードデータ: 手作りルート 50 本（r-001 〜 r-050）。
//
// 仕様書 docs/seed-spec.md §7.1 / §7.2 / §7.5 / §7.6 / §13 に準拠。
// authorKey / spotKey / thumbnailKey / imageKeys / tagKeys は依存ファイル
// (users / spots / images / tags) のキーと完全一致させる。
//
// 著者ペルソナ別の口調指針:
//   u-001 たびまる (r-001〜r-010): 結論先行型・断定的・47都道府県制覇の自信
//   u-002 sakura_trip (r-011〜r-018): 柔らかく丁寧、京都への愛、早朝・観光客のいない時間
//   u-003 kenji_outdoor (r-019〜r-023): ファミリー目線、駐車場・トイレなど実用情報
//   u-004 mio_couple (r-024〜r-028): 彼との二人旅、記念日、ご褒美ステイ、写真重視
//   u-005 hayato_solo (r-029〜r-031): 学生ソロ、青春18きっぷ、節約、〇〇円縛り
//   u-006 gourmet_aki (r-032〜r-037): 食べ歩き、1日5食、ミシュランからB級まで
//   u-007 island_hopper (r-038〜r-042): 離島マニア、フェリー、知る人ぞ知る
//   u-008 natsu_family (r-043〜r-046): 子連れ、自由研究、ベビーカー、子目線
//   u-009 photo_yuki (r-047〜r-050): マジックアワー、光と季節、画になる、シャッター
//
// date / createdAt:
//   - date は 2024-01-01 〜 2026-04-30 の範囲、夏休み枠 (7-8月) を多めに含む
//   - createdAt は date + 0〜90 日後（典型的な事後投稿）
//   - 例外 10%: r-006, r-018, r-040, r-047 は事前計画で createdAt < date

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

export const curatedRoutesFirstHalf: SeedRoute[] = [
  // ===========================================================================
  // §A. u-001 たびまる（インフルエンサー）の手作り 10 本（r-001 〜 r-010）
  //
  // 口調: 結論先行・断定的・リスト的・「保存推奨」「最適解」「断言します」
  // 絵文字: 🚄✈️📌 を 1〜3 個。
  // ===========================================================================

  // ---- r-001 沖縄本島3泊4日（バズ 480 likes / 9,200 views） ----
  {
    key: 'r-001',
    authorKey: 'u-001',
    title: '【夏休み完全版】沖縄本島3泊4日 古宇利島・美ら海・首里城をぜんぶ回る黄金ルート',
    description:
      '結論から言うと、これが沖縄本島を3泊4日でしゃぶり尽くす最適解です。47都道府県制覇した僕が、過去5回の沖縄取材を踏まえて組み直しました📌 ポイントは初日に首里城と国際通りを片付けて、2日目を北部一本に絞ること。古宇利大橋は午前の光、美ら海は混雑前の開館直後が正解。3日目に慶良間で離島を1日体験すれば、ベタな観光地で終わらない満足感が出ます。最終日は国際通りで土産を片付けて空港へ。レンタカーは必須、宿は那覇2泊+恩納村1泊が動きやすかったです🚄',
    date: '2025-07-15T09:00:00Z',
    createdAt: '2025-07-25T13:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-013', 'tag-010'], // 夏休み / 家族旅行 / 絶景
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-001',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              '初日のお昼前に到着。守礼門をくぐった瞬間「沖縄に来た!」って実感する場所。世界遺産の朱色は写真より実物が映えます。階段が多いので午前中の元気なうちに片付けるのが正解。',
            imageKeys: ['img-node-s098-1', 'img-node-s098-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 38.0, memo: '首里城公園駐車場から残波岬まで、沖縄道→国道58号で読谷へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-110',
            details:
              '初日の締めは残波岬の夕日。灯台と崖と西日のコントラストは初日から沖縄を浴びた感が出ます。日没の30分前到着が目安、海風が強いので軽い羽織は持参推奨。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 36.0, memo: '残波岬から国道58号で那覇市内、国際通り近隣のコインパーキングへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '夜の国際通りは屋台と居酒屋の活気が頂点。サーターアンダギーは「丸三冷物店」、ステーキは「ジャッキー」が外しません。お土産はラスト日に回して、初日は身軽に屋台メシを楽しむのが個人的鉄則。',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '国際通り中心部から屋台村「のうれんプラザ」まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夜更けは屋台村のうれんプラザでオリオン生と泡盛のハシゴ。地元客に紛れて沖縄の夜を浴びる時間で、初日の動線の最後にこれを置くと旅のテンションが整います📌',
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
              '北部観光の起点。橋を渡る瞬間が圧巻ですが、撮影は橋の手前駐車場で停めて歩いて渡るのがおすすめ。午前9〜10時の透明度が一番高いです。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: '古宇利大橋から美ら海水族館まで、海岸線沿いに北上', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '黒潮の海大水槽は何度見ても圧巻。混雑前の開館直後（8:30）に入って、ジンベエザメの正面ベンチを確保するのが最高の体験。年パスより1日券で十分回れます。',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 75, distance: 65.0, memo: '美ら海から那覇方面へ南下、首里城の夕方ライトアップに合わせて到着', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-098',
            details:
              '北部から戻る途中、夕方の首里城をもう一度。守礼門のライトアップが始まる17:30以降が映える時間帯で、観光客もまばら。初日と同じ場所でも夜の顔は完全に別物です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 4.0, memo: '首里城から国際通り近隣の沖縄料理店まで那覇市内を移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夕食は国際通り裏路地の居酒屋「うりずん」で泡盛と島豆腐料理。北部一本の長い1日を締めるなら、那覇のローカルな夜の雰囲気で〆るのが個人的最適解📌',
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
              '泊港に向かう前に、もう一度残波岬で朝の海を浴びる。朝7時前なら釣り人と地元ランナーしかいない静かな崖の風景です。フェリーの乗船時間から逆算して30分滞在で十分。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '残波岬から泊港まで車移動、フェリー乗り場の駐車場へ', order: 1 },
              { mode: TransitMode.SHIP, duration: 90, distance: 40.0, memo: '泊港から阿嘉島まで高速船', order: 2 },
            ],
          },
          {
            order: 2,
            spotKey: 's-112',
            details:
              '慶良間ブルーと呼ばれる海をはじめて見たときの衝撃は忘れられません。シュノーケルなら阿嘉ビーチが安全で初心者向け。日帰りでも余裕で楽しめます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 90, distance: 40.0, memo: '阿嘉島から泊港へ高速船で帰着', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '泊港から徒歩圏の国際通りで夜の打ち上げ。慶良間で疲れた身体には「沖縄そばと家庭料理 かちかち山」の軽めの定食がちょうど良い。屋台のオリオン生で〆ます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 14, distance: 4.5, memo: '国際通りから首里城公園まで那覇市内モノレール沿いに移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-098',
            details:
              '夜の首里城外周を散策で〆。守礼門のライトアップは21時頃まで稼働していて、慶良間の海から戻った夜にもう一度立ち寄ると、海と歴史の落差で旅のリズムが整います📌',
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
            spotKey: 's-111',
            details:
              '最終日のお土産タイム。紅芋タルトは御菓子御殿の本店、泡盛は古酒専門店の久米仙営業所がおすすめ。空港で買うと種類が少ないので、ここで仕上げる派です。',
            imageKeys: ['img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 4.5, memo: '国際通りから首里城公園まで那覇市内モノレール沿い', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-098',
            details:
              '空港行きの前にもう一度首里城へ。初日に登った守礼門前で旅の締めの1枚を撮るのが個人的恒例。滞在30分でも、4日間の沖縄を回収する儀式として効きます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 6.0, memo: '首里城から那覇空港へ、ゆいレールでも代替可', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '空港に向かう前のラスト沖縄そば。「首里そば」本店が空港行き経路上にあって、最後の一杯にはこれ以上ないチョイス。チェックインまで余裕がある人だけが行けるご褒美ルートです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '国際通り界隈から残波岬まで国道58号を北上、空港便の出発時間に注意', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-110',
            details:
              '時間に余裕がある日だけ、空港行く前にもう一度残波岬で海を浴びる。初日に夕日を見た同じ場所で、最終日は午前の青い海を撮って4日間の沖縄を回収するのが個人的最後の儀式📌',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 480,
    targetViews: 9200,
  },

  // ---- r-002 北海道5日間（バズ 410 likes / 8,500 views） ----
  {
    key: 'r-002',
    authorKey: 'u-001',
    title: '大人の北海道5日間 富良野ラベンダー〜知床秘境クルーズ',
    description:
      '北海道は広い。だからこそ「全部回ろう」とすると失敗します。結論、5日あるなら 札幌→富良野・美瑛→旭川→知床→小樽 の動線一択。レンタカー必須、走行距離は900kmオーバーですが、これが一番無駄がない✈️ ファーム富田のラベンダーは7月中旬〜下旬がピーク、知床クルーズは半島先端まで行くタイプを必ず予約してください。3日目の旭山動物園は早朝開門ダッシュで人だかりを回避するのが鉄板。最終日に小樽で海鮮を食べて札幌空港、これで完璧です。',
    date: '2024-07-20T08:00:00Z',
    createdAt: '2024-08-15T19:45:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-010'], // 夏休み / 自然 / 絶景
    budget: { amount: 130000, currency: JPY },
    thumbnailKey: 'img-thumb-002',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details:
              '新千歳空港から直接札幌中心へ。大通公園は夏のビアガーデン期間中が活気の頂点。初日はここでゆるく仕上げて、明日からの北上に備えるのが正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園から二条市場までさっぽろテレビ塔経由で徒歩圏', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-121',
            details:
              '初日の夕食は二条市場。ウニ・イクラの海鮮丼でいきなり北海道の底力を浴びるのが正解。「のんのん」のウニいくら丼は3500円、初日のテンションを上げる投資としては安すぎる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 33.0, memo: '札幌駅からJR函館本線で小樽駅、夕方の運河ライトアップに合わせて到着', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-049',
            details:
              '小樽運河の夜のガス灯は写真より実物が断然きれい。札幌から日帰り圏内なので、初日に組み込んでおくと2日目以降の動線が綺麗にまとまります。22時前に札幌へ戻れます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 33.0, memo: '小樽駅から札幌駅まで快速エアポートで戻り、夜の大通公園エリアへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-045',
            details:
              '札幌に戻ったあとは大通公園の夜景で初日を〆。テレビ塔のライトアップ越しに見る大通の並木は22時まで稼働していて、初日の海鮮+運河+夜景のフルコースが完成します✈️',
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
              '富良野まで車で約2時間半。ファーム富田は朝の光が一番ラベンダーが映えます。トラディショナルラベンダー畑（彩の畑）は朝7時〜10時が混雑前のゴールデンタイム。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 45, distance: 32.0, memo: '富良野から美瑛・青い池へ国道237号北上', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '青い池は午後の方が水面が落ち着いて青く見えます。駐車場は500円、所要時間は30分で十分。隣接する白ひげの滝もセットで回るのが効率的。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 38.0, memo: '美瑛から旭川市内の旭山動物園へ夕方便で移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-053',
            details:
              '旭山動物園は夕方17:30まで（夏期）。閉園1時間前に滑り込めば人が引いた園内をゆっくり回れます。本格鑑賞は明日の朝に回し、初日はもうじゅう館とペンギン館を押さえる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '旭山動物園から旭川市内のラーメン横丁まで車移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-053',
            details:
              '夜は旭川市内に泊まって、ラーメン横丁で「梅光軒」の旭川醤油ラーメン。明日の早朝再入園に備えて旭山近くのホテルがベスト、就寝22時で開門時間に余裕📌',
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
            spotKey: 's-053',
            details:
              '昨日の夕方下見を踏まえ、9:30開門と同時に再入園。あざらし館の円柱水槽前で30分粘ると行動展示の真骨頂が見られます。お昼までに主要展示を片付けて午後の長距離移動に備えるのが鉄則。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 240, distance: 200.0, memo: '旭川から知床ウトロまで4時間ドライブ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              '知床五湖は地上遊歩道（夕方）が時間あたりの満足度が一番高い。ヒグマ目撃情報がある日はクローズなので、当日の知床財団HPで確認を。',
            imageKeys: ['img-node-s048-1', 'img-node-s048-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '知床五湖からウトロ市街、フレペの滝遊歩道入口へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-048',
            details:
              '夜は知床自然センターのナイトプログラムへ。フレペの滝近辺の遊歩道で星空とエゾシカを観察できます。20時集合・所要1時間半、ヒグマ対策のレクチャー付き。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 3.5, memo: 'ナイトプログラム終了後、ウトロのRVパークで翌日の出発に備える', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-048',
            details:
              '深夜のウトロ漁港でオホーツク海の星空仕上げ。漁港堤防は地元釣り人がいる程度で、知床連山と銀河のコラボが光害なしで撮れる隠れた絶景ポイント📌',
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
            spotKey: 's-056',
            details:
              '知床から札幌方向へ戻るついでにニセコへ。夏のニセコはアウトドア天国で、ラフティングや乗馬が現地予約で当日OK。羊蹄山ビューの宿が外しません。',
            imageKeys: ['img-node-s056-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: 'ニセコから洞爺湖畔まで国道230号で南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '洞爺湖は午後の遊覧船クルーズで中島まで往復。湖畔のRVパークで車中泊する人も多く、設備が整っています。夏限定の毎晩花火大会は20:45開始、湖上から見ると圧巻。',
            imageKeys: ['img-node-s054-1', 'img-node-s054-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 40.0, memo: '洞爺湖から登別温泉へ、道央道で40分', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-055',
            details:
              '登別温泉地獄谷は夜の鬼火の路ライトアップが圧巻。20時から22時まで、遊歩道に置かれた鬼の灯篭がじわっと地獄を照らす演出は写真欲が爆発します。',
            imageKeys: ['img-node-s055-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: '地獄谷遊歩道から登別温泉街の宿まで戻る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-055',
            details:
              '宿に戻る前に登別温泉街の中央通りで地ビール「のぼりべつ地ビール館」へ。3種類飲み比べセット1500円で道央道の長距離移動を労う、4日目のご褒美ストップ✈️',
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
            spotKey: 's-121',
            details:
              '最終日の朝食は二条市場で再訪。「大磯」のホタテ刺し定食は朝7時から営業していて、空港便に間に合う早朝アクセスが優秀。海鮮で旅を締めるリズムが整います。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 33.0, memo: '札幌駅から小樽駅まで快速エアポートで一直線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-049',
            details:
              '小樽運河は写真より実物の方が情緒があります。寿司なら「政寿司」本店、海鮮丼なら「滝波食堂」一択。ガラス工房巡りは午前中が空いてておすすめ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 38.0, memo: '小樽から新千歳空港、最後の海鮮ランチを挟む余裕あり', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-045',
            details:
              '空港行きの前にもう一度大通公園で締め。とうきびワゴンのバター醤油焼きで旅を終えるのが個人的儀式。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園からさっぽろ駅前通り地下街経由で札幌駅へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-045',
            details:
              '札幌駅地下のステラプレイスで最後の土産整理。ロイズのチョコと六花亭のマルセイバターサンドはここで揃えるのが品揃え一番、5日間の旅の最終ピースが完成します✈️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 410,
    targetViews: 8500,
  },

  // ---- r-003 高尾山〜河口湖 日帰り（バズ 360 likes / 7,800 views） ----
  {
    key: 'r-003',
    authorKey: 'u-001',
    title: '【弾丸】東京から日帰りで行ける夏の絶景 高尾山〜河口湖の1日',
    description:
      '東京から日帰り、車1台で高尾山と河口湖と富士五合目を全部回れます。早朝5時出発が必須条件。結論、高尾山1号路ピストン2時間→中央道で河口湖→富士スバルラインで五合目、夕方には都内に戻れます🚄 弾丸ですが満足度はかなり高い。コツは渋滞回避で、山中湖方面は使わず必ず河口湖ICを使うこと。日帰りで富士山を浴びるならこのルートが現状ベスト。',
    date: '2024-08-03T05:00:00Z',
    createdAt: '2024-08-10T22:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-010', 'tag-025'], // 夏休み / 絶景 / 弾丸旅行
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-003',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-022',
            details:
              '早朝6時着でケーブルカー始発。1号路を歩いて山頂往復で2時間。混雑前に降りてくるのが鉄則です。山頂のもみじ屋のとろろそばは下山前に食べて損なし。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 80, distance: 75.0, memo: '高尾山ICから中央道、河口湖ICまで一直線', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '大石公園のラベンダーと富士山のコラボは夏限定の絶景。コキアの時期もいいですが、今回は7月後半の青ラベンダー狙いで。トイレと駐車場は無料、回転も早い。',
            imageKeys: ['img-node-s007-1', 'img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 45, distance: 18.0, memo: '河口湖から富士スバルライン経由で五合目駐車場へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-006',
            details:
              '夕方の五合目は雲海が出やすく、運がいいと富士山頂のオレンジ色が拝めます。標高2300mで気温は下界より15度低いので長袖必須。日帰りでもここまで来た価値が出ます。',
            imageKeys: ['img-node-s006-1', 'img-node-s006-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 360,
    targetViews: 7800,
  },

  // ---- r-004 鳥取砂丘とラクダと夕日（人気 95 likes / 1,200 views） ----
  {
    key: 'r-004',
    authorKey: 'u-001',
    title: '47都道府県制覇の旅 #38 鳥取砂丘とラクダと夕日と',
    description:
      '47都道府県制覇シリーズ第38回、鳥取編。結論、鳥取砂丘は午前と夕方の2回入るのが正解です📌 午前は風紋がきれいに残る時間、夕方は影が伸びて砂丘が砂漠みたいに化ける時間。間に砂の美術館を挟むと飽きません。2日目は出雲大社まで足を伸ばして縁結びをセットにすれば、写真映えと寺社仏閣の両方が狙えます。ソロ旅向けですが、レンタカーがあれば気軽。',
    date: '2025-04-12T08:30:00Z',
    createdAt: '2025-05-08T20:15:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-010', 'tag-022'], // 自然 / 絶景 / 写真映え
    budget: { amount: 35000, currency: JPY },
    thumbnailKey: 'img-thumb-004',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-076',
            details:
              '到着初日。10時前に入って馬の背の頂上まで登り、海をバックに1枚。風紋がきれいに残る時間帯はとにかく早朝、午前中の写真は格段に映えます。',
            imageKeys: ['img-node-s076-1', 'img-node-s076-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: '砂丘入口から砂の美術館までは徒歩でも近い、ラクダ乗り場の近く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-076',
            details:
              '昼過ぎは隣接の砂の美術館（700円）で世界の砂像を浴びてから、再び砂丘に戻ってラクダ乗り体験（1500円・5分）。午前と夕方の間の時間つぶしとしてちょうど良い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: '砂の美術館から馬の背の夕景ビューポイントへ徒歩で戻る', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-076',
            details:
              '夕方の再入りが本日のメインディッシュ。日没30分前に馬の背に登り直して、影が伸びた砂丘が砂漠化する瞬間を撮る。日没後はライトアップなしなのでヘッドライト推奨。',
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
              '出雲大社は朝イチがマスト。8時前に勢溜の鳥居をくぐって参道を歩くと、観光客がほとんどおらず、松林に朝日が差し込む参道が幻想的。',
            imageKeys: ['img-node-s077-1', 'img-node-s077-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '本殿から神楽殿まで参道を西へ、八足門を経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-077',
            details:
              '神楽殿の大注連縄は写真で見るより遥かに巨大で、その下に立つと圧倒されます。長さ13.6m・重さ5.2tの威圧感は、参拝後すぐに腹に効きます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '神楽殿から授与所へ移動、御朱印と縁結び御守を受ける', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-077',
            details:
              '御朱印帳を新調するならここの限定柄が一番気合い入ります。境内の宝物殿（300円）も忘れずに、出雲国造家伝来の太刀と古文書がしっかり拝めるソロ向けの締め。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 95,
    targetViews: 1200,
  },

  // ---- r-005 京都早朝散歩（人気 110 likes / 1,450 views） ----
  {
    key: 'r-005',
    authorKey: 'u-001',
    title: '京都 真夏の早朝散歩 観光客のいない清水寺と祇園',
    description:
      '結論、夏の京都は朝6時に勝負が決まります。清水寺は朝6時開門、その瞬間に入れば本当に誰もいません。三年坂・二年坂を抜けて八坂神社、祇園花見小路まで一気に歩いて錦市場の朝食で締めるのが個人的最強ルート📌 日中は人と暑さで死ぬので、ホテルに戻って二度寝が正解です。ソロ向け、写真撮るなら必須コース。',
    date: '2024-08-25T05:30:00Z',
    createdAt: '2024-09-12T18:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-022'], // 寺社仏閣 / 写真映え
    budget: { amount: 12000, currency: JPY },
    thumbnailKey: 'img-thumb-005',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-025',
            details:
              '6時開門と同時に入る。誰もいない清水の舞台で日の出を浴びる体験はガチで唯一無二。30分で本堂・舞台・音羽の滝まで回れます。',
            imageKeys: ['img-node-s025-1', 'img-node-s025-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.6, memo: '三年坂・二年坂・八坂神社を抜けて花見小路へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details:
              '朝7時前の花見小路は石畳が掃き清められた直後で、舞妓さんも観光客もいない静謐な時間。ここで撮れる写真は昼間とは全くの別物です。',
            imageKeys: ['img-node-s035-1', 'img-node-s035-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '四条通を西へ歩いて錦市場の東口へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-125',
            details:
              '錦市場は9時から店が動き始めます。朝食は「だし巻き玉子の三木鶏卵」と「タコたまご」、コーヒーは「アラビカ京都 東山」が早朝から開いてて穴場。',
            imageKeys: ['img-node-s125-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 110,
    targetViews: 1450,
  },

  // ---- r-006 屋久島縄文杉トレッキング（人気 75 likes / 980 views）
  // ---- 例外: 事前計画として createdAt < date ----
  {
    key: 'r-006',
    authorKey: 'u-001',
    title: '屋久島 縄文杉トレッキング 1泊2日（体力に自信ある人向け）',
    description:
      '結論から言うと、これは体力ある人向け、覚悟して読んでください。荒川登山口から縄文杉まで往復22km・所要10時間、登山初心者には絶対に勧められません。逆に体力に自信があるなら、これに勝る達成感は屋久島で他にない📌 1日目はトロッコ道を進んで縄文杉でランチ、2日目は白谷雲水峡で苔の森を体験するのが王道。雨対策必須、レインウェア上下とザックカバーは命綱です。',
    date: '2025-05-20T04:00:00Z',
    createdAt: '2025-04-15T10:00:00Z', // 事前計画（10% exception）
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-020', 'tag-024'], // 自然 / ハイキング / 秘境
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-006',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-096',
            details:
              '登山口から縄文杉まで片道5時間。トロッコ道4時間+山道1時間の構成で、序盤の単調さに耐えられるかが勝負。縄文杉の前のデッキで食べるおにぎりは一生忘れません。',
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
            details:
              '前日の縄文杉往復で完全にダウン。2日目は荒川登山口の入り口だけ朝靄ごしに眺めて、昨日見た縄文杉の余韻を噛みしめながら撤収。午後は安房港経由でフェリーで鹿児島へ、トレッキング後の「尾之間温泉」が筋肉痛に効きます。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 75,
    targetViews: 980,
  },

  // ---- r-007 金沢2日間（人気 88 likes / 1,180 views） ----
  {
    key: 'r-007',
    authorKey: 'u-001',
    title: '【保存版】はじめての金沢2日間 兼六園・ひがし茶屋街・近江町市場',
    description:
      '結論、金沢初訪問なら兼六園とひがし茶屋街と近江町市場の3点を押さえれば9割クリアです📌 1日目に兼六園を朝のうちに片付けて、夕方ひがし茶屋街で夜のお茶屋遊び（観光向けの軽いやつ）。2日目は朝活でひがし茶屋街の朝の風情を撮影、午後にもう一度兼六園で雰囲気の違いを楽しむのが個人的に一番美味しい使い方。近江町市場の海鮮丼は移動中に挟み込んで損なし。',
    date: '2025-03-15T09:00:00Z',
    createdAt: '2025-04-22T14:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-003', 'tag-004'], // 歴史 / グルメ / カフェ
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-007',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-064',
            details:
              '入園は朝7時の早朝開園が無料で穴場。霞ヶ池の徽軫灯籠を朝靄ごしに撮ると絵葉書になります。1時間半でぐるっと一周。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 10, distance: 2.0, memo: '兼六園下バス停から武蔵ヶ辻・近江町市場まで、北鉄バス1日券利用', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '兼六園のあとは徒歩+バスで近江町市場へ移動して、昼食は迷わず海鮮丼。「いきいき亭」のおまかせ丼か「山さん寿司」のお造り定食が王道で、どちらも開店直後を狙うのが空席確保の正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 8, distance: 1.6, memo: '武蔵ヶ辻から橋場町まで北鉄バス、ひがし茶屋街入口まで徒歩', order: 1 },
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '橋場町からひがし茶屋街入口まで浅野川大橋経由', order: 2 },
            ],
          },
          {
            order: 3,
            spotKey: 's-065',
            details:
              '夕方のひがし茶屋街は提灯に火が入って雰囲気が変わります。「茶屋美人」で和スイーツ、「金澤しつらえ」でお土産、と同じ通りで完結できる効率の良さ。',
            imageKeys: ['img-node-s065-1', 'img-node-s065-2'],
            transitSteps: [],
          },
        ],
      },
      {
        day: 2,
        nodes: [
          {
            order: 1,
            spotKey: 's-065',
            details:
              '朝8時のひがし茶屋街は観光客がほぼゼロ。石畳が清められた直後の表情が一番美しい。撮影のためだけに早起きする価値あり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '近江町市場まで橋場町経由で徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '昨日に続いて近江町市場で2回目の海鮮。今日は「むさし通り」の方の店を狙って、昨日と違う丼で食べ比べ。場内の総菜店で甘エビコロッケを買って歩き食いするのも金沢らしい使い方です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 12, distance: 2.4, memo: '近江町市場から兼六園下まで北鉄バスで戻る', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '同じ兼六園でも昼の光と朝の光は別物。霞ヶ池の鏡面と松の影のコントラストは午後3時前が一番きれい。帰る前にもう一度寄って正解でした。',
            imageKeys: ['img-node-s064-3'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 88,
    targetViews: 1180,
  },

  // ---- r-008 軽井沢2泊3日（人気 65 likes / 850 views） ----
  {
    key: 'r-008',
    authorKey: 'u-001',
    title: '軽井沢で避暑 アウトレットだけじゃない大人の2泊3日',
    description:
      '軽井沢=アウトレットのイメージは一旦忘れてください。結論、ここは温泉と森と高原リゾートの三重奏です📌 1日目は旧軽井沢銀座でジョン・レノンも歩いた通りを散策、2日目は車で草津温泉まで足を伸ばして湯畑の硫黄濃度を浴び、3日目は伊香保温泉で石段街のレトロを味わう。これで関東甲信越の温泉文化が一気に把握できます。大人カップル向けの動線です。',
    date: '2024-08-10T11:00:00Z',
    createdAt: '2024-09-01T21:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-012'], // 夏休み / 温泉 / カップル
    budget: { amount: 78000, currency: JPY },
    thumbnailKey: 'img-thumb-008',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '旧軽井沢銀座は午前11時前なら人通りもまだ少なめ。1本目はチャーチストリート→旧軽銀座→ジョン・レノンが通った万平ホテルまで、徒歩45分のクラシックコースから。',
            imageKeys: ['img-node-s008-1', 'img-node-s008-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '旧軽銀座中央のミカドコーヒー本店までは徒歩圏内', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '昼食はミカドコーヒー本店のモカソフトと「フランスベーカリー」のフランスパン。テイクアウトして雲場池まで散歩しながら食べるのが個人的ルーティン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.6, memo: '旧軽銀座から雲場池までの並木道を歩いて夕方の散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-008',
            details:
              '旧軽銀座は夕方17時以降は店が閉まり始めて静か。提灯の灯りと並木のシルエットが残る時間帯が、軽井沢らしさを一番感じる時間です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '旧軽銀座から万平ホテルまで夜の散策、ジョン・レノンの常宿', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-008',
            details:
              '夜は万平ホテルのカフェテラス「カフェテラス」でコーヒー＆アップルパイ。歴史あるクラシックホテルの空気を浴びると、軽井沢の格調が初日からしっかり身体に入ります📌',
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
            details:
              '草津温泉の湯畑は朝9時前が一番空いています。湯滝の前で記念写真を撮ってから、源泉付近を一周。硫黄の香りが車に染みつくのは覚悟の上で。',
            imageKeys: ['img-node-s012-1', 'img-node-s012-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 60.0, memo: '草津から伊香保まで国道292号→国道353号で南下、午後の日帰り立ち寄り', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-013',
            details:
              '伊香保の石段街を午後に半日寄り道。本番は3日目に取っておくので、今日は石段から上の伊香保神社までの軽い参拝のみ。365段を一気に登るための偵察日と位置づけます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 60.0, memo: '伊香保から草津へ国道353号→292号で戻る、夜のライトアップに合わせて', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-012',
            details:
              '夜の湯畑ライトアップは深夜まで稼働。湯けむりに緑黄ライトが当たる光景はカップル向け絶景。帰ってからの宿でもう一風呂で締めるのが正解です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '湯畑から西の河原通り経由で深夜の足湯スポットまで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-012',
            details:
              '深夜は西の河原公園の無料足湯で〆。湯畑とは違う川沿いの開放感ある足湯で、夜風に当たりながら泉質を最後にもう一度味わうのが大人カップルの草津の使い方✨',
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
            spotKey: 's-013',
            details:
              '伊香保の石段街は365段、上りはきついので往復タクシーが正解。石段を登り切った伊香保神社で運気を整えて、帰りは黄金の湯で締めるのが鉄板。',
            imageKeys: ['img-node-s013-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '石段街の中腹から黄金の湯共同浴場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-013',
            details:
              '黄金の湯は400円で入れる共同浴場。源泉かけ流しでお湯の質が圧倒的、長湯せず20分で上がってちょうどいい強度。湯上がりに石段街の「勝月堂」で湯の花まんじゅうが鉄板。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.3, memo: '黄金の湯から石段街中腹のお土産通りへ戻る', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-013',
            details:
              '帰路は石段街下のロープウェイ乗り場まで戻り、伊香保ロープウェイ展望台へ。標高800mの見晴台から谷川連峰が見える日もあって、3日間の温泉旅の締めには最適です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '伊香保から水沢うどん街道までの帰り道沿いに立ち寄り', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-013',
            details:
              '帰路の〆は水沢うどん街道で「田丸屋」のざるうどん。麺のコシが温泉旅の疲れに効く昼食で、3日間の温泉巡りの最後の食卓にちょうど良い量と価格です✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 65,
    targetViews: 850,
  },

  // ---- r-009 高千穂峡と黒川温泉 3日間（バズ 290 likes / 5,200 views） ----
  {
    key: 'r-009',
    authorKey: 'u-001',
    title: '高千穂峡と黒川温泉 九州の山奥で過ごす夏休み3日間',
    description:
      '結論、夏休みに九州の奥地で「日常から完全に切り離される」体験ができるのがこのルート🚄 高千穂峡のボートで真名井の滝を間近に浴び、黒川温泉で湯めぐり手形を握って外湯3軒、最後に由布院で金鱗湖の朝霧を撮る。全部車移動、阿蘇のカルデラ越えが最高にドライブ向きです。観光地らしい賑やかさはないけど、その分どこも空いていて夏休みっぽくない静けさが味わえる、玄人向けの夏休みプラン。',
    date: '2025-08-14T10:00:00Z',
    createdAt: '2025-08-30T15:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-008', 'tag-024'], // 夏休み / 温泉 / 秘境
    budget: { amount: 68000, currency: JPY },
    thumbnailKey: 'img-thumb-009',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details:
              'ボートは事前予約推奨。当日券は朝7時から並んで取れるかどうかという激戦。真名井の滝を真下から見上げる体験は写真より遥かに迫力があります。',
            imageKeys: ['img-node-s105-1', 'img-node-s105-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'ボート乗り場から高千穂神社・天岩戸神社方面へ徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-105',
            details:
              '午後は高千穂峡から少し離れた高千穂神社・天岩戸神社へ。神話の舞台を一気に巡れて、夜神楽の予習にもなります。所要1時間半でちょうど良いボリューム。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 65.0, memo: '高千穂から黒川温泉まで国道325号→442号、阿蘇のカルデラ越えの絶景ドライブ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-107',
            details:
              '夕方着で黒川温泉にチェックイン。宿の夕食前にひと風呂、街灯篭が灯る前の薄明の時間に温泉街を歩くのが、黒川らしい入り方です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '宿から温泉街中央通りまで街灯篭の灯る時間に合わせて散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-107',
            details:
              '夜は街全体が街灯篭で柔らかく照らされる時間帯。「黒川温泉風の舎」前の風の通り道で1枚撮ると、玄人向け夏休みの空気が完璧に切り取れます🚄',
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
              '黒川温泉は宿の数だけ湯がある。湯めぐり手形（1500円）で3軒の露天が回れます。「いこい旅館」の滝の湯が朝1軒目に最適、開湯時間の8:30から狙うと貸し切り感あり。',
            imageKeys: ['img-node-s107-1', 'img-node-s107-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 35.0, memo: '黒川温泉から阿蘇草千里まで日帰りドライブ、ミルクロード経由で景観良し', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '黒川から阿蘇まで往復2時間で日帰りできる。草千里ヶ浜のカルデラ草原と、晴れていれば中岳火口の噴煙が遠望できる。お土産は阿蘇神社近辺の門前町商店街で確保。',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 35.0, memo: '阿蘇から黒川温泉へ夕方戻り、夜の湯巡り2軒目に備える', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-107',
            details:
              '夜は湯めぐり手形の2軒目「ふもと旅館」と3軒目「山みず木」を制覇。街灯篭がついた夜の湯めぐり風景は昼と全く違う表情で、玄人向けの夏休みらしい静けさが味わえます。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '湯めぐり3軒目から地蔵堂まで参拝に立ち寄り', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-107',
            details:
              '夜の最後は地蔵堂で湯治の感謝参拝。湯めぐり3軒で疲労した身体を整えるための儀式として、毎回手を合わせて宿へ戻るのが個人的ルーティン🚄',
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
            spotKey: 's-093',
            details:
              '金鱗湖は朝6〜7時の朝霧がメインディッシュ。湖から温泉が湧いていて、気温差で霧が立ちます。夏でも明け方は涼しいので長袖必須。',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 28.0, memo: '由布院から別府まで県道11号やまなみハイウェイで景観ドライブ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-092',
            details:
              '別府まで足を伸ばして地獄めぐりの〆。海地獄のコバルトブルーは九州山奥旅のラストにふさわしい青で、3日間の山と温泉のあとの「青」が記憶を整えてくれる。',
            imageKeys: ['img-node-s092-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 130, distance: 130.0, memo: '別府から博多まで大分自動車道→九州自動車道で帰路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-091',
            details:
              '帰路の福岡で締めの屋台。中洲の屋台で豚骨ラーメンと焼き鳥、〆のラーメンで博多に戻ってきた感を回収。九州横断旅の最終ピットストップとして外せません。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '中洲屋台街から博多もつ鍋通りまで川端通り経由', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-127',
            details:
              '中洲屋台で軽くつまんだあとは博多もつ鍋通りで「楽天地」のもつ鍋で〆。九州山奥3日間の最後を博多のソウルフードで回収するのが、この弾丸ルートの完成形🚄',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 290,
    targetViews: 5200,
  },

  // ---- r-010 飛騨高山〜白川郷〜金沢（人気 105 likes / 1,380 views） ----
  {
    key: 'r-010',
    authorKey: 'u-001',
    title: '飛騨高山〜白川郷〜金沢 北陸縦断 王道の3泊4日',
    description:
      '北陸の鉄板3点を全部詰め込んだ4日間。結論、これが北陸初心者の最適解です📌 名古屋発の高山行特急で飛騨入り→1日目に古い町並と朝市→2日目バスで白川郷→3日目さらに北上して兼六園→4日目ひがし茶屋街で締め。全部公共交通で行けるので運転苦手な人にも優しい。各町の所要時間が短いので飽きにくく、4日間でも長く感じない動線です。',
    date: '2025-04-26T09:00:00Z',
    createdAt: '2025-05-18T20:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-001', 'tag-010', 'tag-016'], // 歴史 / 絶景 / 夏休み
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-010',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-063',
            details:
              '高山陣屋前から「さんまち」と呼ばれる古い町並みへ徒歩5分。朝市は宮川と陣屋前の2箇所、宮川朝市の方が屋台が多くて活気あり。',
            imageKeys: ['img-node-s063-1', 'img-node-s063-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.3, memo: '宮川朝市から上三之町・下三之町の古い町並みへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-063',
            details:
              '昼は古い町並みの「平瀬酒造」で利き酒、隣の「飛騨高山ラーメン桔梗屋」で中華そば。さんまち通り限定の食べ歩きグルメは、みたらしと飛騨牛にぎり寿司の二強です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: 'さんまち通りから高山陣屋・中橋方面へ夕方の散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-063',
            details:
              '夕方は高山陣屋から中橋までの川沿い散歩。橋のライトアップが始まる時間帯に逆光で撮ると、古い町並み全体がオレンジに染まる絶好のシャッターチャンス。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '中橋から本町通りまで戻り、高山ラーメンの店「やよいそば」へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-063',
            details:
              '夜は本町通りの「やよいそば」で高山ラーメン。あっさり鶏ガラ醤油の細麺は飛騨の夜にちょうど良い1杯で、北陸縦断1日目の〆として夜更かし不要の22時前店じまい📌',
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
            details:
              '高山から濃飛バスで50分。展望台「天守閣展望台」は集落全景が撮れる唯一のポイント。冬じゃなくても合掌造りの茅葺きは絵になります。',
            imageKeys: ['img-node-s062-1', 'img-node-s062-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '展望台から集落中心部の和田家・神田家へ下りて徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-062',
            details:
              '集落の中で見学できる合掌造りは「和田家」と「神田家」の2軒。築200年超の屋根裏まで上がれて、養蚕の道具と暮らしの痕跡が残っているのが見どころ。所要40分ずつ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 80, distance: 70.0, memo: '白川郷から金沢駅まで濃飛バス、夕方着で兼六園には間に合わず', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-065',
            details:
              '金沢着後すぐに夕方のひがし茶屋街。提灯の灯る茶屋街は明日朝とは別物の表情で、初日に宵の風情を確認しておくと2日目に動きやすいです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'ひがし茶屋街から橋場町経由で近江町市場まで、夜の散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-129',
            details:
              '夜は近江町市場で当日獲れの海鮮を立ち食い。場内の大半は19時まで営業ですが、外周の居酒屋「いきいき亭」が21時まで開いていて、夕食難民にならないのが助かるポイント📌',
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
            spotKey: 's-064',
            details:
              '白川郷から金沢へバス1時間20分。兼六園は霞ヶ池の徽軫灯籠を撮るなら午後の斜光が正解。日本三名園の中では最もアクセスがいい庭園です。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 12, distance: 2.4, memo: '兼六園下から武蔵ヶ辻・近江町市場まで北鉄バスで移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '金沢の食といえば近江町市場。「いきいき亭」の海鮮丼か、その場で焼いてくれる「大口水産」のホタテ・エビ焼きが定番。座れない場合は食べ歩きで十分満足。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '近江町市場から武蔵ヶ辻交差点を渡って香林坊・片町方面へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '日没前にもう一度兼六園へ。閉園17時ぎりぎりに入って斜光に染まる霞ヶ池の徽軫灯籠を狙う。午後と夕方では水面の色が違うのも、二度寄りの理由になります。',
            imageKeys: ['img-node-s064-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '兼六園から金沢城公園へ石川門を抜けて夜のライトアップを見学', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-064',
            details:
              '夜は金沢城公園のライトアップで〆。石川門と五十間長屋が金色に照らされる時間帯は、兼六園とセットで楽しむ夜の絶景。冬季・春の桜時期は特別開放あり📌',
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
            spotKey: 's-065',
            details:
              '最終日の朝にひがし茶屋街。観光客の多い日中ではなく朝7〜9時を狙うと町家の意匠が際立ちます。金沢駅から徒歩可能な茶屋街唯一のメリット。',
            imageKeys: ['img-node-s065-1', 'img-node-s065-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'ひがし茶屋街から橋場町経由で近江町市場まで朝散歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '帰る前に近江町市場で2日連続の海鮮朝食。今日は丼ではなく場内立ち食いで甘エビ・カニ・サーモン。お土産用の干物と笹寿司もここで購入して、北陸縦断の食ピース完了。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.9, memo: '近江町市場から金沢駅へ徒歩、北陸新幹線かがやきで帰路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '帰り際にもう一度兼六園を覗く。3日目の午後と4日目朝で表情が違う霞ヶ池を比較するのが、王道4日間の最後のお楽しみ。新幹線の発車まで90分あれば余裕です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.9, memo: '兼六園から金沢駅まで徒歩、駅構内で土産仕上げ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-065',
            details:
              '最後にひがし茶屋街にもう一度立ち寄って「茶屋美人」の和スイーツをテイクアウト。新幹線かがやきで車内おやつとして食べるのが、北陸縦断4日間の正しい〆方📌',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 105,
    targetViews: 1380,
  },

  // ===========================================================================
  // §B. u-002 sakura_trip（関西特化）の手作り 8 本（r-011 〜 r-018）
  //
  // 口調: 柔らかく丁寧。「ふらっと」「のんびり」「お気に入り」「私の定番」
  // 絵文字: ☕🌸✨ を控えめに。
  // ===========================================================================

  // ---- r-011 伏見稲荷 早朝半日（中堅 32 likes / 380 views） ----
  {
    key: 'r-011',
    authorKey: 'u-002',
    title: '京都 早朝の伏見稲荷で千本鳥居を独り占め 半日プラン',
    description:
      '観光客でいっぱいになる前の、静かな京都が私のお気に入りです🌸 伏見稲荷は朝6時前に行くと、千本鳥居がほぼ無人。私はだいたい始発の京阪に乗ってJR稲荷駅に6時前に着くようにしています。奥社まで往復1時間、そのあとふらっと錦市場へ移動して、開きたてのお店でだし巻き玉子を朝食代わりに。半日でこれだけ満たされるのは京都の特権だと思います。',
    date: '2025-02-08T05:30:00Z',
    createdAt: '2025-02-20T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-022'], // 寺社仏閣 / 写真映え
    budget: { amount: 4500, currency: JPY },
    thumbnailKey: 'img-thumb-011',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-026',
            details:
              '5:50頃に到着すると、鳥居の朱色がまだ朝の青い光を含んでいて、いつもと違う表情。奥社奉拝所までで折り返すと所要1時間ほど。途中の四ツ辻からの京都市内ビューが好きです。',
            imageKeys: ['img-node-s026-1', 'img-node-s026-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 5.5, memo: 'JR奈良線で伏見稲荷駅から京都駅、地下鉄に乗り換えて四条駅', order: 1 },
              { mode: TransitMode.WALK, duration: 8, distance: 0.6, memo: '四条駅から錦市場の東の入口まで', order: 2 },
            ],
          },
          {
            order: 2,
            spotKey: 's-125',
            details:
              '9時前後の錦市場は、開けたての店舗を1軒ずつ覗ける幸せな時間帯です。「三木鶏卵」のだし巻き玉子と「井上佃煮店」のちりめん山椒で朝食、コーヒーは「アラビカ」で✨',
            imageKeys: ['img-node-s125-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '錦市場から四条通を東へ、花見小路の入口へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '半日の最後に、まだ観光客の少ない祇園花見小路を一周。10時前なら石畳が掃き清められたままで、朝日が舞妓さんの暖簾を照らす時間帯。半日プランの〆として最高の一枚が撮れます🌸',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 380,
  },

  // ---- r-012 京都カフェ巡り（中堅 28 likes / 320 views） ----
  {
    key: 'r-012',
    authorKey: 'u-002',
    title: 'カフェ巡り好きが厳選 京都 河原町〜二条城エリアの隠れ家10軒',
    description:
      'カフェのために京都に住んでいると言っても過言じゃないくらい、私は京都のカフェ文化が好きです☕ 今回は河原町から錦市場、祇園エリアにかけてのお気に入りを10軒、1日で巡るプランにまとめました。朝のモーニング、昼の町家カフェ、夕方の抹茶スイーツと時間帯を変えると飽きません。女子旅の友達と来るとちょうどよい量です。',
    date: '2025-03-10T09:00:00Z',
    createdAt: '2025-03-25T18:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-004', 'tag-003', 'tag-015'], // カフェ / グルメ / 女子旅
    budget: { amount: 7500, currency: JPY },
    thumbnailKey: 'img-thumb-012',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-125',
            details:
              '錦市場周辺は実は町家カフェの宝庫。「% Arabica」「ELEPHANT FACTORY COFFEE」「市川屋珈琲」を午前のうちに3軒。コーヒーは1杯ずつ控えめに頼むのがコツです☕',
            imageKeys: ['img-node-s125-1', 'img-node-s125-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '錦市場から四条通を東へ、花見小路へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-035',
            details:
              '昼下がりの祇園エリアでは、町家カフェ「無碍山房」の抹茶パフェか「ぎおん徳屋」の本わらびもち、どちらかでひと休み。観光客の波が引いた15時前後の祇園が一番落ち着きます☕',
            imageKeys: ['img-node-s035-1', 'img-node-s035-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 25, distance: 6.0, memo: '祇園四条から市バス12系統で金閣寺道までゆったり移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-033',
            details:
              '夕方は金閣寺周辺のカフェ「市川屋珈琲・本店」と「うめぞの茶房」へ。金閣の参拝を5時前にぎりぎり済ませてから抹茶スイーツで〆るのが、女子旅にちょうどいい甘いラスト✨',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 320,
  },

  // ---- r-013 奈良公園と鹿（中堅 24 likes / 280 views） ----
  {
    key: 'r-013',
    authorKey: 'u-002',
    title: '奈良公園で鹿と過ごす1日 ならまちカフェも忘れずに',
    description:
      '奈良はふらっと行きたくなる町です。鹿と東大寺を午前のうちに見てしまって、午後は静かなならまちで甘味とカフェ。京都から近鉄で40分、日帰りで完結するのが私のお気に入りポイント🌸 鹿せんべいは食べさせる側が真剣に走らないとあげられないので、午前の元気な時間帯に持ち越します。',
    date: '2024-11-22T09:00:00Z',
    createdAt: '2024-12-15T14:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-002', 'tag-013'], // 寺社仏閣 / 自然 / 家族旅行
    budget: { amount: 6000, currency: JPY },
    thumbnailKey: 'img-thumb-013',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-028',
            details:
              '奈良公園は近鉄奈良駅から徒歩5分で鹿のお出迎え。鹿せんべいは200円、お辞儀をする鹿が一番礼儀正しいので狙ってあげると可愛いです🦌',
            imageKeys: ['img-node-s028-1', 'img-node-s028-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '奈良公園を抜けて東大寺南大門へ、鹿に挨拶しながら', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-029',
            details:
              '大仏殿の柱の穴くぐりは、子どもが大喜びする鉄板スポット。混雑時は並びますが、回転が早いので15分も待たないことが多いです。',
            imageKeys: ['img-node-s029-1', 'img-node-s029-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '東大寺から春日大社の参道へ、灯籠の並ぶ道を歩く', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-038',
            details:
              '春日大社の朱色の本殿と、参道の苔むした石灯籠。ならまちに戻るときに通る道がほどよく静かで好きです。',
            imageKeys: ['img-node-s038-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 24,
    targetViews: 280,
  },

  // ---- r-014 道頓堀フルコース（中堅 35 likes / 420 views） ----
  {
    key: 'r-014',
    authorKey: 'u-002',
    title: '大阪 朝食〜夜まで食べ続ける道頓堀・黒門市場フルコース',
    description:
      '京都に住んでいるけど、大阪の食欲には毎回勝てません。今日は朝の黒門市場から夜の道頓堀ネオンまで、ひたすら食べ続ける1日です🍤 黒門で串カツとフレッシュジュースの朝食、道頓堀でたこ焼きとお好み焼きの昼食、通天閣下のジャンジャン横丁で串カツ晩酌、最後にもう一度道頓堀のかに道楽看板の前で。女子旅にもおすすめの食い倒れ動線。',
    date: '2024-09-08T09:30:00Z',
    createdAt: '2024-09-30T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-016'], // グルメ / 夏休み
    budget: { amount: 9000, currency: JPY },
    thumbnailKey: 'img-thumb-014',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-030',
            details:
              'まずは道頓堀のグリコ看板で記念撮影✨ お昼に「たこ家道頓堀くくる」の元祖たこ焼きを並んで購入。10時前なら15分待ちで済みます。',
            imageKeys: ['img-node-s030-1', 'img-node-s030-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '道頓堀から黒門市場まで、千日前通りを東へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-120',
            details:
              '黒門市場は午前中が一番活気があります。「黒門三平」の海鮮、「西川」のフルーツジュース、「高橋」の豆腐ドーナツがお気に入り。食べ歩き中心で、座って食べる店は少なめ。',
            imageKeys: ['img-node-s120-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 14, distance: 0.9, memo: '黒門市場から通天閣・新世界へ、堺筋を南下', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-037',
            details:
              '通天閣下のジャンジャン横丁で串カツの〆。「だるま新世界総本店」の二度漬け禁止ソースが本場の味。夜になると赤提灯が連なって最高に映えます🌃',
            imageKeys: ['img-node-s037-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 420,
  },

  // ---- r-015 高野山1泊（人気 70 likes / 920 views） ----
  {
    key: 'r-015',
    authorKey: 'u-002',
    title: '高野山1泊 宿坊で精進料理と朝のお勤め体験',
    description:
      'お寺に泊まる、というのを一度はやってみたかったんです✨ 高野山の宿坊「恵光院」で1泊、精進料理の夕食と朝6時のお勤めに参加してきました。観光客でにぎやかな京都とは別の世界で、奥之院の参道は夕方も朝も人がほとんどおらず、静寂が支配する時間。ソロ旅にこそ向いていて、ふらっと一人で来る方もたくさんいました。',
    date: '2024-10-19T13:00:00Z',
    createdAt: '2024-11-02T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-005', 'tag-024'], // 寺社仏閣 / 秘境
    budget: { amount: 28000, currency: JPY },
    thumbnailKey: 'img-thumb-015',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-043',
            details:
              'ケーブルカーで高野山駅に着いたら、まずは壇上伽藍へ。根本大塔の朱色と高野杉の緑の対比が、参拝の入り口にふさわしい一枚です。所要40分でゆっくり一周✨',
            imageKeys: ['img-node-s043-1', 'img-node-s043-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 12, distance: 2.0, memo: '壇上伽藍前から奥の院前まで南海りんかんバスで移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-043',
            details:
              '夕方の奥之院参道は灯篭にだんだん灯がともる時間が一番幻想的。一の橋から弘法大師御廟まで片道2km、ゆっくり歩いて30分ほど。墓所が並びますが、不思議と怖さはありません。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '奥之院から宿坊「恵光院」までの夜道、足元注意でゆっくりと', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-043',
            details:
              '夜は宿坊「恵光院」で精進料理の夕食。胡麻豆腐と高野豆腐の炊き合わせは想像以上に深い味わい。食後は宿坊の阿字観瞑想に参加できる日もあって、ソロ向けの〆として最高でした✨',
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
            spotKey: 's-043',
            details:
              '朝6時のお勤めを宿坊で済ませてから、もう一度奥之院へ。早朝の参道は前日の夕方とまた違う表情で、霧がかかると本当に別世界。お寺の朝のリズムが心地よくて、また泊まりに来たくなりました。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 14, distance: 1.0, memo: '奥之院から金剛峯寺まで参道を抜けて徒歩で移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-043',
            details:
              '朝食後は金剛峯寺で蟠龍庭の枯山水を眺めながら、お抹茶のお接待をいただく。座ってお庭を見るだけの時間ですが、これが意外と1時間消えるんです。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '金剛峯寺から大門・霊宝館方面へ最後の散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-043',
            details:
              '帰る前に大門と霊宝館で1時間。霊宝館は国宝・重文の仏像を間近で見られる穴場で、拝観料1300円は十分元が取れます。お土産は「みろく石本舗かさ國」のみろく石でお寺の余韻を持ち帰り✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 70,
    targetViews: 920,
  },

  // ---- r-016 城崎温泉浴衣で外湯（バズ 250 likes / 4,800 views） ----
  {
    key: 'r-016',
    authorKey: 'u-002',
    title: '城崎温泉で外湯めぐり 浴衣で歩く2日間',
    description:
      '城崎温泉は浴衣で歩く街全体がテーマパークみたいで、女子旅にぴったり🌸 1日目は午前に姫路城を観光してから昼すぎに城崎入り、宿で浴衣を借りて外湯1軒目。夕食前に1軒、夜に1軒、合計3軒回るのが私のいつものペース。2日目の朝も外湯1軒、朝食後に駅前散策で7つの外湯のうち少なくとも4軒は制覇できます✨ 浴衣レンタルは宿が無料でやってくれるので手ぶらでOK。',
    date: '2024-08-22T11:00:00Z',
    createdAt: '2024-09-18T20:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-015', 'tag-016'], // 温泉 / 女子旅 / 夏休み
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-016',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-039',
            details:
              '姫路城は朝9時開門。天守閣の急な階段を登るのは早めの時間が体力的にも快適です。8月は天守内の湿度が高いので、汗拭きタオルは必需品。',
            imageKeys: ['img-node-s039-1', 'img-node-s039-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 110, distance: 95.0, memo: '姫路駅から特急はまかぜで城崎温泉駅まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-040',
            details:
              '宿に荷物を置いたら浴衣に着替えてさっそく外湯1軒目「一の湯」へ。城崎で最も有名な岩風呂で、洞窟のような風情がここにしかない非日常感を運んでくれます🌸',
            imageKeys: ['img-node-s040-1', 'img-node-s040-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '一の湯から御所の湯まで柳並木を歩いて夕方の散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-040',
            details:
              '夜は外湯2軒目「御所の湯」と3軒目「まんだら湯」をハシゴ。柳並木のガス灯がついた夜の街並みは浴衣姿によく合い、写真欲もテンションも頂点に達します✨',
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
              '朝風呂は鴻の湯が空いてておすすめ。源泉量豊富で、湯上がりの肌が一日中つるつる。朝7時開湯と同時の入浴がベスト。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '鴻の湯から駅前商店街まで温泉街中央通りを散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-040',
            details:
              'チェックアウト前に駅前まで散策しながら、お土産は「但馬牛コロッケ」と「城崎ジェラートカフェChaya」で。湯の里通りには浴衣のままお参りできる温泉寺と四所神社もあり、所要40分のミニ散歩がちょうど良い距離✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.3, memo: '駅前商店街から城崎温泉駅まで土産袋を持って徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-040',
            details:
              '帰り際に駅前すぐの「さとの湯」で締めの一風呂。最後の外湯で2日間で4軒制覇、7つあるうち半数以上を浴衣で歩き切れるのが城崎の魅力です🌸',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 250,
    targetViews: 4800,
  },

  // ---- r-017 嵐山保津川下り（中堅 26 likes / 290 views） ----
  {
    key: 'r-017',
    authorKey: 'u-002',
    title: '京都 嵐山から保津川下り 涼を求める夏の半日',
    description:
      '夏の京都はとにかく暑い。だから水のあるところへ逃げます🍃 嵐山の渡月橋を朝のうちに渡って、JRで保津峡まで行ってトロッコで戻ってくる、いわゆる嵐山ループ。お昼すぎから金閣寺へ移動して、午後の光に映える金色の楼閣を見て1日終わり。半日プランですが涼と王道スポットの両方が押さえられて、夏休みの京都には毎年使っているコースです。',
    date: '2024-07-29T08:00:00Z',
    createdAt: '2024-08-12T18:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-016'], // 自然 / 夏休み
    budget: { amount: 11000, currency: JPY },
    thumbnailKey: 'img-thumb-017',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-027',
            details:
              '渡月橋は朝8時前なら観光客がほぼおらず、嵐山の山並みと桂川が綺麗に撮れます。竹林の道は8時前のうちに抜けるのが最良の選択。',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 12.0, memo: 'JR嵯峨嵐山駅からトロッコ嵯峨駅・トロッコ亀岡駅へ、保津川下り乗船場へ徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-027',
            details:
              '保津川下りは亀岡から嵐山まで2時間、4100円。トロッコ列車で保津峡駅まで戻り、そこから渡月橋に再着するループが嵐山名物。船からも竹林の道を上から眺められます🍃',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 14.0, memo: 'JR嵯峨嵐山から京都駅経由で円町、その後バスで金閣寺道', order: 1 },
              { mode: TransitMode.BUS, duration: 12, distance: 3.5, memo: '円町から金閣寺道バス停まで', order: 2 },
            ],
          },
          {
            order: 3,
            spotKey: 's-033',
            details:
              '午後の金閣寺は逆光気味になりますが、金箔の輝きが一番出る時間帯。鏡湖池に映る逆さ金閣も見逃せません。所要45分でしっかり満足できます✨',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 26,
    targetViews: 290,
  },

  // ---- r-018 神戸 三宮〜元町〜中華街（中堅 30 likes / 350 views）
  // ---- 例外: 事前計画として createdAt < date ----
  {
    key: 'r-018',
    authorKey: 'u-002',
    title: '神戸 三宮〜元町〜中華街 港町をのんびり歩く',
    description:
      '京都から神戸はJRで30分、ふらっと友達と日帰りできる距離感です。今回は元町から南京町でランチ、メリケンパークで港の風景、夕方姫路城まで足を伸ばす計画を立てました🌸 神戸は徒歩で全部回れる町のサイズ感が魅力で、女子旅でゆったりカフェ巡りしながらも観光地もちゃんと押さえられます。中華街はラム肉の小籠包と杏仁豆腐が私の定番。',
    date: '2025-01-25T10:00:00Z',
    createdAt: '2025-01-10T14:00:00Z', // 事前計画（10% exception）
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-007'], // グルメ / ショッピング
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-018',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-032',
            details:
              'メリケンパークは神戸ポートタワーとオリエンタルホテルが両方写る写真スポット。ハーバーランドのモザイクから歩くと、海越しの神戸市街がきれいに見渡せます。',
            imageKeys: ['img-node-s032-1', 'img-node-s032-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 14, distance: 1.0, memo: 'メリケンパークから南京町まで、海岸通りを北上', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-126',
            details:
              '南京町は小腹を空かせて来るべき場所。「老祥記」の豚まんは並ぶ価値ありで、20分待ちでも私はいつも並びます。杏仁豆腐は「YUNYUN」がおすすめ✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 45, distance: 60.0, memo: '元町駅からJR新快速で姫路まで一直線', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-039',
            details:
              '夕方の姫路城は西日に染まって白さが際立ちます。閉門前ぎりぎり16時頃に天守閣に上がるのが時間効率も眺めも一番良かった選択。',
            imageKeys: ['img-node-s039-1'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 350,
  },

  // ===========================================================================
  // §C. u-003 kenji_outdoor（ファミリーアウトドア）の手作り 5 本（r-019 〜 r-023）
  //
  // 口調: 実用情報重視。「家族で」「子どもたちが」「キャンピングカー」
  // 駐車場・トイレ・道の駅情報を多用。絵文字: 🏕️🚐 をたまに。
  // ===========================================================================

  // ---- r-019 道東縦断 4泊5日（人気 78 likes / 1,050 views） ----
  {
    key: 'r-019',
    authorKey: 'u-003',
    title: 'キャンピングカーで道東縦断 知床〜摩周湖〜釧路湿原 4泊5日',
    description:
      '家族4人でキャンピングカーを借りて、道東を縦断してきました🚐 子どもたちが一番喜んだのは知床のヒグマ目撃と旭山動物園のペンギン散歩。北海道は道がまっすぐで運転が楽な反面、給油ポイントが少ないので200km走ったら必ず満タンに戻すのがファミリーには安全です。RVパークは知床ウトロと洞爺湖畔が利用可で、トイレと電源が完備。子連れキャンプ初心者でもこのルートなら安心です。',
    date: '2025-07-25T07:00:00Z',
    createdAt: '2025-08-20T18:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-013'], // 夏休み / 自然 / 家族旅行
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-019',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-048',
            details:
              '知床五湖は地上遊歩道（無料）と高架木道（無料）の2種類。子連れなら高架木道一択で、ヒグマの心配なくベビーカーでも進めます。駐車場は400台、夏休みは午前9時で半分埋まる感覚。',
            imageKeys: ['img-node-s048-1', 'img-node-s048-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 6.0, memo: '知床五湖駐車場からウトロのフレペの滝遊歩道入口まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-048',
            details:
              '午後はフレペの滝遊歩道（往復1km・40分）でオホーツク海を望む断崖を散歩。子どもは双眼鏡持参でアザラシ探しに夢中になります🚐 トイレは入口に1箇所のみ、出発前必須。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 3.5, memo: 'フレペの滝からウトロ市街のRVパーク知床ウトロまで車で移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-048',
            details:
              '夜は知床自然センターのナイトプログラム（大人2400円・子ども1200円）。エゾシカ・キタキツネ観察と星空観察がセット、所要1時間半で20時集合。家族4人でも回りやすい価格帯です🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 5, distance: 2.0, memo: 'ナイトプログラム終了後、ウトロ漁港のRVパークへ車中泊', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-048',
            details:
              '夜は道の駅うとろシリエトクのRVパークで車中泊。電源・トイレ完備、子どもが「キャンピングカーから星空が見える!」と大興奮。深夜のオホーツク海の波音が眠りを誘う子連れキャンピングカー旅の醍醐味🚐',
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
              '洞爺湖は子どもが湖畔で水切り遊びに大はしゃぎ🏕️ 湖畔にRVパークがあり、ここで1泊。トイレ・電源・水場が揃っていて、家族連れでも安心の設備。花火大会が夏休み期間中の毎晩あって、テントから見られるのが最高でした。',
            imageKeys: ['img-node-s054-1', 'img-node-s054-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '湖畔から洞爺湖遊覧船乗り場まで車移動、中島往復のクルーズ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '午後は遊覧船で洞爺湖中島まで往復1時間半。船内でアイスを買って、子どもが喜ぶデッキ体験。中島には自然博物館があり所要45分でちょうど良い見学量🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 40.0, memo: '洞爺湖から登別温泉まで道央道で40分、夕方の地獄谷散策に間に合う時間', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-055',
            details:
              '夕方の登別地獄谷は遊歩道が舗装されていてベビーカーOK。噴煙と硫黄のにおいで子どもが「火山!」と興奮していました。駐車場500円・所要40分・トイレ完備、家族向けの王道スポット🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '地獄谷から登別温泉街の宿まで徒歩、夕食前のひと風呂', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-055',
            details:
              '夜は登別温泉街で家族向けのバイキング夕食「第一滝本館」へ。子ども連れでも気兼ねなく食べられる和洋中バイキングは2泊目の疲れを癒す家族向け選択肢🚐',
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
              '富良野ファーム富田。ラベンダーの香りに子どもが感動していました。駐車場は無料で200台、9時前到着で停められます。ラベンダーソフトは大人にも子どもにも好評。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 45, distance: 30.0, memo: 'ファーム富田から美瑛・青い池まで国道237号を北上', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '青い池は駐車場500円、所要30分。子どもは「絵の具で描いたみたいな池!」と大はしゃぎ。隣接する白ひげの滝もセットで回ると2倍楽しめます🚐 トイレは駐車場のみで、滝までは歩道のみ。',
            imageKeys: ['img-node-s052-1', 'img-node-s052-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 40.0, memo: '美瑛から旭川市街・旭山動物園駐車場まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-053',
            details:
              '夕方の旭山動物園は閉園17:30前の30分が穴場時間。明日の本番に向けて、ペンギン館とあざらし館の位置を下見しておくと、翌朝の動線がスムーズ🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '旭山動物園から旭川市内RVパークまで車移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-053',
            details:
              '夜は旭川市内のRVパークで車中泊。子どもには「梅光軒」のラーメンをテイクアウトして車内で食べると旅情満点。明日の早朝開門に備えて22時就寝のリズムを家族で守るのが鉄則🚐',
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
            spotKey: 's-053',
            details:
              '旭山動物園は開門前に並ぶのが鉄則。家族4人で1500円×大人2+子ども無料で、ペンギン館・あざらし館を午前中で回り切りました。ベビーカー貸出（無料）あり、坂道が多いので体力配分注意。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 180, distance: 180.0, memo: '旭川から小樽まで道央道で3時間、SAでの休憩2回', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-049',
            details:
              '小樽運河はキャンピングカー旅の帰路に立ち寄りやすい中継地点。子どもはガラス工房の体験（吹きガラス1人2500円）で大喜び。運河沿いの倉庫群でレストラン夕食、家族向けの動線です🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 6, distance: 2.0, memo: '小樽運河から小樽市総合博物館RVパークへ短距離移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-049',
            details:
              '夜の小樽運河はガス灯が灯る19:00以降が映え時間。RVパークから散歩で行ける近さで、子どもはアイスを片手に夜散歩を楽しめます。北海道5日目にして家族の表情が一番落ち着くシーンでした🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '小樽運河からルタオ本店まで堺町通り経由で散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-049',
            details:
              '夜のお土産は堺町通りの「ルタオ本店」のドゥーブルフロマージュ。RVパークの冷蔵庫で保管できるサイズで、明日札幌に着いてから家族で食べる予約土産にちょうど良い🚐',
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
            spotKey: 's-121',
            details:
              '最終日朝は二条市場で家族朝食。「のんのん」のミニ海鮮丼が子どもサイズで1300円、これが旅の〆として記憶に強く残ります。場内は通路狭く、ベビーカーは入口でたたむ必要あり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '二条市場から大通公園のとうきびワゴンまで徒歩圏内', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-045',
            details:
              '最終日は札幌に戻って大通公園でゆるく観光。子どもたちはとうきびワゴンのバター醤油焼きを取り合いに🌽 帰りの新千歳空港行きはJRが時間通りで頼りになります。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 1.5, memo: '大通公園からテレビ塔横の有料駐車場へ短距離移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-045',
            details:
              '空港便発前にテレビ塔展望台（大人1000円・子ども400円）から札幌の街を一望。標高90mから南北に伸びる大通公園が一直線に見えて、5日間のゴール地点として家族の記念写真に最適🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: 'テレビ塔から札幌市時計台まで徒歩、子連れの最後の観光小休止', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-045',
            details:
              '札幌市時計台で家族の集合写真。校舎の前で5日間の家族旅を回収する1枚を撮ってから、JRで新千歳空港へ。子どもの「また来たい」の声が、キャンピングカー旅成功の証拠🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 78,
    targetViews: 1050,
  },

  // ---- r-020 上高地2日（中堅 36 likes / 440 views） ----
  {
    key: 'r-020',
    authorKey: 'u-003',
    title: '上高地 河童橋から明神池 家族で歩く穂高の麓',
    description:
      '夏休み恒例の家族登山。上高地は標高1500mで真夏でも涼しく、子どもの体力でも歩ける距離感が魅力です🏕️ 河童橋から明神池まで往復6km、平坦な道なのでベビーカーは無理ですが幼児でも歩けます。マイカー規制なので沢渡か平湯から上高地バスを使うこと。2日目は諏訪湖で間欠泉を見て帰路、というのが我が家の定番ルートです。',
    date: '2024-08-05T09:00:00Z',
    createdAt: '2024-09-10T20:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-020', 'tag-013'], // 自然 / ハイキング / 家族旅行
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-020',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details:
              '河童橋から明神池まで往復約3時間。平坦な遊歩道で、小学校低学年でも歩けます。途中の岳沢湿原で休憩、ハルニレの大木の下でおにぎり昼食が我が家の定番🍙 トイレは河童橋・明神館にあり。',
            imageKeys: ['img-node-s061-1', 'img-node-s061-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 90, distance: 3.5, memo: '河童橋から明神池まで右岸コース、子どもの足でゆっくり', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-061',
            details:
              '明神池は1時間滞在が目安。水面に反射する穂高連峰のリフレクションが上高地一の絶景ポイントで、子どもも「鏡みたい!」と大はしゃぎ🏕️ 明神館の食堂で岩魚塩焼き定食が休憩昼食に最適。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 2.5, memo: '明神池から大正池まで左岸コースで戻る、池畔を周遊', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-061',
            details:
              '夕方は大正池まで足を伸ばす。立ち枯れの木と水面に映る焼岳のシルエットは、上高地を象徴する1枚。バス停の大正池ホテル前から沢渡へ16:30最終便で下山できます🚐',
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
            details:
              '諏訪湖の間欠泉は1時間半おきの噴出時間がすべて。タイミングが合うとお湯が10mまで吹き上がり、子どもが大喜びします。湖畔に駐車場（無料）と公衆トイレが豊富。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '諏訪湖から清里高原まで国道141号で南下、ファミリードライブにちょうど良い距離', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-024',
            details:
              '清里高原は標高1200m、諏訪湖から日帰り圏内のおまけスポット。「萌木の村」のメリーゴーランドは子どもに大人気で1回400円。八ヶ岳ビューも晴れていれば抜群です🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '清里高原から諏訪湖SA経由で帰路、ファミリーマートで休憩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-023',
            details:
              '帰路の諏訪湖SAから湖畔展望台へ。夕方の諏訪湖と八ヶ岳のシルエットを最後に見て、4泊3日の信州ファミリー旅は終了。子どもは車内でぐっすりが我が家の定石🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 36,
    targetViews: 440,
  },

  // ---- r-021 阿蘇草千里で乗馬（中堅 38 likes / 460 views） ----
  {
    key: 'r-021',
    authorKey: 'u-003',
    title: '阿蘇 草千里で乗馬体験と火口見学 1泊2日',
    description:
      '阿蘇は子どもに「自然の大きさ」を体感させるには最高の場所です🐎 草千里ヶ浜の乗馬体験（5分1500円）で子どもたちが大はしゃぎしていました。中岳火口の見学はガス濃度次第で入れるかが当日決まるので、必ず公式HPで確認してから行くこと。2日目は黒川温泉で湯治、家族風呂が予約できる「奥の湯」が子連れには優しいです。駐車場は両スポットとも100台規模あり、夏休みでも午前なら問題なし。',
    date: '2025-08-08T10:00:00Z',
    createdAt: '2025-09-02T19:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-002', 'tag-013', 'tag-016'], // 自然 / 家族旅行 / 夏休み
    budget: { amount: 55000, currency: JPY },
    thumbnailKey: 'img-thumb-021',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-094',
            details:
              '草千里ヶ浜は標高1100m、馬場と展望のセット。乗馬は5分1500円から、子ども2人分でも合計4000円程度で済みます。駐車場500円・100台、夏休みでも午前なら問題なし🚐',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 15, distance: 6.0, memo: '草千里駐車場から中岳火口シャトルバスで往復', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-094',
            details:
              '火口見学は草千里駐車場からシャトルバス（500円往復）。ガス濃度次第で入れるかが当日決まるので、必ず公式HPで確認してから行くこと。火口縁から覗き込む噴煙は子どもにも強烈な体験🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 30.0, memo: '阿蘇から黒川温泉までミルクロード経由、夕方着で湯巡り前の入浴に間に合う', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-107',
            details:
              '夕方着で黒川温泉にチェックイン。「山みず木」の貸切露天は予約制で50分2200円、家族4人で入れるサイズ。明日の湯めぐりに向けて子どもには軽めに浸かる程度で🚐',
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
              '黒川温泉は子連れでも入りやすい家族風呂のある宿が多く、「奥の湯」「山みず木」が子連れに優しいです。湯めぐり手形で外湯3軒OK、子どもは2軒目で飽きるので3軒目は親だけ✨',
            imageKeys: ['img-node-s107-1', 'img-node-s107-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '湯めぐり1軒目から2軒目まで温泉街中央通りを徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-107',
            details:
              '湯めぐり2軒目「ふもと旅館」の露天は河原の上にあり、子どもが「川と一緒に風呂!」と興奮。所要60分・湯量豊富・子ども連れOK。湯上がりにはアイスクリーム購入で機嫌維持🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '黒川温泉から由布院まで帰路に立ち寄り、やまなみハイウェイで景観ドライブ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-093',
            details:
              '帰路は由布院に立ち寄り、金鱗湖で湖畔散策（駐車場500円・周辺コインPで200円）。子どもは湖畔の魚と鯉を見て大はしゃぎ。湯の坪街道で「金賞コロッケ」を食べて阿蘇〜由布院の家族旅完結🚐',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 460,
  },

  // ---- r-022 ニセコ夏アクティビティ（中堅 42 likes / 520 views） ----
  {
    key: 'r-022',
    authorKey: 'u-003',
    title: '北海道ニセコ 夏のアクティビティ天国 2泊3日',
    description:
      'ニセコは冬のスキー場で有名ですが、夏は実はファミリーのアクティビティ天国です🏕️ ラフティング、乗馬、トレッキング、何でも当日予約できます。子どもたちはラフティングで大はしゃぎ。2日目は洞爺湖でカヌー体験、3日目に登別温泉の地獄谷を見て帰路。家族3世代で行きましたが、祖父母も温泉と動物園で楽しめるバランスが良いコースでした。RVパークは「ニセコトレイル」が設備揃っていて快適。',
    date: '2024-08-13T08:30:00Z',
    createdAt: '2024-09-05T20:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-016', 'tag-002', 'tag-013'], // 夏休み / 自然 / 家族旅行
    budget: { amount: 92000, currency: JPY },
    thumbnailKey: 'img-thumb-022',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-056',
            details:
              'ニセコアンヌプリのラフティングツアー、子ども6歳から参加可能で1人6500円。所要2時間、ヘルメット・ライフジャケット込み。びしょ濡れになるので着替え必須🚐',
            imageKeys: ['img-node-s056-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: 'ラフティング集合場所からニセコ羊蹄山ビューの宿まで車移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-056',
            details:
              '午後はニセコの宿でゆっくり、羊蹄山ビューのテラスで子どもとお茶。アンヌプリ山麓の「ニセコビュープラザ」では地元野菜と乳製品が買えて、家族3世代の食卓に並べると喜ばれます🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 45.0, memo: 'ニセコから洞爺湖畔のRVパークまで国道230号で南下', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-054',
            details:
              '夕方は洞爺湖畔のRVパークに移動して1泊目の準備。湖畔の夕焼けは羊蹄山と洞爺湖の両方が同時に見える絶景で、祖父母世代も「これは来た甲斐があった」と納得の景観🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: 'RVパークから湖畔花火大会観覧スポットまで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-054',
            details:
              '夜は湖上花火大会（4月末〜10月毎晩20:45開始、所要20分）を湖畔のテントから観覧。3世代が並んで花火を見る時間は家族旅のハイライトで、子どもは初めての花火に大はしゃぎ🏕️',
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
              '洞爺湖カヌー体験は2人乗り1艇4000円。湖畔の中島まで漕いで往復1時間半、子連れには無理のない距離感。湖畔のキャンピングカーパークで1泊、夜は花火大会が湖上でやっていて家族で大盛り上がり。',
            imageKeys: ['img-node-s054-1', 'img-node-s054-2'],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 50, distance: 8.0, memo: '湖畔から遊覧船で中島往復、デッキでアイス休憩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-054',
            details:
              '午後は遊覧船で洞爺湖中島へ。船内のデッキで子どもがアイスを持ってカモメに餌やり🦅 中島では自然博物館（無料）で30分、洞爺湖カルデラの成り立ちを学べる家族向け展示🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 40.0, memo: '洞爺湖から登別温泉まで道央道で40分、夕方着で地獄谷散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-055',
            details:
              '夕方は登別の地獄谷遊歩道で硫黄の香りを浴びる。日没前の薄明時に噴煙がオレンジに照らされる光景は子どもの記憶に強く残ります。鉄柵の手前から覗き込む安全設計🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '地獄谷から登別温泉街中央通りの宿まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-055',
            details:
              '夜は宿の家族風呂で3世代入浴体験。「第一滝本館」の本館貸切風呂は予約制で50分2200円、祖父母・両親・子どもで3世代揃って入る湯は、北海道家族旅の象徴的なシーン🏕️',
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
              '登別温泉の地獄谷は遊歩道が整備されていて子どもでも安心。歩道の端から噴煙の出る穴が直接見えるのは迫力ありますが、転落防止柵あり。駐車場は500円、トイレも完備。',
            imageKeys: ['img-node-s055-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.2, memo: '地獄谷から大湯沼まで遊歩道で往復、家族の足でちょうど良い', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-055',
            details:
              '地獄谷の奥にある大湯沼は摂氏130度の熱湯沼で、湯気が立ち上る様子は天然のサウナ。遊歩道は片道15分、ベビーカー不可なので抱っこ紐推奨。湯上がりに「天然足湯」で締め🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 80, distance: 110.0, memo: '登別温泉から札幌大通公園まで道央道で帰路、SAで休憩2回', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-045',
            details:
              '帰路は札幌の大通公園で家族3世代の集合写真。とうきびワゴンのバター醤油焼きが3日間の〆🌽 新千歳空港行きJRで18:00台の便を狙うと、子どもの夕食にちょうど良い時間です🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園から二条市場まで徒歩、空港便前の最後のお土産チェック', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-121',
            details:
              '空港便前に二条市場で家族へのお土産仕上げ。「カネサ高橋商店」の干物セットを発送手配、自宅着が翌日というスピード感が3世代旅の最後の締め🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 42,
    targetViews: 520,
  },

  // ---- r-023 立山黒部アルペンルート（人気 68 likes / 880 views） ----
  {
    key: 'r-023',
    authorKey: 'u-003',
    title: '富山〜立山黒部アルペンルート 標高2450mの夏',
    description:
      '立山黒部アルペンルートは、子どもたちに「日本一標高の高い駅」を見せたくて毎年行く我が家の定番🏕️ 室堂は標高2450m、夏でも気温15度前後で羽織物必須です。子連れなら扇沢から立山駅へ抜ける片道ルートが効率的で、6つの乗り物（バス・ケーブルカー・トロリーバス）に乗り換えながら山岳地帯を縦断する体験は、家族の思い出として強烈に残ります。最終日は金沢の兼六園で締めるのが定石。',
    date: '2025-09-21T07:00:00Z',
    createdAt: '2025-10-15T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-010', 'tag-020', 'tag-016'], // 絶景 / ハイキング / 夏休み
    budget: { amount: 68000, currency: JPY },
    thumbnailKey: 'img-thumb-023',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-070',
            details:
              '室堂平は標高2450m、立山連峰の絶景ポイント。みくりが池一周は所要1時間で子連れOK。気温は地上比15度低いので、夏でも長袖必須。トイレ・売店・宿泊施設すべて完備。',
            imageKeys: ['img-node-s070-1', 'img-node-s070-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 2.0, memo: '室堂ターミナルからみくりが池一周コース、子どもでも歩ける平坦さ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-070',
            details:
              '午後はみくりが池の奥にある地獄谷展望台まで足を伸ばす。立ち入り禁止の地獄谷を遠望できるポイントで、噴煙とエメラルドグリーンの池が他にない景観🏕️ 所要往復40分。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 30, distance: 4.0, memo: '室堂から大観峰まで立山トンネルトロリーバスで移動', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-070',
            details:
              '夕方は大観峰展望台から黒部湖の俯瞰ビュー。標高2316m、立山連峰と後立山連峰の両方を一望できる絶景で、家族の集合写真スポットとしてはここがベスト🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 7, distance: 1.7, memo: '大観峰から立山ロープウェイで黒部平へ、夕方便の最終時間', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-070',
            details:
              '黒部平でロープウェイ降車後、黒部ケーブルカーで黒部湖駅まで。夏の夜は黒部ダム観光放水のライトアップ（19:30まで）に間に合う日もあって、家族旅の絶景締めに🏕️',
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
              'トロッコ電車は宇奈月から欅平まで往復2時間半、片道2660円。窓のないオープン客車だと迫力満点ですが、寒いので防寒準備を。子どもにはトンネルと鉄橋の連続が大ウケ🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.5, memo: '欅平駅から人喰岩・奥鐘橋まで遊歩道を散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-071',
            details:
              '欅平駅から徒歩15分の人喰岩は、岸壁を削った狭い遊歩道のスリル満点ポイント。その先の奥鐘橋から見下ろす黒部川の渓谷美は、子どもが「怖い!」と興奮する家族向けハイライト🏕️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 90, distance: 100.0, memo: '宇奈月温泉駅から金沢駅まで富山経由でJR特急、夕方着', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '夕方着で兼六園周辺へ。石川門前の金沢城公園は19:00以降のライトアップで子どもも夜の城下町を歩ける時間。明日の本格鑑賞前の下見として軽く一周がちょうど良い🚐',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '金沢城公園から香林坊・片町方面の家族向け居酒屋まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-064',
            details:
              '夜は香林坊「いたる」で家族向け加賀料理。治部煮と香箱蟹を子どもにも分けて、家族で金沢の郷土料理デビュー。山岳から食卓へというギャップが2日目の終わりにふさわしい🏕️',
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
            spotKey: 's-064',
            details:
              '兼六園で旅の締め。山岳の絶景の後に和の庭園というギャップがちょうど良い。子どもは石川門前の金沢城公園の方が広場で走り回れて好評でした。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-3'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 12, distance: 2.4, memo: '兼六園下から武蔵ヶ辻・近江町市場まで北鉄バス1日券利用', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '近江町市場で家族昼食。「いきいき亭」の海鮮丼は子ども向けミニサイズ（1300円）あり、大人は特上海鮮丼（3300円）。場内は通路狭く、ベビーカーは入口で畳む必要があります🍣',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 8, distance: 1.6, memo: '武蔵ヶ辻から橋場町経由でひがし茶屋街まで北鉄バス', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-065',
            details:
              '夕方のひがし茶屋街で旅の最後の散策。提灯が灯る前後の薄明時間に石畳を歩くと、子どもも「江戸時代みたい」と興奮。お土産は「金澤しつらえ」の和雑貨、新幹線かがやきで18時台の便で帰路🚄',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.9, memo: 'ひがし茶屋街から金沢駅まで徒歩、駅構内で最後の土産仕上げ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-129',
            details:
              '帰る前にもう一度近江町市場に立ち寄って干物・ノドグロセットを発送手配。家族用の冷凍カニも家に届くので、新幹線の時間まで余裕があれば積極的に活用したい〆方🏕️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 68,
    targetViews: 880,
  },

  // ===========================================================================
  // §D. u-004 mio_couple（カップル）の手作り 2 本（r-024 〜 r-025）
  //
  // 口調: 「彼と」「記念日」「ご褒美」「ふたりで」、写真重視。
  // 絵文字: 📷💕✨ を 1〜2 個。
  // ===========================================================================

  // ---- r-024 別府由布院全室露天（人気 92 likes / 1,240 views） ----
  {
    key: 'r-024',
    authorKey: 'u-004',
    title: '結婚記念日に行った別府・由布院 2泊3日 全室露天付き旅館だけ',
    description:
      '結婚2周年の記念日に、彼と九州の温泉縦断をしてきました💕 こだわったのは「全部屋露天風呂付き」の宿に3泊全部泊まること。別府の海地獄を見学した夜は「悠彩の宿 望海」、由布院の朝は金鱗湖の朝霧を窓から眺める「玉の湯」、最終日は黒川温泉の「山みず木」。3軒で約16万円使いましたが、記念日にはこれくらいの贅沢が許されると信じています📷✨ 食事は全部部屋食で、写真もたくさん撮れました。',
    date: '2024-12-20T11:00:00Z',
    createdAt: '2025-01-10T14:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-008', 'tag-012', 'tag-003'], // 温泉 / カップル / グルメ
    budget: { amount: 165000, currency: JPY },
    thumbnailKey: 'img-thumb-024',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-092',
            details:
              '別府地獄めぐりは海地獄が一番フォトジェニック。コバルトブルーの湯の池に湯気が上がる様子が幻想的で、彼と何枚も撮りました📷 入場は400円、所要30分でサクッと回れます。',
            imageKeys: ['img-node-s092-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.6, memo: '海地獄から血の池地獄まで地獄めぐり共通通り経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-092',
            details:
              '海地獄の次は血の池地獄でガラッと色味が変わるのが地獄めぐりの楽しみ💕 真っ赤な池のほとりで彼との写真を撮ると、コバルトブルーとの対比が記念日アルバムを彩る組み合わせに。共通券（2200円）が割安。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 35.0, memo: '別府地獄エリアから由布院温泉「悠彩の宿 望海」までやまなみハイウェイ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-093',
            details:
              '夕方のうちに由布院に移動して「玉の湯」にチェックイン。窓から金鱗湖の夕景が見える特等席で、ふたりで部屋風呂に浸かりながらシャンパンで乾杯したのが記念日のハイライト📷✨',
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
              '由布院金鱗湖は宿の窓から見える絶好の立地でした。朝6時の朝霧が一番きれいで、彼を起こして一緒に写真撮影。湖畔の散歩道は1周20分で、ふたりで手をつないで歩くのにちょうどいい距離感💕',
            imageKeys: ['img-node-s093-1', 'img-node-s093-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '金鱗湖から湯の坪街道までふたりで歩く朝散歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-093',
            details:
              '朝食後は湯の坪街道を散策。「クラフト館 蜂の巣」のオーガニックジャムと「Bsmart」の手作りチョコは記念日のお土産にぴったり📷 ふたりでシェアできるソフトクリームを買い食いするのも温泉街らしい使い方✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '由布院から黒川温泉「山みず木」までやまなみハイウェイ南下', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-107',
            details:
              '夕方着で黒川温泉「山みず木」へ。離れの露天付き客室は彼との時間を最大限楽しめる宿で、お部屋専用の半露天から夜空が見えるのが至福💕 夕食は完全個室の囲炉裏会席。',
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
            spotKey: 's-107',
            details:
              '最終日の朝風呂は、宿の貸切風呂を予約しておいて60分占有。お風呂上がりに彼と部屋食の朝食を取りながら、3日間の写真を一緒に振り返るのが記念日旅の儀式になりました📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '宿から黒川温泉中央通りまで浴衣で散策、街灯篭エリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-107',
            details:
              '街並み全体が温泉風情。夕方の街灯篭が灯る時間に浴衣で散策するのがロマンチックで、彼が撮ってくれた写真が今年のベストショット✨',
            imageKeys: ['img-node-s107-1', 'img-node-s107-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 30.0, memo: '黒川温泉から阿蘇草千里まで帰路に立ち寄り、ミルクロード経由', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-094',
            details:
              '帰路に阿蘇草千里でドライブ休憩。標高1100mのカルデラ草原に立つと、3日間の温泉漬けの身体が一気にリセット。彼の運転中に助手席で撮った草原写真が、記念日の最後の1枚になりました💕',
            imageKeys: ['img-node-s094-1', 'img-node-s094-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 92,
    targetViews: 1240,
  },

  // ---- r-025 宮古島オーシャンビュー4日（バズ 240 likes / 4,500 views） ----
  {
    key: 'r-025',
    authorKey: 'u-004',
    title: 'ハワイより安い夏の宮古島 オーシャンビューホテル4日間',
    description:
      '夏休みのご褒美旅行に、彼と宮古島へ行ってきました💕 ハワイより近くて安くて、海の透明度は完全に勝っています📷 1日目は那覇に降りて古宇利大橋を経由、2日目に宮古島へ飛んで与那覇前浜に直行。ホテルは「シギラベイサイドスイートアラマンダ」のオーシャンビュー、これが今回の旅のメインイベントでした✨ 4日目は那覇に戻って国際通りでお土産。記念日でなくても、年に1回はこれくらいの贅沢を許してほしい、というのがふたりの結論。',
    date: '2025-08-05T09:30:00Z',
    createdAt: '2025-08-22T15:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-016', 'tag-010'], // カップル / 夏休み / 絶景
    budget: { amount: 220000, currency: JPY },
    thumbnailKey: 'img-thumb-025',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-099',
            details:
              '那覇空港でレンタカーを借りて、まず古宇利大橋へ。橋の手前の駐車場で停めて橋を歩いて渡るのが定番、彼との写真が一番きれいに撮れた場所📷 橋の中央からのコバルトブルーは絶対SNSに上げたくなる絶景。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 22.0, memo: '古宇利大橋から美ら海水族館まで沖縄北部の海岸線を南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '美ら海水族館は黒潮の海の大水槽前にずっと座っていられる場所。ジンベエザメと一緒に撮るふたり写真は、彼と来た記念日アルバムに必ず1枚は欲しいシーン💕 入館料2180円、所要2時間。',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 80.0, memo: '美ら海から那覇市内・首里城周辺のホテルまで沖縄道', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-098',
            details:
              '夕方着で首里城のライトアップを彼と。守礼門の朱色が夜のライトに照らされる時間帯は観光客も少なめで、写真撮影には絶好のタイミング📷 ホテルは首里城近くの「ホテル日航那覇 グランドキャッスル」が立地◎。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '首里城からホテル「ホテル日航那覇」まで徒歩、夜の那覇散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-098',
            details:
              '夜は首里城裏手の「玉陵」周辺をふたりで散歩。世界遺産の中で観光客がほぼいない静かなエリアで、彼との初日の夜にぴったりの落ち着いた時間が過ごせます💕',
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
              '宮古島与那覇前浜は本当に「日本一」と言える白砂ビーチ💕 ホテルからビーチまで徒歩3分、彼と朝の散歩で手を繋いで歩いた朝の海は一生の宝物です。宝石みたいな青の海が本当に存在するんだなと感動。',
            imageKeys: ['img-node-s101-1', 'img-node-s101-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '与那覇前浜の北端から南端まで朝の散歩、ふたりで手を繋いで歩く', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-101',
            details:
              '午後はホテルのアクティビティでシュノーケル体験（ふたりで12000円）。透明度40mの海で彼と魚を追いかける時間は、年に1度のご褒美旅でしか得られない体験💕 ガイド付きなので初心者ふたり旅でも安心。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: 'ホテルのプライベートビーチから前浜のサンセットスポットまで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-101',
            details:
              '夕方は前浜のサンセットスポットで彼と夕日待ち📷 オレンジに染まる海と白砂ビーチのコントラストは、宮古島最大のフォトスポット。彼が撮ってくれた逆光シルエットがアルバムの表紙になりました✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 4.0, memo: '前浜からホテル「シギラベイサイドスイートアラマンダ」まで戻る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-101',
            details:
              '夜はホテル「シギラベイサイドスイートアラマンダ」のオーシャンビュースイートで部屋食ディナー💕 バルコニー越しの海風と地物のミーバイ料理、ふたりだけの夜が記念日旅の本質を凝縮させた時間📷',
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
            spotKey: 's-101',
            details:
              '3日目はビーチで何もしない日。ホテルのプライベートビーチで彼と日焼け、夕方は来間大橋で夕日を撮影。「シギラ」のオーシャンビュースイートはバルコニーから直接海が見えて、ふたりで朝食を取るのが至福の時間でした✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: 'ホテルから来間大橋までドライブ、夕方の時間に合わせて出発', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-101',
            details:
              '夕方は来間大橋を渡って来間島まで。橋の中央で停車して彼との記念撮影は、宮古ブルーに包まれた最高の1枚📷 来間島の竜宮城展望台から前浜全景が見渡せる絶景ポイントもあって、ふたりの写真欲を爆発させる場所💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 20, distance: 10.0, memo: '来間島から宮古島東平安名崎まで島東端のドライブ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-101',
            details:
              '夜は宮古島東端の東平安名崎で星空鑑賞。光害が少なく、天の川がはっきり見える日もあって、彼と並んで星座を探す時間がご褒美旅の本質を象徴する瞬間✨ 夜風が強いので軽い羽織は必須。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '東平安名崎から宮古島市街まで戻り、夜のホテルバーへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-101',
            details:
              '深夜はホテルのオーシャンビューバーで彼と泡盛カクテル💕 海の音と星空を背景にふたりで乾杯する時間は、ご褒美旅3日目のエンディングとして忘れられない一夜📷',
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
            spotKey: 's-111',
            details:
              '最終日は那覇に戻って国際通りでお土産。彼への土産は「ロイズ石垣島」、自分用は「久米仙の古酒」で締め。空港まで30分で戻れるのが沖縄旅の最後の楽さ💕',
            imageKeys: ['img-node-s111-1', 'img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '国際通りから市場本通り、第一牧志公設市場までの食べ歩き', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '昼食は第一牧志公設市場の2階食堂で、市場で買った魚を上で調理してもらう「持ち上げシステム」。アグー豚しゃぶしゃぶとミーバイの煮付けは、彼との沖縄旅の最後の食卓にふさわしい贅沢📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 6.0, memo: '国際通りから那覇空港まで国道58号、レンタカー返却を含めて余裕の時間', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-098',
            details:
              '空港行きの前に首里城をもう一度。ふたりで旅の出発と終わりを同じ場所で撮るのが、毎回のご褒美旅で続けている記念日ルーティンです💕 守礼門前の写真がアルバムを締めくくる1枚に✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 6.0, memo: '首里城から那覇空港までゆいレール沿いに移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '空港行く前にもう一度国際通りに戻ってラスト沖縄そばランチ📷 彼と「年に1度はこれくらいの贅沢を」と語り合いながら〆る最後の食卓が、4日間のご褒美旅の結論を象徴する1杯💕',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 240,
    targetViews: 4500,
  },
];

// =============================================================================
// 後半 25 本（r-026 〜 r-050）
// =============================================================================

export const curatedRoutesSecondHalf: SeedRoute[] = [
  // ===========================================================================
  // §A. u-004 mio_couple の追加 3 本（r-026 〜 r-028）
  // ===========================================================================

  // ---- r-026 京都 老舗旅館で過ごす大人のご褒美 1泊2日（人気 65 likes / 850 views） ----
  {
    key: 'r-026',
    authorKey: 'u-004',
    title: '京都 老舗旅館で過ごす大人のご褒美 1泊2日',
    description:
      '彼との半年記念に、京都祇園の老舗「俵屋旅館」に1泊だけ泊まってきました💕 朝食付き2名で約9万円、京都の宿としても格別の値段ですが、女将のおもてなし・檜の内風呂・庭の苔まで含めて全部がご褒美。全室坪庭付きで、夜の祇園散歩から戻ってきて部屋食をいただく時間が今回の旅のハイライト📷 紅葉の時期に合わせて11月中旬に予約、清水寺と嵐山の早朝拝観をセットにしたら2日でも京都の核心に触れられた満足度の高いプランになりました✨',
    date: '2025-11-12T13:00:00Z',
    createdAt: '2025-12-05T10:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-008', 'tag-005'], // カップル / 温泉 / 寺社仏閣
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-026',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-035',
            details:
              '昼過ぎに京都駅着、まずは祇園花見小路を散策しながら宿入りの時間まで街並み撮影📷 紅葉の時期は石畳に色づいた葉が映えて、彼との写真がぜんぶ画になります💕',
            imageKeys: ['img-node-s035-1', 'img-node-s035-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '花見小路から二年坂・三年坂を経由して清水寺まで上り坂', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-025',
            details:
              '清水寺は夕方拝観が正解。修学旅行団体が引いた16時以降が狙い目で、舞台から見える京都市街が紅葉に染まる時間帯が今回いちばん感動した瞬間✨ 拝観料500円、所要45分。',
            imageKeys: ['img-node-s025-1', 'img-node-s025-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '清水寺から二年坂を下って祇園白川エリアへ夜の散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-035',
            details:
              '夜の祇園白川は昼と全然違う顔。巽橋のライトアップに彼との写真を残すのが定番で、舞妓さんに遭遇できたら最高のおまけ📷 静かに歩くのがマナーなので、撮るときも声を抑えて。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '祇園白川から俵屋旅館（中京区麩屋町通）方面へ夜のタクシー併用', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-035',
            details:
              '俵屋旅館にチェックイン。坪庭付きの檜風呂で旅の疲れを流して、20時から部屋食の懐石。鯛蕪蒸しと松茸土瓶蒸しが季節のご褒美で、彼と「これは一生ものの体験」と語り合うエンディングに💕',
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
            spotKey: 's-027',
            details:
              '朝食後にチェックアウト、嵐電で嵐山へ朝移動。渡月橋は朝8時前なら観光客がほぼおらず、川面の朝霧と紅葉のコントラストが完璧📷 彼が三脚で撮ってくれた1枚が今回のベスト。',
            imageKeys: ['img-node-s027-1', 'img-node-s027-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '渡月橋北詰から竹林の小径まで嵯峨野エリアの散歩道', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-027',
            details:
              '嵐山の竹林の小径は朝の光が差し込む時間が美しい瞬間✨ 観光客が増える前に通り抜けて、彼との後ろ姿写真を1枚。野宮神社まで歩くと縁結びのご利益も💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 35, distance: 12.0, memo: '嵐山から市バス59系統で金閣寺道まで観光客で混み合う時間帯', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-033',
            details:
              '昼前に金閣寺へ。鏡湖池に映る金閣を彼と並んで撮るのは京都旅の定番でも、ご褒美旅で押さえると改めてその完成度に圧倒されます📷 拝観500円、所要30分。',
            imageKeys: ['img-node-s033-1'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 30, distance: 8.0, memo: '金閣寺道から市バスで四条河原町、錦市場へ昼食を兼ねて', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-125',
            details:
              '帰路前に錦市場で京漬物と西京味噌をお土産に。「打田漬物」の千枚漬けは記念日のお家ご飯用に、「本田味噌」は普段使いに買い分け。彼と分け合うソフトクリームを買い食いして京都駅へ💕',
            imageKeys: ['img-node-s125-1', 'img-node-s125-2'],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 65,
    targetViews: 850,
  },

  // ---- r-027 箱根 強羅〜大涌谷 美術館とフレンチと温泉（中堅 28 likes / 320 views） ----
  {
    key: 'r-027',
    authorKey: 'u-004',
    title: '箱根 強羅〜大涌谷 美術館とフレンチと温泉',
    description:
      '彼の誕生日に箱根強羅の「強羅花壇」へ1泊2日💕 全室半露天付きで、彫刻の森美術館と大涌谷を午前中に片付けて、午後は美術館とフレンチで完全に大人モード📷 2日目は河口湖まで足を伸ばして富士山を眺める贅沢ドライブ。総額9.5万円、誕生日プレゼントとしてはお互いの旅行が一番嬉しいというふたりの結論を再確認した2日間でした✨',
    date: '2024-10-20T11:30:00Z',
    createdAt: '2024-11-15T16:00:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-008', 'tag-006'], // カップル / 温泉 / アート
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-027',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-016',
            details:
              '朝の小田原から箱根登山鉄道で強羅、ロープウェイで大涌谷へ。コバルトブルーの硫黄煙と相模湾の眺望が朝イチで撮れる時間帯がベスト📷 黒たまご2個で寿命が14年延びるという縁起を担いで彼とシェア💕',
            imageKeys: ['img-node-s016-1', 'img-node-s016-2'],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 8, distance: 1.5, memo: '大涌谷駅から箱根ロープウェイで桃源台方向、ガラス越しの硫黄煙ビュー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-016',
            details:
              '大涌谷の展望広場から見える富士山は、雲がなければ大涌谷越しの絶景。彼と並んで撮る記念写真には必ず黒たまごを写し込むのがお約束📷 滞在30分で十分回れる規模感です。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 25, distance: 8.5, memo: '大涌谷から強羅エリアの彫刻の森美術館までバス＋徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-016',
            details:
              '午後は彫刻の森美術館でアート鑑賞。屋外彫刻と紅葉のコラボがフォトジェニックで、ピカソ館・ネットの森（子連れ向けだけど大人も楽しい）と、ゆっくり歩いて2時間。入場1600円💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '彫刻の森から強羅花壇まで坂道を降りて10分弱', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-016',
            details:
              '夕方チェックインの強羅花壇は、もとは皇族の別邸跡という贅沢な立地。半露天付きの離れ客室で、彼と部屋風呂に浸かりながらシャンパンで乾杯するのが今回のメインイベント✨ 夕食は薪火フレンチで誕生日プレートも用意してもらえました📷',
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
              '朝食後にレンタカーで河口湖まで南下、大石公園からの逆さ富士狙い。10月下旬は山頂に雪が乗り始めて画になる季節📷 彼が朝霧の富士山を撮りたくて朝7時着を目指した甲斐がありました✨',
            imageKeys: ['img-node-s007-1', 'img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大石公園からハーブガーデンまで湖畔遊歩道で散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              '大石公園のハーブガーデンと湖畔のラベンダーソフトクリームは秋でも楽しめる定番💕 彼と分け合いながら富士山を背景にした写真を撮るのが恒例ルーティン📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 45, distance: 24.0, memo: '河口湖から富士スバルラインで富士山五合目まで山岳ドライブ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-006',
            details:
              '富士山五合目（吉田口）まで車で上がると標高2305m、雲海が眼下に広がる絶景。10月下旬はもう寒いのでダウン必須、彼が用意してくれたのが助かりました📷 五合目神社で旅の安全祈願も。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 30.0, memo: '富士山五合目から富士スバルラインを下って河口湖大石公園へ戻る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-007',
            details:
              '夕方の河口湖は山頂が夕日で赤く染まる「赤富士」が見られるラッキーな日でした💕 彼との誕生日旅の締めにふさわしい1枚が撮れて、満足度の高い2日間に✨',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 320,
  },

  // ---- r-028 軽井沢 万平ホテル泊（中堅 30 likes / 380 views） ----
  {
    key: 'r-028',
    authorKey: 'u-004',
    title: '軽井沢 万平ホテル泊 ジョン・レノンが愛した避暑地',
    description:
      '夏の避暑に彼と軽井沢「万平ホテル」へ1泊💕 ジョン・レノンが家族で過ごした宿として有名なクラシックホテルで、館内はずっと撮影したくなる重厚さ📷 全室レトロな調度品で統一されていて、ふたりで朝食ルームでロイヤルミルクティーをいただく時間がご褒美旅の核心。2日目は清里高原まで南下して高原ドライブを楽しんで、合計13万円のクオリティ高い夏旅でした✨',
    date: '2024-08-08T10:00:00Z',
    createdAt: '2024-09-02T14:30:00Z',
    routeFor: RouteFor.COUPLE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-012', 'tag-016'], // カップル / 夏休み
    budget: { amount: 130000, currency: JPY },
    thumbnailKey: 'img-thumb-028',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '北陸新幹線で軽井沢駅着、レンタカーで旧軽井沢銀座へ直行。「ミカドコーヒー」のモカソフトを彼と分け合うのが軽井沢入りのお決まりのルーティン💕',
            imageKeys: ['img-node-s008-1', 'img-node-s008-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '旧軽銀座メイン通りから万平通りへの分岐まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '旧軽銀座は午後3時が観光客のピーク。「ジャムこばやし」のルバーブジャムと「腸詰屋」のソーセージをお土産に確保📷 軽井沢は涼しいので散歩が苦にならない最高の避暑地✨',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 2.0, memo: '旧軽銀座から万平ホテルまで万平通りを進む', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-008',
            details:
              '夕方チェックインの万平ホテル本館は1894年創業のクラシック。アルプス館の窓から見える緑が宿泊客の特等席で、彼と並んで撮る写真がぜんぶ画になります📷 ジョン・レノンスイートにも案内してもらえる時間帯あり💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: 'ホテル本館からダイニングルームまで館内移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-008',
            details:
              '夕食はダイニングルームでビーフシチューのコース。ホテル名物の「フランス風懐石」は彼と分け合いながらゆっくりいただける贅沢な時間で、夜のロビーでロイヤルミルクティーを飲むまでがフルセット✨',
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
            spotKey: 's-024',
            details:
              '朝食後にチェックアウト、レンタカーで清里高原まで南下。標高1200mの清里テラスは夏でも涼しく、リフトで上がれる展望デッキで彼との記念撮影📷 入場2400円、所要1時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '清里テラスから萌木の村まで八ヶ岳エリアの観光道路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-024',
            details:
              '清里萌木の村でランチ。「ROCK」のカレーは清里名物で、彼とシェアしてビーフカレーとチキンカレーを食べ比べ💕 メリーゴーランドが観光名物で、写真の背景にぴったり📷',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 65.0, memo: '清里高原から軽井沢方面へ碓氷バイパス・上信越道経由で帰路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-008',
            details:
              '帰路に再び軽井沢へ立ち寄って軽井沢プリンスショッピングプラザでお買い物。彼へのご褒美にラルフローレン、自分用にトリーバーチを購入するのが今回の戦利品💕',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'プリンスショッピングプラザから軽井沢駅まで地下歩道', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-008',
            details:
              '駅前の「沢屋」でジャムを追加購入して新幹線へ。彼と「来年もまた万平ホテルに泊まろう」と決めたのが、今回のご褒美旅の何よりの収穫✨📷',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 30,
    targetViews: 380,
  },

  // ===========================================================================
  // §B. u-005 hayato_solo の 3 本（r-029 〜 r-031）
  // 学生ソロ・青春18きっぷ・節約・〇〇円縛りの口調。
  // ===========================================================================

  // ---- r-029 18きっぷ 東京〜京都12時間（人気 80 likes / 1100 views） ----
  {
    key: 'r-029',
    authorKey: 'u-005',
    title: '青春18きっぷで行く 東京から京都まで普通列車だけの12時間',
    description:
      '青春18きっぷ1日分（2410円）で東京から京都まで本当に行けるのか、大学の友達と賭けて1人で挑戦してきました。結論、行けます。普通電車だけで朝5:20東京発→18:21京都着の約13時間、6回乗換、車内泊なしの日帰りも理論上可能。実際は京都で1泊して翌朝の桜咲く清水寺を撮ってきました。費用合計2410円+宿2800円=5210円。学生のうちにやっておくべき節約旅行の極致です。',
    date: '2024-08-15T05:20:00Z',
    createdAt: '2024-08-25T22:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011', 'tag-025'], // ソロ旅 / 弾丸旅行
    budget: { amount: 2410, currency: JPY },
    thumbnailKey: 'img-thumb-029',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-020',
            details:
              '朝5:20東京駅発の東海道線小田原行から旅スタート。改札で18きっぷにスタンプを押してもらう瞬間が学生旅行のテンション上昇ポイント。始発はガラガラで進行方向左の窓側を確保、リュックひとつの完全身軽装備。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 90, distance: 83.9, memo: '東京→小田原は東海道線快速アクティーで1時間半', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-020',
            details:
              '東京駅構内のNewDaysで朝食用のおにぎりとペットボトル茶をまとめ買い、所要4時間ぶんのスナックも確保。18きっぷ旅は車内コンビニ等存在しないので出発前の補給が生命線。総額780円。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 540, distance: 430.0, memo: '小田原→熱海→静岡→浜松→豊橋→大垣→米原→京都の乗換6回計9時間', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-025',
            details:
              '夕方18時すぎ京都駅着、京都市バス206で清水寺へ。日没ギリギリの清水の舞台から見える京都市街は、長旅の疲れが一気に飛ぶ夕景。拝観500円、所要30分の駆け足観光。',
            imageKeys: ['img-node-s025-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '清水寺から二年坂・三年坂を下って祇園花見小路まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-035',
            details:
              '夜の祇園花見小路は18きっぷ旅の自分にはちょっと場違いな高級感。眺めるだけで満足、舞妓さんに遭遇したらラッキーと思いつつ、帰り道に1100円の天津飯定食で夕食。学生らしい締め方です。',
            imageKeys: ['img-node-s035-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '祇園から京都駅近くの2800円ドミトリーまで深夜の徒歩移動', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-125',
            details:
              '宿に荷物を置いて錦市場の夜の通りを冷やかして1日終了。閉店時間後の錦市場はシャッター街でそれはそれでフォトジェニック。21時に宿に戻って爆睡、12時間の長旅の充実感だけで2410円ぶん以上の体験でした。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 80,
    targetViews: 1100,
  },

  // ---- r-030 学生ソロ沖縄 公共交通だけ（中堅 35 likes / 420 views） ----
  {
    key: 'r-030',
    authorKey: 'u-005',
    title: 'ヒッチハイクは禁止 学生ソロ旅 沖縄那覇〜本部 公共交通だけで',
    description:
      '大学の夏休み、レンタカーなし＆ヒッチハイク禁止の縛りで沖縄を回ってきました。結論、那覇〜本部までやんばる急行バスで2時間1880円、本部の美ら海も路線バスで普通に行けます。レンタカー前提の沖縄ガイドが多いけど、学生ソロなら公共交通で十分。3万5千円で航空券＋ゲストハウス3泊＋食費まで全部収まりました。',
    date: '2025-08-20T11:00:00Z',
    createdAt: '2025-09-12T19:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011', 'tag-016'], // ソロ旅 / 夏休み
    budget: { amount: 35000, currency: JPY },
    thumbnailKey: 'img-thumb-030',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              '那覇空港着→ゆいレールで首里駅→徒歩15分で首里城。世界遺産入場料400円、学生証提示で割引はないけど400円なら払う価値あり。守礼門前で他の学生旅行者に撮ってもらった1枚が今回のサムネ写真。',
            imageKeys: ['img-node-s098-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅からゆいレールで県庁前駅まで12駅', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '夕方の国際通りは観光客と地元客が半々の活気。1日目の宿は国際通り近くのドミトリー2200円、3泊で6600円という学生ソロには優しい値段。チェックインしてから屋台村のうれんプラザで沖縄そば650円。',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'ドミトリーから国際通り中心部の屋台村へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '夜の国際通りで500円の生オリオンと300円のジーマミー豆腐で晩酌。ひとりでも気軽に入れる立ち飲み「足立屋」は学生ソロ旅の聖地、隣のおじさんに沖縄豆知識を仕込んでもらえるのも公共交通旅の特権。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '国際通りから牧志公設市場までの夜散歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '深夜は牧志公設市場周辺をぶらぶら冷やかし。沖縄1日目は「公共交通でも普通に動けるじゃん」という気持ちで宿に戻って早寝、明日は朝6時起きの本部行バス。',
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
            spotKey: 's-098',
            details:
              '2日目朝に首里城公園周辺を再訪、玉陵（たまうどぅん）まで足を伸ばすルートは学生ソロにおすすめ。世界遺産の琉球王家の墓所が入場料300円で見学できるのに観光客がほぼいない穴場。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅から県庁前駅まで戻ってお昼のソーキそばへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '昼食は国際通り「沖縄そばの店 しむじょう」で本格ソーキそば850円。古民家リノベの店舗が観光客向けのソーキそば店としては群を抜く完成度。学生ソロでも気軽に1人席に座れる安心感。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '国際通りから第一牧志公設市場までの徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '午後は国際通り商店街の路地裏散策。市場本通りやサンライズなはのアーケードに入ると地元客の生活が見えてくる。土産は最終日にまわすので、見学だけ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.7, memo: '国際通りから波の上ビーチまで30分歩いて沖縄唯一の市内ビーチへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夜は国際通り屋台でオリオン2杯と海ぶどう500円。明日は朝6時のやんばる急行バスで本部行きなので早めに宿に戻って準備。バス時刻表アプリのダウンロードを忘れずに。',
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
            spotKey: 's-097',
            details:
              '朝6:00国際通り発の「やんばる急行バス」で記念公園前まで2時間1880円。9時開館の美ら海水族館に1番乗りで入場、入場料1880円。学生証提示で1370円に割引、提示忘れずに。',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '美ら海水族館から海洋博公園内のジンベイザメ展示エリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '美ら海のジンベイザメ大水槽は予想以上の迫力で、ひとりでも全然飽きない。学生ソロ旅でも周りに気を使わず黒潮の海水槽を1時間ずっと眺める贅沢。所要3時間。',
            imageKeys: ['img-node-s097-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '美ら海水族館からエメラルドビーチまで海洋博公園内徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-099',
            details:
              '午後は美ら海近くの「古宇利島観光バス」乗り換えで古宇利大橋まで足を伸ばす。橋の途中下車が公共交通旅の唯一の制約だけど、橋を眺めるカフェ「L LOTA」のテラス席で休憩するだけでも価値あり。',
            imageKeys: ['img-node-s099-1'],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 120, distance: 90.0, memo: '古宇利島から記念公園前経由でやんばる急行バスで那覇に戻る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '20時すぎ国際通り着、3日間連続のオリオンで〆。学生ソロ沖縄は思ったより自由度高くて、レンタカー組より地元密着できた満足感。明日は午後便で帰るのでお土産タイム。',
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
              '帰路前にもう一度首里城エリアへ。朝の守礼門は観光客が少なくて落ち着いて撮影できるベストタイム。学生ソロ旅の最後の写真撮影ルーティン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅からゆいレールで県庁前まで戻り、国際通りの土産購入へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '国際通りで土産を一気に確保。両親には紅芋タルト、サークル仲間にはちんすこう詰め合わせ、自分用に泡盛のミニボトル。市場本通りの「上原商店」が国際通りのチェーン店より安い穴場。',
            imageKeys: ['img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '国際通りから第一牧志公設市場の2階食堂へラスト沖縄ランチ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '昼食は牧志公設市場2階の「歩」でアグー豚しゃぶしゃぶ定食1500円。市場で買った魚を上で調理してもらう「持ち上げシステム」は予算的に厳しいので食堂メニューで。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 12.0, memo: '県庁前駅からゆいレールで那覇空港駅まで終点直行', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '空港行きゆいレール乗車前にもう一度オリオンで乾杯、隣のサラリーマンに「学生ソロ偉い」と褒められて沖縄旅の余韻。総額35,000円ピッタリで4日間収まった節約旅行の達成感が半端ない。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 420,
  },

  // ---- r-031 大学生の節約沖縄 2万円で3泊4日（中堅 28 likes / 320 views） ----
  {
    key: 'r-031',
    authorKey: 'u-005',
    title: '大学生の節約沖縄 2万円で3泊4日チャレンジ',
    description:
      'シーズンオフの9月、LCCで2万円縛りの沖縄チャレンジ。航空券は早割6500円往復、宿はゲストハウス3泊で5400円、食費含めても19,800円ピッタリで収まりました。観光は無料スポット中心（首里城公園無料エリア・国際通り散策・波の上ビーチ）、贅沢は1日1回沖縄そば650円のみ。レンタカー組には絶対できない貧乏旅行の達成感が、学生のうちにしかできない最高の体験。',
    date: '2024-09-10T13:00:00Z',
    createdAt: '2024-10-05T11:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-011', 'tag-016'], // ソロ旅 / 夏休み
    budget: { amount: 19800, currency: JPY },
    thumbnailKey: 'img-thumb-031',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              'LCCピーチで那覇空港午後着、ゆいレール特別乗車券800円で1日乗り放題。まず首里駅へ、首里城公園は守礼門・歓会門・木曳門までは無料で見学可。有料エリアは2万円縛りには贅沢なのでスキップ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅からゆいレールで県庁前駅、国際通りエリアへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '国際通りの安宿「ゲストハウス月光荘」1泊1800円にチェックイン。8人ドミトリー部屋だけど清潔、共用キッチンとシャワーがついて2万円縛り旅の最強拠点。',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '宿から国際通り中央へ夜散歩スタート', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '夜は国際通り屋台村「のうれんプラザ」で500円のオリオン生1杯と300円のじーまみー豆腐で晩酌。これだけで沖縄入りの満足感が出るのが不思議で、学生節約旅行ならではの幸福感。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '屋台村から第一牧志公設市場周辺を冷やかし', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '深夜の国際通りで他のドミトリー宿泊客と合流、2万円縛りの話題で盛り上がる。みんな似たような節約旅行をしていて、学生ソロ旅にはこの「同じ価値観の他人との出会い」がご褒美です。',
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
            spotKey: 's-098',
            details:
              '2日目は首里城公園を再訪して無料エリアで時間つぶし。世界遺産・園比屋武御嶽石門は無料で見学可、玉陵（300円）は予算の都合でスキップ。学生ソロ節約旅は「無料スポット最大化」が鉄則。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅から県庁前まで戻り、波の上ビーチまで徒歩移動', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-098',
            details:
              '首里駅周辺の住宅街散策で「沖縄っぽい瓦屋根」の古民家撮影。観光地化されていない地元エリアを歩くのが2万円縛り旅の独自路線で、沖縄の本来の風景に触れられる時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 30, distance: 1.8, memo: '県庁前から波の上ビーチまで那覇市街を縦断する徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '昼食は国際通り脇の路地「平和通り」で350円の沖縄そばランチ。観光客向け800円のソーキそばは贅沢なので地元価格の店を選ぶ目利きが2万円縛りには重要。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '平和通りから国際通り中心部へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '午後は国際通りのアーケード商店街でショッピング冷やかし、夜はまた屋台村でオリオン1杯。1日トータル支出1800円という節約王の風格。',
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
            spotKey: 's-098',
            details:
              '3日目朝は首里城エリアの龍潭池（無料）で散歩、地元の人がジョギングしている朝の風景が観光地化されていなくていい。学生ソロ節約旅は「観光地以外の日常風景」が宝物。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: 'ゆいレールで那覇市街へ戻り、波の上うみそら公園へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '国際通り近隣の「ジャッキー・ステーキハウス」でAランチ1100円という今回最大の贅沢。ステーキ屋というより那覇市民の定食屋で、量も価格も学生に優しい老舗の味。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'ジャッキーから波の上ビーチまで沖縄唯一の市内ビーチへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '波の上ビーチで午後は読書、有料設備を使わなければ完全無料。沖縄唯一の那覇市内ビーチは観光地と地元の中間で、学生ソロが居心地よく過ごせる隠れ家ポイント。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.2, memo: '波の上ビーチから国際通りの宿まで徒歩で帰路', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夜は宿で他の旅人と無料の自炊。共用キッチンに残っていた素麺と缶詰で晩餐。学生節約旅の連帯感がここで完成、明日は午前便で帰るので最後の沖縄夜更け。',
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
              '帰路前に最後の首里城散歩。3泊した沖縄で印象に残ったのは観光地よりも那覇の生活感のある路地裏で、2万円縛りで強制的に「歩く・見る・出会う」しか選択肢がなかった結果が今回の収穫。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.0, memo: '首里駅から県庁前経由で空港駅まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '空港行く前に国際通りで土産。両親には紅芋タルトの個包装1袋（350円）、自分用にちんすこう（200円）。学生節約旅でも土産代だけは絞らないのがマナー。',
            imageKeys: ['img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '国際通りから県庁前駅、ゆいレールで空港へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '昼食は国際通り「カラカラとちぶぐゎ〜」でランチ800円。沖縄最後の食事として古民家居酒屋の昼定食を選ぶのが節約旅の最終戦略。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 12.0, memo: 'ゆいレールで那覇空港駅まで終点直行', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '空港でLCCチェックイン。総額19,800円ピッタリで3泊4日完走、「2万円縛り達成」のスクショを友達LINEに送信。学生のうちにしかできない貧乏旅行の最高記録更新の手応え。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 320,
  },

  // ===========================================================================
  // §C. u-006 gourmet_aki の 6 本（r-032 〜 r-037）
  // 食べ歩き・1日5食・ミシュランからB級まで・店名連発の口調。
  // 6本と最多なので表現バリエーション特に注意。
  // ===========================================================================

  // ---- r-032 福岡24時間食い倒れ（バズ 220 likes / 4200 views） ----
  {
    key: 'r-032',
    authorKey: 'u-006',
    title: '福岡 24時間食い倒れ もつ鍋・ラーメン・水炊き・屋台フルコース',
    description:
      '食べ歩き専門の私が本気で組んだ福岡24時間フルコース。1日で7食、もつ鍋朝定食→水炊き老舗→博多ラーメン→梅ヶ枝餅→焼鳥屋台→屋台ラーメン→深夜豚骨〆と、博多の食を網羅する完全制覇プランです。総額12,000円で「やま中」「博多川端 だるま」「はかた本家」の名店3軒＋屋台2軒＋太宰府梅ヶ枝餅まで詰め込みました。胃袋の限界を試したい人と、福岡出張の余暇に1日でグルメ完結させたい食通向け。1食目の朝もつ鍋は7時開店「やま中」基山店、最後の屋台ラーメンは中洲「一竜」深夜2時という、24時間張り付くハードコア構成です。',
    date: '2025-07-26T07:00:00Z',
    createdAt: '2025-08-02T22:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-016'], // グルメ / 夏休み
    budget: { amount: 12000, currency: JPY },
    thumbnailKey: 'img-thumb-032',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-127',
            details:
              '1食目は博多もつ鍋通り「やま中 博多店」の朝もつ鍋定食1280円。普通もつ鍋は夜のメニューだけど、福岡では朝7時から食える老舗が存在する。胃袋を朝から鍛えるのが24時間食い倒れの儀式。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'もつ鍋通りから博多川端商店街まで朝の散歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-127',
            details:
              '2食目は博多川端商店街「博多川端 だるま」で朝ラーメン700円。豚骨スープのコクが朝にちょうどよく、麺は替え玉込みで350g完食。1日2杯目のスタートとしては軽め。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 14.0, memo: '博多駅から西鉄電車で太宰府駅まで25分', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-090',
            details:
              '3食目は太宰府天満宮の参道で梅ヶ枝餅2軒食べ比べ。「かさの家」と「やす武」で各1個150円、軽めの間食扱い。福岡食い倒れに太宰府を組み込むのが他と差別化のポイント。',
            imageKeys: ['img-node-s090-1', 'img-node-s090-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '太宰府参道を歩いて天満宮本殿まで参拝', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-090',
            details:
              '4食目は太宰府参道「梅園菓子処」で梅守1個180円と、参道入口「招福庵」で名物のうどん650円。胃袋の調子確認を兼ねた中継地点。本殿参拝で次の食欲のために祈願。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 14.0, memo: '太宰府駅から博多駅まで戻り、もつ鍋通りで夕方の水炊きへ', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-127',
            details:
              '5食目は博多もつ鍋通り戻りで老舗「水たき長野」の水炊き1人前2900円。コラーゲンスープの完成度が福岡随一で、〆の雑炊までフルセットで完食。胃袋が全力で稼働中。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'もつ鍋通りから中洲屋台街まで那珂川沿いを夜散歩', order: 1 },
            ],
          },
          {
            order: 6,
            spotKey: 's-091',
            details:
              '6食目は中洲屋台「鬼多郎」で焼き鳥5本盛り800円とハイボール400円。屋台の煙とおじさんの声で福岡の夜の真髄を吸収する時間。隣のサラリーマンに福岡グルメ豆知識を仕込まれる特典付き。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '中洲屋台街内を移動して別の屋台へハシゴ', order: 1 },
            ],
          },
          {
            order: 7,
            spotKey: 's-091',
            details:
              '7食目（深夜2時）は中洲屋台「一竜」で〆の豚骨ラーメン700円。1日7食の最後を飾るに相応しい濃厚スープで、24時間食い倒れフルコース完走。総額11,830円で12,000円予算ピッタリの達成感。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 220,
    targetViews: 4200,
  },

  // ---- r-033 大阪粉もん完全制覇（人気 102 likes / 1320 views） ----
  {
    key: 'r-033',
    authorKey: 'u-006',
    title: '大阪 粉もん完全制覇 たこ焼き・お好み焼き・串カツ食べ歩き',
    description:
      '大阪日帰り、粉もん5軒制覇プラン。「わなか」のたこ焼き→「美津の」のお好み焼き→「ぼてぢゅう」のモダン焼き→「だるま」の串カツ→「うまい屋」のたこ焼きを1日で食い倒し。総額8,500円で大阪の粉もん文化の主要選手を全部制覇できる、食通向けの濃縮ツアーです。胃袋の準備運動として朝の黒門市場でフルーツサンド軽食、夕方の通天閣エリアで串カツを挟むのが攻略の鍵。',
    date: '2024-11-10T08:00:00Z',
    createdAt: '2024-11-20T19:30:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-025'], // グルメ / 弾丸旅行
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-033',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-120',
            details:
              '1食目は朝8時の黒門市場「ダイワ果園」のフルーツサンド800円で胃袋の準備運動。大阪の朝はあえてフルーツから入って、粉もんの油攻撃に備える戦略。',
            imageKeys: ['img-node-s120-1'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 8, distance: 1.5, memo: '黒門市場から地下鉄堺筋線で日本橋駅、難波・道頓堀方面へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-030',
            details:
              '2食目は道頓堀「わなか千日前店」のたこ焼き8個650円。外カリ中トロの完成度が群を抜く老舗で、生地の出汁感がチェーン店とは別物。1食目本番の合格点。',
            imageKeys: ['img-node-s030-1', 'img-node-s030-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '道頓堀グリコサインから美津の本店まで戎橋越え', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-030',
            details:
              '3食目は道頓堀「美津の」山芋焼き1450円。ふわっふわの食感が大阪お好み焼きの最高峰で、目の前で焼いてもらえるのも一人客の特典。混雑時は1時間並ぶので11時開店狙いが正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '道頓堀から千日前経由で通天閣エリアまで地下鉄1駅', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-037',
            details:
              '4食目は通天閣エリア「だるま 通天閣店」で串カツ8本セット1100円。元祖串カツの味と二度漬け禁止のソースで、大阪B級グルメの真髄を体験。隣の地元客のおっちゃんとの会話付き。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 3.0, memo: '通天閣から地下鉄御堂筋線でなんば駅、道頓堀へ戻る', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-030',
            details:
              '5食目は道頓堀「うまい屋」のたこ焼き8個550円で〆。「わなか」とは生地が違う関西たこ焼きのもうひとつの王道で、食べ比べると意外に違いがわかる胃袋訓練の成果。総額8,400円で予算ピッタリの完走。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 102,
    targetViews: 1320,
  },

  // ---- r-034 函館 朝市と夜景（中堅 42 likes / 510 views） ----
  {
    key: 'r-034',
    authorKey: 'u-006',
    title: '函館 朝市で海鮮丼 夜は夜景と回転寿司の1日',
    description:
      '函館1泊2日のグルメ旅。函館朝市の海鮮丼3軒食べ比べと夜景＋夕食の回転寿司「函太郎」が今回のメイン。朝の活イカ刺し→ウニいくら丼→夕方の函館山ロープウェイ→夜の回転寿司という鉄板の流れに、2日目朝の朝市再訪を組み込んで海鮮系の老舗を徹底攻略。1泊1食付きで48,000円の中堅予算。',
    date: '2025-02-14T07:00:00Z',
    createdAt: '2025-03-08T15:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-009', 'tag-012'], // グルメ / 夜景 / カップル
    budget: { amount: 48000, currency: JPY },
    thumbnailKey: 'img-thumb-034',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-122',
            details:
              '函館朝市の老舗「きくよ食堂」で巴丼1980円スタート。ウニ・イクラ・ホタテの三色丼が函館朝市の鉄板で、朝6時開店狙いが観光客回避の正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '朝市内のえきに市場まで移動して活イカ刺しコーナーへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-122',
            details:
              '2食目は函館朝市内「えきに市場」の活イカ釣り堀でイカ釣り体験＋刺身800円。釣ったイカをその場で捌いてもらえる函館名物で、透明な身の食感が忘れられない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '函館朝市から函館山ロープウェイ山麓駅まで電車も活用', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-047',
            details:
              '夕方17時の函館山ロープウェイで山頂へ往復1800円。日没30分前到着で「夜景の青の時間」をフルで撮影できるベストタイミング。冬の2月は16時すぎから暗くなるので時間に余裕を持って。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 3, distance: 0.5, memo: '山麓駅から山頂駅までロープウェイ往復', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-047',
            details:
              '夜景観賞後は山頂レストラン「ジェノバ」でビーフシチュー2400円ディナー。100万ドルの夜景を眺めながらの食事は函館グルメ旅のクライマックス、1人席もあるソロ食べ歩き安心仕様。',
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
            spotKey: 's-122',
            details:
              '2日目朝も函館朝市再訪で「ながやま茶屋」のうに丼3500円。前日の巴丼とは違う北海道産生うにオンリー丼で、函館の海鮮の格の違いを体感する贅沢。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '函館朝市内を回遊、海鮮系の老舗を巡る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-122',
            details:
              '朝市内「函館自由市場」で塩辛・松前漬け・数の子のお土産買い出し。「布目」の松前漬けは函館グルメ土産の鉄板で、自宅に持ち帰っても函館の余韻が続く。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.OTHER, duration: 3, distance: 0.5, memo: 'ロープウェイで山頂展望台へ昼の景色を撮影に', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-047',
            details:
              '昼の函館山も意外に絶景で、津軽海峡と函館市街が広く見える。夜とは別物の函館山の昼景観は観光客が少なくて穴場。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 1.0, memo: '函館山下から元町エリア・赤レンガ倉庫まで散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-122',
            details:
              '帰路前に朝市で最後の「いか飯」400円とハスカップソフト350円。函館グルメの締めとして自分用土産も確保、48,000円ピッタリの満足度高い1泊2日。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 42,
    targetViews: 510,
  },

  // ---- r-035 仙台 牛タン三軒はしご（中堅 36 likes / 440 views） ----
  {
    key: 'r-035',
    authorKey: 'u-006',
    title: '仙台 牛タン三軒はしご 利久・喜助・伊達の牛たんを比較',
    description:
      '仙台日帰りで牛タン御三家「利久」「喜助」「伊達の牛たん」を1日3軒食べ比べ。利久（厚切り定番）→喜助（炭火焼き老舗）→伊達（極上厚切り）の順で、各店1人前ずつ完食して仙台牛タンの違いを徹底比較。間に松島五大堂で観光を挟んで気分転換。総額11,000円で新幹線往復別の食費弾丸プラン。',
    date: '2025-04-12T11:00:00Z',
    createdAt: '2025-04-25T20:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-025'], // グルメ / 弾丸旅行
    budget: { amount: 11000, currency: JPY },
    thumbnailKey: 'img-thumb-035',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-123',
            details:
              '1軒目は仙台駅3階「牛タン通り」の「利久 西口本店」で牛タン定食2200円。厚切り牛タンの代表格で、テールスープと麦飯のセットが完成度MAX。新幹線降りて10分でこの体験は東北食べ歩き旅の鉄板。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '牛タン通り内を移動、利久から喜助へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-123',
            details:
              '2軒目は隣の「味の牛たん 喜助」で塩牛たん定食2400円。炭火焼きの香ばしさが利久より強く、塩のキレが好みの分かれる老舗の味。1日2杯目で胃袋ウォーミングアップ完了。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 27.0, memo: '仙台駅からJR仙石線で松島海岸駅まで観光のはさみどころ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-058',
            details:
              '腹休めに松島五大堂で観光ブレイク。日本三景の松島を15分散策して、伊達政宗ゆかりの瑞巌寺もセットで参拝。胃袋の準備運動を兼ねた15時の中継地点。',
            imageKeys: ['img-node-s058-1', 'img-node-s058-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 35, distance: 27.0, memo: '松島海岸駅からJR仙石線で仙台駅、最後の伊達へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-123',
            details:
              '3軒目（夜）は牛タン通り「伊達の牛たん本舗」極厚芯たん定食3200円で締め。芯たん部分の厚切りは別格、3軒中ベストワンの満足度。総額10,800円で予算ピッタリ、仙台牛タン御三家比較の結論は「利久＞喜助＞伊達」（個人差あり）。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 36,
    targetViews: 440,
  },

  // ---- r-036 名古屋めし全部入り（中堅 33 likes / 410 views） ----
  {
    key: 'r-036',
    authorKey: 'u-006',
    title: '名古屋めし全部入り ひつまぶし・味噌煮込み・手羽先・天むす',
    description:
      '名古屋日帰り、名古屋めし4種を1日で全部攻略。「あつた蓬莱軒」のひつまぶし→「山本屋本店」の味噌煮込みうどん→熱田神宮参拝で胃休め→「世界の山ちゃん」の手羽先→「千寿」の天むすという、名古屋名物4軒制覇プラン。総額9,500円で名古屋メシのコア体験を1日で完結。',
    date: '2024-06-15T11:00:00Z',
    createdAt: '2024-07-02T18:00:00Z',
    routeFor: RouteFor.FRIENDS,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-025'], // グルメ / 弾丸旅行
    budget: { amount: 9500, currency: JPY },
    thumbnailKey: 'img-thumb-036',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-066',
            details:
              '1食目は名古屋城近くの「あつた蓬莱軒 神宮店」でひつまぶし4500円。名古屋めしの王様で、3つの食べ方（そのまま→薬味→だし茶漬け）を順番に楽しむのが正式作法。並ぶ覚悟で11時開店狙い。',
            imageKeys: ['img-node-s066-1', 'img-node-s066-2'],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 4.5, memo: '名古屋城から地下鉄で栄駅、味噌煮込みうどんの老舗へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-066',
            details:
              '2食目は名古屋城エリア「山本屋本店」の味噌煮込みうどん1650円。八丁味噌の濃厚スープと固めの麺が名古屋人ソウルフードで、ライス追加200円で完璧。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 15, distance: 6.0, memo: '名古屋城から地下鉄名城線で熱田神宮西駅まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-067',
            details:
              '胃袋休憩で熱田神宮参拝。三種の神器「草薙剣」を祀る格式高い神社で、深い森の参道を歩くと胃の調子が整う気がする。参拝無料、所要30分。きしめん「宮きしめん」も境内で食べられる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 15, distance: 6.0, memo: '熱田神宮西駅から栄駅、世界の山ちゃん本店へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-066',
            details:
              '4食目は栄エリア「世界の山ちゃん 本店」で幻の手羽先5本セット680円。胡椒のキレが名古屋飲み屋の代表格で、ハイボール1杯と合わせて居酒屋メニューの〆。最後に矢場とん本店の天むす5個入り650円もテイクアウトで購入、新幹線で帰路の車中スナックに。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 33,
    targetViews: 410,
  },

  // ---- r-037 金沢 近江町市場海鮮三昧（中堅 40 likes / 490 views） ----
  {
    key: 'r-037',
    authorKey: 'u-006',
    title: '金沢 近江町市場で海鮮三昧と治部煮の老舗',
    description:
      '金沢1泊2日、近江町市場の海鮮丼食べ比べと加賀料理「治部煮」の老舗を堪能。1日目は近江町で海鮮丼→兼六園→ひがし茶屋街の定番、2日目朝にもう一度近江町でのどぐろ食い倒し。総額52,000円で金沢グルメの主要ポイントを網羅、海鮮系3食＋加賀料理1食のフルコース構成です。',
    date: '2025-01-25T08:00:00Z',
    createdAt: '2025-02-18T14:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-003', 'tag-001'], // グルメ / 歴史
    budget: { amount: 52000, currency: JPY },
    thumbnailKey: 'img-thumb-037',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-129',
            details:
              '1食目は近江町市場「いきいき亭」で近江町丼2700円。ウニ・イクラ・甘エビ・ノドグロを贅沢に1杯に詰め込んだ金沢海鮮の鉄板。朝7時開店、9時には行列完成なので早朝狙い。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 4, distance: 0.2, memo: '近江町市場内を回遊、甘エビ専門店へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-129',
            details:
              '2食目は市場内「大友楼」で甘エビ刺し800円。能登産の甘エビは身の甘みが東京で食べるものとは別物で、市場内で立ち食いするのが金沢流。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '近江町市場から兼六園真弓坂入口まで徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-064',
            details:
              '昼食後は兼六園散策で胃を休める。日本三名園の冬景色は雪吊りが特徴で、季節感満載のフォトスポット。入園320円、所要60分。',
            imageKeys: ['img-node-s064-1', 'img-node-s064-2', 'img-node-s064-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '兼六園からひがし茶屋街まで浅野川を渡る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-065',
            details:
              '夕方はひがし茶屋街「壽屋」で治部煮御膳3800円。鴨肉の加賀料理代表格で、金箔ソフトクリームも食後デザートに購入してインスタ用にも撮影。総額11,500円目安で1日目完了。',
            imageKeys: ['img-node-s065-1', 'img-node-s065-2'],
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
              '2日目朝も近江町市場再訪で「源左ェ門」のノドグロ塩焼き定食3200円。朝から焼き魚の最高峰を食えるのが金沢グルメ旅の特権で、ふっくらした白身は焼き加減も完璧。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '近江町市場から兼六園真弓坂まで朝の徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-064',
            details:
              '朝の兼六園は観光客が少なくて散策に最適。雪吊りに朝日が当たる時間帯は写真も決まる、グルメ旅の合間の風景リフレッシュタイム。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '兼六園からひがし茶屋街まで再訪', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-065',
            details:
              '茶屋街で午後は「茶房 一笑」の抹茶セット1200円で休憩。金沢加賀棒茶と上生菓子のセットが粋で、グルメ旅の合間の和スイーツ枠として欠かせない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 15, distance: 4.0, memo: 'ひがし茶屋街から近江町市場まで北鉄バスで移動', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-129',
            details:
              '帰路前にもう一度近江町市場でお土産。「中島水産」の塩辛と「四十萬谷本舗」のかぶら寿司を購入、自宅で金沢の余韻を続けるお土産戦略。総額51,800円で予算内完走。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 40,
    targetViews: 490,
  },

  // ===========================================================================
  // §D. u-007 island_hopper の 5 本（r-038 〜 r-042）
  // 離島マニア・フェリー・知る人ぞ知る・島時間・データ系の口調。
  // ===========================================================================

  // ---- r-038 波照間島 日本最南端（人気 72 likes / 950 views） ----
  {
    key: 'r-038',
    authorKey: 'u-007',
    title: '波照間島 日本最南端で見る星空 2泊3日 ハテルマブルーに会いに',
    description:
      '日本に有人島は約400島あるって知ってた？その中でも有人島最南端の波照間島は、僕が10年通い続ける別格の存在🏝️ 石垣島から高速船で1時間20分、欠航率3割の難所だけど、辿り着いた人だけが見られる「ハテルマブルー」のニシ浜は世界の海岸線100選にも入る秘境です⛴️ 2泊3日で石垣島1泊＋波照間島1泊、星空観測タワーで南十字星まで観測する島時間プランです。',
    date: '2025-08-10T11:00:00Z',
    createdAt: '2025-09-05T16:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-024', 'tag-016'], // 離島 / 秘境 / 夏休み
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-038',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-100',
            details:
              '石垣空港着→レンタカーで川平湾へ。世界有数の透明度を誇る湾でグラスボート1200円、25分の船上から熱帯魚とサンゴが見える知る人ぞ知る秘境🏝️',
            imageKeys: ['img-node-s100-1', 'img-node-s100-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 5, distance: 1.0, memo: '川平湾駐車場から展望台まで坂道徒歩', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-100',
            details:
              '川平湾展望台からの眺めは7色のグラデーションが完成形。沖縄離島の中でも川平湾は別格の透明度で、データ的にも透明度40m超の数値を記録する場所。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '川平湾から石垣島南部の離島ターミナル方面へ夕日鑑賞', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-100',
            details:
              '夕方は川平湾再訪で日没鑑賞。マリンブルーが夕焼けでオレンジに染まる瞬間が島時間の真髄で、観光客が引いた18時以降が穴場。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '川平湾から石垣市街の離島ターミナル近隣ホテルへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-100',
            details:
              '石垣市街の宿で島料理ディナー。明日の朝便で波照間に渡るため早めに就寝、波照間航路は欠航率3割なので前日の天気予報チェックが必須⛴️',
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
              '朝7:30石垣港発→9:00波照間港着、すぐにニシ浜へ自転車でアクセス。日本有数の透明度を誇るニシ浜のブルーはデータ的にも透明度50m超え、ハテルマブルーの異名は伊達じゃない🏝️',
            imageKeys: ['img-node-s102-1'],
            transitSteps: [
              { mode: TransitMode.BIKE, duration: 5, distance: 1.5, memo: '波照間港からニシ浜まで自転車で坂を下る', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-102',
            details:
              'ニシ浜でシュノーケル装備2000円レンタル。サンゴと熱帯魚の生息密度が日本トップクラスで、ウミガメに遭遇率も高い秘境スポット。観光客が少ないので独り占め感あり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BIKE, duration: 12, distance: 3.0, memo: 'ニシ浜から日本最南端碑まで自転車で島を縦断', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-102',
            details:
              '日本最南端の碑で記念撮影。北緯24度02分の地点に立つ感動は離島マニアにとっての聖地巡礼で、石碑の前で滞在時間30分。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BIKE, duration: 10, distance: 2.5, memo: '最南端碑から星空観測タワー経由で宿へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-102',
            details:
              '夜は波照間星空観測タワー400円で南十字星観測。日本で南十字星が見える数少ない場所で、4月〜6月がベストシーズンだが8月でも条件次第で観測可。秘境離島の真髄を体験。',
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
            spotKey: 's-100',
            details:
              '朝の高速船で波照間→石垣。最終日朝にもう一度川平湾へ立ち寄り、朝の透明度を撮影。光の角度が違うだけで全然違う色味になる川平湾の魅力を再確認🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 22.0, memo: '川平湾から石垣島市街の土産店へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-100',
            details:
              '川平湾近隣の「石垣島ジェラート」で塩黒糖味400円を食べてラスト休憩。離島土産は八重山ミンサー帯のミニタペストリーが定番、自宅に帰っても島の余韻が続く。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.FLIGHT, duration: 60, distance: 410.0, memo: '石垣空港から那覇空港まで琉球エアコミューター', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '那覇トランジットで国際通り立ち寄り。本土帰り便まで2時間あれば国際通りで沖縄そば食べて土産買い足す時間が確保できる、離島マニアの那覇活用術。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '国際通りから第一牧志公設市場まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-098',
            details:
              '時間に余裕があれば首里城も再訪。波照間→首里城という極端な距離移動が沖縄離島旅の醍醐味で、本土の人には伝わりにくい島時間の濃度を体感する3日間でした⛴️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 72,
    targetViews: 950,
  },

  // ---- r-039 利尻・礼文 花の浮島（中堅 45 likes / 580 views） ----
  {
    key: 'r-039',
    authorKey: 'u-007',
    title: '利尻・礼文 花の浮島めぐり 3泊4日 6月〜8月限定の花畑',
    description:
      '北海道最北端の離島ペア、利尻島と礼文島へ7月の花のシーズンに🏝️ 礼文島は「花の浮島」の異名通り、6月〜8月に300種以上の高山植物が見られる秘境⛴️ 稚内からフェリー1時間40分、ふたつの島の周遊フェリーが効率の鍵。札幌前後泊込みの3泊4日プランで、花のピークと利尻富士の絶景を両方押さえました。',
    date: '2025-07-05T08:00:00Z',
    createdAt: '2025-07-30T19:00:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-002', 'tag-016'], // 離島 / 自然 / 夏休み
    budget: { amount: 110000, currency: JPY },
    thumbnailKey: 'img-thumb-039',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-045',
            details:
              '札幌前泊で大通公園夕方散策。北海道入りの定番、ビアガーデン目当てに7月の大通へ立ち寄るのが恒例。明日朝の稚内行特急は5時間半なので早寝必須。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園からすすきの方面へ夕食散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-045',
            details:
              '札幌大通公園のさっぽろテレビ塔展望台720円から眺める7月の大通公園は緑が映える。稚内出発前の旅の助走としての札幌は、毎回利尻礼文行きで立ち寄るルーティン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 320, distance: 396.0, memo: '札幌駅から特急宗谷で稚内駅まで5時間20分', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-114',
            details:
              '稚内港14:20発のハートランドフェリーで利尻島鴛泊港へ1時間40分2360円。船窓から見える利尻富士のシルエットが島マニアの心を掴む瞬間⛴️ 鴛泊港着後にレンタカーでオタトマリ沼へ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 100, distance: 56.0, memo: '稚内港から鴛泊港までハートランドフェリー', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-114',
            details:
              '夕方のオタトマリ沼から見る利尻富士は逆さ富士の絶景🏝️ 「白い恋人」のパッケージにも採用されたビューポイントで、日没前の30分が完璧な光の角度。',
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
              '朝のオタトマリ沼で逆さ富士再撮影。朝6時の風がない時間帯が鏡面状態の沼を生むベストタイム。離島マニアにしか共有できない朝の島時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 25.0, memo: 'オタトマリ沼から沓形岬公園まで利尻島周回道路', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-114',
            details:
              '利尻島周遊道路は1周60kmで2時間半の絶景ドライブ。途中のペシ岬展望台、姫沼、仙法志御崎公園と立ち寄りスポットが多数。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 18.0, memo: '沓形岬から鴛泊港経由で島内のウニ料理店へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-114',
            details:
              '昼食は利尻島名物のバフンウニ丼3500円。利尻昆布で育った極上のウニが島でしか食べられない味で、離島グルメ旅の真髄。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 8.0, memo: '利尻島の宿へ夕方戻り', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-114',
            details:
              '夜は利尻島民宿で島料理ディナー。明日朝の礼文島行フェリーに備えて早寝、礼文島は花のピーク7月初旬がベストタイミングなので天候祈願🏝️',
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
              '朝のフェリーで利尻→礼文へ45分、香深港着。礼文島南部の桃岩展望台はレブンアツモリソウが咲く稀少種の宝庫で、7月初旬は花のピーク🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 25, distance: 12.0, memo: '香深港から桃岩展望台コースの起点まで宗谷バス', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-115',
            details:
              '桃岩展望台コースを歩くと礼文島固有種のレブンウスユキソウ・レブンソウが視界に。300種の高山植物が標高200m以下で見られる「花の浮島」の異名は伊達じゃない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 35, distance: 18.0, memo: '桃岩展望台からスコトン岬まで島の北端へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-115',
            details:
              'スコトン岬は日本最北の岬とされる絶景地点。海越しに利尻富士が見える夕方の角度が最高、離島マニアの撮影聖地。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 35, distance: 18.0, memo: 'スコトン岬から香深港の宿まで', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-115',
            details:
              '夜は礼文島の宿で「ホッケちゃんちゃん焼き」と「ウニ丼」のフルコース。離島グルメの集大成で、明日の帰路に備えて満腹で就寝🏝️',
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
              '朝の礼文島は霧が出やすく、桃岩展望台の朝霧が幻想的。フェリー出航前にもう一度桃岩エリアを散策、礼文限定のレブンキンバイ群生地に立ち寄り。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 115, distance: 60.0, memo: '香深港から稚内港まで直行フェリー1時間55分', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-114',
            details:
              '帰路フェリーから利尻島を見納め。船尾デッキから見送る島の輪郭は何度撮っても画になる、離島マニアの定番ショット⛴️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 320, distance: 396.0, memo: '稚内駅から札幌駅まで特急宗谷で帰路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-045',
            details:
              '札幌着で大通公園夕食。利尻礼文4日間の余韻を残しつつ、北海道らしい締めくくりとしてススキノでジンギスカン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '大通公園から二条市場まで札幌市場散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-121',
            details:
              '帰る前に二条市場で朝食。ウニ・カニ・イクラの丼で離島グルメ旅を締めくくる、本土帰り前のラスト海鮮。総額110,000円ピッタリで4日間完走の達成感🏝️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 45,
    targetViews: 580,
  },

  // ---- r-040 小笠原父島 5泊6日（中堅 38 likes / 470 views） ※事前計画投稿（createdAt < date） ----
  {
    key: 'r-040',
    authorKey: 'u-007',
    title: '小笠原父島 25時間半フェリーで行く東京の楽園 5泊6日',
    description:
      '東京都小笠原村父島へ、おがさわら丸25時間半の航路で行く秘境離島の決定版🏝️ 竹芝桟橋から週1便しか出ない難所だけど、辿り着いた人だけが見られるボニンブルーの海と固有種の生態系は世界自然遺産⛴️ 5泊6日で父島3泊・船中2泊、ホエールウォッチング・ナイトツアー・ペリーロード探検まで詰め込んだ離島マニア向けプランです。事前計画として出航2か月前に投稿、参考にどうぞ。',
    date: '2026-03-15T11:00:00Z',
    createdAt: '2026-01-20T22:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-024', 'tag-016'], // 離島 / 秘境 / 夏休み
    budget: { amount: 165000, currency: JPY },
    thumbnailKey: 'img-thumb-040',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-001',
            details:
              '出航前の時間つぶしに浅草寺。竹芝桟橋11時出航なので朝のうちに浅草寺参拝で旅の安全祈願、雷門前でリュック装備の自撮りが小笠原行きのお決まり🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 25, distance: 8.5, memo: '浅草駅から都営浅草線で東銀座、東京メトロ日比谷線で大門経由スカイツリー方面', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-002',
            details:
              'スカイツリー展望デッキ2100円から本州の風景を見納め。25時間半の航路で太平洋の真ん中に出るので、東京の高層ビル群を脳内に焼き付ける儀式。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 12.0, memo: '押上駅から都営浅草線で大門、ゆりかもめで竹芝駅まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-021',
            details:
              '11:00竹芝桟橋からおがさわら丸出航⛴️ レインボーブリッジの下を通過する瞬間が島マニアにとってのテンションピーク。船尾デッキから東京湾を見送る30分が島時間の始まり。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 360, distance: 280.0, memo: 'おがさわら丸船内、東京湾→相模湾→太平洋へ夜まで航行', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-021',
            details:
              '夜の船上デッキから東京の夜景が水平線に消えていく光景は離島旅の真髄。船内で軽食ディナー、2等寝台10500円のベッドで早寝🏝️',
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
              '11:00父島二見港着、6日ぶりの陸の感触⛴️ 港を出てすぐの大村海岸が父島のメインビーチ、おがさわら丸下船後すぐの透明度に圧倒される。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '二見港から大村海岸まで徒歩、港のすぐ目の前', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '大村海岸でいきなり海水浴。透明度はデータ的にも30m超で、ビーチからシュノーケルで魚が見える秘境クオリティ🏝️ 観光客は同じおがさわら丸組のみで、ピーク時期でも空いている。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '大村海岸から父島中心街まで徒歩、宿チェックインへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-116',
            details:
              '父島中心街は集落規模だけど居酒屋・カフェ・ダイビング屋が10軒以上あって観光客に必要なものは揃う。「Bonina」のメカジキメンチカツ800円が島ランチの鉄板。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 7.0, memo: '父島中心街からウェザーステーション展望台までレンタカー', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-116',
            details:
              '夕方はウェザーステーション展望台で日没鑑賞。グリーンフラッシュが見える日もあると言われる島の絶景スポット、毎日通っても飽きない秘境の景色🏝️',
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
              '朝はホエールウォッチング半日ツアー10000円。3月はザトウクジラの繁殖期で遭遇率90%超、目の前でブリーチングする迫力は離島マニア人生の上位記憶。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 240, distance: 50.0, memo: 'ボートツアーで父島周辺の鯨ポイント巡り', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '昼食は港近くの「ボニーノ」で島寿司ランチ1500円。サワラの漬けが島寿司の定番で、わさびの代わりにカラシを使うのが小笠原流。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '父島中心街から南島ビーチエリアまでレンタカー', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-116',
            details:
              '午後は南島上陸ツアー（事前申請制）。固有種のオガサワラオオコウモリが見られる島で、エメラルドグリーンの扇池は写真より実物が圧倒的🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 8.0, memo: '南島から父島中心街経由でナイトツアー集合場所へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-116',
            details:
              '夜はナイトツアー4500円でオガサワラオオコウモリ観察。世界自然遺産の固有種を間近で見られるのは離島マニア冥利、星空も同時に楽しめる贅沢な3時間。',
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
              '4日目はドルフィンスイム終日ツアー15000円。野生のミナミハンドウイルカと一緒に泳ぐ体験は世界中でも数か所しかなく、父島が日本では数少ない場所。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 360, distance: 80.0, memo: 'ドルフィンスイムボートで父島周辺の沖合いへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '夕方は小港海岸まで徒歩、人がいないプライベートビーチ感覚の穴場🏝️ 大村海岸より静かで、夕日の角度も小港のほうが美しい。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 5.0, memo: '小港海岸から父島中心街の宿へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-116',
            details:
              '夕食は父島居酒屋「ヤンキータウン」でアカバ煮付け定食2000円。島で獲れた魚しか出さないこだわりの店で、地元客と観光客が半々の島時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '居酒屋から宿まで歩いて帰路', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-116',
            details:
              '夜は港の堤防で星空観察。光害ゼロの父島の夜空は天の川がはっきり見える、離島マニアにとっての究極の星空体験🏝️',
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
              '父島最終日朝は中央山展望台で島全景を見納め。標高319mの父島最高峰から見る島の輪郭は、5日間滞在した愛着が凝縮される瞬間🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 8.0, memo: '中央山から二見港のお土産店へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-116',
            details:
              '昼食は港近くの「カフェ ヤンキータウン姉妹店」で島レモネード500円とパッションフルーツチーズケーキ700円。最後の島スイーツで余韻浸し。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '港のお土産店「B-shipショップ」へ最終買い物', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-021',
            details:
              '15:30父島二見港発、おがさわら丸で竹芝へ⛴️ 港の見送りは島民総出の伝統で、太鼓と紙テープで5日間滞在の離島マニアを送り出す感動の儀式。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 720, distance: 540.0, memo: '父島→東京湾、丸1日の船旅', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-021',
            details:
              '夜の船上デッキから振り返る父島は水平線に消えていく。次の航路は最短で1週間後、5日間の離島滞在の重みを噛み締めながら2等寝台で就寝🏝️',
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
            spotKey: 's-021',
            details:
              '15:30竹芝桟橋着、6日ぶりの本州。レインボーブリッジを下からくぐる帰路の景色は出発時とは別物の重みを持つ、離島マニアにとっての帰還儀式⛴️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 30, distance: 12.0, memo: '竹芝駅からゆりかもめ＋都営浅草線で浅草へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-001',
            details:
              '帰路前に浅草寺再訪で旅の無事を報告。島から戻った時の浅草寺の喧騒は刺激が強すぎて、5日間の島時間との落差を痛感する瞬間🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: '浅草寺からスカイツリー方面へ徒歩', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-002',
            details:
              'スカイツリー前で見上げると、5日前と同じ景色なのに完全に別の見え方をする。離島から本土に戻った時のリセット感がこの旅最大の収穫。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.8, memo: 'スカイツリーから浅草寺方面へ夕食散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-001',
            details:
              '夕食は浅草寺近くの蕎麦屋で天ざる1500円。本土初日の食事として蕎麦を選ぶのが小笠原リターン後のお決まり。総額165,000円で6日間完走、次の出航まで島ロスが続きそう🏝️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 470,
  },

  // ---- r-041 隠岐諸島 4島めぐり（中堅 32 likes / 380 views） ----
  {
    key: 'r-041',
    authorKey: 'u-007',
    title: '隠岐諸島 4島めぐり ローソク岩と摩天崖の3泊4日',
    description:
      '島根県の沖合60km、フェリーで2時間半の隠岐諸島は知る人ぞ知る秘境離島群🏝️ 西ノ島・中ノ島・知夫里島・島後島の有人4島を3泊4日で全部踏むのが島マニアの正解ルート。摩天崖257mの絶壁とローソク岩遊覧船は西ノ島側のメイン、後鳥羽天皇の流刑地・中ノ島の歴史遺構もセットで回ると島の重みが増す。本州側の出雲大社で旅の安全祈願→七類港から内航フェリーで島時間に切り替え⛴️',
    date: '2025-06-15T10:00:00Z',
    createdAt: '2025-08-10T21:30:00Z',
    routeFor: RouteFor.EVERYONE,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-024', 'tag-010'], // 離島 / 秘境 / 絶景
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-041',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-077',
            details:
              '出雲市駅着、まずは出雲大社で旅の安全祈願🏝️ 神門通り入口の鳥居をくぐった瞬間に出雲国の空気感、本殿前の二礼四拍手一礼が島渡りに切り替えるスイッチ。',
            imageKeys: ['img-node-s077-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: '本殿から神門通りを抜けて参道食事処へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-077',
            details:
              '神門通りの「八雲」で出雲そば三段1200円。割子そばを上から順にめんつゆで食べるのが出雲流、フェリー乗船前の腹ごしらえ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 65, distance: 48.0, memo: '出雲市駅周辺から七類港まで一畑バス、島根半島を北上', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-077',
            details:
              '14:25七類港発、隠岐汽船フェリー「くにが」で西郷港へ⛴️ 島後島を経由して別府港着、所要2時間半の海路でまさに島時間に切り替わる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 150, distance: 70.0, memo: '七類港→西郷港→別府港、隠岐汽船フェリー', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-113',
            details:
              'フェリーは島後・西郷港で30分の中継停泊⛴️ 隠岐4島の最大島・島後島の集落を遠望、次回再訪したい島候補をデッキから物色するのが島マニアの航路ルーティン。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 70, distance: 35.0, memo: '西郷港→中ノ島・菱浦港経由→西ノ島・別府港、内航フェリー後半', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-113',
            details:
              '17:00西ノ島・別府港着、レンタカーで宿へ。港のローソン跡で買い出し、夜は民宿「なかむら」のサザエカレーで島ごはん🏝️ 集落の街灯は控えめで、満点の星空が宿の前に広がる。',
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
              '朝7時、西ノ島の摩天崖トレッキング開始🏝️ 標高257mの海食崖は日本有数のスケール、放牧された牛馬が断崖の縁を歩く光景は知床より秘境感がある。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 12.0, memo: '摩天崖から国賀海岸の遊歩道入口へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-113',
            details:
              '国賀海岸の通天橋は海蝕アーチで、観光客の少ない平日朝なら独り占め可能。崖下のカルデラ湾を覗き込むと隠岐特有のヒスイ色の海。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 14.0, memo: '国賀海岸から浦郷港へ、ローソク島遊覧船乗り場', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-113',
            details:
              '14:30ローソク岩遊覧船3500円⛴️ 高さ20mの奇岩の先端に夕日が乗る瞬間だけ「ロウソクに火が灯った」ように見える、隠岐随一の写真スポット。出航は天候次第なので前日要予約。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 12.0, memo: '浦郷港から鬼舞展望所まで、西ノ島の山頂展望スポットへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-113',
            details:
              '17:00鬼舞展望所、標高330mから西ノ島・中ノ島・知夫里島の3島を一望🏝️ 隠岐の地形が一目で分かるパノラマで、明日の島渡りの予習として島マニアにはマスト。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 8.5, memo: '鬼舞展望所から別府港の宿へ、夕食時間に間に合うルート', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-113',
            details:
              '夜は宿で隠岐牛のしゃぶしゃぶ。隠岐牛は子牛を松阪などに出荷する元の血統で、地元で消費される若い個体は脂が爽やかで島時間に合う🏝️',
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
              '内航船で中ノ島・菱浦港へ⛴️ 中ノ島は後鳥羽天皇が流された島、隠岐神社と行在所跡を歩くと承久の乱の重みを実感する。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 25, distance: 8.0, memo: '別府港→菱浦港、隠岐汽船内航船', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-113',
            details:
              '昼前に知夫里島・来居港へ。赤壁の絶壁は朝鮮半島が見える日もある夕日スポット🏝️ 観光客は1日10人程度、フェリー時刻表を握り締めて移動するのが島マニアの嗜み。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 15, distance: 5.0, memo: '菱浦港→来居港、内航船で知夫里島へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-113',
            details:
              '夕方、再び別府港へ戻り西ノ島最後の夜。宿で島寿司と隠岐の地酒「天上夢幻」を傾けながら、3島踏破の自己満足で乾杯🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.4, memo: '宿から別府港堤防まで夜の散歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-113',
            details:
              '夜は別府港の堤防で星空鑑賞🏝️ 光害のない隠岐の夜空は天の川が肉眼で見える、離島マニアの隠れご褒美。明日のフェリー時刻まで島時間を最後まで噛み締める。',
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
            spotKey: 's-113',
            details:
              '4日目朝、別府港→西郷港→七類港のフェリー帰路⛴️ 4島中最大の島後島だけは下船観光時間が取れず通過、次回再訪のリベンジリストに残しておく。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 165, distance: 75.0, memo: '別府港→西郷港経由→七類港、隠岐汽船フェリー', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-077',
            details:
              '14:00七類港着、出雲市方面へバスで戻る道中も日本海を眺めながら島の余韻。出雲大社にもう一度立ち寄って旅の無事報告するのが島マニアのお決まり。',
            imageKeys: ['img-node-s077-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 70, distance: 50.0, memo: '七類港から出雲市駅周辺、一畑バス', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-077',
            details:
              '出雲市駅前で「献上そば 羽根屋」の三色そば1500円🏝️ しじみ汁と組み合わせる出雲の最終ディナー、サンライズ出雲発車前の最後の本州ごはんとしてここを外す島マニアはいない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '羽根屋から出雲市駅まで徒歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-077',
            details:
              '出雲市駅で米子経由のサンライズ出雲に乗り込む。寝台車で東京へ戻る最後の海路代わり、4日間の島時間が車窓の山陰本線でゆっくり溶ける🏝️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 32,
    targetViews: 380,
  },

  // ---- r-042 徳之島 まだ知られていない奄美の隣（一般 8 likes / 95 views） ----
  {
    key: 'r-042',
    authorKey: 'u-007',
    title: '徳之島 まだ知られていない奄美の隣 2泊3日',
    description:
      '鹿児島県大島郡徳之島町、奄美大島の南隣にある有人島🏝️ 奄美ほどメジャーじゃないからこそ観光客も少なく、闘牛文化と犬田布岬の戦艦大和慰霊塔がある島マニア向けの隠れ離島。フェリー or 飛行機で行ける2泊3日コース。',
    date: '2025-09-20T08:30:00Z',
    createdAt: '2025-10-15T18:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-023', 'tag-024', 'tag-016'], // 離島 / 秘境 / 夏休み
    budget: { amount: 75000, currency: JPY },
    thumbnailKey: 'img-thumb-042',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-117',
            details:
              '鹿児島空港から徳之島空港へJAC便で1時間⛴️ 着陸前の機窓から見える島影が小さくて、離島マニアのテンションが上がる瞬間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 35, distance: 20.0, memo: '徳之島空港から犬田布岬までレンタカー、島の西海岸を南下', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '犬田布岬の戦艦大和慰霊塔を訪問。1945年4月7日にこの沖で大和が沈んだ場所、太平洋戦争の重みを離島で実感する数少ないスポット🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 15.0, memo: '犬田布岬から亀津の町中心部へ、夕食と宿', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-117',
            details:
              '亀津港近くの居酒屋「島の幸」で島料理。長寿の島・徳之島は青パパイヤと島豆腐が常備で、奄美黒糖焼酎との相性が抜群。',
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
              '朝、再び犬田布岬で水平線越しの朝日。静かな岬は観光客ゼロで、離島マニアの特権🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '犬田布岬から徳之島闘牛場へ、島の中央部を横断', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '徳之島の闘牛は400年の伝統文化。年に20回ほど興行があり、開催日に当たれば本場の島文化が見られる。当日でなくても闘牛場周辺の牛舎見学は可能。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 40, distance: 25.0, memo: '闘牛場から島北部のムシロ瀬まで、奇岩スポット巡り', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-117',
            details:
              '北部のムシロ瀬は花崗岩の海岸、奄美群島では珍しい岩礁地形🏝️ 夕方戻り、亀津のスーパーで島焼酎を仕入れて宿で星空鑑賞。',
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
              '最終日朝、亀津から犬田布岬経由で空港へ。最後にもう一度大和慰霊塔に手を合わせて島を離れるのが島マニアのお作法🏝️',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 45, distance: 28.0, memo: '亀津→犬田布岬→徳之島空港、島の西側を一周', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-117',
            details:
              '徳之島空港のお土産コーナーで黒糖と島焼酎を購入。マニアックな島ほど空港の品揃えが渋く、この狭さが愛おしい。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 50.0, memo: '徳之島空港→鹿児島空港、JAC便で本土帰還', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-117',
            details:
              '鹿児島空港着、奄美と沖縄の間に隠れた徳之島3日間が完了⛴️ 知名度はまだ低いけど、島マニア的には次に来る島の有力候補🏝️',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 8,
    targetViews: 95,
  },

  // ===========================================================================
  // §H. u-008 natsu_family（子連れ家族）の手作り 4 本（r-043 〜 r-046）
  //
  // 口調: 「うちの子」「夏休みの宿題」「ベビーカー」「子連れOK」「自由研究」
  // 絵文字: 👨‍👩‍👧‍👦🐠 控えめ。
  // ===========================================================================

  // ---- r-043 子連れ沖縄 美ら海とビーチ（バズ 210 likes / 3,900 views） ----
  {
    key: 'r-043',
    authorKey: 'u-008',
    title: '子連れ沖縄 美ら海水族館とビーチで遊ぶ3泊4日',
    description:
      'うちの子（小2と小5）と行った夏休みの沖縄、ベビーカー卒業組〜小学生の家族連れ向けの決定版ルートをまとめます👨‍👩‍👧‍👦 美ら海水族館は朝イチ入館で黒潮大水槽の前を独り占めできるのが家族連れの正解。古宇利大橋の渡る瞬間、子どもが「車が海の上を走ってる！」って歓声上げる場所として外せない🐠 首里城は階段が多めなので午前のうちに片付けて、午後は涼しい屋内施設に切り替えるのが子連れの基本動線。残波岬と国際通りも組み込んだ3泊4日、自由研究のテーマも「海の生き物」で完結します。レンタカー必須、宿は那覇2泊+恩納村1泊で動きました。',
    date: '2025-08-05T08:00:00Z',
    createdAt: '2025-08-25T20:30:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-014', 'tag-013', 'tag-016'], // 子連れ / 家族旅行 / 夏休み
    budget: { amount: 145000, currency: JPY },
    thumbnailKey: 'img-thumb-043',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-098',
            details:
              '初日のお昼前に首里城。守礼門の朱色を見て「お城だ！」とうちの子が興奮、世界遺産の認識はまだ薄いけど階段の多さは「足が疲れた」と素直👨‍👩‍👧‍👦 子連れOKだけど夏は日陰少なめ、帽子と水筒必須。',
            imageKeys: ['img-node-s098-1', 'img-node-s098-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 8.0, memo: '首里城公園駐車場から国際通りのコインパーキングへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-111',
            details:
              '国際通りで早めの夕食、ステーキハウス「88」のキッズプレート1200円が子どもには大ヒット🐠 サーターアンダギーをお土産に1袋500円、夏休みの宿題用に「沖縄の食べ物」テーマでメモ取らせる。',
            imageKeys: ['img-node-s111-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '国際通り中心部から牧志公設市場、お土産散策', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '牧志公設市場の2階食堂で泡盛アイス（大人用）と紅芋アイス（子ども用）。市場の魚屋さんで翌日の自由研究用に「沖縄の魚」写真を撮らせてもらう、子ども目線だと水族館より市場のほうが食いつきよかった👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '公設市場から国際通り東のホテルへ徒歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夜は那覇市内のホテルチェックイン後、子どもと国際通り屋台で沖縄ぜんざい600円🐠 一日中歩いた疲れと甘いもののコンボで子どもは即就寝、明日の美ら海に備える子連れ動線。',
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
            details:
              '8:30開館と同時に美ら海水族館入館🐠 黒潮大水槽の前のベンチを確保、ジンベエザメが目の前を通る瞬間にうちの子が「でかい！」と叫んだのが今回の旅のハイライト。自由研究の写真ここで全部撮りました。',
            imageKeys: ['img-node-s097-1', 'img-node-s097-2', 'img-node-s097-3'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: '館内をジンベエ→サンゴ→深海の順で1時間半周遊', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-097',
            details:
              '11:00イルカショー「オキちゃん劇場」、無料なのに本格的でジャンプの高さは美ら海最大の見どころ🐠 前列水しぶきゾーンは小学生大喜び、タオル必携。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '海洋博公園から古宇利島へ、沖縄自動車道を北上', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-099',
            details:
              '古宇利大橋を渡る瞬間、車内から「車が海の上を走ってる！」と歓声👨‍👩‍👧‍👦 全長1960mの橋は子連れドライブの最高峰、停車禁止なので一旦島側へ抜けてビーチで撮影。',
            imageKeys: ['img-node-s099-1', 'img-node-s099-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: '古宇利ビーチで2時間水遊び、シャワーと売店併設', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-099',
            details:
              '古宇利ビーチで水遊び、波が穏やかで小学生でも安心の遠浅。夕方17時に恩納村の宿へチェックイン、子どもは1日泳ぎ疲れて夕食前に寝落ち🐠',
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
              '3日目朝は残波岬、灯台と崖の絶景。子どもは灯台に登れるのが嬉しいらしく200円入場料以上の満足度👨‍👩‍👧‍👦 風強めなので帽子飛ばされ注意。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 4.0, memo: '残波岬から残波ビーチまで、すぐ近くの海水浴場', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-110',
            details:
              '残波ビーチで午前中ずっと水遊び。バナナボート1人2000円が小学生の冒険心に火をつけて、家族で乗ったのが今回一番盛り上がりました🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 70, distance: 55.0, memo: '残波岬から那覇国際通りまで、沖縄自動車道で南下', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '夕方は国際通りで最後のお土産買い出し。子どもは「シーサーストラップ」、大人は「泡盛セット」、夏休みの自由研究用に絵葉書も追加👨‍👩‍👧‍👦 夕食はステーキ「ジャッキー」のキッズメニュー。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'ジャッキーから那覇市内ホテルへ徒歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '夜はホテルの屋上プールで子どもの最後の水遊び🐠 那覇のホテルは屋上プール完備が多く、3日目の疲れもここでリセット。子どもは「明日も泳ぎたい」と言って眠りにつくのが家族沖縄の定番締め。',
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
            spotKey: 's-111',
            details:
              '最終日朝は国際通りの「ジャッキーステーキ」朝食メニュー。テンダーロイン1500円を家族でシェア、子どもには塩こしょうのみで仕上げてもらえる柔軟さが子連れOK店の真髄🐠',
            imageKeys: ['img-node-s111-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: '国際通り東端のドンキで最後のお土産まとめ買い', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-098',
            details:
              '空港行きの前に首里城をもう一度。3日目で疲れも溜まったけど、子どもが「あの石垣どうやって積んだの？」と質問、それが自由研究の追加テーマになりました👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 15, distance: 6.0, memo: '首里城から那覇空港まで、ゆいレール沿いに南下', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-111',
            details:
              '出発前にゆいレールの牧志駅近くの「ブルーシール」沖縄限定アイス🐠 紅芋・サトウキビ・シークワーサーの3色をきょうだい3人で取り合いになるのが家族沖縄旅の終盤あるある。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.TRAIN, duration: 12, distance: 5.0, memo: '牧志駅からゆいレールで那覇空港駅へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-111',
            details:
              '那覇空港で最後のソーキそばと、機内で食べる用の「沖縄ぜんざい」をテイクアウト🐠 総額145,000円で家族4人3泊4日、夏休みの自由研究と思い出が両方手に入る子連れ沖縄の決定版でした。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 210,
    targetViews: 3900,
  },

  // ---- r-044 富士山五合目と河口湖1泊（中堅 48 likes / 610 views） ----
  {
    key: 'r-044',
    authorKey: 'u-008',
    title: '夏休みの自由研究にもなる 富士山五合目と河口湖1泊',
    description:
      'うちの子（小4）の夏休み自由研究「富士山の高さを体感する」をテーマに行った1泊2日👨‍👩‍👧‍👦 五合目は標高2,305m、酸素が薄くなる感覚を子どもに体験させられる貴重な場所。河口湖大石公園のラベンダーと富士山の同時ビューは子連れ写真の鉄板スポット🐠 ベビーカー組には五合目の階段が一部キツいので注意、小学生からなら全エリアOK。',
    date: '2024-08-10T07:30:00Z',
    createdAt: '2024-09-15T19:45:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-014', 'tag-016', 'tag-010'], // 子連れ / 夏休み / 絶景
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-044',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-006',
            details:
              '朝7時新宿発の高速バスで富士山五合目直行、所要2時間半。標高2,305mに着いた瞬間うちの子が「耳が変！」と訴えて、自由研究の「気圧と耳」テーマがその場で決まりました👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s006-1', 'img-node-s006-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 0.5, memo: '五合目バスターミナルから小御嶽神社まで散策', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-006',
            details:
              '小御嶽神社で子どもが赤い鳥居に興奮、御朱印を自由研究のお守りとして購入500円。観光客は外国人が7割、日本語の少ない環境も子どもにとっては刺激🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.3, memo: '神社から五合目レストハウスへ、お土産と昼食', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-006',
            details:
              '昼食は五合目レストハウスの富士山カレー1200円、ご飯が富士山型に盛られて子ども大喜び。お土産は「富士山溶岩クッキー」を自由研究プレゼン用にキープ👨‍👩‍👧‍👦',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.BUS, duration: 60, distance: 35.0, memo: '五合目バスターミナルから河口湖駅、富士スバルライン経由', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-007',
            details:
              '15:00河口湖大石公園着、ラベンダーと富士山の同時ビューは子連れ写真の正解🐠 公園ベンチで子どもアイス、宿は大石公園そばのコテージで湖畔チェックイン。',
            imageKeys: ['img-node-s007-1'],
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
              '朝5:30、子どもを起こして朝の富士山。雲がかかってない朝を狙うのが子連れ富士の真髄、湖面に映る逆さ富士が見えた瞬間「自由研究表紙これにする！」と即決👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s007-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 20, distance: 1.2, memo: '湖畔遊歩道を散歩、ハーブ館方面へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-007',
            details:
              'ハーブ館で「富士山型ラベンダーソープ」800円、子どもの自由研究プレゼント用に購入。湖畔のカフェ「コノカフェ」でモーニング1200円、子連れOKでベビーカー入店可🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: 'ハーブ館から大石公園駐車場へ戻る', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-007',
            details:
              '河口湖駅前の「FUJIYAMAクッキー」で富士山型クッキーを自由研究プレゼント用に1箱👨‍👩‍👧‍👦 子どもが「お友達にも富士山を見せたい」と言って自分のお小遣いで追加購入したのが旅の予期せぬ収穫。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.3, memo: 'FUJIYAMAクッキー河口湖駅店から駅前高速バス停へ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-007',
            details:
              '11時の高速バスで新宿へ。総額38,000円で家族3人1泊2日、自由研究のネタが2つ取れて子連れ夏休みのコスパ最高ルート👨‍👩‍👧‍👦 来年は富士登山にチャレンジさせたい。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 48,
    targetViews: 610,
  },

  // ---- r-045 軽井沢おもちゃ王国と草津2泊3日（中堅 42 likes / 510 views） ----
  {
    key: 'r-045',
    authorKey: 'u-008',
    title: '軽井沢おもちゃ王国と草津温泉 子連れ2泊3日',
    description:
      'うちの子2人（小2と小5）と行った夏休み軽井沢〜草津のド定番ルート👨‍👩‍👧‍👦 軽井沢は涼しくて子連れ歩きに最適、草津温泉の湯畑と湯もみショーは子どもが「お風呂のお祭り！」と表現してくれた🐠 草津のお湯はpH2.1の強酸性で小学生には刺激強めなので、家族湯のあるお宿選びがポイント。3日目の伊香保石段街もセットで上信越の温泉文化を自由研究テーマにできました。',
    date: '2025-08-15T09:30:00Z',
    createdAt: '2025-09-20T17:00:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-014', 'tag-013', 'tag-008'], // 子連れ / 家族旅行 / 温泉
    budget: { amount: 88000, currency: JPY },
    thumbnailKey: 'img-thumb-045',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-008',
            details:
              '東京駅から北陸新幹線で1時間、軽井沢駅着。旧軽井沢銀座まで車で5分、子連れランチは「ミカドコーヒー」のモカソフトと「腸詰屋」のホットドッグが鉄板👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s008-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 0.8, memo: '旧軽井沢銀座を端から端まで、子どもとお土産物色', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-008',
            details:
              '午後は軽井沢おもちゃ王国へ、入園料1200円で乗り物乗り放題は子連れの神スポット🐠 観覧車から見える浅間山と子どもの笑顔のセットが軽井沢ファミリー旅の正解。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 14.0, memo: 'おもちゃ王国から軽井沢プリンスショッピングプラザへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-008',
            details:
              '夕方、軽井沢プリンスアウトレットで子ども服とお土産買い出し。夕食は「川上庵」の蕎麦、子どもメニューに天ぷら付きで900円👨‍👩‍👧‍👦',
            imageKeys: ['img-node-s008-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 3.5, memo: '川上庵から雲場池まで車、夕涼み散策', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-008',
            details:
              '日没後の雲場池で家族夕涼み🐠 池に映る木々のシルエットを子どもとスマホで撮影、軽井沢の涼しい夜風は東京の真夏との対比で「避暑地」の意味を子どもが体感する場所。',
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
              '朝の旧軽井沢を子どもと散歩、「軽井沢ショー記念礼拝堂」で写真撮影。涼しい朝の空気を子どもが「クーラーみたい！」と表現するのが軽井沢の魔力🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 75, distance: 50.0, memo: '軽井沢から草津温泉まで、国道146号を北上', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-012',
            details:
              '昼前に草津温泉到着、湯畑を1周。湯の花が舞う温泉源は子どもが「温泉の工場！」と言うほど迫力満点👨‍👩‍👧‍👦 周辺のお土産屋で温泉まんじゅうを試食しまくり。',
            imageKeys: ['img-node-s012-1', 'img-node-s012-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 6, distance: 0.4, memo: '湯畑から熱乃湯（湯もみショー会場）まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-012',
            details:
              '14:00熱乃湯で湯もみショー観覧700円、子ども無料👨‍👩‍👧‍👦 「草津良いとこ一度はおいで」を観客と歌うパートで子どもが照れながら歌うのが家族旅行のハイライト。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: '熱乃湯から宿（家族風呂付き旅館）へチェックイン', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-012',
            details:
              '夜は宿の家族風呂で草津のお湯を体験。pH2.1の強酸性湯は短時間入浴がコツ、子どもは5分で出るルールにした🐠 夕食は宿の上州牛しゃぶしゃぶ、子どもメニューに温泉卵付き。',
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
            details:
              '朝の湯畑を再訪、夜のライトアップとは別物の落ち着いた草津👨‍👩‍👧‍👦 子どもがお気に入りの「西の河原公園露天風呂」（混浴の足湯）でひとっぷろ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 60, distance: 40.0, memo: '草津温泉から伊香保温泉まで、長野原方面を経由', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-013',
            details:
              '伊香保石段街365段に挑戦、子どもと数えながら登るのが定番遊び🐠 途中の「黄金の湯」足湯で休憩、無料で子連れOK。',
            imageKeys: ['img-node-s013-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 0.4, memo: '石段街を頂上の伊香保神社まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-013',
            details:
              '伊香保ロープウェイで見晴駅まで4分300円、上州の山並みと子どもの「電車みたい！」のコメントが家族旅らしい光景👨‍👩‍👧‍👦 標高955mの見晴展望台は3歳から楽しめる子連れOKスポット。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.5, memo: 'ロープウェイ駅から伊香保神社へ徒歩、石段街経由', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-013',
            details:
              '伊香保神社で旅の無事を家族で報告、帰路は石段街のお土産屋で「湯の花まんじゅう」をお土産に👨‍👩‍👧‍👦 16時の高速バスで東京へ、総額88,000円の家族子連れ温泉旅完走。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 42,
    targetViews: 510,
  },

  // ---- r-046 ハウステンボス長崎2泊3日（中堅 35 likes / 450 views） ----
  {
    key: 'r-046',
    authorKey: 'u-008',
    title: 'ハウステンボスで子供大はしゃぎ 長崎2泊3日',
    description:
      'うちの子（小2と小5）の夏休み長崎ルート、ハウステンボスのチョコレート伯爵の館とアトラクションメインの2泊3日👨‍👩‍👧‍👦 軍艦島上陸は小学生の自由研究テーマ「廃墟と人間」で大人より食いつき良かった🐠 門司港レトロは関門海峡の船を見せられて家族写真スポットとして優秀。ベビーカー組はハウステンボスの広さを侮らず、レンタサイクル必須です。',
    date: '2024-12-25T08:30:00Z',
    createdAt: '2025-01-30T20:15:00Z',
    routeFor: RouteFor.FAMILY,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-014', 'tag-013', 'tag-016'], // 子連れ / 家族旅行 / 夏休み
    budget: { amount: 95000, currency: JPY },
    thumbnailKey: 'img-thumb-046',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-103',
            details:
              '福岡空港着、レンタカーで門司港レトロへ。関門海峡を行き来する船を子どもが30分飽きずに眺めるのが家族連れの定番👨‍👩‍👧‍👦 旧門司税関のレンガ建築は写真スポット。',
            imageKeys: ['img-node-s103-1', 'img-node-s103-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: '門司港駅から旧門司三井倶楽部、バナナ叩き売り発祥地巡り', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-103',
            details:
              '門司港名物「焼きカレー」を「伽哩本舗」で家族昼食、子ども用は卵の白身追加でマイルドに🐠 海峡を見ながらの食事は子どもの旅行記憶として強く残る場所。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 110, distance: 90.0, memo: '門司港から佐世保方面、九州自動車道で南下しハウステンボスへ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-109',
            details:
              '17:00ハウステンボス着、夜のイルミネーション「光の王国」が子連れには圧倒的👨‍👩‍👧‍👦 1300万球のイルミは「ディズニーより派手」と子どもの感想。場内のホテルアムステルダム宿泊で動線最短。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.6, memo: 'ホテルアムステルダムから運河沿いの花火観覧スポットへ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-109',
            details:
              '21:00運河沿いの花火ショー（夏季限定）を家族で観覧🐠 ホテル目の前の特等席ポジションで、子どもが3日間の旅の中で「一番大きい花火」と評した10分間が長崎旅の初日締め。',
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
            spotKey: 's-109',
            details:
              '朝はチョコレートの館で見学、試食コーナーで子どもが大喜び🐠 「カステラの城」では長崎カステラの製造工程を見学、自由研究の食べ物テーマがここで決定。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 10, distance: 0.6, memo: 'チョコレートの館からアトラクションタウンへ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-109',
            details:
              '午前中はアトラクションエリア、子ども向け「ジュラシックアイランド」と「アスレチックタワー」が小学生には鉄板👨‍👩‍👧‍👦 1日券6800円の元を3時間で取り戻すコスパ。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.5, memo: 'アトラクションタウンから昼食レストラン街へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-109',
            details:
              '14:00ホライゾンアドベンチャープラスで観覧船クルーズ、子どもは「お船の大冒険！」と表現🐠 オランダの街並みを運河から眺める20分、年齢問わず楽しめる家族向けアトラクション。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.7, memo: 'クルーズ降り場からスイーツの城、子ども待望のスイーツビュッフェ', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-109',
            details:
              '夕方はスイーツの城でビュッフェ2200円、子ども1100円のチョコレートフォンデュコース。夜は再度イルミネーション、2日連続で見せると違いに気づく子どもの観察眼が育つ👨‍👩‍👧‍👦',
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
            details:
              '朝はハウステンボスのお土産大量買い出し。チョコレートの城でドラジェ、カステラの城で長崎カステラ、自由研究プレゼン用の写真も全部ここで確保🐠',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 90, distance: 75.0, memo: 'ハウステンボスから長崎港へ、軍艦島ツアー集合', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-108',
            details:
              '13:00軍艦島上陸ツアー4500円👨‍👩‍👧‍👦 上陸後30分、廃墟と化した軍艦島の人工の山を見て子どもが「ここに人が住んでたの？」と質問、自由研究「人が消えた島」テーマ確定。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.SHIP, duration: 50, distance: 19.0, memo: '長崎港から軍艦島往復、ツアー船で約2時間半の周遊', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-108',
            details:
              'ツアー帰港後、長崎駅近くの「リンガーハット長崎駅店」で長崎ちゃんぽん880円🐠 子どもメニューもあって、軍艦島の興奮の後に港町ご当地グルメで締めるのが家族長崎の正解動線。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 130, distance: 110.0, memo: '長崎駅周辺から福岡空港まで、長崎自動車道で帰路', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-108',
            details:
              '福岡空港行きのレンタカー道中で子どもが「廃墟が一番面白かった」と総括🐠 総額95,000円の家族3泊（実質2泊3日）、夏休み宿題が3テーマ取れた子連れ長崎ルート完走。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 35,
    targetViews: 450,
  },

  // ===========================================================================
  // §I. u-009 photo_yuki（風景写真家）の手作り 4 本（r-047 〜 r-050）
  //
  // 口調: 「マジックアワー」「光が」「朝焼け」「シャッター」「画になる」
  // 絵文字: 📸✨ 控えめ。
  // ===========================================================================

  // ---- r-047 美瑛 青い池 早朝の光（人気 75 likes / 1,200 views） ※事前計画投稿（createdAt < date） ----
  {
    key: 'r-047',
    authorKey: 'u-009',
    title: '美瑛 青い池と白金温泉 早朝の光を求めて1泊',
    description:
      '北海道美瑛町、青い池の本気は朝5時のブルーアワーにある📸 風景写真家として通算8回訪れて、唯一の正解時間帯はこの30分だけと言い切る。観光バスが入る7時前に三脚を立てて、無風と朝霧のコンディションが揃った時だけシャッターを切る価値が出る✨ ファーム富田のラベンダーは午後の斜光が画になる時間、夕方→夜→翌朝の光のリレーで美瑛を撮り尽くす1泊2日。事前計画として2か月前に投稿、参考にどうぞ。',
    date: '2026-04-25T05:00:00Z',
    createdAt: '2026-02-10T22:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-016'], // 写真映え / 絶景 / 夏休み
    budget: { amount: 42000, currency: JPY },
    thumbnailKey: 'img-thumb-047',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-046',
            details:
              '13:00ファーム富田着、午後の斜光がラベンダーの紫を最も濃く出す時間帯📸 彩りの畑は7色のグラデーションが画になる、ND8フィルターで動きを止めるのが正解。',
            imageKeys: ['img-node-s046-1', 'img-node-s046-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 18, distance: 1.0, memo: 'ファーム富田の彩りの畑→トラディショナル花畑→ラベンダーイースト', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-052',
            details:
              '17:30青い池到着、夕方のブルーアワー前の光が水面の青を最も深く見せる✨ 観光バスが帰った18時以降は写真家の独占時間、35mmと70-200mmで構図を変えながら40分撮影。',
            imageKeys: ['img-node-s052-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: '青い池駐車場から池の周回遊歩道', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-052',
            details:
              '19:30青い池ライトアップ（11月〜4月限定）開始、青のライトに照らされた立ち枯れの白樺が幻想的📸 夏季は19時には日没後ブルーアワーが画になる、両期間で違う絵が撮れる稀有なスポット。',
            imageKeys: ['img-node-s052-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 4.0, memo: '青い池から白金温泉の宿へ、林道経由', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-052',
            details:
              '宿は白金温泉の「銀瑛荘」、源泉掛け流しの茶褐色のお湯で冷えた指先を温める。明日朝4時起床のため21時には就寝、写真家ルーティンの早寝早起き✨',
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
              '朝4:30青い池到着、まだ薄暗い中で三脚セット。5:00日の出と共に水面が無風なら逆さ立ち枯れ白樺が映る、年に20日もない奇跡のコンディションを狙う📸',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '青い池から美瑛町中心部、パッチワークの路へ', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-046',
            details:
              '7:00ファーム富田再訪、朝の柔らかい光がラベンダーの新たな表情を見せる✨ 夕方の斜光と朝の順光、両方撮ることで美瑛のラベンダーは完結する。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 14.0, memo: 'ファーム富田からパッチワークの路、ケンとメリーの木→セブンスターの木', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-046',
            details:
              '9:00セブンスターの木付近、丘陵地のうねりと農作物のパッチワークが朝の斜光で立体的に浮かぶ📸 観光客が来る前のサイクリング客のみ、写真家として三脚を立てる時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 18, distance: 11.0, memo: 'セブンスターの木からケンとメリーの木、パッチワークの路を縦断', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-046',
            details:
              '9:30パッチワークの路の丘陵地帯、ケンとメリーの木の朝の縦構図が美瑛らしい画📸 11時の旭川行き特急で帰路、総額42,000円で写真家1泊2日の決算。次回は冬の青い池と凍結ライトアップで再訪予定。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 75,
    targetViews: 1200,
  },

  // ---- r-048 上高地 朝霧の河童橋（中堅 38 likes / 500 views） ----
  {
    key: 'r-048',
    authorKey: 'u-009',
    title: '上高地 朝霧の河童橋を撮る 1泊2日のフォトトリップ',
    description:
      '長野県松本市、上高地の河童橋は朝霧と穂高連峰のコントラストでマジックアワーが画になる📸 5月下旬の新緑期、朝5:30に河童橋へ立つと観光客は皆無で、清流梓川の流れと朝靄の山肌だけが残る✨ 日帰りでは絶対撮れない朝の光は、五千尺ホテル泊の特権。三脚必携、レンズは16-35mmと70-200mmの2本で十分。',
    date: '2025-05-20T06:00:00Z',
    createdAt: '2025-06-15T19:30:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-002', 'tag-010'], // 写真映え / 自然 / 絶景
    budget: { amount: 38000, currency: JPY },
    thumbnailKey: 'img-thumb-048',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-061',
            details:
              '11:00上高地バスターミナル着、河童橋まで徒歩5分📸 昼の順光は観光客が多すぎて画にならないので、ホテルチェックイン前に大正池の方角を下見。',
            imageKeys: ['img-node-s061-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.5, memo: '河童橋から大正池まで遊歩道、片道50分', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-061',
            details:
              '13:00大正池、立ち枯れの木立と焼岳の組み合わせが上高地の代表絵✨ 14時前後の順光が水面に焼岳を映す、下見でも妥協せず3時間滞在して70-200mmで圧縮構図。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 50, distance: 3.0, memo: '大正池から河童橋経由、明神池方面入口まで', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-061',
            details:
              '17:00河童橋夕暮れ、穂高連峰がアーベントロート（夕焼けで山肌が赤くなる現象）に染まる時間帯📸 夕焼けの後30分のブルーアワーで橋のシルエットを撮るのが王道。',
            imageKeys: ['img-node-s061-2'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 5, distance: 0.2, memo: '河童橋から五千尺ホテル、夕食前にチェックイン', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-061',
            details:
              '五千尺ホテル泊、河童橋目の前のロケーションで写真家価格22,000円は元が取れる✨ 翌朝4:30起床のため早寝、明日の朝霧予報を天気アプリで確認しながら就寝。',
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
              '朝5:30河童橋、朝霧と新緑と穂高のトリプル成立📸 三脚立てて梓川越しに穂高連峰、長秒露光で水面の流れを絹のようにするのが上高地の代表構図。観光客はゼロ、写真家のみの時間。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.5, memo: '河童橋から明神池まで遊歩道、片道3.5km', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-061',
            details:
              '7:30明神池着、穂高神社奥宮の鏡のような水面に山が映る瞬間が「画になる」を体現する場所✨ 早朝の無風時間帯のみ可能、9時以降は風で水面が乱れて全く別物になる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 60, distance: 3.5, memo: '明神池から河童橋、午前の散策と帰路', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-061',
            details:
              '9:30大正池をもう一度経由、朝の光は前日の午後と全く違う角度で焼岳を映す✨ 同じ被写体を2日連続で撮るのが上高地フォトトリップの真髄、季節と光の多重レイヤーで仕留める。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 1.5, memo: '大正池からバスターミナルまで遊歩道、撮影しながら帰路', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-061',
            details:
              '10:30バスターミナルから松本駅行き、車中で撮影データの一次確認📸 総額38,000円、河童橋朝霧と明神池の鏡面の2大カットが取れた時点で1泊2日の元は取れた、上高地フォトトリップ完走。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 38,
    targetViews: 500,
  },

  // ---- r-049 角島大橋〜元乃隅神社 山口の絶景1日（中堅 28 likes / 380 views） ----
  {
    key: 'r-049',
    authorKey: 'u-009',
    title: '角島大橋〜元乃隅神社 山口の絶景を1日で',
    description:
      '山口県下関市、角島大橋は午前10〜12時の太陽角度でエメラルドブルーが最も濃く出る📸 全長1,780mのコバルトブルーロードは、橋の本州側展望台から70-200mmの圧縮で奥行きを潰すのが王道構図。元乃隅神社の海と鳥居123基のグラデーションを撮ったあと、萩城下町の夕方の白壁を斜光で締める1日弾丸ルート✨',
    date: '2024-10-12T09:00:00Z',
    createdAt: '2024-11-08T21:00:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-025'], // 写真映え / 絶景 / 弾丸旅行
    budget: { amount: 8500, currency: JPY },
    thumbnailKey: 'img-thumb-049',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-085',
            details:
              '朝9:30角島大橋本州側の展望台着📸 太陽が南東から南に移る午前の時間帯、橋の白とエメラルドブルーのコントラストが最も画になる。70-200mmで圧縮構図、絞りf/8〜f/11が定番。',
            imageKeys: ['img-node-s085-1'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 3.5, memo: '本州側展望台から橋を渡り角島側、瀬崎陽の公園駐車場まで', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-085',
            details:
              '11:00角島側から本州方向を撮影、逆方向の絵は順光で海の色が違う✨ 同じ橋でも両端から撮ると2枚で1セットの構成、写真家としてはどちらも欠かせない。',
            imageKeys: ['img-node-s085-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 50, distance: 35.0, memo: '角島から元乃隅神社まで、日本海沿いを北上', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-085',
            details:
              '12:30元乃隅神社着、断崖の上に並ぶ123基の朱色の鳥居と日本海の青のコントラストが画になる📸 16-35mmの広角で鳥居の連続を強調、絞り開放で奥の鳥居を圧縮ボケに溶かす構図。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 0.5, memo: '元乃隅神社の鳥居参道を一番下の海まで降りて昇る', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-084',
            details:
              '15:00萩城下町到着、白壁と土塀の街並みが午後の斜光で立体的に浮かぶ✨ 木戸孝允旧宅周辺の路地は人通り少なめ、足軽長屋の夕方光は構図無限。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 20, distance: 1.2, memo: '萩城下町を木戸孝允旧宅→高杉晋作誕生地→菊屋家住宅、歴史散策ルート', order: 1 },
            ],
          },
          {
            order: 5,
            spotKey: 's-084',
            details:
              '17:00夕方の萩城下町、白壁が斜光で黄金色に染まる15分が1日の締め📸 シャッター切ってから新山口駅へ移動、新幹線で帰路。総額8,500円で山口の絶景3点取り、写真家弾丸の最高効率。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 28,
    targetViews: 380,
  },

  // ---- r-050 高千穂峡 マジックアワー2泊3日（人気 85 likes / 1,400 views） ----
  {
    key: 'r-050',
    authorKey: 'u-009',
    title: '高千穂峡 ボートと滝のマジックアワー 2泊3日',
    description:
      '宮崎県高千穂町、高千穂峡の真名井の滝は午前の柱状節理に光が射す時間帯と、夕方マジックアワーのボート上からの2回が画になる📸 朝の国見ヶ丘で雲海を撮り、青島神社の鬼の洗濯板で日没を仕留める3日間。フォトグラファーとしての宮崎は、東京では珍しい古層の景観が残る秘境✨ レンタカー必須、三脚と16-35mmで構図の自由度を確保。',
    date: '2025-11-08T07:30:00Z',
    createdAt: '2025-12-10T18:45:00Z',
    routeFor: RouteFor.SOLO,
    visibility: PUBLIC_VIS,
    collaboratorPolicy: POLICY,
    language: JA,
    tagKeys: ['tag-022', 'tag-010', 'tag-024'], // 写真映え / 絶景 / 秘境
    budget: { amount: 65000, currency: JPY },
    thumbnailKey: 'img-thumb-050',
    routeDates: [
      {
        day: 1,
        nodes: [
          {
            order: 1,
            spotKey: 's-105',
            details:
              '13:00高千穂峡着、午後の光が真名井の滝を斜めから照らす時間帯📸 御橋からの俯瞰構図と、遊歩道下からの仰角構図、2方向で撮らないと高千穂峡の全貌は出ない。',
            imageKeys: ['img-node-s105-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 15, distance: 0.5, memo: '高千穂峡遊歩道を御橋から滝つぼまで一周、撮影スポット確認', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-105',
            details:
              '16:00ボート貸し出し2000円30分、水面から見上げる柱状節理と真名井の滝が高千穂峡撮影のメインカット✨ 夕方マジックアワー直前の光が最も柔らかく、滝の白と岩の灰色のグラデーションが画になる。',
            imageKeys: ['img-node-s105-2'],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 8, distance: 3.0, memo: '高千穂峡から高千穂神社まで、徒歩でも可能だが三脚あり', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-105',
            details:
              '18:00高千穂神社の夜神楽（観光神楽1000円）20:00開始📸 4時間の本物の神楽から代表4演目を1時間で見られる、ストロボ禁止なのでISO6400で手持ち撮影、宿は神社近くの民宿。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 8, distance: 0.4, memo: '夜神楽から民宿への帰路、夜空を見ながら散歩', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-105',
            details:
              '21:30民宿の前庭で星空鑑賞✨ 高千穂は標高300m＋光害最少の山中で、肉眼で天の川がはっきり見える。明日の国見ヶ丘5:30起床のため早めに就寝、写真家ルーティンの早寝早起き。',
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
              '朝5:30国見ヶ丘、11月は雲海発生率が最も高い月✨ 標高513mから見下ろす阿蘇方面の雲海と朝日のコラボは、高千穂を訪れる写真家の一番の目当て。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 12, distance: 6.0, memo: '国見ヶ丘から高千穂峡へ戻る、朝の渓谷を再訪', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-105',
            details:
              '8:00高千穂峡を朝の光で再撮影📸 観光客が来る前の渓谷は別物、川霧と朝日が真名井の滝を逆光で照らすこの時間限定の絵が取れる。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 150, distance: 130.0, memo: '高千穂から青島神社まで、九州山地を横断して宮崎市方面へ', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-106',
            details:
              '14:00青島神社着、鬼の洗濯板（隆起海床）が午後の斜光で立体的に浮かぶ✨ 神社本殿の朱色と海のブルーのコントラスト、16-35mm広角で島全体を構図に入れる。',
            imageKeys: ['img-node-s106-1'],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 25, distance: 0.8, memo: '青島神社から弥生橋経由で青島ビーチ、日没ポイント確認', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-106',
            details:
              '17:30青島から見る日没、太平洋の水平線に沈む夕日とシルエットになる青島神社の鳥居が高千穂とは別系統のマジックアワー📸 三脚立てて長秒露光、波の動きを絹に見せる構図。',
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
            spotKey: 's-106',
            details:
              '朝6:00青島神社、太平洋からの朝日が鬼の洗濯板を照らす時間帯✨ 夕方とは光の方向が真逆で、同じ場所でも全く別の絵になる。写真家として2日連続で撮る価値のあるスポット。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.WALK, duration: 12, distance: 0.5, memo: '青島神社から青島ビーチ、朝の砂浜散策と最終撮影', order: 1 },
            ],
          },
          {
            order: 2,
            spotKey: 's-106',
            details:
              '青島ビーチで打ち上げられた貝殻の質感を50mmマクロで📸 マジックアワー後の柔らかい光は静物写真にも最適、旅の最後のディテールカットとして外せない。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 30, distance: 18.0, memo: '青島から宮崎空港まで、レンタカー返却', order: 1 },
            ],
          },
          {
            order: 3,
            spotKey: 's-106',
            details:
              '9:30青島と宮崎空港の中間、フェニックス自然動物園の展望台で日向灘を一望📸 同じ太平洋でも青島の海岸線とは違う表情、写真家としての宮崎ロケハン記録に追加。',
            imageKeys: [],
            transitSteps: [
              { mode: TransitMode.CAR, duration: 25, distance: 12.0, memo: 'フェニックス自然動物園から宮崎空港まで、レンタカー返却動線', order: 1 },
            ],
          },
          {
            order: 4,
            spotKey: 's-106',
            details:
              '11:00宮崎空港、3日間で高千穂峡・国見ヶ丘雲海・青島マジックアワーの3点セット完走✨ 総額65,000円、写真家として宮崎の光の質は次回再訪確定の収穫。シャッター回数は2,800枚、現像が楽しみ。',
            imageKeys: [],
            transitSteps: [],
          },
        ],
      },
    ],
    targetLikes: 85,
    targetViews: 1400,
  },

];

/**
 * 手作りルート 全 50 本統合 export。
 * 前半 (r-001〜r-025) + 後半 (r-026〜r-050)。
 */
export const curatedRoutes: SeedRoute[] = [
  ...curatedRoutesFirstHalf,
  ...curatedRoutesSecondHalf,
];
