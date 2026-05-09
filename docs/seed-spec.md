# Routem シードデータ仕様書

本書は、旅行ルート共有 SNS「Routem」の開発・QA・デモ用シードデータの **設計合意書** であり、後続の実装タスク（`prisma/seedData/*.ts` 群の生成および `prisma/seed.ts` 差分作成）を **この一冊だけで** 進められる粒度に整えた仕様書です。

別チャットで行った設計議論（`.claude/seed-design-chat.txt`）の合意事項を、項目別に再構成して転記しています。

---

## 目次

1. プロダクト概要
2. データモデル
3. 設計方針（全体）
4. ペルソナ設計
5. タグ設計（25個）
6. スポット設計（約120件）
7. ルート設計
8. ソーシャルグラフ
9. コメント設計
10. エッジケース仕様
11. 画像URL戦略
12. ファイル別生成要件
13. 出力ルール（後続タスク向け）
14. 後続タスクの想定順序

---

## 1. プロダクト概要

### 1.1 サービス概要

**Routem** は、旅行ルート（行程表）を作成・共有・閲覧・いいねできる多言語 SNS。1ルート = 1旅行プランで、複数日にわたって立ち寄り地点（スポット）を順序付きで並べ、地点間の移動手段も記録できる。

### 1.2 想定ユーザー

- 国内外を旅行する個人
- インバウンド観光客（将来的）
- **本シードでは日本人ユーザーの日本国内旅行のみを対象とする**（テストマーケ期間中のため）

### 1.3 対応言語

サービスとしては JA / EN / KO / ZH の 4 言語をサポートするが、本シードでは **すべて日本語（JA）に統一**。

| 項目                  | 値                |
| --------------------- | ----------------- |
| 投稿言語              | JA                |
| コメント言語          | JA                |
| ユーザーの locale     | JA                |
| ユーザーの language   | JA                |
| タグの言語            | 日本語            |
| 通貨                  | JPY のみ          |

### 1.4 主要機能

- ルートの作成・編集・閲覧（複数日 / 複数地点 / 移動手段）
- ソーシャル: フォロー / いいね / コメント / 閲覧数カウント
- 検索: Meilisearch（タグ・スポット名・本文の全文検索 + 位置情報フィルタ）
- 画像: ユーザーアイコン / 背景 / ルートサムネ / ノード写真
- 多言語対応 UI（i18n）

### 1.5 認証・検索・画像配信の前提

- **認証**: Supabase Auth（メール/パスワード）。`User.id` は Supabase Auth の UUID をそのまま使用。
- **検索**: Meilisearch を `routes` / `tags` インデックスで運用。ルート作成・更新時に同期。
- **画像配信**:
  - 本番: OCI Object Storage
  - 開発: MinIO
  - 本シードでは実画像をストレージに置かないため、`Image.status = EXTERNAL` で **Unsplash の外部 URL** を直接保存する。
  - `next.config.ts` の `images.remotePatterns` に `images.unsplash.com` を追加する必要がある。

---

## 2. データモデル

`prisma/schema.prisma` から、シードで扱う主要モデル・enum を抜粋する（フル定義は schema を参照）。

### 2.1 User

```prisma
model User {
  id              String   @id @db.Uuid // Supabase Auth user.id をそのまま入れる
  name            String
  age             Int?
  bio             String?
  locale          Locale   @default(JA)   // UI言語
  language        Language @default(JA)   // 投稿言語
  icon            Image?   @relation("UserIcon")
  background      Image?   @relation("UserBackground")
  uploadedImages  Image[]  @relation("UserUploads")
  routes          Route[]
  collaborations  RouteCollaborator[]
  likes           Like[]
  comments        Comment[]
  followings      Follow[] @relation("follower")
  followers       Follow[] @relation("following")
  searchHistories SearchHistory[]
}
```

### 2.2 Route

```prisma
model Route {
  id           String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  updatedAt    DateTime        @updatedAt
  createdAt    DateTime        @default(now())
  title        String          @db.VarChar(100)
  description  String
  thumbnail    Image?          @relation("RouteThumbnail")

  budget       Budget?
  routeFor     RouteFor        @default(EVERYONE)
  date         DateTime
  language     Language
  tags         Tag[]

  authorId     String          @db.Uuid
  author       User            @relation(references: [id], fields: [authorId], onDelete: Cascade)

  visibility         RouteVisibility         @default(PRIVATE)
  routeDates         RouteDate[]
  likes              Like[]
  comments           Comment[]
  views              View[]
  collaborators      RouteCollaborator[]
  invites            RouteInvite[]
  collaboratorPolicy RouteCollaboratorPolicy @default(DISABLED)

  @@index([authorId])
}
```

### 2.3 RouteDate

```prisma
model RouteDate {
  id         String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  day        Int         // 1日目、2日目...
  routeId    String      @db.Uuid
  route      Route       @relation(fields: [routeId], references: [id], onDelete: Cascade)
  routeNodes RouteNode[]

  @@unique([routeId, day])
}
```

### 2.4 RouteNode

```prisma
model RouteNode {
  id          String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  order       Int
  images      Image[] @relation("NodeImages")
  details     String?

  routeDateId String    @db.Uuid
  routeDate   RouteDate @relation(fields: [routeDateId], references: [id], onDelete: Cascade)

  spotId      String    @db.Uuid
  spot        Spot      @relation(fields: [spotId], references: [id])

  transitSteps TransitStep[]

  @@unique([routeDateId, order])
}
```

### 2.5 TransitStep

```prisma
model TransitStep {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  mode        TransitMode
  duration    Int?        // 分
  distance    Float?      // km
  memo        String?
  order       Int

  routeNodeId String    @db.Uuid
  routeNode   RouteNode @relation(fields: [routeNodeId], references: [id], onDelete: Cascade)
}
```

### 2.6 Spot

```prisma
model Spot {
  id        String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String
  longitude Float?
  latitude  Float?
  source    SpotSource? // MAPBOX / USER
  sourceId  String?     @db.VarChar(500)

  routeNodes RouteNode[]

  @@unique([source, sourceId])
}
```

### 2.7 Tag

```prisma
model Tag {
  id     String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name   String  @unique
  routes Route[]
}
```

### 2.8 Like

```prisma
model Like {
  id        String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime       @default(now())
  target    LikeViewTarget // ROUTE / COMMENT

  userId    String  @db.Uuid
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  routeId   String? @db.Uuid
  route     Route?  @relation(fields: [routeId], references: [id], onDelete: Cascade)

  commentId String?  @db.Uuid
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@unique([userId, routeId])
  @@unique([userId, commentId])
}
```

### 2.9 Comment

```prisma
model Comment {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  text      String
  createdAt DateTime @default(now())
  routeId   String   @db.Uuid
  route     Route    @relation(fields: [routeId], references: [id], onDelete: Cascade)
  userId    String   @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes     Like[]
}
```

### 2.10 View

```prisma
model View {
  id        String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  target    LikeViewTarget // ROUTE / COMMENT

  routeId String? @db.Uuid
  route   Route?  @relation(fields: [routeId], references: [id], onDelete: Cascade)

  userId String? @db.Uuid
}
```

> View レコードは重複可（カウント用に同一ユーザーから複数行入ってよい）。

### 2.11 Follow

```prisma
model Follow {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  followingId String   @db.Uuid
  following   User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  followerId  String   @db.Uuid
  follower    User     @relation("follower",  fields: [followerId],  references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([followingId, followerId])
}
```

### 2.12 Budget

```prisma
model Budget {
  routeId String @id @db.Uuid
  route   Route  @relation(fields: [routeId], references: [id], onDelete: Cascade)

  localCurrencyCode CurrencyCode
  amount            Int

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.13 Image

```prisma
model Image {
  id        String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  url       String
  key       String?      // S3/OCI上のパス。EXTERNAL の場合は null
  status    ImageStatus  @default(DRAFT)
  type      ImageType
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  uploaderId       String? @db.Uuid
  uploader         User?   @relation("UserUploads",   fields: [uploaderId],       references: [id], onDelete: SetNull)
  routeNodeId      String? @db.Uuid
  routeNode        RouteNode? @relation("NodeImages", fields: [routeNodeId],      references: [id], onDelete: SetNull)
  userIconId       String? @unique @db.Uuid
  userIcon         User?   @relation("UserIcon",       fields: [userIconId],       references: [id], onDelete: SetNull)
  userBackgroundId String? @unique @db.Uuid
  userBackground   User?   @relation("UserBackground", fields: [userBackgroundId], references: [id], onDelete: SetNull)
  routeThumbId     String? @unique @db.Uuid
  routeThumb       Route?  @relation("RouteThumbnail",  fields: [routeThumbId],     references: [id], onDelete: SetNull)
}
```

### 2.14 Enum 定義

```prisma
enum LikeViewTarget         { ROUTE COMMENT }
enum RouteVisibility        { PUBLIC PRIVATE }
enum ImageType              { USER_ICON USER_BG ROUTE_THUMBNAIL NODE_IMAGE OTHER }
enum ImageStatus            { ADOPTED DRAFT UNUSED EXTERNAL }
enum TransitMode            { WALK TRAIN BUS CAR BIKE FLIGHT SHIP OTHER }
enum SpotSource             { MAPBOX USER }
enum RouteCollaboratorPolicy { DISABLED VIEW_ONLY CAN_EDIT }
enum RouteFor               { EVERYONE FAMILY FRIENDS COUPLE SOLO }
enum Locale                 { JA EN KO ZH }
enum Language               { JA EN KO ZH }
enum CurrencyCode           { JPY USD EUR GBP KRW TWD CNY THB VND SGD MYR PHP AUD CAD OTHER }
```

### 2.15 リレーション概要

- `User 1—N Route`（`Route.authorId`）
- `Route 1—N RouteDate`（日数分）
- `RouteDate 1—N RouteNode`（その日の立ち寄り順）
- `RouteNode 1—N TransitStep`（次ノードまでの移動を複合可、例: 徒歩→電車→徒歩）
- `RouteNode N—1 Spot`（同じスポットを複数ルートが参照可、被らせる戦略を採る）
- `Route N—N Tag`（多対多、`connectOrCreate`）
- `Route 1—1 Budget`（任意）
- `Route 1—1 Image`（サムネイル、任意）
- `RouteNode 1—N Image`（ノード写真、任意）
- `User 1—1 Image`（アイコン、任意）/ `User 1—1 Image`（背景、任意）
- `Like` は `Route` または `Comment` を対象（`target` で識別）
- `View` は `Route` 対象、ユーザー任意（匿名閲覧も記録可）
- `Follow` は `following`（フォローされる側）と `follower`（フォローする側）

---

## 3. 設計方針（全体）

### 3.1 規模感

| 種別                | 数量目安                              |
| ------------------- | ------------------------------------- |
| ユーザー            | **33人**（コアペルソナ10 + エッジケース3 + モブ20） |
| ルート              | **250本**（手作り50 + 準手作り100 + 量産100）       |
| スポット            | 約 **120件**                          |
| タグ                | **25個**                              |
| フォロー            | 約 **220件**                          |
| いいね（Route 対象） | 約 **2,500件**                        |
| いいね（Comment 対象） | 約 **135件**（コメントの30%）         |
| コメント            | 約 **450件**（170本のルートに分散）   |
| 閲覧数（View）      | 数十万件規模（いいね数の 5〜20 倍）    |
| Image               | 約 230枚分の URL を使い回し          |

> 算定根拠:
> - ルート 250本 × 平均ノード数を確保しつつ、seed 実行時間を 30 秒〜数分以内に収めるバランス。
> - インフルエンサー（u-001）に最大 32 フォロワーを集中させると、UI の二桁フォロワー表示テストが可能。
> - 「3,000本」案は当初出たが seed 実行時間・手作り限界・デモで見えない下位データの問題から **却下**。250本に確定。

### 3.2 言語・地理スコープ

- **日本人ユーザーのみ、日本国内旅行のみ**
- すべての投稿言語・コメント言語・タグは日本語（JA）
- 通貨はすべて JPY
- ペルソナは全員 `locale: JA` / `language: JA`
- 当初検討した「日本70% + アジア25% + 欧米5%」案は、テストマーケ期間中であることを理由に **日本100% に絞る** ことで合意

### 3.3 冪等性と ID 戦略

- **すべて固定 UUID**。再実行しても同一データになるよう upsert で投入する。
- 内部での扱いやすさのために、人間可読なプレフィックス付き ID（`u-001`、`r-001`、`s-001`、`tag-001`、`mob-001`、`c-001`、`img-001` 等）を **キー** として保持し、DB 保存時にはこれを **決定論的に UUID v4 形式に変換** する（同じ入力からは常に同じ UUID が出る変換関数を `prisma/seedData/types.ts` 等に配置）。
- タグの紐付けは Prisma の `connectOrCreate` を使用。
- ユーザーは Supabase Auth → Prisma の順で作成。Auth UUID をそのまま `User.id` に使うため、`u-001` 等の人間可読 ID は **外部参照キー** としてのみ使用し、最終的な `User.id` は Supabase が払い出す UUID。

> 既存の `prisma/seed.ts` の `ensureAuthUser(email, password, name)` ヘルパを再利用すること。

### 3.4 画像戦略

- **Unsplash のみを使用**（DiceBear / Wikimedia 等の併用案は却下）
- 画像レコードはすべて `Image.status = EXTERNAL`、`Image.key = null`、`Image.url` に Unsplash の直接 URL
- URL 形式: `https://images.unsplash.com/photo-{ID}?w={width}&q={quality}&auto=format`
- `next.config.ts` の `images.remotePatterns` に以下を追加:

  ```ts
  { protocol: 'https', hostname: 'images.unsplash.com' }
  ```

