import { NextResponse } from "next/server";
import { CurrencyCode, Language, Locale, RouteFor } from "@prisma/client";
import { handleRequest } from "@/lib/server/handleRequest";

export async function GET() {
  return handleRequest(async () => {
    return NextResponse.json(
      {
        routeFor: Object.values(RouteFor),
        currencyCode: Object.values(CurrencyCode),
        locale: Object.values(Locale),
        language: Object.values(Language),
      },
      { status: 200 },
    );
  });
}
