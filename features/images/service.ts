import { getS3Client } from "@/lib/config/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageType } from "@prisma/client";
import { imagesRepository, PhotoImageWithRelations } from "./repository";
import { GetImagesType } from "./schema";
import { encodeCursor } from "@/lib/server/cursor";

/** 画像ストレージ上の公開URLを組み立てる。
 *  - prod: OCI Object Storage の固定フォーマット
 *  - dev : MINIO_ENDPOINT（完全URL、例 `http://localhost:9000`）1本で組み立てる
 *
 *  ユニットテスト用に export している（features/images/service.test.ts 参照）。
 *  呼び出し側からは service の内部実装として閉じて扱うこと。
 */
export function buildPublicUrl(bucket: string, key: string) {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // OCI Object Storage の公開URL形式
    // https://objectstorage.{region}.oraclecloud.com/n/{namespace}/b/{bucket}/o/{key}
    const namespace = process.env.OCI_STORAGE_NAMESPACE;
    const region = process.env.OCI_REGION || 'ap-tokyo-1';
    return `https://objectstorage.${region}.oraclecloud.com/n/${namespace}/b/${bucket}/o/${key}`;
  }

  // MinIO (dev): MINIO_ENDPOINT は scheme 込みの完全URL（末尾スラッシュは正規化）
  const endpoint = (process.env.MINIO_ENDPOINT || 'http://localhost:9000').replace(/\/+$/, '');
  return `${endpoint}/${bucket}/${key}`;
}

/** 使用するストレージバケット名を返す。
 *  `OCI_BUCKET_NAME` が明示されていればそれを使い（本番で環境ごとに切り替え可能）、
 *  未指定なら dev/prod ともに `rtmimages` に落ちる（docker-compose.yml の
 *  `mc mb minio_dev/rtmimages` と一致）。
 *
 *  ユニットテスト用に export している。
 */
export function getStorageBucket(): string {
  return process.env.OCI_BUCKET_NAME || 'rtmimages';
}

function ensureExtension(name: string, defaultExt: string = '.webp') {
  const trimmed = (name || '').trim();
  if (!trimmed) return `upload-${Date.now()}${defaultExt}`;
  
  // 拡張子を除去して指定の拡張子を強制的に付与する
  const baseName = trimmed.includes('.') 
    ? trimmed.slice(0, trimmed.lastIndexOf('.')) 
    : trimmed;
  
  return `${baseName}${defaultExt}`;
}

export const imagesService = {
  getUploadPresignedUrl: async (
    userId: string | null,
    fileName: string,
    contentType: string,
    type: string,
    context?: string | null
  ) => {
    try {
      // ディレクトリの決定
      let directory = 'others';
      let imageType: ImageType = ImageType.OTHER;

      if (type === 'route-thumbnails') {
        directory = 'route-thumbnails';
        imageType = ImageType.ROUTE_THUMBNAIL;
      } else if (type === 'user-profiles') {
        directory = 'user-profiles';
        if (context === 'icon') imageType = ImageType.USER_ICON;
        else if (context === 'background') imageType = ImageType.USER_BG;
      } else if (type === 'node-images') {
        directory = 'node-images';
        imageType = ImageType.NODE_IMAGE;
      }

      // バケット名は OCI_BUCKET_NAME env があればそれを使用、未指定なら 'rtmimages' にフォールバック。
      // .env.production で環境ごとに切り替え可能にしておく余地を残している。
      const Bucket = getStorageBucket();
      const Key = `${directory}/${Date.now()}-${ensureExtension(fileName)}`;

      const s3 = getS3Client();
      const command = new PutObjectCommand({ Bucket, Key, ContentType: contentType });
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

      const publicUrl = buildPublicUrl(Bucket, Key);

      // DBにDRAFT状態でレコード作成
      const image = await imagesRepository.createDraftImage(publicUrl, Key, imageType, userId);

      return {
        uploadUrl,
        key: Key,
        publicUrl,
        imageId: image.id,
      };
    } catch (e) {
      throw e;
    }
  },

  getPhotos: async (
    query: GetImagesType,
  ): Promise<{ items: PhotoImageWithRelations[]; nextCursor: string | null }> => {
    try {
      const items = await imagesRepository.findManyAdoptedNodeImages({
        limit: query.limit,
        cursor: query.cursor,
      });

      let nextCursor: string | null = null;
      if (items.length === query.limit && items.length > 0) {
        const last = items[items.length - 1];
        nextCursor = encodeCursor({ createdAt: last.createdAt, id: last.id });
      }

      return { items, nextCursor };
    } catch (e) {
      throw e;
    }
  },
};
