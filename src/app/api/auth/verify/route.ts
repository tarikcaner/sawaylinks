import { authenticateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const isValid = await authenticateRequest(request);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ valid: true });
}
