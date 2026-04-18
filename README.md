@next-project-basis 

**使用方法**
**この右上のuse Templateボタンを押して、このリポジトリをtemplateとして利用すること。**

Next.jsを用いるプロジェクトのbasis
基本的なnextの開発環境と、各種APIを起動するためのdockerの設定ファイルが含まれる。
それぞれの環境での起動には.env系ファイルが必要であるため、提供するリンクからこれをダウンロードしルートディレクトリに配置する。

**APIについて**
RESTAPIに基づいて、./users/route.tsの中身は、get post delete put patchなどで何をするかを書く。
apiに何をするかを含めず、リクエストで指定することができて、/apiが肥大化しない。
それぞれに対応する処理は、libにまとめること。
また、型はzodでschemaを組んでフロントがインポートするだけでよいようにする。

**環境変数について**

環境判定は `NODE_ENV` 1本で行う（`development` / `production`）。
用途は次の2ファイルで分ける:

- `.env`             … ローカル開発用（dev DB / MinIO / localhost）
- `.env.production`  … 本番用（prod DB / OCI Object Storage / https://routem.net）

プロジェクト内での環境変数の取得関数は `lib/config/` 配下の `client.ts` / `server.ts` に使う場所で分けて定義し、
そこで `NODE_ENV` による切り替えを行う。直接 `process.env` を参照するのは config ファイルと script 系のみに留める。

クライアントサイドで用いる変数は `NEXT_PUBLIC_` プレフィックスを付ける。
Next.js は `NEXT_PUBLIC_*` をビルド時にクライアントバンドルへインライン化するため、
Docker ビルドでは必ず `docker-compose-prod.yml` の `build.args` 経由で渡すこと（runtime env では反映されない）。

自サイトの完全URLは `NEXT_PUBLIC_SITE_URL` に一本化している（OAuth コールバック、CORS 判定、共有URL等すべて）。

# 本番デプロイ手順

本番は `docker compose -f docker-compose-prod.yml` + `nginx` で運用する。

```sh
# .env.production に本番用の環境変数を配置した上で
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --build
```

# CORDING STANDARD
**命名規則**
DBカラム名：キャメルケース
クエリパラメータ：キャメルケース
**宣言の並び順**
- できるだけ使用する直前で宣言
- 型なども同じであるが、特に理由がない場合は、アルファベット順で並べる
→ctrl shift P　でコマンドパレットを開き、sort ascendingで選択範囲を並び替えることができる
