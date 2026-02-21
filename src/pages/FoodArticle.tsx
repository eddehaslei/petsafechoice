import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SafetyMeter } from "@/components/SafetyMeter";
import { SafeFoodWidget } from "@/components/SafeFoodWidget";
import { VetVerifiedBadge } from "@/components/VetVerifiedBadge";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { DynamicSEO } from "@/components/DynamicSEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SourceCitation } from "@/components/SourceCitation";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, ArrowLeft } from "lucide-react";
import type { SafetyLevel } from "@/components/SafetyResult";

interface FoodData {
  name: string;
  species: string;
  safety_rating: "safe" | "caution" | "toxic";
  short_answer: string;
  long_desc: string | null;
  category: string | null;
  created_at: string;
}

const safetyMap: Record<string, SafetyLevel> = {
  safe: "safe",
  caution: "caution",
  toxic: "dangerous",
};

export default function FoodArticle() {
  const { foodSlug } = useParams<{ foodSlug: string }>();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [food, setFood] = useState<FoodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const species = location.pathname.includes("/can-cats-eat") ? "cats" : "dogs";

  const petType = species === "cats" ? "cat" : "dog";
  const petLabel = petType === "dog" ? "Dogs" : "Cats";
  const foodName = (foodSlug || "").replace(/-/g, " ");

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .ilike("name", foodName)
        .in("species", [petType, "both"])
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setFood(data as unknown as FoodData);
      }
      setLoading(false);
    };
    fetchFood();
  }, [foodSlug, species]);

  const safetyLevel = food ? safetyMap[food.safety_rating] || "caution" : "caution";

  const getSafetyColor = () => {
    switch (safetyLevel) {
      case "safe": return "text-safe";
      case "caution": return "text-caution";
      case "dangerous": return "text-danger";
    }
  };

  const getSafetyIcon = () => {
    switch (safetyLevel) {
      case "safe": return <CheckCircle className="w-6 h-6 text-safe" />;
      case "caution": return <AlertTriangle className="w-6 h-6 text-caution" />;
      case "dangerous": return <XCircle className="w-6 h-6 text-danger" />;
    }
  };

  const resultForSchema = food ? {
    food: food.name,
    petType: petType as "dog" | "cat",
    safetyLevel,
    summary: food.short_answer,
    details: food.long_desc || "",
    symptoms: [],
    recommendations: [],
    ingredients: [],
    toxicityThreshold: null,
    source: { name: "PetSafeChoice Database", url: "https://petsafechoice.lovable.app" },
  } : null;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {resultForSchema && <DynamicSEO result={resultForSchema} />}
      {resultForSchema && <JsonLdSchema result={resultForSchema} />}
      <Header />

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-accent border border-border/50 text-sm font-medium text-foreground transition-all min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('nav.back')} {t('nav.home')}
        </Link>

        {loading ? (
          <SkeletonLoader variant="result" />
        ) : notFound ? (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-heading font-bold mb-2">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We don't have a verified article for "{capitalize(foodName)}" yet.
            </p>
            <Link
              to={`/en/food/${foodSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Search "{capitalize(foodName)}" instead
            </Link>
          </div>
        ) : food ? (
          <article className="animate-fade-in">
            <Breadcrumbs foodName={food.name} safetyLevel={safetyLevel} />

            {/* Article Header */}
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mt-4 mb-2">
              Can {petLabel} Eat {capitalize(food.name)}?
            </h1>

            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last Updated: {new Date(food.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <VetVerifiedBadge variant="compact" />
            </div>

            {/* Safety Gauge */}
            <SafetyMeter safetyLevel={safetyLevel} />

            <div className="h-6" />

            {/* Affiliate */}
            <SafeFoodWidget foodName={food.name} petType={petType} safetyLevel={safetyLevel} />

            {/* Traffic Light Summary */}
            <div className="mt-8 p-5 rounded-2xl border-2 border-border bg-card">
              <div className="flex items-start gap-3 mb-3">
                {getSafetyIcon()}
                <p className={`font-bold text-lg ${getSafetyColor()}`}>
                  {food.short_answer}
                </p>
              </div>
              {food.long_desc && (
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {food.long_desc}
                </p>
              )}
            </div>


            {/* Source */}
            <SourceCitation source={{ name: "PetSafeChoice Database", url: "https://petsafechoice.lovable.app" }} />

            {/* CTA */}
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                Check Another Food →
              </Link>
            </div>
          </article>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