- 約 230 枚の URL を `prisma/seedData/images.ts` でキュレーション済みプールとして列挙する
- プール内訳:

  | 用途           | 枚数 | 被りの考え方                                |
  | -------------- | ---- | ------------------------------------------- |
  | ユーザーアイコン | 30   | 各ユーザー固有                              |
  | ユーザー背景    | 20   | 被って良い                                  |
  | ルートサムネ    | 80   | 手作り50本は固有、準手作り・量産で被らせる |
  | ノード写真      | 100  | スポットごとに2〜3枚をプールから引く        |

### 3.5 collaboratorPolicy

- 全ルート `DISABLED` で統一する（OPEN/CAN_EDIT 等の混在は seed には入れない）

---

## 4. ペルソナ設計

「シードのペルソナはどこまで作り込むべきか？」という議論の結論として、**「UI で表示される情報の範囲だけ作り込む」** 方針を採った。アイコン・名前・bio・age・投稿傾向・フォロー数・いいね傾向の差別化に必要なレベル止まりで、出身地ストーリーや人間関係などの裏設定は持たない。

### 4.1 コアペルソナ 10人

| #  | id (prefix) | name              | email                   | locale | language | age | bio                                                                            | 想定キャラ                                                       |
| -- | ----------- | ----------------- | ----------------------- | ------ | -------- | --- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1  | u-001       | たびまる           | tabimaru@routem.test     | JA     | JA       | 32  | 47都道府県制覇しました。週末は必ずどこかへ。発信を通じて旅の楽しさを広げたいです🚄 | インフルエンサー。投稿数最多（30本）、フォロワー圧倒的1位、いいね集中 |
| 2  | u-002       | sakura_trip       | sakura@routem.test       | JA     | JA       | 28  | カフェと寺社仏閣めぐりが好き。京都在住、関西中心に発信しています。               | 中堅人気、関西特化、グルメ＆カルチャー                            |
| 3  | u-003       | kenji_outdoor     | kenji@routem.test        | JA     | JA       | 41  | 山と海と温泉。家族4人でキャンピングカー旅。                                     | ファミリー層、アウトドア、北海道・東北多め                        |
| 4  | u-004       | mio_couple        | mio@routem.test          | JA     | JA       | 26  | 彼と二人旅の記録📷 記念日旅行とご褒美ステイ多め。                               | カップル層、予算高め、RouteFor=COUPLE 集中                       |
| 5  | u-005       | hayato_solo       | hayato@routem.test       | JA     | JA       | 22  | 学生、青春18きっぷの民。安く深く。                                              | 学生ソロ、低予算、徒歩・電車多用、SOLOタグ集中                    |
| 6  | u-006       | gourmet_aki       | aki@routem.test          | JA     | JA       | 35  | 食べ歩き専門。ミシュランからB級まで。1日5食。                                   | グルメ特化、食タグ集中、都市部メイン                              |
| 7  | u-007       | island_hopper     | shun@routem.test         | JA     | JA       | 38  | 離島専門。日本に有人島400以上あるって知ってた？                                  | 穴場専門、離島・秘境、フォロワー少ないけど濃い                    |
| 8  | u-008       | natsu_family      | natsu@routem.test        | JA     | JA       | 39  | 小学生2人と夫の4人家族。子連れOK情報を発信中。                                  | ファミリー、夏休み子連れ旅、RouteFor=FAMILY                      |
| 9  | u-009       | photo_yuki        | yuki@routem.test         | JA     | JA       | 30  | 風景写真家。光と季節を追いかけて。                                              | 写真家、絶景・自然、写真のクオリティで勝負                        |
| 10 | u-010       | newbie_haru       | haru@routem.test         | JA     | JA       | 24  | はじめまして！旅好きになりたい初心者です。                                       | 新規ユーザー枠（投稿0〜1、フォロワー数人）                       |

### 4.2 エッジケース 3人

| #  | id    | name           | email                  | bio              | 特徴                                                            |
| -- | ----- | -------------- | ---------------------- | ---------------- | --------------------------------------------------------------- |
| 11 | u-011 | quiet_user     | quiet@routem.test       | （空文字）       | bio空、アイコンなし、背景なし、投稿0、フォロー0、フォロワー0     |
| 12 | u-012 | private_only   | private@routem.test     | プライベート専用です。 | 投稿はあるが全て visibility: PRIVATE（5本）                      |
| 13 | u-013 | longbio_chan   | longbio@routem.test     | （下記の長文）   | bio長文UI確認用（300字超）                                        |

#### u-013 の bio（完全転記）

```
はじめまして、旅と食と猫をこよなく愛する社会人5年目のOLです🐈 北は北海道の知床から南は沖縄の波照間島まで、これまで国内47都道府県のうち42県を訪れました（残り5県、絶賛コンプ中です）。特に好きなのは、ガイドブックには載っていないような小さな町の喫茶店や、地元の人しか行かないような銭湯、夜の路地裏の小さな居酒屋。観光地化されすぎていない、その土地の生活が見える場所が大好物です。週末は必ずどこかへ出かけていて、有給は全て旅行に使うタイプ。Routemでは、私の旅の記録と、次に行きたい場所のメモを兼ねて投稿しています。同じような価値観の方、フォローしてもらえると嬉しいです。質問やおすすめ情報、いつでも歓迎です！
```

### 4.3 モブユーザー 20人

`mob-001` 〜 `mob-020` で命名。軽いプロフィールのみ持ち、bio は 1〜2行、アイコンは Unsplash 人物写真の小さめプールから引く。投稿は 0〜2本程度。

| 範囲              | 人数 | 特徴                                                       |
| ----------------- | ---- | ---------------------------------------------------------- |
| mob-001 〜 mob-010 | 10人 | 投稿1〜2本、フォロー多め（10〜15人）、よくいいねする層     |
| mob-011 〜 mob-020 | 10人 | 投稿0、ROM 専、たびまる/sakura_trip 中心にフォロー         |

これで合計 **33人**。インフルエンサー u-001 たびまるは最大 **32人からフォローされる**（自分以外の全ユーザー）= フォロワー32人を実現。UI 的には二桁フォロワー表示が確認できる。

> モブを 50〜100人に増やして「1.2k followers」表示テストを実現する案も検討したが、20人で十分（Q-12 で確定）。

### 4.4 ペルソナ別投稿配分

| ユーザー                          | 想定投稿数 | 内訳                                       |
| --------------------------------- | ---------- | ------------------------------------------ |
| u-001 たびまる（インフルエンサー） | 30本       | 手作り 10 + 準手作り 15 + 量産 5            |
| u-002 sakura_trip                  | 25本       | 手作り 8 + 準手作り 12 + 量産 5（関西中心） |
| u-003 kenji_outdoor                | 20本       | 手作り 5 + 準手作り 10 + 量産 5（北海道・東北・アウトドア） |
| u-004 mio_couple                   | 18本       | 手作り 5 + 準手作り 10 + 量産 3（カップル系） |
| u-005 hayato_solo                  | 15本       | 手作り 3 + 準手作り 8 + 量産 4（低予算ソロ） |
| u-006 gourmet_aki                  | 22本       | 手作り 6 + 準手作り 12 + 量産 4（グルメ）    |
| u-007 island_hopper                | 12本       | 手作り 5 + 準手作り 5 + 量産 2（離島・穴場、少ないが濃い） |
| u-008 natsu_family                 | 18本       | 手作り 4 + 準手作り 10 + 量産 4（ファミリー） |
| u-009 photo_yuki                   | 20本       | 手作り 4 + 準手作り 12 + 量産 4（絶景）      |
| u-010 newbie_haru                  | 1本        | 準手作り 1（新規ユーザー枠）                 |
| u-011 quiet_user                   | 0本        | エッジケース                                 |
| u-012 private_only                 | 5本        | すべて PRIVATE（手作り 2 + 準手作り 3）      |
| u-013 longbio_chan                 | 4本        | 準手作り 4                                   |
| mob-001 〜 mob-010                 | 計15本     | ほぼ準手作り or 量産                         |
| mob-011 〜 mob-020                 | 0本        | ROM 専                                       |
| **合計**                           | **約 250本** |                                            |

---

## 5. タグ設計（25個）

カテゴリ分類は **内部メモ** であり、DB 上は `Tag` モデルにフラット格納（`category` フィールドは持たない）。タグ名はすべて日本語。

