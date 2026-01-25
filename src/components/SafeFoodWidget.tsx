import { useState, useEffect } from "react";
import { Gift, ShoppingBag, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
}

interface AffiliateProduct {
  id: string;
  product_name: string;
  price_point: string | null;
  image_url: string | null;
  food_category_link: string | null;
}

interface AffiliateMatch {
  productName: string;
  url: string;
}

// Fallback recommendations if no affiliate match
const getFallbackRecommendations = (petType: "dog" | "cat"): AffiliateProduct[] => [
  {
    id: "fallback-1",
    product_name: petType === "dog" ? "Premium Training Treats" : "Gourmet Cat Treats",
    price_point: null,
    image_url: null,
    food_category_link: petType,
  },
  {
    id: "fallback-2",
    product_name: petType === "dog" ? "Natural Freeze-Dried Snacks" : "Dental Health Treats",
    price_point: null,
    image_url: null,
    food_category_link: petType,
  },
];

export function SafeFoodWidget({ foodName, petType }: SafeFoodWidgetProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [affiliateMatch, setAffiliateMatch] = useState<AffiliateMatch | null>(null);

  useEffect(() => {
    const fetchAffiliateMatch = async () => {
      setIsLoading(true);
      setAffiliateMatch(null);
      setProducts([]);

      try {
        const normalizedFoodName = foodName.trim().toLowerCase();

        // Fetch all affiliates from database
        const { data, error } = await supabase.functions.invoke('get-all-affiliates');

        if (error) {
          console.error('Error fetching affiliates:', error);
          setProducts(getFallbackRecommendations(petType));
          return;
        }

        const affiliates = (data?.affiliates ?? []) as Array<{ product_name: string; affiliate_url: string }>;

        // Case-insensitive match: compare lowercase versions
        const match = affiliates.find(
          (a) => (a.product_name ?? '').trim().toLowerCase() === normalizedFoodName
        );

        if (match) {
          // Found a match in the database - show the button
          setAffiliateMatch({
            productName: match.product_name,
            url: match.affiliate_url,
          });
        } else {
          // No match - show generic recommendations
          setProducts(getFallbackRecommendations(petType));
        }
      } catch (err) {
        console.error('Error fetching affiliates:', err);
        setProducts(getFallbackRecommendations(petType));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliateMatch();
  }, [petType, foodName]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <div className="bg-safe/10 border-2 border-safe/30 rounded-2xl p-5 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-safe/10 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-safe/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-safe" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">
                {affiliateMatch
                  ? t('safeFoodWidget.recommendedProduct', 'Recommended Product')
                  : t('safeFoodWidget.title', 'Treat Recommendations')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {affiliateMatch
                  ? t('safeFoodWidget.matchFound', 'We found a great option for you!')
                  : t('safeFoodWidget.subtitle', `Vet-approved options your ${petType} will love`)}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-safe" />
            </div>
          ) : affiliateMatch ? (
            /* Database Affiliate Match - Single Big Button */
            <AffiliateButton
              productName={affiliateMatch.productName}
              affiliateUrl={affiliateMatch.url}
            />
          ) : (
            /* Fallback: Generic Recommendations Grid */
            <div className="grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card/80 rounded-xl p-4 border border-border/50 hover:border-safe/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-safe/10 flex items-center justify-center text-safe group-hover:bg-safe/20 transition-colors">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="w-6 h-6 object-contain rounded"
                        />
                      ) : (
                        <Gift className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground mb-0.5">
                        {product.product_name}
                      </h4>
                      {product.price_point && (
                        <p className="text-xs text-muted-foreground">
                          {product.price_point}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-safe transition-colors shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Affiliate disclosure */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            {t('safeFoodWidget.disclosure', 'These are general recommendations. We may earn a small commission from qualifying purchases.')}
          </p>
        </div>
      </div>
    </div>
  );
}
