import { latestLive } from "@/lib/latest-live";
import { NextResponse } from "next/server";

export async function GET() {
    const latest = await latestLive("@maamokun");
    if (latest) {
        return NextResponse.redirect(latest.url);
    } else {
        return NextResponse.redirect("https://www.youtube.com/@maamokun");
    }
}