import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase edge functions provide this)
    // Try multiple headers in order of preference
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const xRealIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare
    
    let clientIP = '';
    if (xForwardedFor) {
      // x-forwarded-for can contain multiple IPs, the first one is the client
      clientIP = xForwardedFor.split(',')[0].trim();
    } else if (cfConnectingIp) {
      clientIP = cfConnectingIp;
    } else if (xRealIp) {
      clientIP = xRealIp;
    }

    console.log('[get-location] Headers:', {
      'x-forwarded-for': xForwardedFor,
      'x-real-ip': xRealIp,
      'cf-connecting-ip': cfConnectingIp,
      'detected-ip': clientIP
    });

    // Use ip-api.com with the client IP
    const apiUrl = clientIP 
      ? `http://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone`
      : 'http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone';

    console.log('[get-location] Fetching:', apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log('[get-location] Response:', data);

    if (data.status === 'success') {
      const result = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
      };
      console.log('[get-location] Returning:', result);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('[get-location] ip-api failed:', data.message);
      throw new Error(`ip-api failed: ${data.message}`);
    }
  } catch (error) {
    console.error('[get-location] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Could not detect location',
        country: '',
        countryCode: '',
        city: '',
        region: '',
        lat: 0,
        lon: 0,
        timezone: '',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
