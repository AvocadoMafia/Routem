import { NextResponse } from "next/server";
import { syncAllUsers } from "@/lib/auth/supabase/syncUsersDev";

export async function POST() {
    await syncAllUsers();
    return NextResponse.json({ ok: true });
}
