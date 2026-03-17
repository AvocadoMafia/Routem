import { getS3Client } from "@/lib/config/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageType } from "@prisma/client";
import { imagesRepository } from "./repository";

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

      const Bucket = process.env.MINIO_BUCKET || 'rtmimages';
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
};
