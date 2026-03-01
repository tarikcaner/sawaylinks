import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json({ theme: data.theme, customization: data.customization });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAuth = await authenticateRequest(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = await getSiteData();

    if (body.theme) {
      data.theme = body.theme;
    }
    if (body.customization) {
      data.customization = { ...data.customization, ...body.customization };
    }

    await saveSiteData(data);
    return NextResponse.json({ theme: data.theme, customization: data.customization });
  } catch {
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}
