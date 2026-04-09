import { GetRoutesMeSchema } from "@/features/routes/me/schema";
import { routesMeservice } from "@/features/routes/me/service";
import { createClient } from "@/lib/auth/supabase/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { validateParams } from "@/lib/server/validateParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error("auth error");
    const user_id = user?.id;
    if (!user_id) throw new Error("user not found");
    const parsed_params = await validateParams(GetRoutesMeSchema, { userId: user_id });
    const data = await routesMeservice.getRoutesMe(parsed_params);
    return NextResponse.json(data, { status: 200 });
  });
}
