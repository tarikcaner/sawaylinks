import { recordLinkClick } from "@/lib/analytics-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { linkId } = body;
    if (!linkId || typeof linkId !== "string") {
      return NextResponse.json({ error: "linkId required" }, { status: 400 });
    }
    await recordLinkClick(linkId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
