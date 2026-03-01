import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
  console.warn(
    "[SawayLinks] ADMIN_PASSWORD and ADMIN_SECRET must be set in environment variables. See .env.example"
  );
}

const encoder = new TextEncoder();

const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

// --- Password hashing with PBKDF2 ---

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

async function verifyHash(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const computedHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  // Timing-safe comparison
  if (computedHex.length !== hashHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computedHex.length; i++) {
    mismatch |= computedHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
  }
  return mismatch === 0;
}

async function getStoredPasswordHash(): Promise<string | null> {
  try {
    const raw = await readFile(AUTH_FILE, "utf-8");
    const data = JSON.parse(raw);
    return data.passwordHash || null;
  } catch {
    return null;
  }
}

async function savePasswordHash(hash: string): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(AUTH_FILE, JSON.stringify({ passwordHash: hash }, null, 2), "utf-8");
}

// --- JWT helpers ---

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

// --- Exports ---

function verifyEnvPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  if (password.length !== ADMIN_PASSWORD.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifyPassword(password: string): Promise<boolean> {
  // First try stored hash (changed password)
  const storedHash = await getStoredPasswordHash();
  if (storedHash) {
    return verifyHash(password, storedHash);
  }
  // Fallback to env var
  return verifyEnvPassword(password);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const valid = await verifyPassword(currentPassword);
  if (!valid) return false;
  const hash = await hashPassword(newPassword);
  await savePasswordHash(hash);
  return true;
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
