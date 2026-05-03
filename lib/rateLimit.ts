/**
 * Simple in-memory rate limiter for Next.js API routes
 * Tracks requests per IP address with time-window sliding
 */

interface RateLimitStore {
  [key: string]: number[];
}

const requestStore: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000,
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Initialize or get existing requests for this identifier
  if (!requestStore[identifier]) {
    requestStore[identifier] = [];
  }

  // Remove requests outside the time window
  requestStore[identifier] = requestStore[identifier].filter(
    (timestamp) => timestamp > windowStart,
  );

  const requestCount = requestStore[identifier].length;
  const remaining = Math.max(0, limit - requestCount);
  const resetTime = requestStore[identifier][0]
    ? requestStore[identifier][0] + windowMs
    : now + windowMs;

  if (requestCount >= limit) {
    return { success: false, remaining: 0, resetTime };
  }

  // Add current request timestamp
  requestStore[identifier].push(now);

  return { success: true, remaining: remaining - 1, resetTime };
}

/**
 * Get client IP from Next.js request
 * Handles X-Forwarded-For, X-Real-IP headers (behind proxies like Vercel)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback for local development
  return "127.0.0.1";
}