| #  | tag name      | カテゴリ         | 想定使用ルート数         |
| -- | ------------- | ---------------- | ------------------------ |
| 1  | 歴史           | テーマ           | 多                       |
| 2  | 自然           | テーマ           | 多                       |
| 3  | グルメ         | テーマ           | 多                       |
| 4  | カフェ         | テーマ           | 中                       |
| 5  | 寺社仏閣       | テーマ           | 中                       |
| 6  | アート         | テーマ           | 少                       |
| 7  | ショッピング   | テーマ           | 中                       |
| 8  | 温泉           | テーマ           | 中                       |
| 9  | 夜景           | テーマ           | 中                       |
| 10 | 絶景           | テーマ           | 多                       |
| 11 | ソロ旅         | 同行者           | 中                       |
| 12 | カップル       | 同行者           | 中                       |
| 13 | 家族旅行       | 同行者           | 中                       |
| 14 | 子連れ         | 同行者           | 少                       |
| 15 | 女子旅         | 同行者           | 中                       |
| 16 | 夏休み         | シーズン         | 多（メインテーマ）       |
| 17 | 紅葉           | シーズン         | 少                       |
| 18 | 桜             | シーズン         | 少                       |
| 19 | 花火           | シーズン         | 中（夏休み連動）          |
| 20 | ハイキング     | アクティビティ   | 中                       |
| 21 | サイクリング   | アクティビティ   | 少                       |
| 22 | 写真映え       | アクティビティ   | 中                       |
| 23 | 離島           | エリア性質       | 中（穴場テーマ）          |
| 24 | 秘境           | エリア性質       | 少（穴場テーマ）          |
| 25 | 弾丸旅行       | スタイル         | 少                       |

### タグ付与ルール（ルート側）

- 1ルートあたり **2〜5タグ**（平均 3タグ）
- 「**夏休み**」タグは全体の **40%（100本程度）** に付与（夏休みフィードのテストに必要）
- 構成: テーマ系（歴史/自然/グルメ等）必須 1個 + 同行者系 1個 + 任意 1〜3個

---

## 6. スポット設計（約120件）

夏休み定番 + 穴場をミックスして約 120 スポット。座標は **実在する正確な値**（GeoJSON で確認可能）。`SpotSource = USER`、`sourceId = null` で良い（外部 ID 同期の対象外）。

ID は `s-001` 形式の人間可読プレフィックス → 決定論的 UUID。

### 6.1 関東エリア（東京 / 神奈川 / 千葉 / 山梨 / 長野 一部）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 浅草寺                            | 35.7148   | 139.7967   | 東京     |
| 東京スカイツリー                   | 35.7100   | 139.8107   | 東京     |
| 渋谷スクランブル交差点             | 35.6595   | 139.7005   | 東京     |
| 鎌倉大仏（高徳院）                 | 35.3168   | 139.5358   | 神奈川   |
| 江ノ島シーキャンドル               | 35.2997   | 139.4810   | 神奈川   |
| 富士山 五合目                     | 35.3962   | 138.7300   | 山梨     |
| 河口湖 大石公園                   | 35.5168   | 138.7556   | 山梨     |
| 軽井沢 旧軽井沢銀座                | 36.3540   | 138.6356   | 長野     |

### 6.2 関東・甲信越（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 日光東照宮                         | 36.7580   | 139.5989   | 栃木     |
| 鬼怒川温泉                         | 36.8000   | 139.7044   | 栃木     |
| 那須高原                           | 37.0306   | 139.9711   | 栃木     |
| 草津温泉 湯畑                     | 36.6228   | 138.5969   | 群馬     |
| 伊香保温泉 石段街                  | 36.4886   | 138.9114   | 群馬     |
| 鎌倉 小町通り                      | 35.3192   | 139.5500   | 神奈川   |
| 横浜 みなとみらい                  | 35.4548   | 139.6322   | 神奈川   |
| 箱根 大涌谷                        | 35.2436   | 139.0211   | 神奈川   |
| 江ノ島 弁天橋                      | 35.3019   | 139.4839   | 神奈川   |
| 明治神宮                           | 35.6764   | 139.6993   | 東京     |
| 上野公園                           | 35.7150   | 139.7732   | 東京     |
| 東京駅 丸の内駅舎                  | 35.6812   | 139.7671   | 東京     |
| お台場 レインボーブリッジ          | 35.6360   | 139.7634   | 東京     |
| 高尾山                             | 35.6253   | 139.2436   | 東京     |
| 諏訪湖                             | 36.0500   | 138.0833   | 長野     |
| 清里高原                           | 35.9081   | 138.4344   | 山梨     |

### 6.3 関西エリア

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 清水寺                            | 34.9949   | 135.7851   | 京都     |
| 伏見稲荷大社                       | 34.9671   | 135.7727   | 京都     |
| 嵐山 渡月橋                       | 35.0128   | 135.6770   | 京都     |
| 奈良公園                           | 34.6851   | 135.8430   | 奈良     |
| 東大寺 大仏殿                      | 34.6889   | 135.8398   | 奈良     |
| 道頓堀                             | 34.6687   | 135.5012   | 大阪     |
| ユニバーサル・スタジオ・ジャパン   | 34.6654   | 135.4323   | 大阪     |
| 神戸 メリケンパーク                | 34.6810   | 135.1882   | 兵庫     |

### 6.4 関西エリア（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 金閣寺（鹿苑寺）                   | 35.0394   | 135.7292   | 京都     |
| 銀閣寺（慈照寺）                   | 35.0270   | 135.7982   | 京都     |
| 京都 祇園 花見小路                 | 35.0036   | 135.7750   | 京都     |
| 大阪城                             | 34.6873   | 135.5259   | 大阪     |
| 通天閣                             | 34.6524   | 135.5063   | 大阪     |
| 春日大社                           | 34.6814   | 135.8484   | 奈良     |
| 姫路城                             | 34.8394   | 134.6939   | 兵庫     |
| 城崎温泉                           | 35.6260   | 134.8047   | 兵庫     |
| 熊野古道 大門坂                    | 33.6678   | 135.8911   | 和歌山   |
| 那智の滝                           | 33.6700   | 135.8911   | 和歌山   |
| 高野山 奥之院                      | 34.2147   | 135.5919   | 和歌山   |
| 琵琶湖 白鬚神社                    | 35.2706   | 136.0017   | 滋賀     |

### 6.5 北海道・東北

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 札幌大通公園                       | 43.0608   | 141.3543   | 北海道   |
| 富良野 ファーム富田                | 43.4146   | 142.4147   | 北海道   |
| 函館山展望台                       | 41.7595   | 140.7041   | 北海道   |
| 知床五湖                           | 44.1062   | 145.0901   | 北海道   |
| 小樽運河                           | 43.1928   | 141.0028   | 北海道   |
| 奥入瀬渓流                         | 40.5167   | 140.9333   | 青森     |
| 銀山温泉                           | 38.5683   | 140.5267   | 山形     |

### 6.6 北海道・東北（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 美瑛 青い池                        | 43.4956   | 142.6256   | 北海道   |
| 旭山動物園                         | 43.7689   | 142.4783   | 北海道   |
| 洞爺湖                             | 42.5938   | 140.8569   | 北海道   |
| 登別温泉 地獄谷                    | 42.4961   | 141.1689   | 北海道   |
| ニセコ アンヌプリ                  | 42.8631   | 140.6917   | 北海道   |
| 中尊寺 金色堂                      | 39.0008   | 141.0975   | 岩手     |
| 松島 五大堂                        | 38.3683   | 141.0617   | 宮城     |
| 蔵王 御釜                          | 38.1383   | 140.4500   | 山形     |
| 五色沼                             | 37.6619   | 140.0725   | 福島     |

### 6.7 中部・北陸

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 上高地 河童橋                     | 36.2503   | 137.6347   | 長野     |
| 白川郷 合掌造り集落                | 36.2592   | 136.9067   | 岐阜     |
| 飛騨高山 古い町並                  | 36.1408   | 137.2589   | 岐阜     |
| 兼六園                             | 36.5621   | 136.6625   | 石川     |
| ひがし茶屋街                       | 36.5722   | 136.6663   | 石川     |

### 6.8 中部・北陸（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 名古屋城                           | 35.1856   | 136.8997   | 愛知     |
| 熱田神宮                           | 35.1278   | 136.9081   | 愛知     |
| 伊勢神宮 内宮                      | 34.4548   | 136.7257   | 三重     |
| 鳥羽水族館                         | 34.4836   | 136.8403   | 三重     |
| 立山 室堂平                        | 36.5783   | 137.5953   | 富山     |
| 黒部峡谷 トロッコ電車              | 36.8167   | 137.5944   | 富山     |
| 永平寺                             | 36.0556   | 136.3556   | 福井     |
| 東尋坊                             | 36.2406   | 136.1264   | 福井     |

### 6.9 中国・四国

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 厳島神社                           | 34.2959   | 132.3197   | 広島     |
| 原爆ドーム                         | 34.3955   | 132.4536   | 広島     |
| 鳥取砂丘                           | 35.5414   | 134.2236   | 鳥取     |
| 出雲大社                           | 35.4019   | 132.6855   | 島根     |
| 道後温泉本館                       | 33.8516   | 132.7864   | 愛媛     |
| 四万十川 沈下橋                    | 33.0364   | 132.9831   | 高知     |
| 小豆島 エンジェルロード            | 34.4831   | 134.2558   | 香川     |

### 6.10 中国・四国（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 倉敷 美観地区                      | 34.5953   | 133.7714   | 岡山     |
| 後楽園                             | 34.6678   | 133.9358   | 岡山     |
| 尾道 千光寺                        | 34.4108   | 133.2056   | 広島     |
| 萩城下町                           | 34.4111   | 131.4014   | 山口     |
| 角島大橋                           | 34.3514   | 130.8814   | 山口     |
| 金刀比羅宮                         | 34.1856   | 133.8089   | 香川     |
| 直島 草間彌生 かぼちゃ              | 34.4517   | 133.9933   | 香川     |
| 大歩危・小歩危                     | 33.8489   | 133.7867   | 徳島     |
| 祖谷のかずら橋                     | 33.8633   | 133.7956   | 徳島     |

### 6.11 九州・沖縄

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 太宰府天満宮                       | 33.5318   | 130.5350   | 福岡     |
| 博多 中洲屋台                      | 33.5910   | 130.4083   | 福岡     |
| 別府 海地獄                        | 33.2922   | 131.4831   | 大分     |
| 由布院 金鱗湖                      | 33.2664   | 131.3583   | 大分     |
| 阿蘇 草千里ヶ浜                    | 32.8836   | 131.0494   | 熊本     |
| 桜島 湯之平展望所                  | 31.5942   | 130.6469   | 鹿児島   |
| 屋久島 縄文杉                      | 30.3014   | 130.5158   | 鹿児島   |
| 沖縄美ら海水族館                   | 26.6943   | 127.8780   | 沖縄     |
| 首里城                             | 26.2173   | 127.7194   | 沖縄     |
| 古宇利大橋                         | 26.6997   | 128.0231   | 沖縄     |
| 石垣島 川平湾                      | 24.4533   | 124.1453   | 沖縄     |
| 宮古島 与那覇前浜ビーチ            | 24.7350   | 125.2658   | 沖縄     |
| 波照間島 ニシ浜                    | 24.0669   | 123.7906   | 沖縄     |

