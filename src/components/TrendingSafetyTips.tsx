import { useState, useEffect } from "react";
import { Sparkles, Leaf, Fish, Heart, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useGeoLocation } from "@/hooks/useGeoLocation";

interface TrendingTopic {
  id: string;
  icon: React.ReactNode;
  title: string;
  keyword: string;
  summary: string;
  badge: string;
  badgeColor: "coral" | "sage" | "cream";
  affiliateCategory: string;
}

interface AffiliateProduct {
  id: string;
  product_name: string;
  price_point: string | null;
  image_url: string | null;
}

const trendingTopics: TrendingTopic[] = [
  {
    id: "salmon-oil",
    icon: <Fish className="w-5 h-5" />,
    title: "The Salmon Oil Secret",
    keyword: "Best Salmon Oil 2026",
    summary: "Wild-Caught Omega 3 Liquid – liquid gold for fur health and joint support.",
    badge: "Popular",
    badgeColor: "coral",
    affiliateCategory: "salmon oil",
  },
  {
    id: "mushrooms",
    icon: <Sparkles className="w-5 h-5" />,
    title: "Lion's Mane Focus",
    keyword: "Medicinal Mushrooms Dogs",
    summary: "Focus & Brain Support Powder – supports senior pet cognitive function.",
    badge: "New 2026",
    badgeColor: "sage",
    affiliateCategory: "mushroom supplement",
  },
  {
    id: "air-dried",
    icon: <Leaf className="w-5 h-5" />,
    title: "Air-Dried Beef Topper",
    keyword: "Air-Dried Raw Food",
    summary: "High-Protein Topper – the safest middle ground between kibble and raw.",
    badge: "Trending",
    badgeColor: "cream",
    affiliateCategory: "air dried food",
  },
];

interface TrendingSafetyTipsProps {
  onTopicClick?: (keyword: string) => void;
}

export function TrendingSafetyTips({ onTopicClick }: TrendingSafetyTipsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [affiliateProducts, setAffiliateProducts] = useState<Record<string, AffiliateProduct | null>>({});
  const [loadingAffiliates, setLoadingAffiliates] = useState(true);
  const { countryCode } = useGeoLocation();

  // Fetch affiliate products for each topic
  useEffect(() => {
    const fetchAffiliatesForTopics = async () => {
      setLoadingAffiliates(true);
      const results: Record<string, AffiliateProduct | null> = {};

      for (const topic of trendingTopics) {
        try {
          const { data, error } = await supabase.functions.invoke('get-affiliates', {
            body: {
              food_category: topic.affiliateCategory,
              country_code: countryCode || 'US',
              limit: 1,
            },
          });

          if (!error && data?.products?.length > 0) {
            results[topic.id] = data.products[0];
          } else {
            results[topic.id] = null;
          }
        } catch {
          results[topic.id] = null;
        }
      }

      setAffiliateProducts(results);
      setLoadingAffiliates(false);
    };

    fetchAffiliatesForTopics();
  }, [countryCode]);

  const handleAffiliateClick = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/affiliate-redirect?id=${productId}`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          }
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.url) {
          window.open(result.url, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (err) {
      console.error('Error redirecting to affiliate:', err);
    }
  };

  const getBadgeClasses = (color: TrendingTopic["badgeColor"]) => {
    switch (color) {
      case "coral":
        return "bg-primary/90 text-primary-foreground";
      case "sage":
        return "bg-sage text-sage-foreground";
      case "cream":
        return "bg-cream text-cream-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-heading font-bold text-foreground">
          Trending Now
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {trendingTopics.map((topic) => {
          const affiliateProduct = affiliateProducts[topic.id];
          
          return (
            <div
              key={topic.id}
              className={cn(
                "group cursor-pointer rounded-3xl p-6",
                "bg-white/70 dark:bg-card/50 backdrop-blur-md",
                "border border-primary/10 dark:border-border/30",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]",
                "dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              )}
              onMouseEnter={() => setHoveredId(topic.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onTopicClick?.(topic.keyword)}
            >
              {/* Badge */}
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
                  getBadgeClasses(topic.badgeColor)
                )}
              >
                {topic.badge}
              </span>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  {topic.icon}
                </div>
                <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">
                  {topic.title}
                </h3>
              </div>

              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {topic.summary}
              </p>

              {/* Affiliate Product CTA or Learn More */}
              {loadingAffiliates ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : affiliateProduct ? (
                <button
                  onClick={(e) => handleAffiliateClick(e, affiliateProduct.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
                    "bg-primary/10 hover:bg-primary/20 text-primary",
                    "transition-all duration-200 text-sm font-medium",
                    "border border-primary/20 hover:border-primary/40"
                  )}
                >
                  <span className="truncate">{affiliateProduct.product_name}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Discover</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Affiliate Disclosure */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        We may earn a small commission from qualifying purchases. Prices may vary by region.
      </p>

      {/* FAQ Schema JSON-LD for Trending Topics */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": trendingTopics.map((topic) => ({
              "@type": "Question",
              "name": `What is ${topic.title} for pets?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": topic.summary,
              },
            })),
          }),
        }}
      />
    </section>
  );
}