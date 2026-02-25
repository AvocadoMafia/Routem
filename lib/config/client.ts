//クライアントで用いる環境変数を取得するための関数を定義するファイル

//事前宣言
let mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;


export default function getClientMapboxAccessToken() {
    return mapboxAccessToken;
}
