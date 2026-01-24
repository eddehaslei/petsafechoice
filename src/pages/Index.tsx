import { useState } from "react";
import { Dog, Cat, Heart, ArrowLeft } from "lucide-react";
import { PetToggle } from "@/components/PetToggle";
import { FoodSearch } from "@/components/FoodSearch";
import { SafetyResult, SafetyResultData } from "@/components/SafetyResult";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type PetType = "dog" | "cat";

const Index = () => {
  const [petType, setPetType] = useState<PetType>("dog");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SafetyResultData | null>(null);
  const [searchSource, setSearchSource] = useState<"trending" | "search" | null>(null);
  const { t } = useTranslation();

  const handleSearch = async (food: string, source: "trending" | "search" = "search") => {
    setIsLoading(true);
    setResult(null);
    setSearchSource(source);

    try {
      const { data, error } = await supabase.functions.invoke("check-food-safety", {
        body: { food, petType },
      });

      if (error) {
        console.error("Edge function error:", error);
        
        if (error.message?.includes("429") || error.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (error.message?.includes("402") || error.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error("Failed to check food safety. Please try again.");
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Error checking food safety:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDiscovery = () => {
    setResult(null);
    setSearchSource(null);
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
        {!result ? (
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
            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-6">
              {t('common.tagline')}
            </p>
            
            {/* Trust Bar */}
            <TrustBar />
          </div>
        ) : (
          <div className="mb-6 animate-fade-in">
            {/* Back to Discovery button for trending searches */}
            {searchSource === "trending" && (
              <button
                onClick={handleBackToDiscovery}
                className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-accent border border-border/50 hover:border-primary/30 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-x-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Discovery
              </button>
            )}
            <DynamicResultHeader data={result} />
          </div>
        )}

        {/* Pet Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <PetToggle value={petType} onChange={setPetType} />
        </div>

        {/* Search */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FoodSearch onSearch={handleSearch} isLoading={isLoading} />
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
                    onClick={() => handleSearch(food)}
                    className="px-4 py-2 bg-card hover:bg-accent rounded-full text-sm font-medium text-foreground border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trending Safety Tips - Homepage Authority Content */}
            <TrendingSafetyTips onTopicClick={(keyword) => handleSearch(keyword, "trending")} />
          </>
        )}

        {/* Results Section */}
        {(result || isLoading) && (
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {t('search.checking', { petType: petType === 'dog' ? t('petToggle.dog').toLowerCase() : t('petToggle.cat').toLowerCase() })}
                </p>
              </div>
            ) : result ? (
              <>
                {/* Featured Snippet - Google-optimized answer box */}
                <FeaturedSnippet data={result} />
                
                {/* Main Safety Result */}
                <SafetyResult data={result} />
                
                {/* Vet-Verified Badge - Trust signal */}
                <div className="w-full max-w-2xl mx-auto mt-4">
                  <VetVerifiedBadge variant="full" />
                </div>
                
                {/* Social Share */}
                <SocialShareCard data={result} />
                
                {/* Conversion hooks based on safety level */}
                {result.safetyLevel === "dangerous" && (
                  <>
                    <EmergencyBanner 
                      foodName={result.food.charAt(0).toUpperCase() + result.food.slice(1)} 
                      petType={result.petType} 
                    />
                    {/* Vet Map Widget - Phase 7 requirement */}
                    <VetMapWidget 
                      foodName={result.food.charAt(0).toUpperCase() + result.food.slice(1)} 
                      petType={result.petType} 
                    />
                  </>
                )}
                
                {result.safetyLevel === "safe" && (
                  <SafeFoodWidget 
                    foodName={result.food} 
                    petType={result.petType} 
                  />
                )}
                
                {/* Related Foods - drives engagement */}
                <RelatedFoods 
                  currentFood={result.food} 
                  petType={result.petType}
                  onFoodClick={handleSearch}
                />
              </>
            ) : null}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
