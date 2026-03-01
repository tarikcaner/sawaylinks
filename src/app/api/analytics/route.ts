import { getAnalytics } from "@/lib/analytics-store";
import { getSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const isAuth = await authenticateRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [analytics, siteData] = await Promise.all([
      getAnalytics(),
      getSiteData(),
    ]);

    const linkTitles: Record<string, string> = {};
    for (const link of siteData.links) {
      linkTitles[link.id] = link.title;
    }

    return NextResponse.json({ ...analytics, linkTitles });
  } catch {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
