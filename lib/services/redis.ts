// Redis シングルトン getter。
// 旧 lib/config/server.ts から分離。
//
// 旧実装は `createClient().connect()` の connect を fire-and-forget で呼び、
// 接続が完了する前にクライアントを返していたため、cold start 直後の並列
// リクエストで `ClientClosedError` や queue 上のまま宙吊りになる問題があった
// (本番で一部のコンポーネントだけ fetch に失敗していた原因)。
//
// 本実装では `connect()` の Promise そのものを global に保持し、呼び出し側が
// await した時点で必ず ready なクライアントを受け取れるようにする。
// 接続に失敗した場合は Promise を reset して次回再接続を試みる。
//
// 呼び出し側で try/catch してフォールバックを書けるように、例外はそのまま
// 投げる (キャッシュ無しのパスに落とすのは上位層の責務)。

import { createClient, RedisClientType } from "redis";

declare global {
    // eslint-disable-next-line no-var
    var redisPromise: Promise<RedisClientType> | null;
}

export function getRedisClient(): Promise<RedisClientType> {
    if (globalThis.redisPromise) return globalThis.redisPromise;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        // REDIS_URL が無い環境では接続しようがないので reject。
        // 上位の getRedisClientOrNull で吸収される想定。
        return Promise.reject(new Error("REDIS_URL is not set"));
    }

    const client = createClient({ url: redisUrl }) as RedisClientType;

    client.on("error", (err) => {
        // error イベントは再接続中にも発火しうるので握り潰し (ログのみ)。
        console.error("[redis] client error:", err);
    });

    globalThis.redisPromise = client
        .connect()
        .then(() => client)
        .catch((err) => {
            // 接続失敗時は promise をクリアして次回再接続できるようにする
            console.error("[redis] connection failed:", err);
            globalThis.redisPromise = null;
            throw err;
        });

    return globalThis.redisPromise;
}

/**
 * Redis が利用できない場合に `null` を返す安全版。
 * trending / recommend 等のキャッシュ系 API で、Redis 不達時にエラーで
 * ページ全体を壊すのではなく DB フォールバックに落とすために使う。
 */
export async function getRedisClientOrNull(): Promise<RedisClientType | null> {
    try {
        return await getRedisClient();
    } catch {
        return null;
    }
}
