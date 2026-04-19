import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/api/server";
import { usersService } from "@/features/users/service";
import { validateParams } from "@/lib/api/server";
import { GetUsersSchema } from "@/features/users/schema";

// GET /api/v1/users
// ユーザー一覧を取得します（TopUsersSectionなどで利用）
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const search_params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed_params = await validateParams(GetUsersSchema, search_params);
    const users = await usersService.getUsers(parsed_params);
    return NextResponse.json(users, { status: 200 });
  });
}
