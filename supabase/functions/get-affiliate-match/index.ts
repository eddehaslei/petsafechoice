import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT;
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
      return new Response(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { food_name, country_code } = await req.json();

    if (!food_name) {
      return new Response(
        JSON.stringify({ affiliate: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Normalize food name for matching
    const normalizedFoodName = food_name.toLowerCase().trim();

    // First try to find an exact or partial match for the user's country
    const validCountryCode = country_code?.toUpperCase().match(/^[A-Z]{2}$/) ? country_code.toUpperCase() : 'US';

    let { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('id, product_name, affiliate_url')
      .eq('country_code', validCountryCode)
      .ilike('product_name', `%${normalizedFoodName}%`)
      .limit(1)
      .maybeSingle();

    // Fallback to US if no country-specific match found
    if (!error && !affiliate && validCountryCode !== 'US') {
      const fallback = await supabase
        .from('affiliates')
        .select('id, product_name, affiliate_url')
        .eq('country_code', 'US')
        .ilike('product_name', `%${normalizedFoodName}%`)
        .limit(1)
        .maybeSingle();
      
      affiliate = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ affiliate: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${clientIP}] Affiliate match for "${food_name}": ${affiliate ? affiliate.product_name : 'none'}`);

    return new Response(
      JSON.stringify({ affiliate }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-affiliate-match:", error);
    return new Response(
      JSON.stringify({ affiliate: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