### 6.12 九州・沖縄（追加分）

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 門司港レトロ                       | 33.9447   | 130.9614   | 福岡     |
| 糸島 桜井二見ヶ浦                  | 33.5917   | 130.1864   | 福岡     |
| 高千穂峡                           | 32.7128   | 131.3022   | 宮崎     |
| 青島神社                           | 31.8019   | 131.4750   | 宮崎     |
| 黒川温泉                           | 33.0794   | 131.1428   | 熊本     |
| 軍艦島（端島）                     | 32.6275   | 129.7383   | 長崎     |
| ハウステンボス                     | 33.0856   | 129.7867   | 長崎     |
| 残波岬                             | 26.5614   | 127.9747   | 沖縄     |
| 沖縄 国際通り                      | 26.2147   | 127.6864   | 沖縄     |
| 慶良間諸島 阿嘉島                  | 26.2014   | 127.2750   | 沖縄     |

### 6.13 穴場・離島系

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 隠岐 摩天崖                        | 36.3653   | 133.0944   | 島根     |
| 利尻島 オタトマリ沼                | 45.1186   | 141.2422   | 北海道   |
| 礼文島 桃岩展望台                  | 45.3683   | 141.0286   | 北海道   |
| 小笠原 父島 大村海岸               | 27.0942   | 142.1928   | 東京     |
| 徳之島 犬田布岬                    | 27.7222   | 128.9333   | 鹿児島   |
| 奥能登 白米千枚田                  | 37.4569   | 137.1697   | 石川     |

### 6.14 グルメ・カフェ・夜景・体験系

| name                              | lat       | lng        | エリア   |
| --------------------------------- | --------- | ---------- | -------- |
| 築地場外市場                       | 35.6654   | 139.7707   | 東京     |
| 黒門市場                           | 34.6657   | 135.5067   | 大阪     |
| 二条市場                           | 43.0586   | 141.3559   | 北海道   |
| 函館 朝市                          | 41.7733   | 140.7264   | 北海道   |
| 仙台 牛タン通り                    | 38.2606   | 140.8819   | 宮城     |
| 浅草 仲見世通り                    | 35.7117   | 139.7967   | 東京     |
| 京都 錦市場                        | 35.0050   | 135.7647   | 京都     |
| 神戸 南京町                        | 34.6886   | 135.1869   | 兵庫     |
| 福岡 博多もつ鍋通り                | 33.5894   | 130.4019   | 福岡     |
| 横浜中華街                         | 35.4422   | 139.6464   | 神奈川   |

> 合計約 **120 スポット**。ルート 250 本で被らせる前提（同じスポットが 3〜5 ルートで使われる程度の自然な被り）。

### 6.15 スポット ID 採番

`s-001` から始め、上記の表の出現順で連番を振る。最終的に DB 保存時に決定論的 UUID へ変換。

---

## 7. ルート設計

### 7.1 手作り 50本（curated）

各ルートは「日数 / 主要スポット / タグ / 予算 / RouteFor / バンド（いいね・閲覧の規模感）」を一覧化。タイトルは略記、フルタイトル・description は実装時に拡張。

| #  | id    | 著者   | タイトル略                                  | 日数 | 主要スポット                                                        | タグ                          | 予算(JPY) | RouteFor | バンド |
| -- | ----- | ------ | ------------------------------------------- | ---- | ------------------------------------------------------------------- | ----------------------------- | --------- | -------- | ------ |
| 1  | r-001 | u-001  | 沖縄本島3泊4日 古宇利・美ら海・首里城        | 4    | 美ら海水族館 / 古宇利大橋 / 首里城 / 国際通り                       | 夏休み / 家族旅行 / 絶景       | 95,000    | EVERYONE | バズ   |
| 2  | r-002 | u-001  | 北海道5日間 富良野〜知床                     | 5    | ファーム富田 / 美瑛青い池 / 知床五湖 / 小樽運河                     | 夏休み / 自然 / 絶景           | 130,000   | EVERYONE | バズ   |
| 3  | r-003 | u-001  | 高尾山〜河口湖 日帰り                        | 1    | 高尾山 / 河口湖大石公園 / 富士山五合目                              | 夏休み / 絶景 / 弾丸旅行        | 8,500     | EVERYONE | バズ   |
| 4  | r-004 | u-001  | 鳥取砂丘とラクダと夕日                       | 2    | 鳥取砂丘 / 出雲大社                                                 | 自然 / 絶景 / 写真映え          | 35,000    | SOLO     | 人気   |
| 5  | r-005 | u-001  | 京都早朝散歩 観光客のいない清水寺             | 1    | 清水寺 / 祇園花見小路 / 錦市場                                      | 寺社仏閣 / 写真映え             | 12,000    | SOLO     | 人気   |
| 6  | r-006 | u-001  | 屋久島 縄文杉トレッキング                     | 2    | 屋久島縄文杉                                                        | 自然 / ハイキング / 秘境        | 65,000    | SOLO     | 人気   |
| 7  | r-007 | u-001  | 金沢2日間 兼六園・茶屋街                     | 2    | 兼六園 / ひがし茶屋街 / 近江町市場                                  | 歴史 / グルメ / カフェ           | 42,000    | EVERYONE | 人気   |
| 8  | r-008 | u-001  | 軽井沢 大人の2泊3日                          | 3    | 軽井沢旧軽井沢 / 草津温泉 / 伊香保温泉                              | 夏休み / 温泉 / カップル        | 78,000    | COUPLE   | 人気   |
| 9  | r-009 | u-001  | 高千穂峡と黒川温泉 3日間                     | 3    | 高千穂峡 / 黒川温泉 / 由布院金鱗湖                                  | 夏休み / 温泉 / 秘境            | 68,000    | EVERYONE | バズ   |
| 10 | r-010 | u-001  | 飛騨高山〜白川郷〜金沢                       | 4    | 飛騨高山 / 白川郷 / 兼六園 / ひがし茶屋街                           | 歴史 / 絶景 / 夏休み            | 88,000    | EVERYONE | 人気   |
| 11 | r-011 | u-002  | 伏見稲荷 早朝半日                            | 1    | 伏見稲荷大社 / 錦市場                                               | 寺社仏閣 / 写真映え             | 4,500     | SOLO     | 中堅   |
| 12 | r-012 | u-002  | 京都 河原町カフェ巡り                        | 1    | 錦市場 / 祇園花見小路                                               | カフェ / グルメ / 女子旅        | 7,500     | FRIENDS  | 中堅   |
| 13 | r-013 | u-002  | 奈良公園と鹿と1日                            | 1    | 奈良公園 / 東大寺 / 春日大社                                        | 寺社仏閣 / 自然 / 家族旅行       | 6,000     | EVERYONE | 中堅   |
| 14 | r-014 | u-002  | 道頓堀・黒門市場フルコース                    | 1    | 道頓堀 / 黒門市場 / 通天閣                                          | グルメ / 夏休み                  | 9,000     | FRIENDS  | 中堅   |
| 15 | r-015 | u-002  | 高野山1泊 宿坊体験                           | 2    | 高野山奥之院                                                        | 寺社仏閣 / 秘境                  | 28,000    | SOLO     | 人気   |
| 16 | r-016 | u-002  | 城崎温泉 浴衣で外湯めぐり                     | 2    | 城崎温泉 / 姫路城                                                   | 温泉 / 女子旅 / 夏休み           | 38,000    | FRIENDS  | バズ   |
| 17 | r-017 | u-002  | 嵐山と保津川下り                             | 1    | 嵐山渡月橋 / 金閣寺                                                 | 自然 / 夏休み                    | 11,000    | EVERYONE | 中堅   |
| 18 | r-018 | u-002  | 神戸 三宮〜元町〜中華街                       | 1    | 神戸メリケンパーク / 南京町 / 姫路城                                | グルメ / ショッピング            | 9,500     | FRIENDS  | 中堅   |
| 19 | r-019 | u-003  | 道東縦断 4泊5日                              | 5    | 知床五湖 / 洞爺湖 / ファーム富田 / 旭山動物園                       | 夏休み / 自然 / 家族旅行         | 145,000   | FAMILY   | 人気   |
| 20 | r-020 | u-003  | 上高地 河童橋〜明神池                        | 2    | 上高地河童橋 / 諏訪湖                                               | 自然 / ハイキング / 家族旅行     | 42,000    | FAMILY   | 中堅   |
| 21 | r-021 | u-003  | 阿蘇 草千里で乗馬体験                        | 2    | 阿蘇草千里 / 黒川温泉                                               | 自然 / 家族旅行 / 夏休み         | 55,000    | FAMILY   | 中堅   |
| 22 | r-022 | u-003  | ニセコ 夏のアクティビティ                     | 3    | ニセコ / 洞爺湖 / 登別温泉                                          | 夏休み / 自然 / 家族旅行         | 92,000    | FAMILY   | 中堅   |
| 23 | r-023 | u-003  | 立山黒部アルペンルート                       | 3    | 立山室堂平 / 黒部峡谷 / 兼六園                                      | 絶景 / ハイキング / 夏休み       | 68,000    | EVERYONE | 人気   |
| 24 | r-024 | u-004  | 別府・由布院 全室露天                        | 3    | 別府海地獄 / 由布院金鱗湖 / 黒川温泉                                | 温泉 / カップル / グルメ         | 165,000   | COUPLE   | 人気   |
| 25 | r-025 | u-004  | 宮古島 オーシャンビュー4日                    | 4    | 宮古島与那覇前浜 / 古宇利大橋                                        | カップル / 夏休み / 絶景         | 220,000   | COUPLE   | バズ   |
| 26 | r-026 | u-004  | 京都 老舗旅館ご褒美                          | 2    | 祇園花見小路 / 清水寺 / 嵐山渡月橋                                  | カップル / 温泉 / 寺社仏閣        | 110,000   | COUPLE   | 人気   |
| 27 | r-027 | u-004  | 箱根 美術館とフレンチ                        | 2    | 箱根大涌谷 / 河口湖大石公園                                          | カップル / 温泉 / アート          | 95,000    | COUPLE   | 中堅   |
| 28 | r-028 | u-004  | 軽井沢 万平ホテル泊                          | 2    | 軽井沢旧軽井沢 / 清里高原                                            | カップル / 夏休み                 | 130,000   | COUPLE   | 中堅   |
| 29 | r-029 | u-005  | 18きっぷ 東京〜京都12時間                     | 1    | 東京駅 / 清水寺                                                     | ソロ旅 / 弾丸旅行                 | 2,410     | SOLO     | 人気   |
| 30 | r-030 | u-005  | 学生ソロ沖縄 公共交通だけ                     | 4    | 国際通り / 首里城 / 美ら海水族館                                    | ソロ旅 / 夏休み                   | 35,000    | SOLO     | 中堅   |
| 31 | r-031 | u-005  | 2万円で3泊4日沖縄                            | 4    | 国際通り / 首里城                                                   | ソロ旅 / 夏休み                   | 19,800    | SOLO     | 中堅   |
| 32 | r-032 | u-006  | 福岡24時間食い倒れ                           | 1    | 博多中洲屋台 / 博多もつ鍋通り / 太宰府天満宮                         | グルメ / 夏休み                   | 12,000    | FRIENDS  | バズ   |
| 33 | r-033 | u-006  | 大阪粉もん完全制覇                            | 1    | 道頓堀 / 黒門市場 / 通天閣                                          | グルメ / 友達                     | 8,500     | FRIENDS  | 人気   |
| 34 | r-034 | u-006  | 函館 朝市と夜景                              | 2    | 函館朝市 / 函館山展望台                                             | グルメ / 夜景 / カップル          | 48,000    | EVERYONE | 中堅   |
| 35 | r-035 | u-006  | 仙台 牛タン三軒はしご                         | 1    | 仙台牛タン通り / 松島五大堂                                          | グルメ / 弾丸旅行                  | 11,000    | SOLO     | 中堅   |
| 36 | r-036 | u-006  | 名古屋めし全部入り                            | 1    | 名古屋城 / 熱田神宮                                                 | グルメ / 弾丸旅行                  | 9,500     | FRIENDS  | 中堅   |
| 37 | r-037 | u-006  | 金沢 近江町市場海鮮三昧                       | 2    | 近江町市場 / 兼六園 / ひがし茶屋街                                  | グルメ / 歴史                      | 52,000    | EVERYONE | 中堅   |
| 38 | r-038 | u-007  | 波照間島 日本最南端                          | 3    | 波照間島ニシ浜 / 石垣島川平湾                                        | 離島 / 秘境 / 夏休み              | 95,000    | SOLO     | 人気   |
| 39 | r-039 | u-007  | 利尻・礼文 花の浮島                          | 4    | 利尻島オタトマリ / 礼文島桃岩                                        | 離島 / 自然 / 夏休み              | 110,000   | EVERYONE | 中堅   |
| 40 | r-040 | u-007  | 小笠原父島 5泊6日                            | 6    | 小笠原父島大村海岸                                                  | 離島 / 秘境 / 夏休み              | 165,000   | SOLO     | 中堅   |
| 41 | r-041 | u-007  | 隠岐諸島4島めぐり                            | 4    | 隠岐摩天崖 / 出雲大社                                               | 離島 / 秘境 / 絶景                | 88,000    | EVERYONE | 中堅   |
| 42 | r-042 | u-007  | 徳之島 知られていない奄美の隣                 | 3    | 徳之島犬田布岬                                                      | 離島 / 秘境 / 夏休み              | 75,000    | SOLO     | 一般   |
| 43 | r-043 | u-008  | 子連れ沖縄 美ら海と海                        | 4    | 美ら海水族館 / 古宇利大橋 / 首里城                                  | 子連れ / 家族旅行 / 夏休み         | 145,000   | FAMILY   | バズ   |
| 44 | r-044 | u-008  | 富士山五合目と河口湖                         | 2    | 富士山五合目 / 河口湖大石公園                                        | 子連れ / 夏休み / 絶景             | 38,000    | FAMILY   | 中堅   |
| 45 | r-045 | u-008  | 軽井沢おもちゃ王国と草津                     | 3    | 軽井沢旧軽井沢 / 草津温泉                                            | 子連れ / 家族旅行 / 温泉           | 88,000    | FAMILY   | 中堅   |
| 46 | r-046 | u-008  | ハウステンボス長崎2泊                         | 3    | ハウステンボス / 軍艦島 / 門司港レトロ                               | 子連れ / 家族旅行 / 夏休み         | 95,000    | FAMILY   | 中堅   |
| 47 | r-047 | u-009  | 美瑛 青い池1泊                               | 2    | 美瑛青い池 / ファーム富田                                            | 写真映え / 絶景 / 夏休み           | 42,000    | SOLO     | 人気   |
| 48 | r-048 | u-009  | 上高地 朝霧の河童橋                          | 2    | 上高地河童橋                                                        | 写真映え / 自然 / 絶景             | 38,000    | SOLO     | 中堅   |
| 49 | r-049 | u-009  | 角島大橋〜元乃隅神社                          | 1    | 角島大橋 / 萩城下町                                                 | 写真映え / 絶景 / 弾丸旅行         | 8,500     | SOLO     | 中堅   |
| 50 | r-050 | u-009  | 高千穂峡マジックアワー                        | 3    | 高千穂峡 / 青島神社                                                 | 写真映え / 絶景 / 秘境             | 65,000    | SOLO     | 人気   |

