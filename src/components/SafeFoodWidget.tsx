import { useState, useEffect, forwardRef } from "react";
import { ShoppingBag, Loader2, Shield, Apple, Beef, Fish, Pill, Cookie, Carrot, Grape, Cherry } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";
import type { SafetyLevel } from "./SafetyResult";

// Curated food image map with high-quality, direct URLs (white background product shots)
const FOOD_IMAGE_MAP: Record<string, string> = {
  // Fruits
  "apple": "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=800&h=400&fit=crop&q=80",
  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=400&fit=crop&q=80",
  "blueberry": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=400&fit=crop&q=80",
  "blueberries": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=400&fit=crop&q=80",
  "strawberry": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=400&fit=crop&q=80",
  "strawberries": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=400&fit=crop&q=80",
  "watermelon": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=400&fit=crop&q=80",
  "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=400&fit=crop&q=80",
  "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&h=400&fit=crop&q=80",
  "grape": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&h=400&fit=crop&q=80",
  "orange": "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=400&fit=crop&q=80",
  "pear": "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&h=400&fit=crop&q=80",
  
  // Vegetables
  "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=400&fit=crop&q=80",
  "carrots": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=400&fit=crop&q=80",
  "broccoli": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=400&fit=crop&q=80",
  "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=400&fit=crop&q=80",
  "pumpkin": "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&h=400&fit=crop&q=80",
  "sweet potato": "https://images.unsplash.com/photo-1596097635121-14b63a7b0a41?w=800&h=400&fit=crop&q=80",
  "cucumber": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&h=400&fit=crop&q=80",
  
  // Proteins
  "chicken": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=400&fit=crop&q=80",
  "salmon": "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&h=400&fit=crop&q=80",
  "beef": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=400&fit=crop&q=80",
  "turkey": "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800&h=400&fit=crop&q=80",
  "egg": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=400&fit=crop&q=80",
  "eggs": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=400&fit=crop&q=80",
  "fish": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&q=80",
  "tuna": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&q=80",
  "shrimp": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=400&fit=crop&q=80",
  "liver": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&h=400&fit=crop&q=80",
  "pork": "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=800&h=400&fit=crop&q=80",
  
  // Dairy & Other
  "cheese": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=400&fit=crop&q=80",
  "yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=400&fit=crop&q=80",
  "milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=400&fit=crop&q=80",
  "peanut butter": "https://images.unsplash.com/photo-1612253979816-35ee7c7eb89b?w=800&h=400&fit=crop&q=80",
  "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&q=80",
  "oatmeal": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&h=400&fit=crop&q=80",
  "honey": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=400&fit=crop&q=80",
  "coconut": "https://images.unsplash.com/photo-1580984969071-a8da8c3a67f8?w=800&h=400&fit=crop&q=80",
  
  // Toxic foods (still need images)
  "chocolate": "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=400&fit=crop&q=80",
  "onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=400&fit=crop&q=80",
  "onions": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=400&fit=crop&q=80",
  "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&h=400&fit=crop&q=80",
  "avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=400&fit=crop&q=80",
};

// Pet product image (professional supplement bottle)
const PET_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1585846416120-3a7354ed7d39?w=800&h=400&fit=crop&q=80";

// Food category detection for icon fallbacks
type FoodCategory = "fruit" | "vegetable" | "protein" | "dairy" | "supplement" | "grain" | "unknown";

const CATEGORY_KEYWORDS: Record<FoodCategory, string[]> = {
  fruit: ["apple", "banana", "berry", "grape", "mango", "melon", "orange", "pear", "peach", "plum", "cherry", "strawberry", "blueberry", "watermelon"],
  vegetable: ["carrot", "broccoli", "spinach", "pumpkin", "potato", "cucumber", "celery", "pea", "bean", "lettuce", "kale"],
  protein: ["chicken", "beef", "salmon", "fish", "turkey", "egg", "meat", "liver", "pork", "shrimp", "tuna", "lamb"],
  dairy: ["cheese", "yogurt", "milk", "cream"],
  supplement: ["oil", "treat", "supplement", "vitamin", "chew", "bone", "biscuit", "pill"],
  grain: ["rice", "oat", "wheat", "bread", "pasta"],
  unknown: [],
};

const detectFoodCategory = (foodName: string): FoodCategory => {
  const lowerFood = foodName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerFood.includes(keyword))) {
      return category as FoodCategory;
    }
  }
  return "unknown";
};

