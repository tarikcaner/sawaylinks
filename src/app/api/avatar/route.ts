import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { getSiteData, saveSiteData } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const AVATAR_DIR = path.join(process.cwd(), "data", "avatars");

export async function POST(request: Request) {
  try {
    const authenticated = await authenticateRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: jpeg, png, webp" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB" },
        { status: 400 }
      );
    }

    const ext = EXT_MAP[file.type];
    const filename = `avatar.${ext}`;
    await mkdir(AVATAR_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(AVATAR_DIR, filename), buffer);

    const avatarUrl = `/api/avatar/serve?v=${Date.now()}`;

    // Update site data with new avatar path
    const data = await getSiteData();
    data.profile.avatar = avatarUrl;
    await saveSiteData(data);

    return NextResponse.json({ url: avatarUrl });
  } catch (err) {
    console.error("[Avatar Upload Error]", err);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}

// GET: Serve the avatar image
export async function GET() {
  try {
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
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