#### 手作り 50本のフルタイトル参照

実装時の正式タイトル一覧（略記から拡張するための参照）:

**u-001 たびまる（10本）**

1. 【夏休み完全版】沖縄本島3泊4日 古宇利島・美ら海・首里城をぜんぶ回る黄金ルート
2. 大人の北海道5日間 富良野ラベンダー〜知床秘境クルーズ
3. 【弾丸】東京から日帰りで行ける夏の絶景 高尾山〜河口湖の1日
4. 47都道府県制覇の旅 #38 鳥取砂丘とラクダと夕日と
5. 京都 真夏の早朝散歩 観光客のいない清水寺と祇園
6. 屋久島 縄文杉トレッキング 1泊2日（体力に自信ある人向け）
7. 【保存版】はじめての金沢2日間 兼六園・ひがし茶屋街・近江町市場
8. 軽井沢で避暑 アウトレットだけじゃない大人の2泊3日
9. 高千穂峡と黒川温泉 九州の山奥で過ごす夏休み3日間
10. 飛騨高山〜白川郷〜金沢 北陸縦断 王道の3泊4日

**u-002 sakura_trip（8本）**

1. 京都 早朝の伏見稲荷で千本鳥居を独り占め 半日プラン
2. カフェ巡り好きが厳選 京都 河原町〜二条城エリアの隠れ家10軒
3. 奈良公園で鹿と過ごす1日 ならまちカフェも忘れずに
4. 大阪 朝食〜夜まで食べ続ける道頓堀・黒門市場フルコース
5. 高野山1泊 宿坊で精進料理と朝のお勤め体験
6. 城崎温泉で外湯めぐり 浴衣で歩く2日間
7. 京都 嵐山から保津川下り 涼を求める夏の半日
8. 神戸 三宮〜元町〜中華街 港町をのんびり歩く

**u-003 kenji_outdoor（5本）**

1. キャンピングカーで道東縦断 知床〜摩周湖〜釧路湿原 4泊5日
2. 上高地 河童橋から明神池 家族で歩く穂高の麓
3. 阿蘇 草千里で乗馬体験と火口見学 1泊2日
4. 北海道ニセコ 夏のアクティビティ天国 2泊3日
5. 富山〜立山黒部アルペンルート 標高2450mの夏

**u-004 mio_couple（5本）**

1. 結婚記念日に行った別府・由布院 2泊3日 全室露天付き旅館だけ
2. ハワイより安い夏の宮古島 オーシャンビューホテル4日間
3. 京都 老舗旅館で過ごす大人のご褒美 1泊2日
4. 箱根 強羅〜大涌谷 美術館とフレンチと温泉
5. 軽井沢 万平ホテル泊 ジョン・レノンが愛した避暑地

**u-005 hayato_solo（3本）**

1. 青春18きっぷで行く 東京から京都まで普通列車だけの12時間
2. ヒッチハイクは禁止 学生ソロ旅 沖縄那覇〜本部 公共交通だけで
3. 大学生の節約沖縄 2万円で3泊4日チャレンジ

**u-006 gourmet_aki（6本）**

1. 福岡 24時間食い倒れ もつ鍋・ラーメン・水炊き・屋台フルコース
2. 大阪 粉もん完全制覇 たこ焼き・お好み焼き・串カツ食べ歩き
3. 函館 朝市で海鮮丼 夜は夜景と回転寿司の1日
4. 仙台 牛タン三軒はしご 利久・喜助・伊達の牛たんを比較
5. 名古屋めし全部入り ひつまぶし・味噌煮込み・手羽先・天むす
6. 金沢 近江町市場で海鮮三昧と治部煮の老舗

**u-007 island_hopper（5本）**

1. 波照間島 日本最南端で見る星空 2泊3日 ハテルマブルーに会いに
2. 利尻・礼文 花の浮島めぐり 3泊4日 6月〜8月限定の花畑
3. 小笠原父島 25時間半フェリーで行く東京の楽園 5泊6日
4. 隠岐諸島 4島めぐり ローソク岩と摩天崖の3泊4日
5. 徳之島 まだ知られていない奄美の隣 2泊3日

**u-008 natsu_family（4本）**

1. 子連れ沖縄 美ら海水族館とビーチで遊ぶ3泊4日
2. 夏休みの自由研究にもなる 富士山五合目と河口湖1泊
3. 軽井沢おもちゃ王国と草津温泉 子連れ2泊3日
4. ハウステンボスで子供大はしゃぎ 長崎2泊3日

**u-009 photo_yuki（4本）**

1. 美瑛 青い池と白金温泉 早朝の光を求めて1泊
2. 上高地 朝霧の河童橋を撮る 1泊2日のフォトトリップ
3. 角島大橋〜元乃隅神社 山口の絶景を1日で
4. 高千穂峡 ボートと滝のマジックアワー 2泊3日

### 7.2 バズ枠の確定（8本）

当初 5 本想定だったが、500 いいね前後で頭打ちにする現実性の調整で 8 本に拡大。

| #     | タイトル略                                  | 想定いいね | 想定閲覧 |
| ----- | ------------------------------------------- | ---------- | -------- |
| r-001 | 沖縄本島3泊4日                              | 480        | 9,200    |
| r-002 | 北海道5日間                                  | 410        | 8,500    |
| r-003 | 高尾山〜河口湖日帰り                         | 360        | 7,800    |
| r-009 | 高千穂峡と黒川温泉                          | 290        | 5,200    |
| r-016 | 城崎温泉 浴衣で外湯（u-002発、トップ女子旅枠） | 250        | 4,800    |
| r-025 | 宮古島オーシャンビュー（u-004）              | 240        | 4,500    |
| r-032 | 福岡24時間食い倒れ（u-006）                  | 220        | 4,200    |
| r-043 | 子連れ沖縄（u-008）                          | 210        | 3,900    |

### 7.3 準手作り 100本（semi）

「テンプレート方式」で生成する。

#### タイトルテンプレ（10種ローテ）

1. `{エリア}{日数}日間 {テーマ}を満喫`
2. `はじめての{エリア} {日数}日でまわるおすすめスポット`
3. `{エリア}で過ごす夏休み {同行者}向け`
4. `{エリア} {テーマ}と{テーマ}の{日数}日間`
5. `週末{エリア} {日数}日{ノード数}スポット弾丸ルート`
6. `{エリア}の{季節形容}を楽しむ{日数}日間`
7. `{エリア} 王道コース{日数}日`
8. `穴場の{エリア} 知る人ぞ知る{日数}日`
9. `{エリア}グルメ旅 {日数}日{食事数}食`
10. `{エリア}{日数}日 ローカル目線で巡る`

#### description テンプレ（5パターン、各 300〜500字）

