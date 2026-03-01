import { recordPageView } from "@/lib/analytics-store";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await recordPageView();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
