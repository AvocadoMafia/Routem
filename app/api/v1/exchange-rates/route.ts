import { NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { exchangeRatesRepository } from "@/features/exchangeRates/repository";

export async function GET() {
  return handleRequest(async () => {
    const exchangeRates = await exchangeRatesRepository.findMany({
      orderBy: { currencyCode: "asc" },
    });
    return NextResponse.json(exchangeRates, { status: 200 });
  });
}
