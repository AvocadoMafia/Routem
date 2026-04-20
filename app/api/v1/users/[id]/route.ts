import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";
import { UserIdSchema } from "@/features/users/schema";
import { usersService } from "@/features/users/service";
import { createClient } from "@/lib/auth/supabase-server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(async () => {
    const { id } = await params;
    const validated_params = await validateParams(UserIdSchema, { id });

    const supabase = await createClient(req);
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const user = await usersService.getUserById(validated_params.id, currentUser?.id);

    return Response.json({ user });
  });
}
