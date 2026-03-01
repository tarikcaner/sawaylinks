const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
  console.warn(
    "[SawayLinks] ADMIN_PASSWORD and ADMIN_SECRET must be set in environment variables. See .env.example"
  );
}

const encoder = new TextEncoder();

async function getKey(): Promise<CryptoKey> {
  if (!ADMIN_SECRET) throw new Error("ADMIN_SECRET is not configured");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(ADMIN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  if (password.length !== ADMIN_PASSWORD.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createToken(): Promise<string> {
  const header = base64UrlEncode(
    encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  );
  const payload = base64UrlEncode(
    encoder.encode(
      JSON.stringify({
        sub: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      })
    )
  );

  const key = await getKey();
  const signatureData = encoder.encode(`${header}.${payload}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, signatureData);
  const signature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${header}.${payload}.${signature}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;

    // Verify signature
    const key = await getKey();
    const signatureData = encoder.encode(`${header}.${payload}`);
    const signatureBytes = base64UrlDecode(signature);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      signatureData
    );
    if (!valid) return false;

    // Check expiry
    const payloadData = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload))
    );
    if (payloadData.exp && payloadData.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function authenticateRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}
