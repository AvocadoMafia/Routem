import {NextRequest, NextResponse} from "next/server";
import {handleRequest} from "@/lib/server/handleRequest";
import {createClient} from "@/lib/auth/supabase/server";
import {validateParams} from "@/lib/server/validateParams";
import {GetCommentsSchema} from "@/features/comments/schema";
import {commentsService} from "@/features/comments/service";

export default function GET(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        const safe_user = error ? null : user;

        const body = await req.json();

        const parsed_body = await validateParams(GetCommentsSchema, body)
        
        if(parsed_body.onlyMine && !user?.id) {
            throw new Error("Missing required parameter")
        }

        const comments = await commentsService.getComments(
            user?.id,
            parsed_body.take,
            parsed_body.onlyMine,
            parsed_body.without
        );

        return NextResponse.json(comments, {status: 200})
    })
}