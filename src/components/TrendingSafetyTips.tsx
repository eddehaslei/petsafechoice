import { useState, useEffect } from "react";
import { Sparkles, Leaf, Fish, Heart, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useTranslation } from "react-i18next";

interface Citation {
  author: string;
  year: number;
  title: string;
  journal: string;
  url: string;
}

interface TrendingTopicData {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  keywordKey: string;
  summaryKey: string;
  badgeKey: string;
  badgeColor: "coral" | "sage" | "cream";
  affiliateCategory: string;
  citation: Citation;
}

interface AffiliateProduct {
  id: string;
  product_name: string;
  price_point: string | null;
  image_url: string | null;
}

const trendingTopicsData: TrendingTopicData[] = [
  {
    id: "salmon-oil",
    icon: <Fish className="w-5 h-5" />,
    titleKey: "trending.salmonOil.title",
    keywordKey: "trending.salmonOil.keyword",
    summaryKey: "trending.salmonOil.summary",
    badgeKey: "trending.badges.popular",
    badgeColor: "coral",
    affiliateCategory: "salmon oil",
    citation: {
      author: "Bauer, J. E.",
      year: 2011,
      title: "Therapeutic use of fish oils in companion animals",
      journal: "JAVMA",
      url: "https://pubmed.ncbi.nlm.nih.gov/22087720/",
    },
  },
  {
    id: "mushrooms",
    icon: <Sparkles className="w-5 h-5" />,
    titleKey: "trending.lionsMane.title",
    keywordKey: "trending.lionsMane.keyword",
    summaryKey: "trending.lionsMane.summary",
    badgeKey: "trending.badges.new2026",
    badgeColor: "sage",
    affiliateCategory: "mushroom supplement",
    citation: {
      author: "Sheng, X. et al.",
      year: 2017,
      title: "Immunomodulatory effects of Hericium erinaceus",
      journal: "Journal of Agricultural and Food Chemistry",
      url: "https://pubmed.ncbi.nlm.nih.gov/28266134/",
    },
  },
  {
    id: "air-dried",
    icon: <Leaf className="w-5 h-5" />,
    titleKey: "trending.airDried.title",
    keywordKey: "trending.airDried.keyword",
    summaryKey: "trending.airDried.summary",
    badgeKey: "trending.badges.trending",
    badgeColor: "cream",
    affiliateCategory: "air dried food",
    citation: {
      author: "van Rooijen, C. et al.",
      year: 2013,
      title: "The effect of drying methods on nutritional value of pet foods",
      journal: "Animal Feed Science and Technology",
      url: "https://pubmed.ncbi.nlm.nih.gov/23645215/",
    },
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
  const { t } = useTranslation();

  // Fetch affiliate products for each topic
  useEffect(() => {
    const fetchAffiliatesForTopics = async () => {
      setLoadingAffiliates(true);
      const results: Record<string, AffiliateProduct | null> = {};

      for (const topic of trendingTopicsData) {
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

  const getBadgeClasses = (color: TrendingTopicData["badgeColor"]) => {
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
          {t("trending.title")}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {trendingTopicsData.map((topic) => {
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
              onClick={() => onTopicClick?.(t(topic.keywordKey))}
            >
              {/* Badge */}
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
                  getBadgeClasses(topic.badgeColor)
                )}
              >
                {t(topic.badgeKey)}
              </span>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  {topic.icon}
                </div>
                <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">
                  {t(topic.titleKey)}
                </h3>
              </div>

              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {t(topic.summaryKey)}
              </p>

              {/* Scientific Citation - for E-E-A-T (all topics have citations now) */}
              <a
                href={topic.citation.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block mb-4 p-2.5 bg-muted/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
              >
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  <span className="font-medium text-foreground not-italic">{t("trending.scientificReference")}: </span>
                  {topic.citation.author} ({topic.citation.year}). {topic.citation.title}. 
                  <span className="text-primary ml-1">[PubMed]</span>
                </p>
              </a>

              {/* Affiliate Product CTA or Learn More */}
              {loadingAffiliates ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>{t("trending.loading")}</span>
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
                  <span>{t("trending.discover")}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Affiliate Disclosure */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        {t("trending.affiliateDisclosure")}
      </p>

      {/* FAQ Schema JSON-LD for Trending Topics */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": trendingTopicsData.map((topic) => ({
              "@type": "Question",
              "name": `What is ${t(topic.titleKey)} for pets?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t(topic.summaryKey),
              },
            })),
          }),
        }}
      />
    </section>
  );
}