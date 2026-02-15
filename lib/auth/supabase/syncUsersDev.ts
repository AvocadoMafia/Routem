import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/auth/supabase/admin";

// devのみでSupabaseのユーザをPrismaのUserテーブルに同期するスクリプト
export async function syncAllUsers() {
    let page = 1;
    const perPage = 1000;

    while (true) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage,
        });

        if (error) throw error;

        if (!data.users.length) break;

        for (const user of data.users) {
            await prisma.user.upsert({
                where: { id: user.id },
                create: {
                    id: user.id,
                    name: user.user_metadata?.name || "",
                },
                update: {},
            });
        }

        page++;
    }

    console.log("User sync completed");
}
