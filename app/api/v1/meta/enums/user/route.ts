import { NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { LANGUAGE_VALUES, LOCALE_VALUES } from "@/lib/constants/enums";

export async function GET() {
  return handleRequest(async () => {
    return NextResponse.json(
      {
        locale: LOCALE_VALUES,
        language: LANGUAGE_VALUES,
      },
      { status: 200 },
    );
  });
}
