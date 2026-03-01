import { authenticateRequest, changePassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const isAuth = await authenticateRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mevcut ve yeni sifre gerekli." }, { status: 400 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "Yeni sifre en az 8 karakter olmali." }, { status: 400 });
    }

    const success = await changePassword(currentPassword, newPassword);
    if (!success) {
      return NextResponse.json({ error: "Mevcut sifre yanlis." }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi." }, { status: 500 });
  }
}