- **テンプレ A**: 旅のきっかけ → 各日の概要 → おすすめポイント → まとめ
- **テンプレ B**: 結論先行（このルートはこういう人向け） → ハイライト3つ → 注意点
- **テンプレ C**: 時系列日記風
- **テンプレ D**: Q&A 形式（こんな疑問ありませんか？）
- **テンプレ E**: 箇条書き的にスポットの感想

#### 組み合わせルール

- **エリアプール（8 エリア）**: 関東 / 関西 / 北海道 / 東北 / 中部 / 中国・四国 / 九州 / 沖縄
- 各エリア **約 12〜13 本**
- 各ペルソナの「準手作り」配分（4.4 節の表）を満たすよう、エリア × ペルソナ × タグの組み合わせを設計
- description のテンプレ展開は **事前計算して固定値** で出力（実行時関数生成は禁止）

### 7.4 量産 100本（generated）

「ページング・検索のスケールテスト用」。quality より quantity 優先。

#### 生成ルール

| 項目         | ルール                                                                                  |
| ------------ | --------------------------------------------------------------------------------------- |
| タイトル     | `{エリア}{日数}日間の旅 #{連番}` 形式                                                   |
| description  | 80〜150字の短文。3〜5パターンの定型から選択。例: `"{エリア}を{日数}日間で巡るルート。{ハイライトスポット}を中心に組み立てました。{同行者形容}におすすめです。"` |
| タグ         | ランダムに 2〜3 個（テーマ系から 1 個必須）                                               |
| スポット     | 該当エリアのスポットからランダムに 3〜5 個選択                                           |
| TransitStep  | 90% は `WALK` 単発、10% で `TRAIN` / `CAR` 混合                                        |
| 予算         | `日数 × 15,000〜30,000円` のランダム                                                    |
| いいね       | 0〜10 個（一般 or 無名バンド）                                                          |
| 閲覧         | いいねの 5〜20 倍                                                                       |

> 量産ゾーンも、最終的な seed データファイルでは **固定値として出力**（再現性のため）。生成ロジックは `generated.ts` 内に `seed`（乱数固定）付きで持ち、`tsx scripts/...` で1回実行 → 結果を吐き出す形。

### 7.5 共通分布

#### 7.5.1 日数分布

| 日数            | 比率 | 目安本数 |
| --------------- | ---- | -------- |
| 1日（日帰り）   | 30%  | 75本     |
| 2日             | 35%  | 87本     |
| 3日             | 20%  | 50本     |
| 4日             | 10%  | 25本     |
| 5日以上         | 5%   | 13本（最大8日） |

#### 7.5.2 ノード数

各日 **3〜5ノード** が基本。ただし以下のエッジケースを混ぜる:

- 1日のみ・1ノードのみのルート（最小構成）: **1本**
- 1日5ノード超え（〜8ノード）の弾丸ルート: **5本**
- 平均は 1日 4ノード

#### 7.5.3 TransitMode 分布

`WALK` が最も多く、次に `TRAIN`。`FLIGHT` / `SHIP` は離島ルートに集中。

| Mode    | 使用頻度 | 主な使い手                        |
| ------- | -------- | --------------------------------- |
| WALK    | 50%      | 全員（ノード間徒歩）              |
| TRAIN   | 25%      | hayato_solo / 都市部ルート         |
| CAR     | 12%      | kenji_outdoor / natsu_family      |
| BUS     | 5%       | 観光地内移動                      |
| FLIGHT  | 4%       | island_hopper / 沖縄ルート        |
| SHIP    | 2%       | island_hopper（離島フェリー）     |
| BIKE    | 1%       | サイクリングルート（しまなみ等）   |
| OTHER   | 1%       | ロープウェイ・ケーブルカー等       |

#### 7.5.4 予算分布

| 予算帯                | 比率 | 想定                                     |
| --------------------- | ---- | ---------------------------------------- |
| 0円（予算なし=null）  | 8%   | エッジケース、お金の話したくない投稿     |
| 0円（amount=0）       | 2%   | 「無料で楽しめる旅」枠                   |
| 1〜10,000円           | 15%  | hayato_solo の青春18きっぷ系             |
| 10,001〜30,000円      | 25%  | 1泊2日標準                               |
| 30,001〜80,000円      | 30%  | 2〜3泊スタンダード                        |
| 80,001〜200,000円     | 15%  | mio_couple の高級ステイ                  |
| 200,001円〜           | 5%   | 長期旅行・ハネムーン枠                    |

通貨はすべて JPY（外国通貨は混ぜない）。

#### 7.5.5 RouteFor 配分

| RouteFor | 比率 | 主な使い手                            |
| -------- | ---- | ------------------------------------- |
| EVERYONE | 40%  | デフォルト・無難な投稿                |
| SOLO     | 20%  | hayato_solo / 一部のたびまる           |
| COUPLE   | 15%  | mio_couple                            |
| FAMILY   | 15%  | natsu_family / kenji_outdoor          |
| FRIENDS  | 10%  | 学生・若手                            |

#### 7.5.6 Visibility 配分

| visibility | 本数        | 比率 | 内訳                                                    |
| ---------- | ----------- | ---- | ------------------------------------------------------- |
| PUBLIC     | 230本       | 92%  |                                                         |
| PRIVATE    | 20本        | 8%   | 主に u-012（5本）+ 各ペルソナの「下書き的なPRIVATE」を1本ずつ |

#### 7.5.7 いいね・閲覧の分布（べき乗則）

| バンド | 本数 | いいね数範囲 | 閲覧数範囲     |
| ------ | ---- | ------------ | -------------- |
| バズ   | 5    | 200〜500     | 3,000〜10,000  |
| 人気   | 20   | 50〜200      | 800〜3,000     |
| 中堅   | 60   | 10〜50       | 200〜800       |
| 一般   | 130  | 1〜10        | 30〜200        |
| 無名   | 35   | 0            | 0〜30          |

> バズ 5 本は実際には 8 本に拡張（7.2 節の表参照）。インフルエンサー u-001 に集中させる（4本）+ sakura_trip / mio_couple / gourmet_aki / natsu_family にバズ枠を持たせる。

### 7.6 createdAt と date のズレ

| 項目                  | ルール                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| `Route.date`（旅行日） | 過去 2 年以内にランダム分散。**夏休み旅行は 7〜8 月に 40% 集中**             |
| `Route.createdAt`（投稿日） | 旅行日の **0〜90 日後** にランダム配置                                |
| 例外（10%）            | 「事前計画として旅行前に投稿」パターン: `createdAt < date`（旅行日の方が後） |

これにより、「最新投稿フィード」と「旅行日順ソート」で異なる結果が見える状態を実現する。

---

## 8. ソーシャルグラフ

### 8.1 フォロー関係

合計 **33ユーザー**（コア13 + モブ20）。総 Follow レコード数は約 **220件**。

#### ユーザー別フォロー設計

| ユーザー                          | フォロワー数 | フォロー数 | 備考                                            |
| --------------------------------- | ------------ | ---------- | ----------------------------------------------- |
| u-001 たびまる                    | **32人**     | 5人        | 自分以外全員からフォローされる。フォロー先は u-002, u-003, u-006, u-007, u-009 |
| u-002 sakura_trip                 | 25人         | 8人        |                                                 |
| u-003 kenji_outdoor               | 18〜22人     | 6〜10人    |                                                 |
| u-004 mio_couple                  | 16人         | 6人        |                                                 |
| u-005 hayato_solo                 | 8人          | 12人       | ROM 専寄り、見る方が多い                        |
| u-006 gourmet_aki                 | 18〜22人     | 6〜10人    |                                                 |
| u-007 island_hopper               | 12人         | 3人        | 島好きだけがフォロー                            |
| u-008 natsu_family                | 14人         | 5人        |                                                 |
| u-009 photo_yuki                  | 18〜22人     | 6〜10人    |                                                 |
| u-010 newbie_haru                 | 2人          | 4人        | 新規ユーザー枠                                  |
| u-011 quiet_user                  | **0人**      | **0人**    | エッジケース（空状態UI）                         |
| u-012 private_only                | 1人          | 1人        | u-013 とのみ相互                                |
| u-013 longbio_chan                | 6人          | 8人        |                                                 |
| mob-001 〜 mob-010                | 各 2〜5人    | 各 8〜15人 | u-001 必ずフォロー + ランダム                    |
| mob-011 〜 mob-020                | 各 0〜2人    | 各 5〜12人 | u-001 必ずフォロー + ランダム                    |

#### 集計確認

- **総 Follow レコード数**: 約 220 件
- **u-001 のフォロワー数**: 32（最大、二桁表示UI 確認可能）
- **u-011 quiet_user**: フォロワー・フォロー共に 0（空状態 UI 確認）
- **u-012 ⇄ u-013**: 相互フォロー（1ペア）

> 詳細マトリクス（33 × 33）は仕様書では持たず、`socialGraph.ts` で `[followerId, followingId]` のタプル配列として持つ。

### 8.2 いいね分布

#### 8.2.1 ルート対象いいね（target = ROUTE）

合計 **約 2,500 件**。バンド別の本数 × 上限の積算で算出。

| バンド | 本数 | いいね合計レンジ           |
| ------ | ---- | -------------------------- |
| バズ   | 8    | 200〜500 × 8 = 約 2,000上限 |
| 人気   | 20   | 50〜200 × 20 = 約 1,500上限 |
| 中堅   | 60   | 10〜50 × 60 = 約 1,500上限  |
| 一般   | 130  | 1〜10 × 130 = 約 600上限    |
| 無名   | 35   | 0                          |

> 上記は理論上限。実際は分布の中心値を使い、合計が **約 2,500 件** に収まるよう調整する。

#### 8.2.2 コメント対象いいね（target = COMMENT）

- 合計 **約 135 件**（コメント全体の **30%** にいいねが付く想定）
- 著者返信コメント（c-003, c-006, c-016, c-019）: 平均 5〜10 いいね
- 共感系（c-008, c-010）: 平均 3〜8 いいね
- 質問系・スパム系: 0〜2 いいね

#### 8.2.3 いいねの付け手

- バズ・人気ルートにはモブユーザー全員 + 関連ペルソナがいいね
- 一般・中堅にはモブの一部とペルソナの一部
- いいね相手は **ランダムだが固定 seed で決定論的に**（再現性のため）

### 8.3 閲覧数（View）

ルートごとの View レコード数 = **いいね数の 5〜20 倍**。

| バンド | 閲覧数範囲     |
| ------ | -------------- |
| バズ   | 3,000〜10,000  |
| 人気   | 800〜3,000     |
| 中堅   | 200〜800       |
| 一般   | 30〜200        |
| 無名   | 0〜30          |

合計 View レコード数は **数十万件規模**。`userId` は半数を `null`（匿名閲覧）として混ぜる。

> View は `@@unique` 制約がないので同一ユーザーから複数行入って良い（カウント用）。

---

## 9. コメント設計

### 9.1 量

