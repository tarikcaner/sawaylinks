import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: "ids must be an array" },
        { status: 400 }
      );
    }

    const data = await getSiteData();

    // Create a map of existing links by id
    const linkMap = new Map(data.links.map((l) => [l.id, l]));

    // Reorder: assign new order based on position in ids array
    const reordered = ids
      .map((id: string, index: number) => {
        const link = linkMap.get(id);
        if (!link) return null;
        return { ...link, order: index };
      })
      .filter(Boolean);

    // Keep any links not mentioned in ids at the end
    const mentionedIds = new Set(ids);
    const remaining = data.links
      .filter((l) => !mentionedIds.has(l.id))
      .map((l, i) => ({ ...l, order: ids.length + i }));

    data.links = [...reordered, ...remaining] as typeof data.links;
    await saveSiteData(data);

    return NextResponse.json({ links: data.links });
  } catch {
    return NextResponse.json(
      { error: "Failed to reorder links" },
      { status: 500 }
    );
  }
}
