import { imagesRecommendationService } from "@/features/images/recommendation/service";
import { handleRequest } from "@/lib/server/handleRequest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const data = await imagesRecommendationService.get();
    if (!data) {
      return NextResponse.json({ error: "No recommendation image found" }, { status: 404 });
    }
    return NextResponse.json(data);
  });
}