| 項目                  | 値                                                       |
| --------------------- | -------------------------------------------------------- |
| コメントが付くルート数 | 全 250 本中 **170 本（70%）**                           |
| バズルート             | 5〜15 件                                                  |
| 人気ルート             | 3〜5 件                                                   |
| 中堅ルート             | 1〜2 件                                                   |
| 一般ルート             | 0〜1 件                                                   |
| 無名ルート             | 0 件                                                      |
| **合計コメント数**     | **約 450 件**                                            |

### 9.2 サンプル 20 件

| #     | ルート              | 投稿者               | テキスト                                                                                                          | 用途                              |
| ----- | ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| c-001 | r-001 沖縄本島       | u-002 sakura_trip    | 古宇利大橋の写真がきれいすぎて保存しました！次の沖縄旅の参考にします🌺                                              | 一般的な感想                      |
| c-002 | r-001               | u-008 natsu_family   | 子連れでも回れますか？うちは小学生2人なので参考にしたいです                                                        | 質問                              |
| c-003 | r-001               | u-001 たびまる       | @natsu_family さん、美ら海と古宇利は子連れでも全然大丈夫ですよ！首里城は階段多いので午前中の元気なうちに行くといいです👍 | 著者の返信                        |
| c-004 | r-001               | mob-003              | 今度の夏休みここ行きます！保存しました                                                                            | 短い保存系                        |
| c-005 | r-002 北海道5日      | u-009 photo_yuki     | 富良野のラベンダー、ベストな時期はいつ頃でしょうか？                                                              | 質問                              |
| c-006 | r-002               | u-001                | @photo_yuki 7月中旬〜下旬がピークです！朝の光で撮るのがおすすめ📸                                                   | 著者返信                          |
| c-007 | r-003 高尾山日帰り   | u-005 hayato_solo    | これ予算8500円って本当ですか？学生なので助かります                                                                | 検証系質問                        |
| c-008 | r-005 京都早朝       | u-002                | 早朝の清水寺、私もよく行きます！観光客いない時間帯の京都は別世界ですよね                                          | 共感                              |
| c-009 | r-006 屋久島         | mob-007              | 縄文杉までの往復10時間、体力ない私には無理そう…でもいつか挑戦したいです                                            | 弱気な憧れ                        |
| c-010 | r-016 城崎温泉       | u-013 longbio_chan   | 城崎、私も先月行ってきました！外湯7つ全部回りましたよ。浴衣レンタルが宿で無料だったの最高でした                    | 体験共有                          |
| c-011 | r-016               | mob-002              | 浴衣で歩く街、雰囲気あって素敵すぎる                                                                              | 短い感想                          |
| c-012 | r-024 別府由布院     | u-004 mio_couple     | この記事、夫に見せたら「ここ予約しよ」って即決でした😂結婚記念日に行ってきます！                                   | 行動につながった系                |
| c-013 | r-025 宮古島         | u-007 island_hopper  | 与那覇前浜は本当に日本一のビーチだと思います。引き潮の時間に行くと砂浜が広がって特に綺麗ですよ                    | 補足情報                          |
| c-014 | r-029 18きっぷ       | mob-011              | 12時間は流石に無理です…笑 でもチャレンジ精神すごい                                                                | ツッコミ系                        |
| c-015 | r-032 福岡食い倒れ   | u-002                | 4軒目で挫折しそう（笑）でも美味しそうすぎる                                                                       | カジュアル                        |
| c-016 | r-032               | u-006 gourmet_aki    | @sakura_trip 私も初日は3軒で限界でした😭2日に分けるの推奨です                                                       | 著者返信                          |
| c-017 | r-038 波照間島       | mob-005              | 日本最南端、行ってみたい場所No.1です                                                                              | 憧れ                              |
| c-018 | r-043 子連れ沖縄     | mob-009              | 来月家族で行きます！このルート参考にさせてもらいますね、ありがとうございます🙏                                     | 感謝                              |
| c-019 | r-043               | u-008                | @mob-009 楽しんできてください！美ら海は午前の早い時間がおすすめです🐠                                              | 著者返信                          |
| c-020 | r-047 美瑛青い池     | mob-001              | 写真きれい…                                                                                                       | スパムっぽい超短文（モデレーション確認用） |

### 9.3 著者返信、コメントへのいいね、スパムコメント

#### 著者返信パターン

- 著者返信コメント: `c-003`, `c-006`, `c-016`, `c-019` の 4 種
- パターン: `@xxx ` で始まり、質問・感謝への回答、現地情報の補足、絵文字 1 個程度
- 著者返信は元コメントの **数日以内** に投稿される（createdAt の差を 1〜7 日で表現）

#### コメントへのいいね（Like target=COMMENT）

- コメント全体の **30%（約 135 件）** にいいね
- 著者返信コメントには平均 **5〜10 いいね**
- 共感系コメントには平均 **3〜8 いいね**
- 質問系・スパム系は **0〜2 いいね**

#### スパムコメント（モデレーション UI 確認用）

- `c-020` の「写真きれい…」のような **超短文** を最低 1 件入れる
- スパムフィルタ実装時の確認用（実装はまだ無いが seed 段階で混ぜておく）

### 9.4 コメント ID と採番

`c-001` 形式の人間可読プレフィックス。サンプル 20 件以外は `c-021` 以降を機械的に振る（バンドごとの分布に従って）。最終的に DB 保存時に決定論的 UUID へ変換。

---

## 10. エッジケース仕様

UI のあらゆる「境界状態」を網羅するため、以下を最低 1 個ずつ仕込む。

| ケース                                  | 用途                              | 対応データ                              |
| --------------------------------------- | --------------------------------- | --------------------------------------- |
| いいね 0 ・閲覧 0 のルート               | 「新着・無名」UI テスト           | 無名バンド 35本のうち先頭 5本           |
| いいね 100 超のルート                    | トレンディング UI テスト          | バズ 8本                                |
| コメント 0 のルート                      | 空状態 UI テスト                   | 全体の 30%（80本）                      |
| 1日のみ・1ノードのみのルート             | 最小構成                          | 量産ゾーンに 1本 仕込む                 |
| 5日以上の長期ルート                      | 長尺 UI テスト                     | r-002（5日）, r-019（5日）, r-040（6日）等 |
| サムネ画像なしルート                     | プレースホルダ UI テスト          | 一般・無名ゾーンの 20 本               |
| ノード画像なしルート                     | 同上                              | 量産 100本のうち 30 本                  |
| 予算なしルート（Budget=null）            | Budget optional 確認              | 全体の 8%（20本）                        |
| 予算 0 円ルート（amount=0）              | "Free trip" 表示確認              | 全体の 2%（5本）                         |
| visibility=PRIVATE ルート                | 認可テスト用                      | 各ペルソナ 1 本 + u-012 の 5 本         |
| RouteFor 全パターン網羅                  | EVERYONE/FAMILY/FRIENDS/COUPLE/SOLO 各 1 本以上 | 7.5.5 の配分で達成              |
| TransitMode 全網羅                      | WALK〜SHIP まで使われている       | 7.5.3 の分布で達成                      |
| アイコンなし・背景なしユーザー            | プロフィール UI                   | u-011 quiet_user                        |
| bio 空ユーザー                          | 同上                              | u-011 quiet_user                        |
| bio 長文（300 字超）ユーザー              | 同上                              | u-013 longbio_chan                       |
| フォロー 0 / フォロワー 0 ユーザー        | 新規ユーザー UI                   | u-011 quiet_user                        |
| 1 ノードに transitStep 3 つ（徒歩→電車→徒歩） | 複合移動 UI                  | r-029 など都市部弾丸ルートに仕込む      |
| すべての投稿が PRIVATE のユーザー         | 「投稿はあるが見えない」UI        | u-012 private_only（5本すべて PRIVATE） |
| 投稿 0 のユーザー                        | 「投稿なし」状態の UI             | u-011 quiet_user, mob-011〜020          |

---

## 11. 画像 URL 戦略

### 11.1 方針

- **Unsplash のみ使用** + `next.config.ts` に `images.unsplash.com` を追加
- すべて `Image.status = EXTERNAL`、`Image.key = null`
- DiceBear / Wikimedia / placeholder.co の併用は **しない**

### 11.2 URL 形式

```
https://images.unsplash.com/photo-{ID}?w={width}&q={quality}&auto=format
```

例:

```
https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80&auto=format
```

推奨パラメータ:

| 用途           | width | quality |
| -------------- | ----- | ------- |
| ユーザーアイコン | 256   | 80      |
| ユーザー背景    | 1600  | 80      |
| ルートサムネ    | 1200  | 80      |
| ノード写真      | 800   | 80      |

### 11.3 画像プール構成

| 用途           | 枚数 | 被りの考え方                                                |
| -------------- | ---- | ----------------------------------------------------------- |
| ユーザーアイコン | 30   | 各ユーザー固有（人物ポートレート、日本人らしさのある写真）     |
| ユーザー背景    | 20   | 被ってもよい（風景）                                          |
| ルートサムネ    | 80   | 手作り 50 本は固有 / 準手作り 100 本 + 量産 100 本で被らせる |
| ノード写真      | 100  | スポット別、スポットごとに 2〜3 枚プール                     |

合計 **約 230 枚** の固定 URL を `prisma/seedData/images.ts` に集約する。

### 11.4 キュレーションのアプローチ

- 信頼できる Unsplash 写真 ID（人気タグ付きで消えにくいもの）を選定
- 日本の地名・スポット名で検索したベストな写真を割り当て
- ユーザーアイコン用は `portrait japanese asian person` 系から日本人らしさのある写真を選定
- 写真 ID の実在確認は **後続タスク側で軽く確認**（仕様書段階では不要）

### 11.5 エッジケース画像（11.3 のプールから外れる）

| 対象                              | 扱い                                |
| --------------------------------- | ----------------------------------- |
| u-011 quiet_user                  | アイコン・背景ともに `null`         |
| u-013 longbio_chan                | アイコンあり・背景なし              |
| mob-011 〜 mob-020 の半分          | アイコンなし                        |
| 一般枠ルート 20 本               | サムネなし                          |
| 量産 100 本のうち 30 本           | ノード写真なし                      |

これでプレースホルダ UI のテストが可能。

### 11.6 next.config.ts への追加

```ts
{
  protocol: 'https',
  hostname: 'images.unsplash.com',
}
```

これだけでよい（`api.dicebear.com`, `upload.wikimedia.org` 等は **不要**）。

---

## 12. ファイル別生成要件

最終的に `prisma/seedData/` 配下に以下のファイル群を生成する。各ファイルは「純粋データのみ」で、ロジック（upsert 呼び出し等）は `prisma/seed.ts` 側に置く。

### 12.1 ディレクトリ構成

```
prisma/
├── seed.ts                      # 既存。データを import して upsert する責務
└── seedData/
    ├── types.ts                 # 中間型・ID 変換ヘルパ
    ├── tags.ts                  # 25 タグ
    ├── spots.ts                 # 約 120 スポット（UUID + 座標）
    ├── images.ts                # 約 230 枚の Unsplash URL 辞書
    ├── users.ts                 # 33 ユーザー定義（アイコン・背景の image key も持つ）
    ├── routes/
    │   ├── curated.ts           # 手作り 50 本（フル定義）
    │   ├── semi.ts              # 準手作り 100 本（テンプレ展開済み）
    │   └── generated.ts         # 量産 100 本（生成結果を固定値で出力）
    ├── socialGraph.ts           # フォロー約 220 + ルートいいね約 2,500 + コメントいいね約 135
    │                            # + コメント約 450 + 閲覧数（数十万）
    └── index.ts                 # 全部をまとめて re-export
```

