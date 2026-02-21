import { useEffect, useCallback, useRef } from "react";
import { Dog, Cat, Heart, ArrowLeft } from "lucide-react";
import { PetToggle } from "@/components/PetToggle";
import { FoodSearch } from "@/components/FoodSearch";
import { SafetyResult } from "@/components/SafetyResult";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { DynamicSEO } from "@/components/DynamicSEO";
import { DynamicResultHeader } from "@/components/DynamicResultHeader";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { SafeFoodWidget } from "@/components/SafeFoodWidget";
import { SocialShareCard } from "@/components/SocialShareCard";
import { RelatedFoods } from "@/components/RelatedFoods";
import { FeaturedSnippet } from "@/components/FeaturedSnippet";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { VetMapWidget } from "@/components/VetMapWidget";
import { VetVerifiedBadge } from "@/components/VetVerifiedBadge";
import { RecentSearches, useRecentSearches } from "@/components/RecentSearches";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { BackToTop } from "@/components/BackToTop";
import { SafetyMeter } from "@/components/SafetyMeter";
import { DoseResponseSlider } from "@/components/DoseResponseSlider";
import { EmergencyVetButton } from "@/components/EmergencyVetButton";
import { IngredientBreakdown } from "@/components/IngredientBreakdown";
import { SourceCitation } from "@/components/SourceCitation";
import { RequestFood } from "@/components/RequestFood";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSearchStore } from "@/stores/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { detectFoodState, getFoodStateNote } from "@/lib/foodState";
import { usePermalink } from "@/hooks/usePermalink";

// Debounce helper for rate limiting - 1 second minimum between searches
const useDebounce = (callback: (...args: any[]) => void, delay: number, rateLimitMessage?: string) => {
  const lastCall = useRef<number>(0);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    } else {
      toast.info(rateLimitMessage || "Please wait a moment before searching again.");
    }
  }, [callback, delay, rateLimitMessage]);
};

