import { latestLive } from "@/lib/latest-live";
import { NextResponse } from "next/server";

export async function GET() {
    const latest = await latestLive("@maamokun");
    if (latest) {
        return NextResponse.json(latest)
    } else {
        return NextResponse.json({ error: "No live stream found" }, { status: 404 });
    }
}