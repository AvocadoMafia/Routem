import {createServerClient} from "@supabase/ssr";
import {NextResponse} from "next/server";
import {getPrisma} from "@/lib/config/server";
import {createClient} from "@/lib/auth/supabase/server";

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    //認証
    if (!user) {
        return NextResponse.json({ user: null })
    }

    //prismaからユーザー問い合わせ
    const prismaUser = await getPrisma().user.findUnique({
        where: { id: user.id },
        include: {icon: true}
    })

    return NextResponse.json({ ...prismaUser })
}
