import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { routesSearchService } from "@/features/routes/search/service";
import { validateParams } from "@/lib/server/validateParams";
import { SearchRoutesSchema } from "@/features/routes/search/schema";
import { createClient } from "@/lib/auth/supabase/server";

// GET /api/v1/routes/search
// Search routes with limit-offset pagination
// Query params: q, limit, offset, orderBy, routeFor, month
// Response: { items: Route[], total: number }
export async function GET(req: NextRequest) {
  return await handleRequest(async () => {
    const supabase = await createClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    const safe_user = error ? null : user;
    const search_params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed_params = await validateParams(SearchRoutesSchema, search_params);
    const result = await routesSearchService.searchRoutes(safe_user, parsed_params);
    return NextResponse.json(result, { status: 200 });
  });
}
