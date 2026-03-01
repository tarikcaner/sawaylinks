import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/store";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch site data" },
      { status: 500 }
    );
  }
}
