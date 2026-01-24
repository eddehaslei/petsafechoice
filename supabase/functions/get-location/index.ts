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
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     '';

    // Use ip-api.com with the client IP
    const apiUrl = clientIP 
      ? `http://ip-api.com/json/${clientIP}?fields=status,country,countryCode,regionName,city,lat,lon,timezone`
      : 'http://ip-api.com/json/?fields=status,country,countryCode,regionName,city,lat,lon,timezone';

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'success') {
      return new Response(
        JSON.stringify({
          country: data.country,
          countryCode: data.countryCode,
          city: data.city,
          region: data.regionName,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Failed to get location from ip-api');
    }
  } catch (error) {
    console.error('Error in get-location:', error);
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
