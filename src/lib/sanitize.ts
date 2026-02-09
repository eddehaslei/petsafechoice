/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks in search inputs
 */

/**
 * Sanitize a search query by stripping HTML tags, script injections,
 * and dangerous characters while preserving valid food names.
 */
export function sanitizeSearchQuery(input: string): string {
  return input
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script/event handler patterns
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove SQL injection patterns
    .replace(/['";\\]/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    // Trim and limit length
    .trim()
    .slice(0, 100);
}

/**
 * Validate that a string looks like a food name (not code or attack payload)
 */
export function isValidFoodInput(input: string): boolean {
  const sanitized = sanitizeSearchQuery(input);
  if (sanitized.length < 1 || sanitized.length > 100) return false;
  // Must contain at least one letter
  if (!/[a-zA-ZÀ-ÿ\u0600-\u06FF]/.test(sanitized)) return false;
  return true;
}