// High-quality fallback images for safety states
const FALLBACK_IMAGES = {
  safe: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop&q=80",
  dangerous: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800&h=400&fit=crop&q=80",
};

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
  safetyLevel?: SafetyLevel;
}

interface AffiliateLink {
  productName: string;
  url: string;
}

// Amazon domain configuration by language
const AMAZON_CONFIG: Record<string, { domain: string; tag: string }> = {
  es: { domain: "amazon.es", tag: "petsafechoice-20" },
  de: { domain: "amazon.de", tag: "petsafechoice-20" },
  fr: { domain: "amazon.fr", tag: "petsafechoice-20" },
  en: { domain: "amazon.com", tag: "petsafechoice-20" },
};

const DEFAULT_CONFIG = AMAZON_CONFIG.en;

// Common food name translations for Spanish Amazon searches
const FOOD_TRANSLATIONS_ES: Record<string, string> = {
  "apple": "manzana",
  "banana": "plátano",
  "blueberry": "arándano",
  "blueberries": "arándanos",
  "carrot": "zanahoria",
  "carrots": "zanahorias",
  "chicken": "pollo",
  "chocolate": "chocolate",
  "egg": "huevo",
  "eggs": "huevos",
  "fish": "pescado",
  "grapes": "uvas",
  "grape": "uva",
  "meat": "carne",
  "milk": "leche",
  "onion": "cebolla",
  "onions": "cebollas",
  "peanut butter": "mantequilla de maní",
  "pumpkin": "calabaza",
  "rice": "arroz",
  "salmon": "salmón",
  "salmon oil": "aceite de salmón",
  "spinach": "espinaca",
  "strawberry": "fresa",
  "strawberries": "fresas",
  "sweet potato": "batata",
  "tuna": "atún",
  "turkey": "pavo",
  "watermelon": "sandía",
  "yogurt": "yogur",
  "cheese": "queso",
  "beef": "carne de res",
  "pork": "cerdo",
  "honey": "miel",
  "oatmeal": "avena",
  "broccoli": "brócoli",
  "cucumber": "pepino",
  "mango": "mango",
  "coconut": "coco",
  "coconut oil": "aceite de coco",
  "liver": "hígado",
  "shrimp": "camarones",
};


/**
 * Get Amazon config based on user's language
 */
function getAmazonConfig(language: string) {
  return AMAZON_CONFIG[language] || DEFAULT_CONFIG;
}

/**
 * Translate food name for regional Amazon searches
 */
function translateFoodName(foodName: string, language: string): string {
  if (language === 'es') {
    const lowerName = foodName.toLowerCase().trim();
    return FOOD_TRANSLATIONS_ES[lowerName] || foodName;
  }
  return foodName;
}

/**
 * Generate safe treats URL based on language
 */
function getSafeTreatsUrl(language: string): string {
  const config = getAmazonConfig(language);
  const safetyKeyword = language === 'es' 
    ? 'mejores+snacks+naturales+perros+gatos' 
    : 'best+natural+freeze+dried+dog+cat+treats';
  return `https://www.${config.domain}/s?k=${safetyKeyword}&tag=${config.tag}`;
}

/**
 * Generate a fallback Amazon search URL with "Best" prefix for quality results
 */
function generateFallbackUrl(foodName: string, language: string): string {
  const config = getAmazonConfig(language);
  const translatedName = translateFoodName(foodName, language);
  // Add "Best" or "Mejores" prefix to help Amazon find top-rated products
  const qualityPrefix = language === 'es' ? 'mejores' : 'best';
  const searchTerm = encodeURIComponent(`${qualityPrefix} ${translatedName}`);
  return `https://www.${config.domain}/s?k=${searchTerm}&tag=${config.tag}`;
}

