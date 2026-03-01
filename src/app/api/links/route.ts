import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json({ links: data.links });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, url, icon, category, isPinned } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "title and url are required" },
        { status: 400 }
      );
    }

    const data = await getSiteData();

    const maxOrder =
      data.links.length > 0
        ? Math.max(...data.links.map((l) => l.order))
        : -1;

    const newLink = {
      id: crypto.randomUUID(),
      title,
      url,
      icon,
      category,
      isPinned: isPinned ?? false,
      order: maxOrder + 1,
    };

    data.links.push(newLink);
    await saveSiteData(data);

    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
