import {NextRequest, NextResponse} from "next/server";
import {handleRequest} from "@/lib/server/handleRequest";
import {createClient} from "@/lib/auth/supabase/server";
import {validateParams} from "@/lib/server/validateParams";
import {CreateCommentSchema, DeleteCommentSchema, GetCommentsSchema} from "@/features/comments/schema";
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

export function POST(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            throw new Error("Unauthorized");
        }

        const body = await req.json();
        const parsed_body = await validateParams(CreateCommentSchema, body);

        const comment = await commentsService.createComment(
            user.id,
            parsed_body.routeId,
            parsed_body.text
        );

        return NextResponse.json(comment, {status: 201});
    })
}

export function DELETE(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            throw new Error("Unauthorized");
        }

        const body = await req.json();
        const parsed_body = await validateParams(DeleteCommentSchema, body);

        const comment = await commentsService.deleteComment(user.id, parsed_body.id);

        return NextResponse.json(comment , {status: 200});
    })
}