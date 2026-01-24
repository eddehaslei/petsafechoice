import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting for redirects
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60; // clicks per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  record.count++;
  if (record.count > RATE_LIMIT) {
    return true;
  }
  return false;
}

// Amazon domain mapping for global monetization
const AMAZON_DOMAINS: Record<string, string> = {
  US: "amazon.com",
  DE: "amazon.de",
  ES: "amazon.es",
  FR: "amazon.fr",
  GB: "amazon.co.uk",
  IT: "amazon.it",
  CA: "amazon.ca",
  AU: "amazon.com.au",
  JP: "amazon.co.jp",
};

// Convert amazon.com URLs to localized versions
function localizeAmazonUrl(url: string, countryCode: string): string {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check if it's an Amazon URL
    if (!hostname.includes("amazon.")) {
      return url; // Not Amazon, return as-is
    }
    
    // Get target domain for country (default to US)
    const targetDomain = AMAZON_DOMAINS[countryCode] || AMAZON_DOMAINS["US"];
    
    // Replace the hostname with localized domain
    parsedUrl.hostname = targetDomain;
    
    console.log(`Localized Amazon URL: ${url} -> ${parsedUrl.toString()} (${countryCode})`);
    return parsedUrl.toString();
  } catch {
    return url; // If parsing fails, return original
  }
}

// Detect country from IP using ipapi.co
async function detectCountryFromIP(ip: string): Promise<string> {
  try {
    if (ip === "unknown" || ip === "127.0.0.1") {
      return "US";
    }
    
    const response = await fetch(`https://ipapi.co/${ip}/country/`, {
      headers: { "User-Agent": "PetSafeChoice/1.0" },
    });
    
    if (response.ok) {
      const country = await response.text();
      if (country && country.length === 2) {
        console.log(`Detected country ${country} for IP ${ip}`);
        return country.toUpperCase();
      }
    }
  } catch (err) {
    console.error("IP detection failed:", err);
  }
  return "US";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIP)) {
      console.log(`Rate limited redirect: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const affiliateId = url.searchParams.get('id');
    const requestedCountry = url.searchParams.get('country'); // Allow override

    if (!affiliateId) {
      return new Response(
        JSON.stringify({ error: "Product ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate UUID format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(affiliateId)) {
      return new Response(
        JSON.stringify({ error: "Invalid product ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Detect user's country from IP (or use override)
    const countryCode = requestedCountry?.toUpperCase() || await detectCountryFromIP(clientIP);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('affiliate_url, product_name')
      .eq('id', affiliateId)
      .single();

    if (error || !affiliate) {
      console.error("Affiliate not found:", affiliateId);
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Localize Amazon URLs for the user's country
    const localizedUrl = localizeAmazonUrl(affiliate.affiliate_url, countryCode);

    console.log(`[${clientIP}] Redirect to: ${affiliate.product_name} (${countryCode} -> ${localizedUrl})`);

    // Return the localized URL for frontend redirect
    return new Response(
      JSON.stringify({ url: localizedUrl, country: countryCode }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in affiliate-redirect:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
