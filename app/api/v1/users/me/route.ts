import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/lib/auth/supabase/server";
import {handleRequest} from "@/lib/server/handleRequest";
import {usersService} from "@/features/users/service";
import {validateParams} from "@/lib/server/validateParams";
import {UpdateUserSchema, UpdateUserType} from "@/features/users/schema";

export async function GET(req: NextRequest) {
    return handleRequest(async () => {
        //クライアント生成の過程でユーザー認証も行ってくれる
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error("[users/me GET] auth error:", error?.message, "user:", !!user);
            throw new Error("Unauthorized");
        }

        //prismaからユーザー問い合わせ、いなければ自動作成
        let prismaUser;
        try {
            prismaUser = await usersService.getUserById(user.id);
        } catch {
            // 初回ログイン時: Supabaseの情報からPrismaにユーザーを作成
            const { getPrisma } = await import("@/lib/config/server");
            try {
                prismaUser = await getPrisma().user.create({
                    data: {
                        id: user.id,
                        name: user.user_metadata?.name ?? "",
                        bio: "",
                    },
                });
            } catch {
                // 競合で create が失敗した場合は既存ユーザーを取得
                prismaUser = await getPrisma().user.findUniqueOrThrow({
                    where: { id: user.id },
                });
            }
        }

        return NextResponse.json({...prismaUser}, {status: 200})
    })
}



export async function PATCH(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            throw new Error("Unauthorized");
        }
        const body = await req.json();
        const parsed_body = await validateParams(UpdateUserSchema, body)

        const updatedUser = await usersService.updateUser(user.id, parsed_body)

        return NextResponse.json({...updatedUser}, {status: 200})

    })
}

export async function DELETE(req: NextRequest) {
    return handleRequest(async () => {
        const supabase = await createClient(req);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            throw new Error("Unauthorized");
        }

        // Prisma側のデータを削除 (Cascadeにより関連データも削除される)
        await usersService.deleteUser(user.id);

        // Supabase Auth側のユーザーを削除
        const { supabaseAdmin } = await import("@/lib/auth/supabase/admin");
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        
        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    });
}
