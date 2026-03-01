import { verifyPassword, createToken } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

function getClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  // Check rate limit
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Cok fazla deneme. Lutfen bekleyin.",
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter || 60),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Sifre gerekli." }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        {
          error: "Yanlis sifre.",
          remaining: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Success - reset rate limit and create token
    resetRateLimit(ip);
    const token = await createToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi." }, { status: 500 });
  }
}
