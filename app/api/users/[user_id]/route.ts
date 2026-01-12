import { handleRequest } from "@/lib/server/handleReques";
import { validateParams } from "@/lib/server/validateParams";
import { UserIdSchema } from "@/features/users/schema";
import { usersService } from "@/features/users/service";
// default　exportじゃない限り、｛｝で名前指定してインポートする


// routeはHttp層
// req, resの型とバリデーション、エラー処理を担当

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  return handleRequest(async () => {
    const validated_params = await validateParams(UserIdSchema, params);

    const user = await usersService.getUserById(validated_params.user_id);

    return Response.json({ user });
  });
}
  