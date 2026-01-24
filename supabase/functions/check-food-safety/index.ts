import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets when function cold starts)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window (increased since DB is free)
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

// Validate that input looks like a food item
function isValidFoodQuery(food: string): { valid: boolean; reason?: string } {
  const trimmed = food.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, reason: "Food name too short" };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, reason: "Food name too long" };
  }
  
  // Check for question patterns that aren't about food
  const nonFoodPatterns = [
    /^(what|when|where|who|why|how)\s+(is|are|was|were|did|do|does|can|could|would|will|should)\s+(the|a|an)?\s*(time|date|day|weather|news|city|country|president|capital|age|old|year|meaning|definition)/i,
    /^(tell me about|explain|describe|what's the)\s+(history|geography|politics|science|math)/i,
    /\b(calculate|solve|compute|translate)\b/i,
    /\b(years? old|how old|born in|founded|established)\b/i,
    /\b(capital of|president of|population of|weather in)\b/i,
  ];
  
  for (const pattern of nonFoodPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, reason: "Please enter a food item, not a general question" };
    }
  }
  
  return { valid: true };
}

// Map database safety_rating to API response format
function mapSafetyRating(dbRating: string): string {
  switch (dbRating) {
    case 'safe': return 'safe';
    case 'caution': return 'caution';
    case 'toxic': return 'dangerous';
    default: return 'caution';
  }
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
      console.log(`Rate limited: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { food, petType, language = "en" } = await req.json();

    if (!food || !petType) {
      return new Response(
        JSON.stringify({ error: "Food and pet type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (petType !== "dog" && petType !== "cat") {
      return new Response(
        JSON.stringify({ error: "Pet type must be 'dog' or 'cat'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = isValidFoodQuery(food);
    if (!validation.valid) {
      console.log(`Invalid food query rejected: "${food}" - ${validation.reason}`);
      return new Response(
        JSON.stringify({ error: validation.reason }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // STEP 1: Check database first (FREE!)
    const foodLower = food.toLowerCase().trim();
    console.log(`[${clientIP}] Checking database for: ${foodLower} (${petType})`);

    const { data: dbFood, error: dbError } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', foodLower)
      .or(`species.eq.${petType},species.eq.both`)
      .maybeSingle();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // If found in database, return immediately (no AI cost!)
    if (dbFood) {
      console.log(`[${clientIP}] ✅ Found in database: ${dbFood.name} (${dbFood.safety_rating}) - FREE`);
      
      const safetyData = {
        food: dbFood.name,
        petType: petType,
        safetyLevel: mapSafetyRating(dbFood.safety_rating),
        summary: dbFood.short_answer,
        details: dbFood.long_desc || dbFood.short_answer,
        symptoms: dbFood.risks || [],
        recommendations: dbFood.serving_tips 
          ? [dbFood.serving_tips, ...(dbFood.benefits || [])]
          : dbFood.benefits || ["Consult your veterinarian for specific advice."],
        source: "database" // For debugging
      };

      return new Response(JSON.stringify(safetyData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STEP 2: Not in database - use AI (costs credits)
    console.log(`[${clientIP}] ⚠️ Not in database, using AI for: ${food}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map language codes to full language names for the prompt
    const languageNames: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      ar: "Arabic",
    };
    const targetLanguage = languageNames[language] || "English";

    const systemPrompt = `You are a veterinary nutrition expert. Your job is to provide accurate, science-based information about whether specific foods are safe for pets.

IMPORTANT RULES:
1. Always err on the side of caution - pet safety is the priority
2. Base your answers on veterinary science and toxicology data
3. Consider species-specific differences (dogs vs cats)
4. If a food is toxic, clearly state the toxic compounds and mechanisms
5. Be specific about quantities and risk levels
6. ONLY answer questions about food items. If the input is not a food, respond with safetyLevel "unknown".
7. CRITICAL: You MUST respond in ${targetLanguage}. All text fields (summary, details, symptoms, recommendations) must be written in ${targetLanguage}.

You must respond with a JSON object matching this exact structure:
{
  "food": "the food item (keep the original name, do not translate)",
  "petType": "dog" or "cat",
  "safetyLevel": "safe" | "caution" | "dangerous" | "unknown",
  "summary": "A clear 1-2 sentence summary IN ${targetLanguage}",
  "details": "2-3 sentences with scientific explanation IN ${targetLanguage}",
  "symptoms": ["array", "of", "potential", "symptoms", "IN ${targetLanguage}"],
  "recommendations": ["array", "of", "recommendations", "IN ${targetLanguage}"]
}

Always respond with ONLY the JSON object, no additional text. Remember: ALL text content must be in ${targetLanguage}.`;

    const userPrompt = `Is ${food} safe for ${petType === "dog" ? "dogs" : "cats"} to eat? Please respond in ${targetLanguage}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to check food safety" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to get safety information" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let safetyData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      safetyData = JSON.parse(cleanContent);
      safetyData.source = "ai"; // For debugging
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse safety information" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${clientIP}] AI result: ${safetyData.safetyLevel}`);

    return new Response(JSON.stringify(safetyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-food-safety:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
