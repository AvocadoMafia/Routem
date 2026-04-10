import { NextResponse } from "next/server";
import { CurrencyCode, RouteFor } from "@prisma/client";
import { handleRequest } from "@/lib/server/handleRequest";

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
