import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { imagesService } from "@/features/images/service";
import { validateParams } from "@/lib/server/validateParams";
import { GetImagesSchema } from "@/features/images/schema";

/**
 * GET /api/v1/images
 * PhotoSection用：公開ルートに紐づく採用済みノード画像をcreatedAt降順でカーソルページネーションして返す。
 */
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const search_params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed_params = await validateParams(GetImagesSchema, search_params);

    const data = await imagesService.getPhotos(parsed_params);
    return NextResponse.json(data, { status: 200 });
  });
}
