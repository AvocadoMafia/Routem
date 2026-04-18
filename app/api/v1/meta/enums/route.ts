import { NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { CurrencyCode, RouteFor } from "@prisma/client";

export async function GET() {
  return handleRequest(async () => {
    return NextResponse.json(
      {
        routeFor: Object.values(RouteFor),
        currencyCode: Object.values(CurrencyCode),
      },
      { status: 200 },
    );
  });
}
