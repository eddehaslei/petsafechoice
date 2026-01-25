import { useState, useEffect, forwardRef } from "react";
import { ShoppingBag, Loader2, Shield, Apple, Beef, Fish, Pill, Cookie, Carrot, Cherry, Milk, Wheat, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";
import type { SafetyLevel } from "./SafetyResult";

// Food category detection for icon display
type FoodCategory = "fruit" | "vegetable" | "protein" | "dairy" | "supplement" | "grain" | "toxic" | "unknown";

const CATEGORY_KEYWORDS: Record<FoodCategory, string[]> = {
  fruit: ["apple", "banana", "berry", "grape", "mango", "melon", "orange", "pear", "peach", "plum", "cherry", "strawberry", "blueberry", "watermelon", "manzana", "plátano", "uva", "sandía", "fresa"],
  vegetable: ["carrot", "broccoli", "spinach", "pumpkin", "potato", "cucumber", "celery", "pea", "bean", "lettuce", "kale", "zanahoria", "calabaza", "pepino", "espinaca"],
  protein: ["chicken", "beef", "salmon", "fish", "turkey", "egg", "meat", "liver", "pork", "shrimp", "tuna", "lamb", "pollo", "carne", "huevo", "pescado", "atún"],
  dairy: ["cheese", "yogurt", "milk", "cream", "queso", "yogur", "leche"],
  supplement: ["oil", "treat", "supplement", "vitamin", "chew", "bone", "biscuit", "pill", "aceite"],
  grain: ["rice", "oat", "wheat", "bread", "pasta", "oatmeal", "arroz", "avena"],
  toxic: ["chocolate", "onion", "garlic", "grape", "raisin", "avocado", "xylitol", "cebolla", "ajo", "uva"],
  unknown: [],
};

const detectFoodCategory = (foodName: string, safetyLevel?: SafetyLevel): FoodCategory => {
  const lowerFood = foodName.toLowerCase();
  
  // Check toxic first if safety level indicates danger
  if (safetyLevel === "dangerous") {
    return "toxic";
  }
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "toxic" || category === "unknown") continue;
    if (keywords.some(keyword => lowerFood.includes(keyword))) {
      return category as FoodCategory;
    }
  }
  return "unknown";
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

    // Check if food is dangerous - should show safe alternative instead
    const isDangerous = safetyLevel === "dangerous";
    const isCaution = safetyLevel === "caution";
    
    // Get the food category for icon display
    const foodCategory = detectFoodCategory(foodName, safetyLevel);
    
    // Get category icon component - PURE ICONS, NO PHOTOS
    const getCategoryIcon = () => {
      // Toxic foods get warning icon
      if (foodCategory === "toxic" || isDangerous) {
        return <Shield className="w-14 h-14 text-danger" />;
      }
      
      switch (foodCategory) {
        case "fruit":
          return <Apple className="w-14 h-14 text-safe" />;
        case "vegetable":
          return <Carrot className="w-14 h-14 text-safe" />;
        case "protein":
          return <Beef className="w-14 h-14 text-primary" />;
        case "dairy":
          return <Milk className="w-14 h-14 text-muted-foreground" />;
        case "supplement":
          return <Droplets className="w-14 h-14 text-primary" />;
        case "grain":
          return <Wheat className="w-14 h-14 text-caution" />;
        default:
          return <Cherry className="w-14 h-14 text-muted-foreground" />;
      }
    };
    
    // Get background color based on safety
    const getIconBgColor = () => {
      if (isDangerous) return "from-danger/10 to-danger/5";
      if (isCaution) return "from-caution/10 to-caution/5";
      return "from-safe/10 to-safe/5";
    };
    
    // SEO-optimized alt text (kept for accessibility)
    const getImageAlt = () => {
      const capitalizedFood = foodName.charAt(0).toUpperCase() + foodName.slice(1);
      return `Safe food for pets: ${capitalizedFood}`;
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
          {/* Food Icon Section - PURE ICONS, NO PHOTOS */}
          <div className={`relative w-full h-[120px] sm:h-[140px] bg-gradient-to-br ${getIconBgColor()} overflow-hidden flex items-center justify-center`}>
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-background/60 shadow-sm border border-border/30 backdrop-blur-sm">
                {getCategoryIcon()}
              </div>
              <span className="mt-3 text-sm font-semibold text-foreground capitalize">
                {foodName}
              </span>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-background/20" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-background/20" />
          </div>

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
