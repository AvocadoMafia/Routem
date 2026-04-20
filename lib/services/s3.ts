// S3 互換ストレージ（MinIO / OCI Object Storage 等）の AWS SDK クライアント。
// 旧 lib/config/server.ts から分離。NODE_ENV=production のときは OCI、それ以外は MinIO に切替える。

import { S3Client } from "@aws-sdk/client-s3";

declare global {
    // eslint-disable-next-line no-var
    var s3Client: S3Client;
}

export function getS3Client() {
    if (globalThis.s3Client) return globalThis.s3Client;

    const isProd = process.env.NODE_ENV === "production";

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
            throw new Error(
                "Missing OCI env: OCI_STORAGE_NAMESPACE, OCI_ACCESS_KEY, OCI_SECRET_KEY are required in production",
            );
        }
    } else {
        // MinIO 用の設定
        endpoint = process.env.MINIO_ENDPOINT;
        accessKeyId = process.env.MINIO_ACCESS_KEY;
        secretAccessKey = process.env.MINIO_SECRET_KEY;
        region = process.env.MINIO_REGION || "us-east-1";

        if (!endpoint || !accessKeyId || !secretAccessKey) {
            throw new Error(
                "Missing MinIO env: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY are required",
            );
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
