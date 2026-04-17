import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { imagesService } from "@/features/images/service";
import {
  isAllowedContentType,
  isAllowedUploadType,
  isAllowedContext,
  sanitizeFileName,
  ALLOWED_CONTENT_TYPES,
  ALLOWED_UPLOAD_TYPES,
} from "@/lib/server/uploadValidation";

/**
 * GET /api/v1/images/uploads?fileName=...&contentType=...&type=route-thumbnails
 * 署名付きURL（PUT）を発行して返す。
 */
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user } } = await supabase.auth.getUser();

    const url = new URL(req.url);
    const rawFileName = url.searchParams.get('fileName') || `upload-${Date.now()}`;
    const contentType = url.searchParams.get('contentType') || 'image/webp';
    const type = url.searchParams.get('type') || 'others';
    const context = url.searchParams.get('context');

    // Content-Type検証
    if (!isAllowedContentType(contentType)) {
      return NextResponse.json(
        { error: `Invalid contentType. Allowed: ${ALLOWED_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // アップロードタイプ検証
    if (!isAllowedUploadType(type)) {
      return NextResponse.json(
        { error: `Invalid type. Allowed: ${ALLOWED_UPLOAD_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // コンテキスト検証
    if (!isAllowedContext(context)) {
      return NextResponse.json(
        { error: 'Invalid context. Allowed: icon, background' },
        { status: 400 }
      );
    }

    // ファイル名サニタイズ
    const fileName = sanitizeFileName(rawFileName);

    const result = await imagesService.getUploadPresignedUrl(
      user?.id || null,
      fileName,
      contentType,
      type,
      context
    );

    return NextResponse.json(result, { status: 200 });
  });
}
