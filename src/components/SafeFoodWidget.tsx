import { useState, useEffect } from "react";
import { Gift, ShoppingBag, ExternalLink, Loader2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useGeoLocation } from "@/hooks/useGeoLocation";

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

interface MatchedAffiliate {
  id: string;
  product_name: string;
  affiliate_url: string;
  price_point?: string | null;
  image_url?: string | null;
}

// Fallback recommendations if API fails
const getFallbackRecommendations = (petType: "dog" | "cat") => [
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
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [matchedAffiliate, setMatchedAffiliate] = useState<MatchedAffiliate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const { countryCode } = useGeoLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAffiliates = async () => {
      setIsLoading(true);
      setMatchedAffiliate(null);
      setDbConnected(false);
      
      try {
        const normalizedFoodName = foodName.trim();
        console.log('[SafeFoodWidget] Fetching affiliate match for:', {
          foodName: normalizedFoodName,
          countryCode: countryCode || 'US',
          petType,
        });

        // First, check for a matching affiliate product by food name
        const matchResponse = await supabase.functions.invoke('get-affiliate-match', {
          body: { 
            food_name: normalizedFoodName,
            country_code: countryCode || 'US'
          }
        });

        // Debug log requested by user
        console.log('Affiliate Data:', matchResponse.data);
        console.log('Database Row Found:', matchResponse.data?.affiliate);

        // Visible "connection alive" signal requested by user
        if (matchResponse.data) {
          setDbConnected(true);
        }

        if (!matchResponse.error && matchResponse.data?.affiliate) {
          // Match found - use this as the primary recommendation
          setMatchedAffiliate(matchResponse.data.affiliate);
          setProducts([]); // Clear generic products
        } else {
          // No match - fetch general affiliates as fallback
          const { data, error } = await supabase.functions.invoke('get-affiliates', {
            body: { 
              pet_type: petType,
              country_code: countryCode || 'US',
              limit: 4
            }
          });

          if (error) throw error;

          if (data) {
            setDbConnected(true);
          }
          
          if (data?.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts(getFallbackRecommendations(petType));
          }
        }
      } catch (err) {
        console.error('Error fetching affiliates:', err);
        setProducts(getFallbackRecommendations(petType));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliates();
  }, [petType, countryCode, foodName]);

  const handleProductClick = async (productId: string) => {
    if (productId.startsWith('fallback-')) return;
    
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
      console.error('Error redirecting:', err);
    }
  };

  const handleAmazonClick = () => {
    if (matchedAffiliate?.affiliate_url) {
      window.open(matchedAffiliate.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  };
  
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
                {matchedAffiliate 
                  ? t('safeFoodWidget.recommendedProduct', 'Recommended Product')
                  : t('safeFoodWidget.title', 'Treat Recommendations')
                }
              </h3>
              <p className="text-xs text-muted-foreground">
                {matchedAffiliate
                  ? t('safeFoodWidget.matchFound', 'We found a great option for you!')
                  : t('safeFoodWidget.subtitle', { petType: petType === 'dog' ? t('petToggle.dog').toLowerCase() : t('petToggle.cat').toLowerCase(), defaultValue: `Vet-approved options your ${petType} will love` })
                }
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-safe" />
            </div>
          ) : matchedAffiliate ? (
            /* Matched Affiliate - Direct DB link */
            <button
              onClick={handleAmazonClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              style={{ backgroundColor: '#F28C74' }}
            >
              <ShoppingBag className="w-6 h-6" />
              <span>{t('safeFoodWidget.viewOnAmazon', 'View on Amazon')}</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          ) : (
            /* Fallback: Generic Recommendations Grid */
            <div className="grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
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
