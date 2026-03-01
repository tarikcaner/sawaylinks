interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  locked: boolean;
  lockExpires: number;
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5; // per window
const LOCKOUT_THRESHOLD = 10; // total fails before lockout
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.firstAttempt > LOCKOUT_DURATION && !entry.locked) {
      store.delete(key);
    }
    if (entry.locked && now > entry.lockExpires) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  const entry = store.get(ip);

  // No entry = first attempt
  if (!entry) {
    store.set(ip, { attempts: 1, firstAttempt: now, locked: false, lockExpires: 0 });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Check if locked out
  if (entry.locked) {
    if (now > entry.lockExpires) {
      // Lockout expired, reset
      store.delete(ip);
      store.set(ip, { attempts: 1, firstAttempt: now, locked: false, lockExpires: 0 });
      return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
    }
    return { allowed: false, retryAfter: Math.ceil((entry.lockExpires - now) / 1000) };
  }

  // Reset window if expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    store.set(ip, { attempts: 1, firstAttempt: now, locked: false, lockExpires: 0 });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Check if too many attempts in window
  if (entry.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.firstAttempt + WINDOW_MS - now) / 1000) };
  }

  // Check lockout threshold
  if (entry.attempts >= LOCKOUT_THRESHOLD) {
    entry.locked = true;
    entry.lockExpires = now + LOCKOUT_DURATION;
    store.set(ip, entry);
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT_DURATION / 1000) };
  }

  entry.attempts++;
  store.set(ip, entry);
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.attempts };
}

export function resetRateLimit(ip: string): void {
  store.delete(ip);
}
