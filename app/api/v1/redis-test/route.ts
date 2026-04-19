import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/services/redis";

export async function GET() {
    try {
        const redis = await getRedisClient();

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
