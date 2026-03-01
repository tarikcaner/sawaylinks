import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const AVATAR_DIR = path.join(process.cwd(), "data", "avatars");

export async function GET() {
  const extensions = ["jpg", "png", "webp"];
  for (const ext of extensions) {
    try {
      const filePath = path.join(AVATAR_DIR, `avatar.${ext}`);
      const data = await readFile(filePath);
      const contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
      return new NextResponse(data, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      continue;
    }
  }
  return new NextResponse(null, { status: 404 });
}
