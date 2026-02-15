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
import { TrendingSafetyTips } from "@/components/TrendingSafetyTips";
import { TrendingIn2026 } from "@/components/TrendingIn2026";
import { RecentSearches, useRecentSearches } from "@/components/RecentSearches";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { BackToTop } from "@/components/BackToTop";
import { SafetyMeter } from "@/components/SafetyMeter";
import { DoseResponseSlider } from "@/components/DoseResponseSlider";
import { EmergencyVetButton } from "@/components/EmergencyVetButton";
import { IngredientBreakdown } from "@/components/IngredientBreakdown";
import { SourceCitation } from "@/components/SourceCitation";
import { useSearchStore } from "@/stores/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { sanitizeSearchQuery } from "@/lib/sanitize";
import { detectFoodState, getFoodStateNote } from "@/lib/foodState";

// Debounce helper for rate limiting - 1 second minimum between searches
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const lastCall = useRef<number>(0);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    } else {
      toast.info("Please wait a moment before searching again.");
    }
  }, [callback, delay]);
};

const Index = () => {
  const { t, i18n } = useTranslation();
  const { addSearch } = useRecentSearches();
  
  // Global state from Zustand store - persists across navigation
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

  const handleSearchCore = useCallback(async (food: string, source: "trending" | "search" = "search") => {
    const normalizedFood = food.trim();
    if (!normalizedFood) return;
    
    // INSTANT: Check cache first for <50ms response
    const cached = getCachedResult(normalizedFood, petType);
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
      setCachedResult(normalizedFood, petType, data);
      
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
  const handleSearch = useDebounce(handleSearchCore, 1000);

  // INSTANT toggle switch - use cache if available (target: <100ms)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Only trigger if petType actually changed and we have a previous search
    if (previousPetType.current !== petType && lastSearchedFood) {
      // Check cache first for instant switch
      const cached = getCachedResult(lastSearchedFood, petType);
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

  // Auto-refresh when language changes (if there's an active search)
  useEffect(() => {
    if (previousLanguage.current !== i18n.language && lastSearchedFood && result) {
      handleSearch(lastSearchedFood, searchSource || "search");
    }
    previousLanguage.current = i18n.language;
  }, [i18n.language, lastSearchedFood, result, searchSource, handleSearch]);

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
      
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-4 pb-8">
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
            
            {/* Trending Safety Tips - Homepage Authority Content */}
            <TrendingSafetyTips onTopicClick={(keyword) => handleSearch(keyword, "trending")} />
            
            {/* 2026 Trends Section */}
            <TrendingIn2026 />
          </>
        )}

        {/* Results Section */}
        {(result || isLoading) && (
          <div className="mt-8">
            {isLoading ? (
              <SkeletonLoader variant="result" />
            ) : result ? (
              <>
                {/* Featured Snippet - Google-optimized answer box */}
                <FeaturedSnippet data={result} />
                
                {/* Safety Meter - Animated gauge */}
                <SafetyMeter safetyLevel={result.safetyLevel} />
                
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
                
                {/* Affiliate Widget - shows for ALL safety levels with safety intelligence */}
                <SafeFoodWidget 
                  foodName={result.food} 
                  petType={result.petType}
                  safetyLevel={result.safetyLevel}
                />
                
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
