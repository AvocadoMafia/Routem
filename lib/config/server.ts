//サーバーで用いる環境変数を取得するための関数を定義するファイル

import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Meilisearch } from "meilisearch";
import { createClient, RedisClientType } from "redis";


declare global{
var meilisearch:Meilisearch;
var prisma: PrismaClient;
var  s3Client: S3Client;
// Redis は「接続完了まで解決しない Promise」を global にキャッシュする。
// getRedisClient() を await した時点で必ず ready なクライアントが得られる。
var redisPromise: Promise<RedisClientType> | null;
}

function requireServerEnv(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(`Missing required server env: ${name}`);
    }
    return value;
}

// Supabase プロジェクトの URL / Publishable key はクライアント側 SDK でも必須で
// NEXT_PUBLIC_* としてビルド時にインライン化されるため、サーバ側でもそのまま流用する。
// 旧実装の SUPABASE_URL / SUPABASE_ANON_KEY 等へのフォールバック多段チェーンは
// vercel 運用時の名残で、現行の docker 運用では不要なため撤去。
export function getServerSupabaseUrl(): string {
    return requireServerEnv(
        "NEXT_PUBLIC_SUPABASE_URL",
        process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
}

export function getServerSupabasePublishableKey(): string {
    return requireServerEnv(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    );
}

export function getMeilisearch(){
    // global変数として存在した場合のガード節
    if(globalThis.meilisearch) return globalThis.meilisearch;

    globalThis.meilisearch = new Meilisearch({
     host: process.env.MEILISEARCH_URL!,
     apiKey: process.env.MEILISEARCH_APIKEY!,
    });
    
    return globalThis.meilisearch;
}


export function getPrisma() {
    if (globalThis.prisma) return globalThis.prisma;

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            `Database connection string is not defined.`,
        );
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalThis.prisma = new PrismaClient({ adapter });

    return globalThis.prisma;
}

// S3互換ストレージ（MinIO / OCI Object Storage等）クライアントのゲッター
// NODE_ENV が 'production' の場合は OCI Object Storage を、それ以外は MinIO を使用します。
export function getS3Client() {
    if (globalThis.s3Client) return globalThis.s3Client;

    const isProd = process.env.NODE_ENV === 'production';
    
    let endpoint: string | undefined;
    let accessKeyId: string | undefined;
    let secretAccessKey: string | undefined;
    let region: string;

    if (isProd) {
        // OCI Object Storage 用の設定
        // エンドポイント形式: https://{namespace}.compat.objectstorage.{region}.oraclecloud.com
        const namespace = process.env.OCI_STORAGE_NAMESPACE;
        region = process.env.OCI_REGION || "ap-tokyo-1";
        endpoint = `https://${namespace}.compat.objectstorage.${region}.oraclecloud.com`;
        accessKeyId = process.env.OCI_ACCESS_KEY;
        secretAccessKey = process.env.OCI_SECRET_KEY;
        
        if (!namespace || !accessKeyId || !secretAccessKey) {
            throw new Error("Missing OCI env: OCI_STORAGE_NAMESPACE, OCI_ACCESS_KEY, OCI_SECRET_KEY are required in production");
        }
    } else {
        // MinIO 用の設定
        endpoint = process.env.MINIO_ENDPOINT;
        accessKeyId = process.env.MINIO_ACCESS_KEY;
        secretAccessKey = process.env.MINIO_SECRET_KEY;
        region = process.env.MINIO_REGION || "us-east-1";

        if (!endpoint || !accessKeyId || !secretAccessKey) {
            throw new Error("Missing MinIO env: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY are required");
        }
    }

    globalThis.s3Client = new S3Client({
        region,
        endpoint,
        forcePathStyle: true,
        credentials: { accessKeyId, secretAccessKey },
    });

    return globalThis.s3Client;
}


/**
 * Redis クライアントを「接続完了を保証したうえで」取得する。
 *
 * 旧実装は `createClient().connect()` の connect を fire-and-forget で呼び、
 * 接続が完了する前にクライアントを返していたため、cold start 直後の並列
 * リクエストで `ClientClosedError` や queue 上のまま宙吊りになる問題が
 * あった (本番で一部のコンポーネントだけ fetch に失敗していた原因)。
 *
 * 本実装では `connect()` の Promise そのものを global に保持し、呼び出し側が
 * await した時点で必ず ready なクライアントを受け取れるようにする。
 * 接続に失敗した場合は Promise を reset して次回再接続を試みる。
 *
 * 呼び出し側で try/catch してフォールバックを書けるように、例外はそのまま
 * 投げる (キャッシュ無しのパスに落とすのは上位層の責務)。
 */
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
