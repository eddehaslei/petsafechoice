import { useState, useEffect, forwardRef } from "react";
import { ShoppingBag, Loader2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";
import type { SafetyLevel } from "./SafetyResult";

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
  safetyLevel?: SafetyLevel;
}

interface AffiliateLink {
  productName: string;
  url: string;
}

// Amazon domain and filter configuration by language
const AMAZON_CONFIG: Record<string, { domain: string; tag: string; ratingFilter: string }> = {
  es: { domain: "amazon.es", tag: "petsafechoice-20", ratingFilter: "p_72%3A440634031" },
  de: { domain: "amazon.de", tag: "petsafechoice-20", ratingFilter: "p_72%3A419130031" },
  fr: { domain: "amazon.fr", tag: "petsafechoice-20", ratingFilter: "p_72%3A428432031" },
  en: { domain: "amazon.com", tag: "petsafechoice-20", ratingFilter: "p_72%3A2661611011" },
};

const DEFAULT_CONFIG = AMAZON_CONFIG.en;

/**
 * Get Amazon config based on user's language
 */
function getAmazonConfig(language: string) {
  return AMAZON_CONFIG[language] || DEFAULT_CONFIG;
}

/**
 * Generate safe treats URL based on language
 */
function getSafeTreatsUrl(language: string): string {
  const config = getAmazonConfig(language);
  return `https://www.${config.domain}/s?k=natural+freeze+dried+dog+cat+treats&rh=${config.ratingFilter}&tag=${config.tag}`;
}

/**
 * Generate a fallback Amazon search URL with 4+ star quality filter
 */
function generateFallbackUrl(foodName: string, language: string): string {
  const config = getAmazonConfig(language);
  const searchTerm = encodeURIComponent(foodName);
  return `https://www.${config.domain}/s?k=${searchTerm}&rh=${config.ratingFilter}&tag=${config.tag}`;
}

export const SafeFoodWidget = forwardRef<HTMLDivElement, SafeFoodWidgetProps>(
  function SafeFoodWidget({ foodName, petType, safetyLevel = "safe" }, ref) {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language?.split('-')[0] || 'en';
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(null);

    // Check if food is dangerous - should show safe alternative instead
    const isDangerous = safetyLevel === "dangerous";

    useEffect(() => {
      // If food is dangerous, skip fetching and show safe alternative immediately
      if (isDangerous) {
        setAffiliateLink({
          productName: "Natural Freeze-Dried Treats",
          url: getSafeTreatsUrl(currentLanguage)
        });
        setIsLoading(false);
        console.log('Affiliate Status: Safe Alternative (Dangerous Food)');
        return;
      }

      let isMounted = true;
      const normalizedName = foodName.trim();

      const fetchAffiliate = async () => {
        try {
          const response = await supabase.functions.invoke('get-all-affiliates');
          
          if (!isMounted) return;

          if (response.data?.affiliates && Array.isArray(response.data.affiliates)) {
            const affiliates = response.data.affiliates as Array<{ product_name: string; affiliate_url: string }>;
            
            const match = affiliates.find(
              (a) => a.product_name && a.product_name.toLowerCase() === normalizedName.toLowerCase()
            );

            if (match && match.affiliate_url) {
              console.log('Affiliate Status: Database Match');
              setAffiliateLink({ productName: match.product_name, url: match.affiliate_url });
              setIsLoading(false);
              return;
            }
          }

          if (isMounted) {
            console.log('Affiliate Status: Auto-Generated');
            setAffiliateLink({ productName: normalizedName, url: generateFallbackUrl(normalizedName, currentLanguage) });
          }
        } catch {
          if (isMounted) {
            console.log('Affiliate Status: Auto-Generated');
            setAffiliateLink({ productName: normalizedName, url: generateFallbackUrl(normalizedName, currentLanguage) });
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      setIsLoading(true);
      setAffiliateLink(null);
      fetchAffiliate();

      return () => {
        isMounted = false;
      };
    }, [foodName, isDangerous, currentLanguage]);

    // Dynamic styling based on safety
    const containerBg = isDangerous ? "bg-primary/10 border-primary/30" : "bg-safe/10 border-safe/30";
    const iconBg = isDangerous ? "bg-primary/20" : "bg-safe/20";
    const iconColor = isDangerous ? "text-primary" : "text-safe";
    const loaderColor = isDangerous ? "text-primary" : "text-safe";

    return (
      <div ref={ref} className="w-full max-w-2xl mx-auto mt-6 px-2 sm:px-0 animate-slide-up">
        <div className={`${containerBg} border-2 rounded-2xl p-4 sm:p-5 relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-24 h-24 ${isDangerous ? 'bg-primary/10' : 'bg-safe/10'} rounded-full -translate-y-1/2 translate-x-1/2`} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {isDangerous ? (
                  <Shield className={`w-5 h-5 ${iconColor}`} />
                ) : (
                  <ShoppingBag className={`w-5 h-5 ${iconColor}`} />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  {isDangerous 
                    ? t('safeFoodWidget.safeAlternative', 'Safe Alternative')
                    : t('safeFoodWidget.recommendedProduct', 'Recommended Product')
                  }
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isDangerous
                    ? t('safeFoodWidget.tryThisInstead', 'Try these vet-approved treats instead!')
                    : t('safeFoodWidget.matchFound', 'We found a great option for you!')
                  }
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={`w-6 h-6 animate-spin ${loaderColor}`} />
              </div>
            ) : affiliateLink ? (
              <AffiliateButton productName={affiliateLink.productName} affiliateUrl={affiliateLink.url} />
            ) : null}

            <p className="mt-4 px-2 sm:px-0 text-xs text-muted-foreground text-center leading-relaxed">
              {t('safeFoodWidget.disclosure', 'We may earn a small commission from qualifying purchases.')}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
