import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json({ theme: data.theme });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme } = body;

    if (!theme || typeof theme !== "string") {
      return NextResponse.json(
        { error: "theme is required and must be a string" },
        { status: 400 }
      );
    }

    const data = await getSiteData();
    data.theme = theme;
    await saveSiteData(data);

    return NextResponse.json({ theme: data.theme });
  } catch {
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}
