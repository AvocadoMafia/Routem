import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest";
import { createClient } from "@/lib/auth/supabase/server";
import { validateParams } from "@/lib/server/validateParams";
import { CreateLikeSchema } from "@/features/likes/schema";
import { likesService } from "@/features/likes/service";

export function POST(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            throw new Error("Unauthorized");
        }

        const body = await req.json();
        const parsed_body = await validateParams(CreateLikeSchema, body);

        const result = await likesService.toggleLike(
            user.id,
            parsed_body.target,
            parsed_body.routeId,
            parsed_body.commentId
        );

        return NextResponse.json(result, { status: 200 });
    });
}

// POSTだけで完結するようにし、不要なDELETEメソッドと関連スキーマの参照を削除しました。