### 12.2 各ファイルの export 仕様

#### `types.ts`

```ts
// 人間可読 ID から決定論的 UUID への変換
export function toUuid(prefix: string, key: string): string;

// 中間型（必要に応じて）
export type SeedTag = { key: string; name: string };
export type SeedSpot = { key: string; name: string; latitude: number; longitude: number };
export type SeedImage = { key: string; url: string; type: ImageType };
export type SeedUser = {
  key: string;             // "u-001" / "mob-005"
  name: string;
  email: string;
  bio: string;
  age: number | null;
  iconKey: string | null;       // images の key を参照
  backgroundKey: string | null;
};
export type SeedTransitStep = {
  mode: TransitMode;
  duration: number | null;
  distance: number | null;
  memo: string | null;
  order: number;
};
export type SeedRouteNode = {
  order: number;
  spotKey: string;
  details: string | null;
  imageKeys: string[];          // ノード写真の image key 配列
  transitSteps: SeedTransitStep[];
};
export type SeedRouteDate = {
  day: number;
  nodes: SeedRouteNode[];
};
export type SeedRoute = {
  key: string;                  // "r-001"
  authorKey: string;            // "u-001"
  title: string;
  description: string;
  date: string;                 // ISO8601
  createdAt: string;            // ISO8601
  routeFor: RouteFor;
  visibility: RouteVisibility;
  tagKeys: string[];
  budget: { amount: number; currency: 'JPY' } | null;
  thumbnailKey: string | null;
  routeDates: SeedRouteDate[];
  // 集計目標（seed 投入時に like/view を生成するための指示）
  targetLikes: number;
  targetViews: number;
};
export type SeedFollow = { followerKey: string; followingKey: string };
export type SeedComment = {
  key: string;                  // "c-001"
  routeKey: string;
  authorKey: string;
  text: string;
  createdAt: string;            // ISO8601
  targetLikes: number;
};
```

#### `tags.ts`

```ts
export const tags: SeedTag[];  // 長さ 25
```

#### `spots.ts`

```ts
export const spots: SeedSpot[];  // 長さ 約 120
```

#### `images.ts`

```ts
// 用途別の画像プール
export const userIcons: SeedImage[];      // 30
export const userBackgrounds: SeedImage[]; // 20
export const routeThumbnails: SeedImage[]; // 80
export const nodeImages: SeedImage[];      // 100

// すべてのフラットなリスト（upsert 用）
export const allImages: SeedImage[];
```

#### `users.ts`

```ts
export const coreUsers: SeedUser[];   // 10
export const edgeUsers: SeedUser[];   // 3
export const mobUsers: SeedUser[];    // 20
export const allUsers: SeedUser[];    // 33
```

#### `routes/curated.ts`

```ts
export const curatedRoutes: SeedRoute[];  // 50
```

#### `routes/semi.ts`

```ts
export const semiRoutes: SeedRoute[];     // 100
```

#### `routes/generated.ts`

```ts
export const generatedRoutes: SeedRoute[]; // 100、固定値
```

#### `socialGraph.ts`

```ts
export const follows: SeedFollow[];                        // 約 220
export const comments: SeedComment[];                      // 約 450
// いいねは「どのユーザーがどのルートにいいねしたか」を決定論的に列挙
export const routeLikes: { userKey: string; routeKey: string }[];  // 約 2,500
export const commentLikes: { userKey: string; commentKey: string }[]; // 約 135
// 閲覧は集計のみ持ち、seed.ts 側で日付ばらつきを与えて View レコードを量産
export const viewCounts: { routeKey: string; count: number; loggedInRatio: number }[];
```

#### `index.ts`

```ts
export * from './types';
export * from './tags';
export * from './spots';
export * from './images';
export * from './users';
export * from './routes/curated';
export * from './routes/semi';
export * from './routes/generated';
export * from './socialGraph';

// 利便性のための統合 export
export const allRoutes: SeedRoute[]; // curated + semi + generated
```

---

## 13. 出力ルール（後続タスク向け）

- 各 `.ts` ファイルは **純粋データのみ**。Prisma クライアント呼び出し・upsert ロジックは含めない（それは `prisma/seed.ts` 側）
- Prisma の型を直接使ってよい（`Prisma.UserCreateInput` など）。複雑な部分は中間型（12.2 の `SeedRoute` 等）を `types.ts` で定義する
- すべての文字列・description は **自然な日本語**。ChatGPT 直訳調・機械的な定型文の繰り返しは避ける
- description のテンプレ展開は **事前計算して固定値で出力**（実行時関数生成は禁止 = 再現性のため）
- 量産ゾーン（`generated.ts`）も、最終的にはデータが **固定値として吐かれている状態**（生成ロジックは別 script で1回実行 → 結果をハードコード）
- 日本語コメントを TS ファイル先頭に1段落入れて、そのファイルが何を表すかを明示する
- ID は人間可読プレフィックス（`u-001`, `r-001`, `s-001`, `c-001`, `tag-001`, `mob-001`, `img-001` 等）を **キー** として持ち、DB 保存時に `toUuid()` で決定論的 UUID に変換する
- すべての `createdAt` / `date` は ISO8601 文字列（`'2024-08-15T10:30:00Z'` 形式）。`new Date()` の動的呼び出しは禁止
- emoji は description / bio / コメントで自然な範囲で使う（多用しすぎない）

### 13.1 prefix 命名規則（`toUuid()` 第1引数の固定表）

`toUuid(prefix, key)` の `prefix` 引数は、後続のすべてのファイルで **同一エンティティに対して必ず同じ値** を渡すこと。ブレると別 UUID が生成され FK 違反になる。

| エンティティ        | key prefix     | `toUuid` 第1引数 | 備考                                                                                  |
| ------------------- | -------------- | ----------------- | ------------------------------------------------------------------------------------- |
| **User**            | `u-` / `mob-`  | （使用しない）    | 🚨 Supabase Auth が UUID を発行するため `toUuid` では生成しない                        |
| **Tag**             | `tag-`         | （使用しない）    | `Tag.name` が `@unique` のため UUID 不要、name で `upsert`                              |
| **Spot**            | `s-`           | `'spot'`          | 例: `toUuid('spot', 's-013')`                                                         |
| **Image**           | `img-`         | `'image'`         | 例: `toUuid('image', 'img-icon-007')`                                                 |
| **Route**           | `r-`           | `'route'`         | 例: `toUuid('route', 'r-042')`                                                        |
| **RouteDate**       | （key 持たず） | `'routeDate'`     | 合成キー `${routeKey}:${day}`。例: `toUuid('routeDate', 'r-001:2')`                    |
| **RouteNode**       | （key 持たず） | `'routeNode'`     | 合成キー `${routeKey}:${day}:${order}`。例: `toUuid('routeNode', 'r-001:2:3')`         |
| **TransitStep**     | （key 持たず） | `'transitStep'`   | 合成キー `${routeKey}:${day}:${nodeOrder}:${stepOrder}`                                |
| **Comment**         | `c-`           | `'comment'`       | 例: `toUuid('comment', 'c-007')`                                                      |
| **Follow**          | （key 持たず） | `'follow'`        | 合成キー `${followerKey}>${followingKey}`                                              |
| **Like (route)**    | （key 持たず） | `'likeRoute'`     | 合成キー `${userKey}@${routeKey}`                                                     |
| **Like (comment)**  | （key 持たず） | `'likeComment'`   | 合成キー `${userKey}@${commentKey}`                                                   |
| **View**            | （key 持たず） | `'view'`          | 大量行のため、index 連番付きキー `${routeKey}#${i}` を使う                              |
| **Budget**          | （key 持たず） | （使用しない）    | `Budget.routeId` が PK なので Route の UUID をそのまま再利用                            |
| **RouteCollaborator** / **RouteInvite** | – | – | 本シードでは投入しない（`collaboratorPolicy: DISABLED` 統一のため）                |

### 13.2 運用ルール（後続セッションが必ず守ること）

1. **User の UUID は `toUuid` 禁止**
   - 実行時に Supabase Auth が返す UUID を `Map<userKey, supabaseAuthUserId>` で管理し、以降の `Route.authorId` / `Follow` / `Like` / `Comment` / `View` の参照はすべてこの Map から引く。
   - `users.ts` 自体は `id` を持たず、`SeedUser.key` のみで識別する。

2. **prefix 文字列の固定**
   - 上表の `toUuid` 第1引数は厳守。`toUuid('route', ...)` と `toUuid('r', ...)` のようにブレると別 UUID になり FK 違反を起こす。
   - 後続セッションが新しいエンティティを追加する場合は、本表に列を追加してから使う。

3. **合成キーの区切り文字**
   - `:` — 階層構造（RouteDate / RouteNode / TransitStep）
   - `>` — フォロー方向（follower → following）
   - `@` — いいねの主従（user → target）
   - `#` — ビュー連番
   - 上記 4 種は **被らせないこと**（grep しやすさを担保）。

4. **upsert の `where` 句**
   - **Tag**: `where: { name }`
   - **その他全エンティティ**: `where: { id: toUuid(prefix, key) }`
   - User は Supabase Auth の `listUsers` から email で既存判定（既存 `ensureAuthUser` ヘルパが行う）。

---

## 14. 後続タスクの想定順序

依存関係順に、1 タスク = 1 〜 2 ファイル単位で進める。各タスクは独立した Claude セッションで完結できるよう設計する。

| #  | 生成物                                  | 想定行数      | 依存                              |
| -- | --------------------------------------- | ------------- | --------------------------------- |
| 1  | `types.ts` + `tags.ts` + `spots.ts`     | 軽量（合計約 700 行） | なし                              |
| 2  | `images.ts`                             | 中（約 500 行）        | なし                              |
| 3  | `users.ts`                              | 中（約 400 行）        | `images.ts`（image key を参照）    |
| 4  | `routes/curated.ts` 前半（r-001〜r-025） | 重（約 1,500 行）      | users / tags / spots / images     |
| 5  | `routes/curated.ts` 後半（r-026〜r-050） | 重（約 1,500 行）      | 同上                              |
| 6  | `routes/semi.ts`                        | 重（約 2,000 行、必要なら分割） | 同上                       |
| 7  | `routes/generated.ts`                   | 中（約 1,500 行、固定値出力） | 同上                          |
| 8  | `socialGraph.ts`                        | 重（約 1,500 行）       | users / routes（全種別）           |
| 9  | `index.ts` + `prisma/seed.ts` 差分      | 軽量                    | 全部                              |

**合計 9 タスク**。各タスクは独立 Claude セッションで完結でき、本仕様書（`docs/seed-spec.md`）と必要な依存ファイルを参照すればよい。

> 各タスクの開始時に「`docs/seed-spec.md` の Section X を見て、prisma/seedData/yyy.ts を作って」と指示する想定。
