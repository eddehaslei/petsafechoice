/**
 * Frontend Rate Limiter
 * Prevents excessive API calls to protect against abuse and database flooding
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit entries in memory (keyed by action type)
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

// Configuration
const RATE_LIMITS = {
  search: { maxRequests: 20, windowMs: 60 * 1000 },      // 20 searches per minute
  affiliate: { maxRequests: 30, windowMs: 60 * 1000 },   // 30 affiliate fetches per minute
  log: { maxRequests: 30, windowMs: 60 * 1000 },         // 30 logs per minute
} as const;

type RateLimitAction = keyof typeof RATE_LIMITS;

/**
 * Check if an action is rate limited
 * @param action - The type of action to check
 * @returns true if the action should be blocked, false if allowed
 */
export function isRateLimited(action: RateLimitAction): boolean {
  const config = RATE_LIMITS[action];
  const now = Date.now();
  const entry = rateLimitStore.get(action);

  // No previous entry or window expired - reset
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(action, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }

  // Increment counter
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    console.warn(`[Rate Limit] Action "${action}" blocked: ${entry.count}/${config.maxRequests} requests`);
    return true;
  }

  return false;
}

/**
 * Get remaining requests for an action
 * @param action - The type of action to check
 * @returns Number of remaining requests in current window
 */
export function getRemainingRequests(action: RateLimitAction): number {
  const config = RATE_LIMITS[action];
  const now = Date.now();
  const entry = rateLimitStore.get(action);

  if (!entry || now > entry.resetTime) {
    return config.maxRequests;
  }

  return Math.max(0, config.maxRequests - entry.count);
}

/**
 * Get time until rate limit resets (in milliseconds)
 * @param action - The type of action to check
 * @returns Milliseconds until reset, or 0 if not limited
 */
export function getResetTime(action: RateLimitAction): number {
  const entry = rateLimitStore.get(action);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return 0;
  }

  return entry.resetTime - now;
}

/**
 * Reset rate limit for an action (for testing purposes)
 * @param action - The type of action to reset
 */
export function resetRateLimit(action: RateLimitAction): void {
  rateLimitStore.delete(action);
}
