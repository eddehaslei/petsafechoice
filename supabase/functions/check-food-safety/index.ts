import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { food, petType } = await req.json();

    if (!food || !petType) {
      return new Response(
        JSON.stringify({ error: "Food and pet type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a veterinary nutrition expert. Your job is to provide accurate, science-based information about whether specific foods are safe for pets.

IMPORTANT RULES:
1. Always err on the side of caution - pet safety is the priority
2. Base your answers on veterinary science and toxicology data
3. Consider species-specific differences (dogs vs cats)
4. If a food is toxic, clearly state the toxic compounds and mechanisms
5. Be specific about quantities and risk levels

You must respond with a JSON object matching this exact structure:
{
  "food": "the food item",
  "petType": "dog" or "cat",
  "safetyLevel": "safe" | "caution" | "dangerous",
  "summary": "A clear 1-2 sentence summary of whether this food is safe",
  "details": "2-3 sentences with scientific explanation of why the food is safe/unsafe, including any toxic compounds or nutritional benefits",
  "symptoms": ["array", "of", "potential", "symptoms"] (optional, include if there are risks),
  "recommendations": ["array", "of", "recommendations"] (always include practical advice)
}

Safety levels:
- "safe": The food is generally safe and can be given in moderation
- "caution": The food has some risks or conditions (e.g., only in small amounts, certain preparations, or specific circumstances)
- "dangerous": The food is toxic or harmful and should never be given

Always respond with ONLY the JSON object, no additional text.`;

    const userPrompt = `Is ${food} safe for ${petType === "dog" ? "dogs" : "cats"} to eat? Provide detailed, scientifically accurate information.`;

    console.log(`Checking food safety for: ${food} (${petType})`);

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

    // Parse the JSON response from the AI
    let safetyData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      safetyData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse safety information" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Food safety result:", safetyData.safetyLevel);

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
