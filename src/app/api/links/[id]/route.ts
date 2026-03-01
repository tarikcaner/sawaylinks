import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = await getSiteData();

    const index = data.links.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    data.links[index] = { ...data.links[index], ...body, id };
    await saveSiteData(data);

    return NextResponse.json({ link: data.links[index] });
  } catch {
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await getSiteData();

    const index = data.links.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    data.links.splice(index, 1);
    await saveSiteData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}
