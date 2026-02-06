import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get("q")?.trim();

        if (!q) {
            return NextResponse.json({ features: [] }, { status: 200 });
        }

        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!token) {
            return NextResponse.json(
                { error: "Mapbox access token is not configured" },
                { status: 500 }
            );
        }

        const endpoint =
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            encodeURIComponent(q) +
            ".json";

        const params = new URLSearchParams({
            access_token: token,
            autocomplete: "true",
            fuzzyMatch: "true",
            limit: "8",
            language: "ja",

            // ★ ここが重要
            types: "poi,place",

            // ★ ユーザー位置が分かるなら必ず入れる
            proximity: "139.7671,35.6812",
        });


        const res = await fetch(`${endpoint}?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Mapbox geocoding failed", details: text },
                { status: 502 }
            );
        }


        const data = (await res.json()) as unknown;

        console.log(data);
        return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
