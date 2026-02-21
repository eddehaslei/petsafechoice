import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


const EN_UI_STRINGS = {
  "common.appName": "Can My Pet Eat This?",
  "common.tagline": "Science-backed food safety information for dogs and cats. Know what's safe before you share!",
  "common.popularSearches": "Popular searches:",
  "common.madeWithLove": "Made with",
  "common.forPets": "for pets everywhere",
  "common.allRightsReserved": "All rights reserved.",
  "nav.back": "Back",
  "nav.home": "Home",
  "nav.about": "About",
  "nav.safeFoods": "Safe Foods",
  "nav.emergency": "Emergency",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "search.placeholder": "Search for a food (e.g., chocolate, grapes, chicken...)",
  "search.button": "Check Safety",
  "search.checking": "Checking if it's safe for your {{petType}}...",
  "petToggle.dog": "Dog",
  "petToggle.cat": "Cat",
  "safety.safe": "Safe",
  "safety.caution": "Caution",
  "safety.dangerous": "Dangerous",
  "safety.safeTitle": "Safe to Eat",
  "safety.cautionTitle": "Use Caution",
  "safety.dangerousTitle": "Dangerous",
  "safety.symptoms": "Symptoms to Watch For",
  "safety.recommendations": "Recommendations",
  "safety.disclaimer": "This information is for general guidance only. Always consult with your veterinarian.",
  "featuredSnippet.safeAnswer": "Yes, {{petType}} can safely eat {{food}}.",
  "featuredSnippet.cautionAnswer": "{{food}} should be given to {{petType}} with caution.",
  "featuredSnippet.dangerousAnswer": "No! {{food}} is toxic to {{petType}}.",
  "resultHeader.canEat": "Can {{petName}} Eat {{foodName}}?",
  "resultHeader.lastUpdated": "Last Updated:",
  "resultHeader.safetyGuide": "Safety & Health Guide",
  "safeFoodWidget.recommendedProduct": "Recommended Product",
  "safeFoodWidget.matchFound": "We found a great option for you!",
  "safeFoodWidget.disclosure": "We may earn a small commission from qualifying purchases.",
  "safeFoodWidget.amazonDisclosure": "As an Amazon Associate, I earn from qualifying purchases.",
  "safeFoodWidget.shopOn": "Shop {{food}} on Amazon",
  "vetBadge.verified": "Vet-Verified",
  "vetBadge.reviewedBy": "Medically reviewed by licensed veterinary professionals",
  "newsletter.title": "Weekly Safety Tips",
  "newsletter.description": "Get pet food safety tips, recalls, and expert advice in your inbox.",
  "newsletter.placeholder": "Enter your email",
  "newsletter.subscribe": "Subscribe",
  "newsletter.subscribed": "You're subscribed!",
  "emergency.title": "Emergency Contacts",
  "emergency.immediateHelp": "If Your Pet Is In Immediate Danger",
  "emergency.callVet": "Call your nearest emergency vet clinic immediately. Time is critical in poisoning cases.",
  "emergency.24hClinics": "24/7 Emergency Vet Clinics",
  "emergency.whatToDo": "What To Do In A Pet Emergency",
  "emergency.step1Title": "Stay calm.",
  "emergency.step1Desc": "Your pet can sense your stress.",
  "emergency.step2Title": "Note what they ate",
  "emergency.step2Desc": "and approximately how much.",
  "emergency.step3Title": "Call the emergency vet",
  "emergency.step3Desc": "before heading there.",
  "emergency.step4Title": "Don't induce vomiting",
  "emergency.step4Desc": "unless specifically instructed by a vet.",
  "emergency.step5Title": "Bring the packaging",
  "emergency.step5Desc": "or sample of what your pet consumed if possible.",
  "emergency.searchMaps": "Search on Google Maps",
  "emergencyVet.findNearest": "EMERGENCY: FIND NEAREST VET",
  "emergencyVet.callNow": "Call Now",
  "emergencyVet.directions": "Directions",
  "safeFoods.title": "Safe Foods Guide",
  "safeFoods.dogsTab": "Dogs",
  "safeFoods.catsTab": "Cats",
  "safeFoods.showMore": "Show More",
  "recentSearches.title": "Recently Checked",
  "recentSearches.clear": "Clear",
  "share.button": "Share This Result",
  "requestFood.button": "Request '{{food}}' to be reviewed",
  "errors.generic": "Something went wrong. Please try again.",
  "errors.tooManyRequests": "Too many requests. Please wait a moment and try again.",
  "notFound.message": "Oops! This page doesn't exist.",
  "notFound.backHome": "Back to Home",
  "footer.company": "Company",
  "footer.resources": "Resources",
  "footer.support": "Support",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.disclaimer": "Disclaimer",
  "footer.aboutTitle": "About PetSafe Choice",
  "footer.aboutText": "At PetSafe Choice, we believe every pet deserves a long, healthy life.",
  "footer.disclaimerTitle": "Medical Disclaimer",
  "footer.disclaimerText": "PetSafe Choice provides information for educational purposes only. Always consult your veterinarian.",
  "footer.readMore": "Read full disclaimer →",
  "footer.affiliateTitle": "Amazon Affiliate Disclosure",
  "footer.affiliateDisclosure": "As an Amazon Associate, PetSafe Choice earns from qualifying purchases.",
  "rateLimit.tooFast": "You're searching fast! Please wait a moment."
};


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });


  try {
    const { targetLanguage, languageCode } = await req.json();
    if (!targetLanguage || !languageCode) {
      return new Response(JSON.stringify({ error: "targetLanguage and languageCode required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }


    const langCode = languageCode.toLowerCase().slice(0, 5);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);


    // Check cache first
    const { data: cached } = await supabase
      .from("ui_translations")
      .select("translations")
      .eq("language_code", langCode)
      .maybeSingle();


    if (cached?.translations) {
      return new Response(JSON.stringify({ translations: cached.translations, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }


    // Translate via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const prompt = `Translate these UI strings from English to ${targetLanguage}.
RULES:
- Keep {{variable}} placeholders EXACTLY as they are — never translate them
- Keep JSON key names identical
- Only translate the string values
- Return ONLY valid JSON, no markdown fences, no explanation
- Use natural, friendly tone for a pet care app


${JSON.stringify(EN_UI_STRINGS, null, 2)}`;


    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "user", content: prompt }] }),
    });


    if (!aiResponse.ok) throw new Error(`AI error: ${aiResponse.status}`);


    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    const clean = content.replace(/```json\n?|\n?```/g, "").trim();
    const translated = JSON.parse(clean);


    // Cache in database
    await supabase.from("ui_translations").upsert({
      language_code: langCode,
      language_name: targetLanguage,
      translations: translated,
      created_at: new Date().toISOString()
    }, { onConflict: "language_code" });


    return new Response(JSON.stringify({ translations: translated, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });


  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});