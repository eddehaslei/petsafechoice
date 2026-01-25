import { useState, useEffect } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
}

interface AffiliateLink {
  productName: string;
  url: string;
}

/**
 * Generate a fallback Amazon search URL with 4+ star quality filter
 */
function generateFallbackUrl(foodName: string): string {
  const searchTerm = encodeURIComponent(foodName);
  return `https://www.amazon.com/s?k=${searchTerm}&rh=p_72%3A2661611011&tag=petsafechoice-20`;
}

export function SafeFoodWidget({ foodName, petType }: SafeFoodWidgetProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(null);

  useEffect(() => {
    const fetchAffiliate = async () => {
      setIsLoading(true);
      const normalizedName = foodName.trim();

      try {
        // Check database for matching affiliate
        const { data, error } = await supabase.functions.invoke('get-all-affiliates');

        if (!error && data?.affiliates?.length > 0) {
          const affiliates = data.affiliates as Array<{ product_name: string; affiliate_url: string }>;
          const match = affiliates.find(
            (a) => a.product_name?.toLowerCase() === normalizedName.toLowerCase()
          );

          if (match) {
            setAffiliateLink({ productName: match.product_name, url: match.affiliate_url });
            setIsLoading(false);
            return;
          }
        }

        // Fallback: generate Amazon search link
        setAffiliateLink({ productName: normalizedName, url: generateFallbackUrl(normalizedName) });
      } catch {
        // Error resilience: always show fallback
        setAffiliateLink({ productName: normalizedName, url: generateFallbackUrl(normalizedName) });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliate();
  }, [foodName]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <div className="bg-safe/10 border-2 border-safe/30 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-safe/10 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-safe/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-safe" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">
                {t('safeFoodWidget.recommendedProduct', 'Recommended Product')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('safeFoodWidget.matchFound', 'We found a great option for you!')}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-safe" />
            </div>
          ) : affiliateLink ? (
            <AffiliateButton productName={affiliateLink.productName} affiliateUrl={affiliateLink.url} />
          ) : null}

          <p className="mt-4 text-xs text-muted-foreground text-center">
            {t('safeFoodWidget.disclosure', 'We may earn a small commission from qualifying purchases.')}
          </p>
        </div>
      </div>
    </div>
  );
}
