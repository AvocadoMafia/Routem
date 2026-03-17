import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { imagesService } from "@/features/images/service";

/**
 * GET /api/v1/uploads?fileName=...&contentType=...&type=route-thumbnails
 * 署名付きURL（PUT）を発行して返す。
 */
export async function GET(req: NextRequest) {
  return handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user } } = await supabase.auth.getUser();

    const url = new URL(req.url);
    const fileName = url.searchParams.get('fileName') || `upload-${Date.now()}`;
    const contentType = url.searchParams.get('contentType') || 'image/webp';
    const type = url.searchParams.get('type') || 'others';
    const context = url.searchParams.get('context');

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
