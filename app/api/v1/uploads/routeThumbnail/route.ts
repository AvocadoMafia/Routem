import { NextRequest, NextResponse } from "next/server";
import { getS3Client } from "@/lib/config/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 共通: バケット名と公開URLを正規化して生成
function buildPublicUrl(bucket: string, key: string) {
  const rawPublic = process.env.MINIO_PUBLIC_ENDPOINT || process.env.MINIO_ENDPOINT || 'localhost';
  const useSSL = (process.env.MINIO_USE_SSL || 'false').toLowerCase() === 'true';
  const protocol = useSSL ? 'https' : 'http';
  const defaultPort = useSSL ? '443' : '9000';
  const port = process.env.MINIO_PUBLIC_PORT || process.env.MINIO_PORT || defaultPort;
  const hostNoScheme = rawPublic.replace(/^https?:\/\//i, '').replace(/\/+$/g, '');
  const host = hostNoScheme.replace(/:\d+$/, '');
  return `${protocol}://${host}:${port}/${bucket}/${key}`;
}

function ensureWebpFileName(name: string) {
  const trimmed = (name || '').trim();
  if (!trimmed) return `route-thumb-${Date.now()}.webp`;
  // 拡張子を .webp に強制
  const base = trimmed.replace(/\.[^./\\]+$/i, '');
  return `${base}.webp`;
}

// GET /api/v1/uploads/routeThumbnail?fileName=...&contentType=image/webp
// 署名付きURL（PUT）を発行して返す（クエリで受け取り）。必ずWEBPを強制。
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rawName = url.searchParams.get('fileName') || `route-thumb-${Date.now()}.webp`;
    const fileName = ensureWebpFileName(rawName);
    // contentTypeはクエリ値に関わらずimage/webp固定
    const contentType = 'image/webp';

    const Bucket = process.env.MINIO_BUCKET || 'rtmimages';
    const Key = `route-thumbnails/${Date.now()}-${fileName}`;

    const s3 = getS3Client();
    const command = new PutObjectCommand({ Bucket, Key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    const publicUrl = buildPublicUrl(Bucket, Key);
    return NextResponse.json({ uploadUrl, key: Key, publicUrl }, { status: 200 });
  } catch (e: any) {
    console.error('/api/v1/uploads/routeThumbnail GET error', e);
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

// 互換性のためのPOST（将来削除可）
// リクエスト: { fileName?: string, contentType?: string }（contentTypeは無視してWEBP固定）
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawName: string = body?.fileName || `route-thumb-${Date.now()}.webp`;
    const fileName = ensureWebpFileName(rawName);
    const contentType = 'image/webp';

    const Bucket = process.env.MINIO_BUCKET || 'rtmimages';
    const Key = `route-thumbnails/${Date.now()}-${fileName}`;

    const s3 = getS3Client();
    const command = new PutObjectCommand({ Bucket, Key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    const publicUrl = buildPublicUrl(Bucket, Key);
    return NextResponse.json({ uploadUrl, key: Key, publicUrl }, { status: 200 });
  } catch (e: any) {
    console.error('/api/v1/uploads/routeThumbnail POST error', e);
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