export const SafeFoodWidget = forwardRef<HTMLDivElement, SafeFoodWidgetProps>(
  function SafeFoodWidget({ foodName, petType, safetyLevel = "safe" }, ref) {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language?.split('-')[0] || 'en';
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(null);
    const [imageError, setImageError] = useState(false);

    // Check if food is dangerous - should show safe alternative instead
    const isDangerous = safetyLevel === "dangerous";
    const isCaution = safetyLevel === "caution";
    
    // Get the food category for icon fallback
    const foodCategory = detectFoodCategory(foodName);
    const isPetProduct = foodCategory === "supplement";
    
    // Get curated image URL - prioritizes hardcoded map, then category fallback
    const getImageData = (): { url: string | null; useIcon: boolean; category: FoodCategory } => {
      const foodLower = foodName.toLowerCase().trim();
      
      // 1. Check hardcoded image map first
      if (FOOD_IMAGE_MAP[foodLower]) {
        return { url: FOOD_IMAGE_MAP[foodLower], useIcon: false, category: foodCategory };
      }
      
      // 2. Pet products get a professional supplement bottle image
      if (isPetProduct) {
        return { url: PET_PRODUCT_IMAGE, useIcon: false, category: "supplement" };
      }
      
      // 3. For unknown foods, use icon-based fallback (no random Unsplash)
      return { url: null, useIcon: true, category: foodCategory };
    };
    
    const imageData = getImageData();
    
    // Get category icon component
    const getCategoryIcon = () => {
      switch (foodCategory) {
        case "fruit":
          return <Apple className="w-16 h-16 text-safe" />;
        case "vegetable":
          return <Carrot className="w-16 h-16 text-safe" />;
        case "protein":
          return <Beef className="w-16 h-16 text-primary" />;
        case "dairy":
          return <Cookie className="w-16 h-16 text-caution" />;
        case "supplement":
          return <Pill className="w-16 h-16 text-primary" />;
        case "grain":
          return <Cookie className="w-16 h-16 text-caution" />;
        default:
          return <Cherry className="w-16 h-16 text-muted-foreground" />;
      }
    };
    
    // Get fallback image based on safety level
    const getFallbackImage = () => {
      if (isDangerous) return FALLBACK_IMAGES.dangerous;
      return FALLBACK_IMAGES.safe;
    };
    
    // SEO-optimized alt text
    const getImageAlt = () => {
      const capitalizedFood = foodName.charAt(0).toUpperCase() + foodName.slice(1);
      return `Safe food for pets: ${capitalizedFood}`;
    };
    
    // SEO description/title for the image
    const getImageTitle = () => {
      const capitalizedFood = foodName.charAt(0).toUpperCase() + foodName.slice(1);
      return `Fresh ${capitalizedFood} for pets`;
    };

    // Reset image error on food change
    useEffect(() => {
      setImageError(false);
    }, [foodName]);

    const handleImageError = () => {
      setImageError(true);
    };

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
      
      // Reset image states on food change (timeout handled in separate useEffect)

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
        <div className={`${containerBg} border-2 rounded-2xl overflow-hidden relative`}>
          {/* Food Image Section - Curated images only */}
          <div className="relative w-full h-[160px] sm:h-[200px] bg-muted/30 overflow-hidden">
            {imageData.url && !imageError ? (
              <img
                src={imageData.url}
                alt={getImageAlt()}
                title={getImageTitle()}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            ) : imageData.useIcon ? (
              // Category-based icon fallback (no random images)
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-background">
                <div className="p-4 rounded-2xl bg-background/80 shadow-sm border border-border/50">
                  {getCategoryIcon()}
                </div>
                <span className="mt-3 text-sm text-muted-foreground font-medium capitalize">
                  {foodName}
                </span>
              </div>
            ) : (
              // Fallback for failed curated images
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={getFallbackImage()}
                  alt={isDangerous ? "This food is not safe for pets" : "Healthy pet food"}
                  title={isDangerous ? "Warning: toxic food" : "Safe and healthy pet treats"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Overlay for toxic foods */}
                {isDangerous && (
                  <div className="absolute inset-0 bg-danger/30 flex items-center justify-center">
                    <div className="bg-background/90 rounded-full p-4 shadow-lg">
                      <Shield className="w-10 h-10 text-danger" />
                    </div>
                  </div>
                )}
                {/* Ultimate emoji fallback */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-safe/10 -z-10">
                  <span className="text-5xl mb-2" role="img" aria-label={isDangerous ? "Warning" : "Pet food"}>
                    {isDangerous ? "⚠️" : "🐕"}
                  </span>
                  <span className="text-sm text-muted-foreground/70 font-medium">
                    {isDangerous 
                      ? t('safeFoodWidget.notRecommended', 'Not Recommended')
                      : t('safeFoodWidget.healthyChoice', 'Healthy Choice')
                    }
                  </span>
                </div>
              </div>
            )}
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
          
          <div className={`absolute top-[160px] sm:top-[200px] right-4 w-24 h-24 ${isDangerous ? 'bg-primary/10' : 'bg-safe/10'} rounded-full -translate-y-1/2`} />

          <div className="relative p-4 sm:p-5">
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
            <p className="mt-2 px-2 sm:px-0 text-[10px] text-muted-foreground/60 text-center leading-relaxed">
              {t('safeFoodWidget.amazonDisclosure', 'As an Amazon Associate, I earn from qualifying purchases.')}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
