import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get("q")?.trim();
        const mapbox_id = url.searchParams.get("mapbox_id")?.trim();
        const session_token = url.searchParams.get("session_token")?.trim() || "fixed-session-123";

        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!token) {
            return NextResponse.json(
                { error: "Mapbox access token is not configured" },
                { status: 500 }
            );
        }

        // Retrieve request if mapbox_id is provided
        if (mapbox_id) {
            const endpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}`;
            const params = new URLSearchParams({
                access_token: token,
            });
            if (session_token) params.append("session_token", session_token);

            const res = await fetch(`${endpoint}?${params.toString()}`, { cache: "no-store" });
            if (!res.ok) {
                const text = await res.text();
                return NextResponse.json({ error: "Retrieve failed", details: text }, { status: res.status });
            }
            const data = await res.json();
            return NextResponse.json(data, { status: 200 });
        }

        // Suggest request if q is provided
        if (!q) {
            return NextResponse.json({ suggestions: [] }, { status: 200 });
        }

        const endpoint = "https://api.mapbox.com/search/searchbox/v1/suggest";

        const params = new URLSearchParams({
          q,
          access_token: token,
          limit: "10",
          language: "ja",
          types: "poi,address,street,locality,place",
          proximity: "139.7671,35.6812", // Tokyo as default
        });
        if (session_token) params.append("session_token", session_token);

        const res = await fetch(`${endpoint}?${params.toString()}`, { cache: "no-store" });

        if (!res.ok) {
            const text = await res.text();
            console.error("Mapbox suggest failed:", {
                status: res.status,
                statusText: res.statusText,
                details: text,
                url: `${endpoint}?${params.toString()}`
            });
            return NextResponse.json(
                { error: "Mapbox suggest failed", details: text },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
