import {
  ImageRecommendationRequestSchema,
  ImageRecommendationRequestType,
} from "@/features/images/recommendation/schema";
import { imagesRecommendationService } from "@/features/images/recommendation/service";
import { handleRequest } from "@/lib/server/handleRequest";
import { validateParams } from "@/lib/server/validateParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<ImageRecommendationRequestType> },
) {
  return await handleRequest(async () => {
    const parsed = await validateParams(ImageRecommendationRequestSchema, await params);

    const data = await imagesRecommendationService.get(parsed);
    if (!data) {
      return NextResponse.json({ error: "No recommendation image found" }, { status: 404 });
    }
    return NextResponse.json(data);
  });
}
