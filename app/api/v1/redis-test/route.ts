
import { NextResponse } from "next/server";
import {getRedisClient} from "@/lib/config/server";

export async function GET() {

    const redis = getRedisClient()

    try {
        // 書き込み
        await redis.set("test:key", "hello redis");

        // 読み込み
        const value = await redis.get("test:key");

        return NextResponse.json({
            success: true,
            value,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}
