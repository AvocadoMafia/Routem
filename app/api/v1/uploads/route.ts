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

function ensureExtension(name: string, defaultExt: string = '.webp') {
  const trimmed = (name || '').trim();
  if (!trimmed) return `upload-${Date.now()}${defaultExt}`;
  if (trimmed.includes('.')) return trimmed;
  return `${trimmed}${defaultExt}`;
}

/**
 * GET /api/v1/uploads?fileName=...&contentType=...&type=route-thumbnails
 * 署名付きURL（PUT）を発行して返す。
 * type によって保存先ディレクトリを切り替える。
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const fileName = url.searchParams.get('fileName') || `upload-${Date.now()}`;
    const contentType = url.searchParams.get('contentType') || 'image/webp';
    const type = url.searchParams.get('type') || 'others';

    // ディレクトリの決定
    let directory = 'others';
    if (type === 'route-thumbnails') directory = 'route-thumbnails';
    else if (type === 'user-profiles') directory = 'user-profiles';
    else if (type === 'node-images') directory = 'node-images';

    const Bucket = process.env.MINIO_BUCKET || 'rtmimages';
    const Key = `${directory}/${Date.now()}-${ensureExtension(fileName)}`;

    const s3 = getS3Client();
    const command = new PutObjectCommand({ Bucket, Key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    const publicUrl = buildPublicUrl(Bucket, Key);
    return NextResponse.json({ uploadUrl, key: Key, publicUrl }, { status: 200 });
  } catch (e: any) {
    console.error('/api/v1/uploads GET error', e);
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
