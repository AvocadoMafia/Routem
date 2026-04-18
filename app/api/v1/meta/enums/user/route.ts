import { NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { Language, Locale } from "@prisma/client";

export async function GET() {
  return handleRequest(async () => {
    return NextResponse.json(
      {
        locale: Object.values(Locale),
        language: Object.values(Language),
      },
      { status: 200 },
    );
  });
}
