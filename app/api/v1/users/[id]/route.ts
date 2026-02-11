import { handleRequest } from "@/lib/server/handleRequest";
import { validateParams } from "@/lib/server/validateParams";
import { UserIdSchema } from "@/features/users/schema";
import { usersService } from "@/features/users/service";
// default　exportじゃない限り、｛｝で名前指定してインポートする


// routeはHttp層
// req, resの型とバリデーション、エラー処理を担当

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(async () => {
    const { id: id } = await params;
    const validated_params = await validateParams(UserIdSchema, { id });

    const user = await usersService.getUserById(validated_params.id);

    return Response.json({ user });
  });
}
