/**
 * Shared Amazon Affiliate URL generator
 * Used by SafeFoodWidget (search results) and SafeFoods page (guide).
 *
 * ─── CONFIGURATION ───────────────────────────────────────────────
 * Update AFFILIATE_TAG with your Amazon Associates tracking ID.
 */

export const AFFILIATE_TAG = "petsafechoice-20";

/** Amazon domain per country code (ISO 3166-1 alpha-2) */
const COUNTRY_TO_DOMAIN: Record<string, string> = {
  // Spain & LATAM default
  ES: "amazon.es", MX: "amazon.com.mx", AR: "amazon.com", CO: "amazon.com",
  // English-speaking
  US: "amazon.com", GB: "amazon.co.uk", CA: "amazon.ca", AU: "amazon.com.au",
  IN: "amazon.in",
  // Europe
  DE: "amazon.de", FR: "amazon.fr", IT: "amazon.it", NL: "amazon.nl",
  SE: "amazon.se", PL: "amazon.pl", BE: "amazon.com.be",
  // Asia
  JP: "amazon.co.jp", SG: "amazon.sg",
  // Brazil
  BR: "amazon.com.br",
};

const DEFAULT_DOMAIN = "amazon.es"; // primary market = Spain

/**
 * Resolve the Amazon domain for a given country code.
 * Falls back to amazon.es (Spain) when unknown.
 */
export function getAmazonDomain(countryCode?: string): string {
  if (!countryCode) return DEFAULT_DOMAIN;
  return COUNTRY_TO_DOMAIN[countryCode.toUpperCase()] || DEFAULT_DOMAIN;
}

/**
 * Build a fully-encoded Amazon search URL with affiliate tag.
 *
 * @param foodName  - The food item name (e.g. "Green Beans")
 * @param petType   - "dog" | "cat"
 * @param countryCode - ISO country code for domain selection
 */
export function buildAmazonAffiliateUrl(
  foodName: string,
  petType: "dog" | "cat",
  countryCode?: string,
): string {
  const domain = getAmazonDomain(countryCode);
  const query = `${foodName} ${petType} treats`;
  return `https://www.${domain}/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}
