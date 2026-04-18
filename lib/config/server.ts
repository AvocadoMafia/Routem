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
var redisClient: RedisClientType;
}

function requireServerEnv(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(`Missing required server env: ${name}`);
    }
    return value;
}

export function getServerSupabaseUrl(): string {
    return requireServerEnv(
        "SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)",
        process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
}

export function getServerSupabasePublishableKey(): string {
    return requireServerEnv(
        "SUPABASE_PUBLISHABLE_DEFAULT_KEY / SUPABASE_ANON_KEY (or NEXT_PUBLIC_* fallback)",
        process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
            process.env.SUPABASE_ANON_KEY ??
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
 * Redisクライアントをシングルトンで取得する関数
 * 環境変数 REDIS_URL (例: redis://localhost:6379) を使用します
 */
export function getRedisClient() {
    if (globalThis.redisClient) return globalThis.redisClient;

    const redisUrl = process.env.REDIS_URL;

    console.log("REDIS_URL", redisUrl);

    globalThis.redisClient = createClient({
        url: redisUrl,
    });

    // 接続エラーのハンドリング
    globalThis.redisClient.on("error", (err) => {
        console.error("Redis Client Error", err);
    });

    // 非同期で接続を開始するが、クライアント自体は即座に返す
    // 使用側で await client.connect() が必要になる場合もあるが、
    // node-redis v4以降では最初に一度 connect() を呼ぶ必要がある。
    // ここで直接 connect() を呼ぶ (非同期)
    globalThis.redisClient.connect().catch((err) => {
        console.error("Redis Connection Error", err);
    });

    return globalThis.redisClient;
}