const Index = () => {
  const { t, i18n } = useTranslation();
  const { addSearch } = useRecentSearches();
  
  // Global state from Zustand store
  const {
    petType,
    result,
    lastSearchedFood,
    isLoading,
    searchSource,
    setPetType,
    setResult,
    setLastSearchedFood,
    setIsLoading,
    setSearchSource,
    clearResult,
    getCachedResult,
    setCachedResult,
  } = useSearchStore();

  // Permalink - updates URL to /[lang]/food/[food-name]
  usePermalink(result);

  // Track if we should trigger auto-refresh on toggle changes
  const isFirstRender = useRef(true);
  const previousPetType = useRef(petType);
  const previousLanguage = useRef(i18n.language);

  // Log search to database
  const logSearch = useCallback(async (query: string, species: string, safetyLevel?: string) => {
    try {
      const sanitized = sanitizeSearchQuery(query);
      await supabase
        .from("search_logs")
        .insert([
          {
            query: sanitized.toLowerCase(),
            species: species,
            language: i18n.language,
            result_safety_level: safetyLevel || null,
            source: "search",
          },
        ]);
    } catch {
      // Silent fail for analytics
    }
  }, [i18n.language]);

  // Client-side blacklist for non-food items — bypass AI entirely
  // Uses FUZZY matching: if the search query CONTAINS any of these keywords, block it
  const NON_FOOD_KEYWORDS = [
    // Chemicals & cleaning
    'bleach', 'lejía', 'lejia', 'detergent', 'detergente', 'antifreeze', 'anticongelante',
    'paint', 'pintura', 'gasoline', 'gasolina', 'pesticide', 'pesticida',
    'poison', 'veneno', 'cleaning', 'limpieza', 'cleaner', 'limpiador',
    'fertilizer', 'fertilizante', 'insecticide', 'insecticida', 'turpentine', 'ammonia',
    'chemical', 'químico', 'quimico', 'solvent', 'disolvente', 'acid', 'ácido',
    // Drugs & medications
    'weed', 'marijuana', 'marihuana', 'meth', 'cocaine', 'cocaína', 'cocaina',
    'pill', 'pastilla', 'ibuprofen', 'ibuprofeno', 'acetaminophen', 'aspirin', 'aspirina',
    'thc', 'cbd', 'xanax', 'adderall', 'opioid', 'fentanyl', 'heroin', 'heroína',
    'medication', 'medicamento', 'medicine', 'medicina', 'drug', 'droga',
    // Objects
    'glass', 'vidrio', 'coin', 'moneda', 'sock', 'calcetín', 'calcetines',
    'battery', 'batteries', 'pila', 'pilas',
    'plastic', 'plástico', 'plastico', 'rubber', 'goma', 'fabric', 'tela',
    'string', 'yarn', 'hilo', 'rock', 'piedra', 'liquid', 'líquido',
  ];

  // FUZZY CHECK: if query contains ANY blacklisted keyword, block immediately
  const isNonFoodItem = (query: string): boolean => {
    const lower = query.toLowerCase().trim();
    return NON_FOOD_KEYWORDS.some(keyword => lower.includes(keyword));
  };

  const handleSearchCore = useCallback(async (food: string, source: "trending" | "search" = "search") => {
    const normalizedFood = food.trim();
    if (!normalizedFood) return;

    // FUZZY BLACKLIST CHECK: block anything containing a non-food keyword
    if (isNonFoodItem(normalizedFood)) {
      const dangerResult = {
        food: normalizedFood,
        petType,
        safetyLevel: "dangerous" as const,
        summary: t('safety.nonFoodSummary', `🚨 "${normalizedFood}" is NOT a food item and is extremely hazardous to pets. Do NOT let your pet ingest this substance.`),
        details: t('safety.nonFoodDetails', `This is a dangerous chemical/object. If your pet has ingested "${normalizedFood}", contact an emergency veterinarian or animal poison control immediately.`),
        symptoms: [
          t('safety.nonFoodSymptom1', 'Severe poisoning or chemical burns'),
          t('safety.nonFoodSymptom2', 'Vomiting, seizures, difficulty breathing'),
          t('safety.nonFoodSymptom3', 'Internal organ damage'),
        ],
        recommendations: [
          t('safety.nonFoodRec1', 'Call your emergency vet immediately'),
          t('safety.nonFoodRec2', 'Do NOT induce vomiting unless instructed by a vet'),
          t('safety.nonFoodRec3', 'Bring the product packaging to the vet'),
        ],
        ingredients: [],
        toxicityThreshold: null,
        source: { name: "Safety Guardrail", url: "https://www.aspca.org/pet-care/animal-poison-control" },
      };
      setResult(dangerResult);
      setLastSearchedFood(normalizedFood);
      setSearchSource(source);
      setIsLoading(false);
      addSearch(normalizedFood);
      return;
    }
    
    // INSTANT: Check cache first for <50ms response
    const cached = getCachedResult(normalizedFood, petType, i18n.language);
    if (cached) {
      // No loading state - instant switch
      setResult(cached);
      setLastSearchedFood(normalizedFood);
      setSearchSource(source);
      setIsLoading(false);
      addSearch(normalizedFood);
      // Log asynchronously
      logSearch(normalizedFood, petType, cached.safetyLevel);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setSearchSource(source);
    setLastSearchedFood(normalizedFood);

    try {
      // Detect food state (frozen, raw, cooked, dried)
      const { state: foodState, cleanName } = detectFoodState(normalizedFood);
      const stateNote = getFoodStateNote(foodState, i18n.language);

      const { data, error } = await supabase.functions.invoke("check-food-safety", {
        body: { food: normalizedFood, petType, language: i18n.language },
      });

      if (error) {
        if (error.message?.includes("429") || error.status === 429) {
          toast.error(t('errors.tooManyRequests'));
        } else if (error.message?.includes("402") || error.status === 402) {
          toast.error(t('errors.serviceUnavailable'));
        } else {
          toast.error(t('errors.genericWithSupport'), {
            action: {
              label: t('errors.contactSupport', 'Email Support'),
              onClick: () => window.location.href = '/contact',
            },
          });
        }
        setIsLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      // Append food state note to details if applicable
      if (stateNote && data) {
        data.details = `${data.details}\n\n${stateNote}`;
      }

      setResult(data);
      // Cache for instant species toggle
      setCachedResult(normalizedFood, petType, data, i18n.language);
      
      if (data && !data.error) {
        addSearch(normalizedFood);
        logSearch(normalizedFood, petType, data.safetyLevel);
      }
    } catch {
      toast.error(t('errors.genericWithSupport'), {
        action: {
          label: t('errors.contactSupport', 'Email Support'),
          onClick: () => window.location.href = '/contact',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [petType, i18n.language, setIsLoading, setResult, setSearchSource, setLastSearchedFood, addSearch, t, getCachedResult, setCachedResult, logSearch]);

  // Debounced search - 1 second minimum between searches
  const handleSearch = useDebounce(handleSearchCore, 1000, t('rateLimit.tooFast'));

  // INSTANT toggle switch - use cache if available (target: <100ms)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Only trigger if petType actually changed and we have a previous search
    if (previousPetType.current !== petType && lastSearchedFood) {
      // Check cache first for instant switch
      const cached = getCachedResult(lastSearchedFood, petType, i18n.language);
      if (cached) {
        // INSTANT: No loading state, just swap the data
        setIsLoading(false);
        setResult(cached);
        // Log the toggle switch
        logSearch(lastSearchedFood, petType, cached.safetyLevel);
      } else {
        // No cache, fetch new data
        handleSearch(lastSearchedFood, searchSource || "search");
      }
    }
    previousPetType.current = petType;
  }, [petType, lastSearchedFood, searchSource, handleSearch, getCachedResult, setResult, setIsLoading, logSearch]);

  // FORCE re-fetch when language changes (clear result, show spinner, re-query)
  useEffect(() => {
    if (previousLanguage.current !== i18n.language && lastSearchedFood) {
      // Clear stale result immediately so old-language text is never shown
      setResult(null);
      setIsLoading(true);
      // Re-fetch in new language (bypass debounce by calling core directly)
      handleSearchCore(lastSearchedFood, searchSource || "search");
    }
    previousLanguage.current = i18n.language;
  }, [i18n.language, lastSearchedFood, searchSource, handleSearchCore, setResult, setIsLoading]);

  const handleBackToDiscovery = () => {
    clearResult();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic background based on safety level
  const getBackgroundClass = () => {
    if (!result) return "hero-gradient";
    switch (result.safetyLevel) {
      case "safe":
        return "bg-gradient-to-b from-safe-bg via-background to-background";
      case "caution":
        return "bg-gradient-to-b from-caution-bg via-background to-background";
      case "dangerous":
        return "bg-gradient-to-b from-danger-bg via-background to-background";
      default:
        return "hero-gradient";
    }
  };

  return (
    <div className={cn("min-h-screen relative flex flex-col transition-colors duration-500", getBackgroundClass())}>
      {/* Dynamic SEO - updates page title and meta tags */}
      <DynamicSEO result={result} />
      
      {/* JSON-LD Schema for Google rich results */}
      <JsonLdSchema result={result} />

      {/* Hero Background Image - only on landing */}
      {!result && !isLoading && (
        <div className="absolute inset-x-0 top-0 h-[60vh] overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: "url('/images/pet-bg.jpg')", opacity: 0.20, filter: "blur(1px) brightness(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
      )}
      
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-4 pb-8 relative z-10">
        {/* Header - show default or dynamic based on result */}
        {!result && !isLoading ? (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Dog className="w-12 h-12 text-primary animate-bounce-gentle" />
              </div>
              <Heart className="w-7 h-7 text-primary/60" />
              <div className="relative">
                <Cat className="w-12 h-12 text-primary animate-bounce-gentle" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-3">
              {t('common.appName')}
            </h1>
            {/* Tagline - hidden on mobile for cleaner UI */}
            <p className="hidden sm:block text-lg text-muted-foreground max-w-lg mx-auto mb-6">
              {t('common.tagline')}
            </p>
            
            {/* Trust Bar - hidden on mobile for cleaner UI */}
            <div className="hidden sm:block">
              <TrustBar />
            </div>
          </div>
        ) : result ? (
          <div className="mb-6 animate-fade-in">
            {/* Back to Home button - always visible on results */}
            <button
              onClick={handleBackToDiscovery}
              className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-accent border border-border/50 hover:border-primary/30 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-x-0.5 min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('nav.back')} {t('nav.home')}
            </button>
            <DynamicResultHeader data={result} />
          </div>
        ) : null}

        {/* Pet Toggle */}
        <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <PetToggle value={petType} onChange={setPetType} />
        </div>

        {/* Search - Full width with button below */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FoodSearch onSearch={(food) => handleSearch(food, "search")} isLoading={isLoading} />
        </div>

        {/* Popular Foods */}
        {!result && !isLoading && (
          <>
            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-muted-foreground mb-3">{t('common.popularSearches')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Chocolate", "Grapes", "Chicken", "Peanut Butter", "Bananas", "Avocado"].map((food) => (
                  <button
                    key={food}
                    onClick={() => handleSearch(food, "search")}
                    className="px-4 py-2 bg-card hover:bg-accent rounded-full text-sm font-medium text-foreground border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Popular Food Safety Guides */}
            <div className="mt-10 mb-8 animate-fade-in" style={{ animationDelay: "0.35s" }}>
              <h2 className="text-xl font-heading font-bold text-foreground text-center mb-4">
                Popular Food Safety Guides 🔍
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { slug: "chocolate", name: "Chocolate", emoji: "🍫", status: "dangerous" as const },
                  { slug: "grapes", name: "Grapes", emoji: "🍇", status: "dangerous" as const },
                  { slug: "chicken", name: "Chicken", emoji: "🍗", status: "safe" as const },
                  { slug: "avocado", name: "Avocado", emoji: "🥑", status: "caution" as const },
                  { slug: "peanut-butter", name: "Peanut Butter", emoji: "🥜", status: "caution" as const },
                  { slug: "bananas", name: "Bananas", emoji: "🍌", status: "safe" as const },
                  { slug: "onions", name: "Onions", emoji: "🧅", status: "dangerous" as const },
                  { slug: "strawberries", name: "Strawberries", emoji: "🍓", status: "safe" as const },
                  { slug: "milk", name: "Milk", emoji: "🥛", status: "caution" as const },
                  { slug: "watermelon", name: "Watermelon", emoji: "🍉", status: "safe" as const },
                ].map((food) => (
                  <a
                    key={food.slug}
                    href={`/foods/${food.slug}`}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                      food.status === "safe" ? "border-safe/30 hover:border-safe/60 bg-safe-bg/30" :
                      food.status === "caution" ? "border-caution/30 hover:border-caution/60 bg-caution-bg/30" :
                      "border-danger/30 hover:border-danger/60 bg-danger-bg/30"
                    )}
                  >
                    <span className="text-2xl mb-1">{food.emoji}</span>
                    <span className="text-xs font-semibold text-foreground text-center">{food.name}</span>
                  </a>
                ))}
              </div>
              <div className="text-center mt-3">
                <a href="/foods" className="text-sm text-primary hover:underline font-medium">
                  View all food guides →
                </a>
              </div>
            </div>

          </>
        )}

        {/* Results Section */}
        {(result || isLoading) && (
          <div className="mt-4">
            {isLoading ? (
              <SkeletonLoader variant="result" />
            ) : result ? (
              <>
                {/* Breadcrumbs for SEO hierarchy */}
                <Breadcrumbs foodName={result.food} safetyLevel={result.safetyLevel} />
                
                {/* Featured Snippet - Google-optimized answer box */}
                <FeaturedSnippet data={result} />
                
                {/* Safety Meter - Animated gauge */}
                <SafetyMeter safetyLevel={result.safetyLevel} />
                
                {/* Affiliate Widget - HIGH VISIBILITY: directly under safety indicator */}
                <SafeFoodWidget 
                  foodName={result.food} 
                  petType={result.petType}
                  safetyLevel={result.safetyLevel}
                />
                
                {/* Main Safety Result */}
                <SafetyResult data={result} />
                
                {/* Source Citation */}
                <SourceCitation source={result.source} />
                
                {/* Ingredient Breakdown for mixed dishes */}
                <IngredientBreakdown ingredients={result.ingredients || []} foodName={result.food} />
                
                {/* Dose-Response Calculator */}
                <DoseResponseSlider
                  safetyLevel={result.safetyLevel}
                  toxicityThreshold={result.toxicityThreshold}
                  foodName={result.food}
                  petType={result.petType}
                />
                
                {/* Vet-Verified Badge - Trust signal */}
                <div className="w-full max-w-2xl mx-auto mt-4">
                  <VetVerifiedBadge variant="full" />
                </div>
                
                {/* Social Share */}
                <SocialShareCard data={result} />
                
                {/* Emergency actions for dangerous foods */}
                {result.safetyLevel === "dangerous" && (
                  <>
                    <div className="w-full max-w-2xl mx-auto">
                      <EmergencyVetButton petType={result.petType} />
                    </div>
                    <EmergencyBanner 
                      foodName={result.food.charAt(0).toUpperCase() + result.food.slice(1)} 
                      petType={result.petType} 
                    />
                    <VetMapWidget 
                      foodName={result.food.charAt(0).toUpperCase() + result.food.slice(1)} 
                      petType={result.petType} 
                    />
                  </>
                )}
                
                {/* Related Foods - drives engagement */}
                <RelatedFoods 
                  currentFood={result.food} 
                  petType={result.petType}
                  onFoodClick={handleSearch}
                />
                
                {/* Recent Searches - helps users compare foods */}
                <RecentSearches 
                  onFoodClick={(food) => handleSearch(food, "search")} 
                  currentFood={result.food}
                />
                
                {/* Request a Food - shows when result might be AI-generated */}
                {result.source?.name === "AI" && (
                  <RequestFood foodName={result.food} petType={result.petType} />
                )}
              </>
            ) : null}
          </div>
        )}
      </main>

      <Footer />
      
      {/* Back to Top - shows on long pages */}
      <BackToTop />
    </div>
  );
};

export default Index;
