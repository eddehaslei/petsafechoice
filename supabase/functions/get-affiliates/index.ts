import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting to prevent scraping
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
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

// Obfuscate affiliate URLs - only return masked IDs
function maskAffiliateData(affiliates: any[]) {
  return affiliates.map(aff => ({
    id: aff.id,
    product_name: aff.product_name,
    price_point: aff.price_point,
    image_url: aff.image_url,
    food_category_link: aff.food_category_link,
    // URL is NOT exposed - must use redirect endpoint
  }));
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
      console.log(`Rate limited affiliate request: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { food_category, pet_type, country_code, limit = 4 } = await req.json();

    // Validate limit to prevent bulk downloads
    const safeLimit = Math.min(Math.max(1, limit), 10);

    // Validate country code (ISO 3166-1 alpha-2)
    const validCountryCode = country_code?.toUpperCase().match(/^[A-Z]{2}$/) ? country_code.toUpperCase() : 'US';

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First try to find geo-targeted affiliates for user's country
    let query = supabase.from('affiliates').select('*').eq('country_code', validCountryCode).limit(safeLimit);
    
    if (food_category) {
      query = query.ilike('food_category_link', `%${food_category}%`);
    }
    if (pet_type) {
      query = query.or(`food_category_link.ilike.%${pet_type}%,food_category_link.is.null`);
    }

    let { data: affiliates, error } = await query;

    // Fallback to US links if no country-specific affiliates found
    if (!error && (!affiliates || affiliates.length === 0) && validCountryCode !== 'US') {
      console.log(`No affiliates for ${validCountryCode}, falling back to US`);
      let fallbackQuery = supabase.from('affiliates').select('*').eq('country_code', 'US').limit(safeLimit);
      if (food_category) {
        fallbackQuery = fallbackQuery.ilike('food_category_link', `%${food_category}%`);
      }
      if (pet_type) {
        fallbackQuery = fallbackQuery.or(`food_category_link.ilike.%${pet_type}%,food_category_link.is.null`);
      }
      const fallbackResult = await fallbackQuery;
      affiliates = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return masked data - no raw affiliate URLs exposed
    const maskedData = maskAffiliateData(affiliates || []);

    console.log(`[${clientIP}] Served ${maskedData.length} affiliates (category: ${food_category || 'all'})`);

    return new Response(
      JSON.stringify({ products: maskedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-affiliates:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
