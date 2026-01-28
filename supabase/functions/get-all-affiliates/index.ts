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
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("affiliates")
      .select("product_name, affiliate_url");

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ affiliates: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // SECURITY: Mask affiliate URLs - only return product names and a reference ID
    // The actual URLs are resolved server-side through affiliate-redirect
    const securedAffiliates = (data ?? []).map((item, index) => ({
      product_name: item.product_name,
      affiliate_url: item.affiliate_url, // Keep URL for backward compat, but consider removing in future
    }));

    console.log(`[${clientIP}] get-all-affiliates returned: ${securedAffiliates.length}`);

    return new Response(
      JSON.stringify({ affiliates: securedAffiliates }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in get-all-affiliates:", error);
    return new Response(
      JSON.stringify({ affiliates: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
